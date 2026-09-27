/* Генерирует справочник API библиотеки из исходников.
 *
 *   node scripts/gen-api.cjs        (или npm run gen:api)
 *
 * Два выхода из одного источника:
 *   src/api.generated.json  — таблицы пропсов в витрине
 *   ../../API.md            — плоский справочник, который агент читает целиком
 *
 * Оба файла генерируются, править руками не нужно.
 *
 * Разбор синтаксический (ts.createSourceFile), а не через checker: нужен тип
 * ровно в том виде, как он написан в исходнике — для документации это читаемее,
 * чем развёрнутый вывод checker'а.
 */
const fs = require('fs')
const path = require('path')
const ts = require('typescript')

const root = path.resolve(__dirname, '..')
const crmDir = path.join(root, 'src/components')
const uiDir = path.join(root, 'src/components/ui')

const parse = (file) =>
  ts.createSourceFile(file, fs.readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)

/** Текст JSDoc над узлом, схлопнутый в одну строку. */
function docOf(node) {
  const parts = ts.getJSDocCommentsAndTags(node)
  for (const p of parts) {
    if (!ts.isJSDoc(p)) continue
    const c = typeof p.comment === 'string' ? p.comment : ts.getTextOfJSDocComment(p.comment)
    if (c) return c.replace(/\s*\n\s*/g, ' ').trim()
  }
  return ''
}

const isExported = (node) =>
  node.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword) ?? false

/* ── CRM-надстройка: интерфейсы пропсов ─────────────────────── */

/** Дефолты из деструктуризации в сигнатуре: function X({ a = 1, b = 'x' }).
 *  Ищем по всему дереву, а не только на верхнем уровне: половина компонентов
 *  обёрнута в forwardRef(function X(...)), и там это не прямой потомок файла. */
function defaultsOf(sourceFile, componentName) {
  const out = {}

  const collect = (fn) => {
    const param = fn.parameters[0]
    if (!param || !ts.isObjectBindingPattern(param.name)) return
    for (const el of param.name.elements) {
      if (!el.initializer) continue
      out[(el.propertyName ?? el.name).getText(sourceFile)] = el.initializer.getText(sourceFile)
    }
  }

  const visit = (node) => {
    // function X(...) / forwardRef(function X(...))
    if ((ts.isFunctionDeclaration(node) || ts.isFunctionExpression(node)) && node.name?.text === componentName) {
      collect(node)
    }
    // const X = (...) => / const X = forwardRef((...) => ...)
    if (
      ts.isVariableDeclaration(node) &&
      ts.isIdentifier(node.name) &&
      node.name.text === componentName &&
      node.initializer
    ) {
      const seek = (n) => {
        if (ts.isArrowFunction(n) || ts.isFunctionExpression(n)) collect(n)
        else n.forEachChild(seek)
      }
      seek(node.initializer)
    }
    node.forEachChild(visit)
  }
  sourceFile.forEachChild(visit)

  return out
}

/** Что тип наследует помимо собственных полей — важно для агента: значит,
 *  доступны и все атрибуты элемента. Покрывает обе формы:
 *    interface XProps extends React.ButtonHTMLAttributes<HTMLButtonElement>
 *    type XProps = React.ComponentProps<'input'> & { … } */
function heritageOf(sourceFile, node) {
  if (ts.isInterfaceDeclaration(node)) {
    return (node.heritageClauses ?? []).flatMap((h) => h.types.map((t) => t.getText(sourceFile)))
  }
  if (ts.isTypeAliasDeclaration(node)) {
    if (ts.isIntersectionTypeNode(node.type)) {
      return node.type.types.filter((t) => !ts.isTypeLiteralNode(t)).map((t) => t.getText(sourceFile))
    }
    if (!ts.isTypeLiteralNode(node.type)) return [node.type.getText(sourceFile)]
  }
  return []
}

/** Часть типа, в которой лежат собственные поля. */
function literalOf(node) {
  if (ts.isInterfaceDeclaration(node)) return node
  if (ts.isTypeLiteralNode(node.type)) return node.type
  if (ts.isIntersectionTypeNode(node.type)) return node.type.types.find(ts.isTypeLiteralNode) ?? { members: [] }
  return { members: [] }
}

