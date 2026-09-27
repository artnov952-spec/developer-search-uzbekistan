/**
 * Сборка поставки Cloudplus Icons: отдельные SVG, спрайт, React-компонент,
 * офлайн-каталог и README. Источник правды - src/lib/icons/defs-*.ts.
 *
 * Запуск:  npx esbuild src/lib/icons/data.ts --bundle --platform=node --format=cjs --outfile=/tmp/cp-icons-data.cjs
 *          node scripts/build-icon-pack.cjs
 */
const fs = require('fs')
const path = require('path')

const { ICONS } = require('/tmp/cp-icons-data.cjs')
const OUT = path.resolve(__dirname, '../icon-pack')
const VERSION = '1.0.0'

const rm = (p) => fs.rmSync(p, { recursive: true, force: true })
const mk = (p) => fs.mkdirSync(p, { recursive: true })
const w = (p, s) => fs.writeFileSync(p, s, 'utf8')

rm(OUT)
mk(path.join(OUT, 'svg'))
mk(path.join(OUT, 'react'))

const ATTRS =
  'xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" ' +
  'stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"'

// ── 1. Отдельные SVG ────────────────────────────────────────────────
for (const i of ICONS) {
  w(path.join(OUT, 'svg', `${i.name}.svg`), `<svg ${ATTRS}>${i.body}</svg>\n`)
}

// ── 2. Спрайт ───────────────────────────────────────────────────────
const symbols = ICONS.map(
  (i) => `  <symbol id="cp-${i.name}" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${i.body}</symbol>`,
).join('\n')
w(
  path.join(OUT, 'sprite.svg'),
  `<svg xmlns="http://www.w3.org/2000/svg" style="display:none">\n${symbols}\n</svg>\n`,
)

// ── 3. React ────────────────────────────────────────────────────────
const paths = ICONS.map((i) => `  '${i.name}': ${JSON.stringify(i.body)},`).join('\n')
w(
  path.join(OUT, 'react', 'icons.js'),
  `// Cloudplus Icons v${VERSION} - ${ICONS.length} иконок. Сгенерировано, не править руками.\nexport const CP_ICON_PATHS = {\n${paths}\n}\nexport const CP_ICON_NAMES = Object.keys(CP_ICON_PATHS)\n`,
)
w(
  path.join(OUT, 'react', 'CpIcon.jsx'),
  `import { CP_ICON_PATHS } from './icons.js'

/** Толщина обводки под размер: мелкие размеры требуют чуть более жирного штриха. */
function autoStroke(size) {
  if (size <= 16) return 1.75
  if (size <= 20) return 1.65
  return 1.6
}

/**
 * Иконка Cloudplus. Цвет наследуется от текста (currentColor).
 * <CpIcon name="deal" size={20} />
 */
export function CpIcon({ name, size = 20, strokeWidth, className, ...rest }) {
  const body = CP_ICON_PATHS[name]
  if (!body) return null
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth ?? autoStroke(size)}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={['cp-icon', className].filter(Boolean).join(' ')}
      aria-hidden={rest['aria-label'] ? undefined : true}
      dangerouslySetInnerHTML={{ __html: body }}
      {...rest}
    />
  )
}
`,
)
w(
  path.join(OUT, 'react', 'icons.d.ts'),
  `export type CpIconName =\n${ICONS.map((i) => `  | '${i.name}'`).join('\n')}\n\nexport declare const CP_ICON_PATHS: Record<CpIconName, string>\nexport declare const CP_ICON_NAMES: CpIconName[]\n`,
)

// ── 4. CSS ──────────────────────────────────────────────────────────
w(
  path.join(OUT, 'icons.css'),
  `/* Cloudplus Icons v${VERSION} */
.cp-icon { display: inline-block; vertical-align: middle; flex: none; }
/* Двухцветный режим: акцентная точка красится в цвет бренда. */
.cp-icon--duo [fill='currentColor'] { fill: var(--cp-icon-accent, #2f6df6); }
.cp-icon--soft { opacity: .78; }
`,
)

// ── 5. Офлайн-каталог ───────────────────────────────────────────────
const groups = [...new Set(ICONS.map((i) => i.group))]
const cells = groups
  .map((g) => {
    const items = ICONS.filter((i) => i.group === g)
      .map(
        (i) =>
          `<button class="cell" data-n="${i.name} ${i.label.toLowerCase()} ${i.keywords.join(' ')}" onclick="copy('${i.name}')">` +
          `<svg ${ATTRS.replace('width="24" height="24"', 'width="28" height="28"')}>${i.body}</svg>` +
          `<span>${i.name}</span></button>`,
      )
      .join('')
    return `<h2>${g} <i>${ICONS.filter((i) => i.group === g).length}</i></h2><div class="grid">${items}</div>`
  })
  .join('\n')
