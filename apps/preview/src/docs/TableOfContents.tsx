import { useEffect, useState } from 'react'

type Entry = { id: string; title: string }

/** Секции страницы размечены атрибутом data-toc (см. Demo и PropsTable).
 *  Собираем их после рендера страницы — плюс отслеживаем активную. */
export function TableOfContents({ slug }: { slug: string }) {
  const [entries, setEntries] = useState<Entry[]>([])
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    const id = window.requestAnimationFrame(() => {
      const nodes = Array.from(document.querySelectorAll<HTMLElement>('main [data-toc]'))
      setEntries(
        nodes
          .filter((n) => n.id && n.dataset.toc)
          .map((n) => ({ id: n.id, title: n.dataset.toc as string })),
      )
      setActive(null)
    })
    return () => window.cancelAnimationFrame(id)
  }, [slug])

  useEffect(() => {
    if (entries.length === 0) return

    const observer = new IntersectionObserver(
      (records) => {
        // Активной считаем самую верхнюю из видимых секций.
        const visible = records
          .filter((r) => r.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible.length > 0) setActive(visible[0].target.id)
      },
      // Верхняя треть окна: секция становится активной, когда доходит до неё.
      { rootMargin: '-64px 0px -66% 0px', threshold: 0 },
    )

    for (const e of entries) {
      const node = document.getElementById(e.id)
      if (node) observer.observe(node)
    }
    return () => observer.disconnect()
  }, [entries])

  if (entries.length < 2) return null

  return (
    <aside className="sticky top-14 hidden h-fit w-56 shrink-0 py-10 pr-6 xl:block">
      <div className="text-muted-foreground mb-2 text-xs font-medium tracking-wide uppercase">
        На этой странице
      </div>
      <nav>
        <ul className="space-y-0.5 border-l">
          {entries.map((e) => (
            <li key={e.id}>
              <a
                href={`#${e.id}`}
                onClick={(ev) => {
                  ev.preventDefault()
                  document.getElementById(e.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }}
                className={
                  '-ml-px block border-l py-1 pl-3 text-sm transition-colors ' +
                  (active === e.id
                    ? 'border-foreground text-foreground font-medium'
                    : 'text-muted-foreground hover:text-foreground border-transparent')
                }
              >
                {e.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}