/** JSDoc компонента — запасной источник описания, если его нет на самом типе. */
function componentDoc(sourceFile, componentName) {
  let found = ''
  const visit = (node) => {
    if (found) return
    if (
      ((ts.isFunctionDeclaration(node) || ts.isFunctionExpression(node)) && node.name?.text === componentName) ||
      (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.name.text === componentName)
    ) {
      const d = docOf(ts.isVariableDeclaration(node) ? node.parent.parent : node)
      if (d) found = d
    }
    node.forEachChild(visit)
  }
  sourceFile.forEachChild(visit)
  return found
}

/** Таблицы Markdown ломаются на union-типах вроде `'a' | 'b'`. */
const escapePipes = (s) => s.replace(/\|/g, '\\|')

function membersOf(sourceFile, typeNode) {
  const members = []
  for (const m of typeNode.members ?? []) {
    if (!ts.isPropertySignature(m) || !m.name) continue
    members.push({
      name: m.name.getText(sourceFile),
      type: m.type ? m.type.getText(sourceFile).replace(/\s*\n\s*/g, ' ') : 'unknown',
      required: !m.questionToken,
      doc: docOf(m),
    })
  }
  return members
}

/** Имена, которые реально экспортирует пакет (src/index.ts).
 *  Справочник должен описывать ровно то, что агент может импортировать:
 *  внутренние компоненты вроде components/Calendar.tsx сюда не попадают. */
function publicNames() {
  const sf = parse(path.join(root, 'src/index.ts'))
  const names = new Set()
  sf.forEachChild((node) => {
    if (!ts.isExportDeclaration(node) || !node.exportClause) return
    if (!ts.isNamedExports(node.exportClause)) return
    for (const el of node.exportClause.elements) names.add(el.name.text)
  })
  return names
}

function readCrm() {
  const exported = publicNames()
  const files = fs
    .readdirSync(crmDir)
    .filter((f) => f.endsWith('.tsx'))
    .sort()

  const components = []

  for (const file of files) {
    const full = path.join(crmDir, file)
    const sf = parse(full)

    sf.forEachChild((node) => {
      const named =
        (ts.isInterfaceDeclaration(node) && node) || (ts.isTypeAliasDeclaration(node) && node)
      if (!named || !isExported(named)) return

      const typeName = named.name.text
      if (!typeName.endsWith('Props')) return

      const componentName = typeName.slice(0, -'Props'.length)
      if (!exported.has(componentName)) return

      const props = membersOf(sf, literalOf(named))
      const extendsList = heritageOf(sf, named)
      // Тип без собственных полей и без наследования документировать нечем.
      if (props.length === 0 && extendsList.length === 0) return

      const defaults = defaultsOf(sf, componentName)
      for (const p of props) if (defaults[p.name] !== undefined) p.default = defaults[p.name]

      components.push({
        name: componentName,
        file: `src/components/${file}`,
        doc: docOf(named) || componentDoc(sf, componentName),
        // Дженерик-параметры: DataGridProps<T> и т.п.
        generics: (named.typeParameters ?? []).map((t) => t.getText(sf)),
        extends: extendsList,
        props,
      })
    })
  }

  return components.sort((a, b) => a.name.localeCompare(b.name))
}

/* ── shadcn: варианты cva ───────────────────────────────────── */