w(
  path.join(OUT, 'preview.html'),
  `<!doctype html><html lang="ru"><head><meta charset="utf-8">
<title>Cloudplus Icons - ${ICONS.length} иконок</title>
<style>
:root{--fg:#10141c;--fg2:#6b7480;--bd:#e6e8ec;--bg:#fbfbfc;--acc:#2f6df6}
*{box-sizing:border-box}
body{margin:0;padding:40px;font:14px/1.5 -apple-system,Inter,Segoe UI,sans-serif;background:var(--bg);color:var(--fg)}
h1{font-size:28px;margin:0 0 6px;letter-spacing:-.02em}
.lead{color:var(--fg2);margin:0 0 24px;max-width:70ch}
#q{width:100%;max-width:420px;height:40px;padding:0 14px;border:1px solid var(--bd);border-radius:10px;font:inherit;background:#fff;margin-bottom:28px}
h2{font-size:15px;margin:28px 0 12px;display:flex;gap:8px;align-items:center}
h2 i{font-style:normal;font-size:11px;font-weight:600;color:var(--fg2);background:#eef0f3;border-radius:20px;padding:2px 7px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:8px}
.cell{display:flex;flex-direction:column;align-items:center;gap:9px;padding:16px 8px 12px;border:1px solid transparent;border-radius:12px;background:#fff;cursor:pointer;font:inherit;color:var(--fg)}
.cell:hover{border-color:var(--bd)}
.cell span{font-size:11px;color:var(--fg2);word-break:break-all;text-align:center}
.cell.hit span{color:var(--acc)}
.hide{display:none}
</style></head><body>
<h1>Cloudplus Icons</h1>
<p class="lead">${ICONS.length} авторских иконок · v${VERSION}. Клик по иконке копирует ее имя.
Диагональная асимметрия радиусов, акцентная точка, сетка 24x24, обводка 1.6.</p>
<input id="q" placeholder="Поиск: сделка, воронка, звонок, экспорт...">
${cells}
<script>
const q=document.getElementById('q')
q.oninput=()=>{const s=q.value.trim().toLowerCase()
 document.querySelectorAll('.cell').forEach(c=>c.classList.toggle('hide',!!s&&!c.dataset.n.includes(s)))
 document.querySelectorAll('h2').forEach(h=>{let n=h.nextElementSibling,v=[...n.children].some(c=>!c.classList.contains('hide'));h.classList.toggle('hide',!v);n.classList.toggle('hide',!v)})}
function copy(n){navigator.clipboard&&navigator.clipboard.writeText(n)
 const el=[...document.querySelectorAll('.cell')].find(c=>c.dataset.n.startsWith(n+' '))
 if(el){el.classList.add('hit');setTimeout(()=>el.classList.remove('hit'),900)}}
</script></body></html>
`,
)

// ── 6. README ───────────────────────────────────────────────────────
const byGroup = groups.map((g) => `- **${g}** - ${ICONS.filter((i) => i.group === g).length}`).join('\n')
w(
  path.join(OUT, 'README.md'),
  `# Cloudplus Icons v${VERSION}

${ICONS.length} авторских иконок под Cloudplus CRM. Собственная геометрия, не производная
от Lucide / Feather / Phosphor.

## Что внутри

| Путь | Что это |
|---|---|
| \`svg/\` | ${ICONS.length} отдельных SVG, 24x24, \`currentColor\` |
| \`sprite.svg\` | спрайт с \`<symbol id="cp-<имя>">\` |
| \`react/CpIcon.jsx\` | React-компонент |
| \`react/icons.js\` | карта имя → разметка |
| \`react/icons.d.ts\` | типы имен для TypeScript |
| \`icons.css\` | двухцветный режим и модификаторы |
| \`preview.html\` | офлайн-каталог с поиском, открывается двойным кликом |

## Состав

${byGroup}

## Правила набора

1. **Диагональная асимметрия радиусов** - у контейнеров радиус 5 на верхнем-левом и
   нижнем-правом углах, радиус 2 на двух других. Подпись набора.
2. **Акцентная точка** - не более одной залитой точки r=1.15 на смысловом центре.
3. **Сетка 2px, углы 0/45/90** - четкость на 16px без хинтинга.
4. Обводка 1.6, \`linecap/linejoin: round\`, цвет - \`currentColor\`.

## Встраивание в CRM (React)

\`\`\`bash
cp -r icon-pack/react apps/web/src/icons
cp icon-pack/icons.css apps/web/src/icons/icons.css
\`\`\`

\`\`\`tsx
import { CpIcon } from './icons/CpIcon'
import './icons/icons.css'

<CpIcon name="deal" size={20} />
<CpIcon name="calendar" size={20} className="cp-icon--duo" />  // акцентная точка цветом бренда
\`\`\`

Замена в сайдбаре - один в один по смыслу:

| Было (lucide) | Стало |
|---|---|
| \`Building2\` | \`crm\` / \`company\` |
| \`Gauge\` | \`logos\` |
| \`CheckSquare\` | \`mitos\` |
| \`Send\` | \`telegram\` |
| \`MessageCircle\` | \`communications\` |
| \`Calendar\` | \`calendar\` |
| \`Database\` | \`database\` |
| \`Network\` | \`structure\` |
| \`BarChart3\` | \`sales-rating\` |
| \`BookOpen\` | \`knowledge\` |
| \`Bot\` | \`assistant\` |
| \`History\` | \`action-log\` |
| \`Code2\` | \`dev\` |

## Спрайт (без сборки)

\`\`\`html
<div hidden id="cp-sprite"></div>
<script>fetch('/sprite.svg').then(r=>r.text()).then(s=>cpSprite.innerHTML=s)</script>

<svg width="20" height="20"><use href="#cp-deal"></use></svg>
\`\`\`

## Цвет

Контур наследует \`color\` родителя. Акцентная точка красится через переменную:

\`\`\`css
.sidebar { --cp-icon-accent: #5b8cff; }
\`\`\`
`,
)

console.log(`Готово: ${ICONS.length} иконок → ${OUT}`)
console.log(`  svg/           ${fs.readdirSync(path.join(OUT, 'svg')).length} файлов`)
console.log(`  sprite.svg     ${(fs.statSync(path.join(OUT, 'sprite.svg')).size / 1024).toFixed(1)} КБ`)
console.log(`  preview.html   ${(fs.statSync(path.join(OUT, 'preview.html')).size / 1024).toFixed(1)} КБ`)
