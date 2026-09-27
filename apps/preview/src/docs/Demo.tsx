import { Tabs, TabsContent, TabsList, TabsTrigger } from '@cloudplus/ui'
import { Link2 } from 'lucide-react'
import { CodeBlock, CopyButton } from './CodeBlock'

export type DemoProps = {
  title?: string
  description?: string
  code: string
  children: React.ReactNode
  /** Растянуть превью по ширине вместо центрирования по строке. */
  block?: boolean
}

/** Идентификатор секции для якоря и оглавления: из заголовка примера. */
export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-|-$/g, '')
}

export function Demo({ title, description, code, children, block = false }: DemoProps) {
  const id = title ? slugify(title) : undefined

  return (
    // data-toc собирает оглавление справа: одна разметка на все виды секций.
    <section id={id} data-toc={title} className="scroll-mt-20">
      {title && (
        <div className="mb-3">
          <h3 className="group flex items-center gap-2 text-lg font-semibold tracking-tight">
            {title}
            {id && (
              <a
                href={`#${id}`}
                aria-label={`Ссылка на «${title}»`}
                onClick={(e) => {
                  // Хеш-роутер витрины реагирует на слаги страниц; якорь примера
                  // прокручиваем сами, не трогая адресную строку.
                  e.preventDefault()
                  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }}
                className="text-muted-foreground hover:text-foreground opacity-0 transition-opacity group-hover:opacity-100"
              >
                <Link2 className="size-4" />
              </a>
            )}
          </h3>
          {description && <p className="text-muted-foreground mt-1 text-sm">{description}</p>}
        </div>
      )}

      <Tabs defaultValue="preview">
        <div className="flex items-center justify-between gap-2">
          <TabsList>
            <TabsTrigger value="preview">Превью</TabsTrigger>
            <TabsTrigger value="code">Код</TabsTrigger>
          </TabsList>
          <CopyButton text={code.trim()} />
        </div>

        <TabsContent value="preview">
          <div
            className={
              'bg-background rounded-lg border p-8 ' +
              (block ? '' : 'flex min-h-40 flex-wrap items-center justify-center gap-3')
            }
          >
            {children}
          </div>
        </TabsContent>

        <TabsContent value="code">
          <CodeBlock code={code} className="max-h-[28rem]" />
        </TabsContent>
      </Tabs>
    </section>
  )
}