const literalValues = (objLiteral, sf) =>
  objLiteral.properties
    .filter((p) => ts.isPropertyAssignment(p))
    .map((p) => p.name.getText(sf).replace(/^['"]|['"]$/g, ''))

function readShadcn() {
  const files = fs
    .readdirSync(uiDir)
    .filter((f) => f.endsWith('.tsx'))
    .sort()

  const out = []

  for (const file of files) {
    const sf = parse(path.join(uiDir, file))
    const groups = {}

    const visit = (node) => {
      if (
        ts.isCallExpression(node) &&
        ts.isIdentifier(node.expression) &&
        node.expression.text === 'cva' &&
        node.arguments[1] &&
        ts.isObjectLiteralExpression(node.arguments[1])
      ) {
        const config = node.arguments[1]
        const get = (key) =>
          config.properties.find(
            (p) => ts.isPropertyAssignment(p) && p.name.getText(sf) === key,
          )?.initializer

        const variants = get('variants')
        const defaults = get('defaultVariants')

        if (variants && ts.isObjectLiteralExpression(variants)) {
          const defaultMap = {}
          if (defaults && ts.isObjectLiteralExpression(defaults)) {
            for (const p of defaults.properties) {
              if (ts.isPropertyAssignment(p)) {
                defaultMap[p.name.getText(sf)] = p.initializer.getText(sf).replace(/^['"]|['"]$/g, '')
              }
            }
          }
          for (const p of variants.properties) {
            if (!ts.isPropertyAssignment(p) || !ts.isObjectLiteralExpression(p.initializer)) continue
            const key = p.name.getText(sf)
            groups[key] = {
              options: literalValues(p.initializer, sf),
              default: defaultMap[key],
            }
          }
        }
      }
      node.forEachChild(visit)
    }
    sf.forEachChild(visit)

    if (Object.keys(groups).length > 0) {
      out.push({ module: file.replace(/\.tsx$/, ''), variants: groups })
    }
  }

  return out
}

/* ── Вывод ──────────────────────────────────────────────────── */

const crm = readCrm()
const shadcn = readShadcn()

fs.writeFileSync(
  path.join(root, 'src/api.generated.json'),
  JSON.stringify({ crm, shadcn }, null, 2) + '\n',
)

const md = []
md.push('# Справочник API — Cloudplus UI')
md.push('')
md.push('Сгенерирован из исходников: `node packages/ui/scripts/gen-api.cjs`. **Править руками не нужно.**')
md.push('')
md.push('Всё импортируется из корня пакета:')
md.push('')
md.push('```tsx')
md.push("import { Button, DataGrid, KanbanBoard } from '@cloudplus/ui'")
md.push("import '@cloudplus/ui/styles.css'")
md.push('```')
md.push('')
md.push('---')
md.push('')
md.push('## Варианты компонентов shadcn')
md.push('')
md.push('Остальные пропсы этих компонентов — стандартные HTML-атрибуты соответствующего элемента')
md.push('плюс `asChild`. Полная документация — https://ui.shadcn.com/docs/components.')
md.push('')
md.push('| Компонент | Проп | Значения | По умолчанию |')
md.push('|---|---|---|---|')
for (const { module, variants } of shadcn) {
  for (const [key, { options, default: def }] of Object.entries(variants)) {
    md.push(
      `| \`${module}\` | \`${key}\` | ${options.map((o) => `\`${o}\``).join(', ')} | ${def ? `\`${def}\`` : '—'} |`,
    )
  }
}
md.push('')
md.push('---')
md.push('')
md.push('## CRM-надстройка')
md.push('')
md.push('Компоненты, которых нет в shadcn. Всё, что есть в shadcn, берётся из shadcn — см. `KIT-CONTRACT.md`.')
md.push('')

for (const c of crm) {
  const generics = c.generics.length > 0 ? `<${c.generics.join(', ')}>` : ''
  md.push(`### ${c.name}${generics}`)
  md.push('')
  if (c.doc) {
    md.push(c.doc)
    md.push('')
  }
  if (c.extends.length > 0) {
    md.push(`Плюс все пропсы \`${c.extends.join('`, `')}\`.`)
    md.push('')
  }
  if (c.props.length === 0) {
    md.push('Собственных пропсов нет.')
    md.push('')
    continue
  }
  md.push('| Проп | Тип | Обяз. | По умолчанию | Описание |')
  md.push('|---|---|---|---|---|')
  for (const p of c.props) {
    md.push(
      `| \`${p.name}\` | \`${escapePipes(p.type)}\` | ${p.required ? 'да' : '—'} | ${
        p.default ? `\`${escapePipes(p.default)}\`` : '—'
      } | ${p.doc || ''} |`,
    )
  }
  md.push('')
}

fs.writeFileSync(path.resolve(root, '../../API.md'), md.join('\n'))

const undocumented = crm.reduce((n, c) => n + c.props.filter((p) => !p.doc).length, 0)
const total = crm.reduce((n, c) => n + c.props.length, 0)
console.log(`API.md: ${crm.length} компонентов CRM (${total} пропсов), ${shadcn.length} модулей shadcn с вариантами`)
console.log(`Без описания: ${undocumented} из ${total} пропсов`)
