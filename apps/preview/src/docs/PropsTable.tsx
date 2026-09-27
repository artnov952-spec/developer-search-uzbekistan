/* Таблицы API. Данные — из сгенерированного справочника, руками здесь ничего
   не перечисляется: разойтись с исходниками невозможно. */
import { Badge, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@cloudplus/ui'
import { crmApi, shadcnApi } from './api'
import { slugify } from './Demo'

function Shell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section id={slugify(title)} data-toc={title} className="scroll-mt-20">
      <h3 className="mb-3 text-lg font-semibold tracking-tight">{title}</h3>
      <div className="overflow-x-auto rounded-lg border">{children}</div>
    </section>
  )
}

/** Блок «API» в конце страницы: таблицы всех показанных на ней компонентов. */
export function ApiSection({ of }: { of: string[] }) {
  return (
    <div className="space-y-8 pt-4">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">API</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Сгенерировано из исходников. Полный справочник по всей библиотеке — в <code className="font-mono text-xs">API.md</code>.
        </p>
      </div>
      {of.map((name) => <PropsTable key={name} of={name} />)}
    </div>
  )
}

/** Таблица пропсов компонента CRM-надстройки. */
export function PropsTable({ of }: { of: string }) {
  const api = crmApi(of)
  if (!api) {
    return (
      <p className="text-muted-foreground text-sm">
        Нет данных API для <code className="font-mono">{of}</code> — пересоберите библиотеку.
      </p>
    )
  }

  const generics = api.generics.length > 0 ? `<${api.generics.join(', ')}>` : ''

  return (
    <Shell title={`${of}${generics}`}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-44">Проп</TableHead>
            <TableHead className="w-64">Тип</TableHead>
            <TableHead className="w-28">По умолчанию</TableHead>
            <TableHead>Описание</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {api.props.map((p) => (
            <TableRow key={p.name}>
              <TableCell className="align-top">
                <code className="font-mono text-xs font-medium">{p.name}</code>
                {p.required && (
                  <Badge variant="outline" className="ml-1.5 px-1 py-0 text-[10px]">обяз.</Badge>
                )}
              </TableCell>
              <TableCell className="align-top">
                <code className="text-muted-foreground font-mono text-xs break-all">{p.type}</code>
              </TableCell>
              <TableCell className="align-top">
                {p.default
                  ? <code className="font-mono text-xs">{p.default}</code>
                  : <span className="text-muted-foreground">—</span>}
              </TableCell>
              <TableCell className="text-muted-foreground align-top text-sm">{p.doc || '—'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {api.extends.length > 0 && (
        <p className="text-muted-foreground border-t px-4 py-2.5 text-xs">
          Плюс все пропсы <code className="font-mono">{api.extends.join(', ')}</code>.
        </p>
      )}
    </Shell>
  )
}

/** Таблица вариантов cva для компонента shadcn: имя файла модуля, не компонента. */
export function VariantsTable({ of, title }: { of: string; title?: string }) {
  const api = shadcnApi(of)
  if (!api) return null

  return (
    <Shell title={title ?? 'Варианты'}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-32">Проп</TableHead>
            <TableHead>Значения</TableHead>
            <TableHead className="w-32">По умолчанию</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.entries(api.variants).map(([key, group]) => (
            <TableRow key={key}>
              <TableCell className="align-top">
                <code className="font-mono text-xs font-medium">{key}</code>
              </TableCell>
              <TableCell className="align-top">
                <div className="flex flex-wrap gap-1">
                  {group.options.map((o) => (
                    <code key={o} className="bg-muted rounded px-1.5 py-0.5 font-mono text-xs">{o}</code>
                  ))}
                </div>
              </TableCell>
              <TableCell className="align-top">
                {group.default
                  ? <code className="font-mono text-xs">{group.default}</code>
                  : <span className="text-muted-foreground">—</span>}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <p className="text-muted-foreground border-t px-4 py-2.5 text-xs">
        Остальные пропсы — стандартные HTML-атрибуты элемента плюс <code className="font-mono">asChild</code>.
      </p>
    </Shell>
  )
}
