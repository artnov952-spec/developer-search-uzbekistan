import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Badge, Button,
  CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,
  Input, Kbd, Label,
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
  Separator, Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger,
  Tabs, TabsList, TabsTrigger,
  useCommandK, useTheme, ACCENTS, FONTS,
} from '@cloudplus/ui'
import { ChevronLeft, ChevronRight, Menu, Moon, Search, Sun } from 'lucide-react'
import { GROUPS, PAGES, type DocPage } from './pages'
import { CodeBlock } from './CodeBlock'
import { TableOfContents } from './TableOfContents'

const isSlug = (s: string) => PAGES.some((p) => p.slug === s)

/** Роутинг по хешу. Хеш, который не соответствует ни одной странице (например,
 *  якорь внутри демо — `#varianty`), НЕ считается сменой страницы: раньше
 *  такой хеш проваливался в `?? PAGES[0]` и любая внутренняя ссылка
 *  выкидывала пользователя на первую страницу сайта. */
function useHashSlug(fallback: string) {
  const [slug, setSlug] = useState(() => {
    const h = window.location.hash.slice(1)
    return isSlug(h) ? h : fallback
  })
  useEffect(() => {
    const onHash = () => {
      const h = window.location.hash.slice(1)
      if (isSlug(h)) setSlug(h)
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  return [slug, useCallback((s: string) => { window.location.hash = s }, [])] as const
}

function groupPages(query: string) {
  const q = query.trim().toLowerCase()
  const match = (p: DocPage) =>
    !q || p.title.toLowerCase().includes(q) || p.slug.includes(q) || p.description.toLowerCase().includes(q)
  return GROUPS.map((g) => ({ group: g, items: PAGES.filter((p) => p.group === g && match(p)) })).filter(
    (g) => g.items.length > 0,
  )
}

function Brand() {
  return (
    <>
      <span className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded text-xs font-semibold">
        C
      </span>
      <span className="text-sm font-semibold tracking-tight">Cloudplus UI</span>
      <Badge variant="secondary" className="ml-auto text-[10px]">v1</Badge>
    </>
  )
}

function NavList({ current, onPick, query }: { current: string; onPick: (s: string) => void; query: string }) {
  const grouped = useMemo(() => groupPages(query), [query])

  if (grouped.length === 0) {
    return <p className="text-muted-foreground px-2 py-6 text-sm">Ничего не найдено.</p>
  }

  return (
    <>
      {grouped.map(({ group, items }) => (
        <div key={group} className="mb-5">
          <div className="text-muted-foreground mb-1 px-2 text-xs font-medium tracking-wide uppercase">
            {group}
          </div>
          <ul className="space-y-0.5">
            {items.map((p) => {
              const active = p.slug === current
              return (
                <li key={p.slug}>
                  <button
                    onClick={() => onPick(p.slug)}
                    aria-current={active ? 'page' : undefined}
                    className={
                      'w-full rounded-md px-2 py-1.5 text-left text-sm transition-colors ' +
                      (active
                        ? 'bg-accent text-accent-foreground font-medium'
                        : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground')
                    }
                  >
                    {p.title}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </>
  )
}

function Sidebar({ current, onPick }: { current: string; onPick: (s: string) => void }) {
  const [query, setQuery] = useState('')

  return (
    <aside className="bg-background sticky top-0 hidden h-dvh w-64 shrink-0 border-r md:block">
      <div className="flex h-14 items-center gap-2 border-b px-4"><Brand /></div>

      <div className="p-3">
        <div className="relative">
          <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск компонента…"
            className="pl-8"
          />
        </div>
      </div>

      <nav className="h-[calc(100dvh-7.5rem)] overflow-y-auto px-3 pb-8">
        <NavList current={current} onPick={onPick} query={query} />
      </nav>
    </aside>
  )
}

/** На узком экране раньше навигации не было вообще: сайдбар просто прятался. */
function MobileNav({ current, onPick }: { current: string; onPick: (s: string) => void }) {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden" aria-label="Открыть меню">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0">
        <SheetHeader className="h-14 flex-row items-center gap-2 border-b px-4">
          <SheetTitle className="contents"><Brand /></SheetTitle>
        </SheetHeader>
        <nav className="overflow-y-auto px-3 pb-8">
          <NavList
            current={current}
            query=""
            onPick={(s) => { onPick(s); setOpen(false) }}
          />
        </nav>
      </SheetContent>
    </Sheet>
  )
}

/** Палитра ⌘K — на том же Command, что документирует сама витрина. */
function CommandPalette({ onPick }: { onPick: (s: string) => void }) {
  const [open, setOpen] = useState(false)
  useCommandK(setOpen)

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="text-muted-foreground w-full justify-start gap-2 sm:w-56"
      >
        <Search className="size-4" />
        <span className="flex-1 text-left">Поиск…</span>
        <Kbd>⌘K</Kbd>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen} title="Поиск по витрине" description="Компоненты и разделы">
        <CommandInput placeholder="Компонент или раздел…" />
        <CommandList>
          <CommandEmpty>Ничего не найдено.</CommandEmpty>
          {GROUPS.map((g) => {
            const items = PAGES.filter((p) => p.group === g)
            if (items.length === 0) return null
            return (
              <CommandGroup key={g} heading={g}>
                {items.map((p) => (
                  <CommandItem
                    key={p.slug}
                    value={`${p.title} ${p.slug} ${p.description}`}
                    onSelect={() => { onPick(p.slug); setOpen(false) }}
                  >
                    {p.title}
                  </CommandItem>
                ))}
              </CommandGroup>
            )
          })}
        </CommandList>
      </CommandDialog>
    </>
  )
}

function Topbar({ current, onPick }: { current: string; onPick: (s: string) => void }) {
  const { theme, toggleTheme, density, setDensity, accent, setAccent, font, setFont } = useTheme()

  return (
    <header className="bg-background/80 sticky top-0 z-30 flex h-14 items-center gap-2 border-b px-4 backdrop-blur sm:gap-4 sm:px-6">
      <MobileNav current={current} onPick={onPick} />

      <div className="min-w-0 flex-1 sm:max-w-56">
        <CommandPalette onPick={onPick} />
      </div>

      <div className="ml-auto flex items-center gap-4">
        <div className="hidden items-center gap-1.5 xl:flex">
          <Label className="text-muted-foreground text-xs">Акцент</Label>
          <div className="flex items-center gap-1">
            {ACCENTS.map((a) => (
              <button
                key={a.value}
                onClick={() => setAccent(a.value)}
                title={a.label}
                aria-label={`Акцент: ${a.label}`}
                aria-pressed={accent === a.value}
                style={{ background: a.color }}
                className={
                  'size-4 rounded-full border transition-transform ' +
                  (accent === a.value ? 'ring-ring/60 scale-110 ring-2 ring-offset-1' : 'hover:scale-110')
                }
              />
            ))}
          </div>
        </div>

        <Select value={font} onValueChange={(v: string) => setFont(v as typeof font)}>
          <SelectTrigger size="sm" className="hidden w-36 lg:flex"><SelectValue /></SelectTrigger>
          <SelectContent>
            {FONTS.map((f) => <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>)}
          </SelectContent>
        </Select>

        <Tabs
          value={density}
          onValueChange={(v: string) => setDensity(v as typeof density)}
          className="hidden sm:block"
        >
          <TabsList>
            <TabsTrigger value="default">Обычная</TabsTrigger>
            <TabsTrigger value="compact">Плотная</TabsTrigger>
          </TabsList>
        </Tabs>

        <Separator orientation="vertical" className="hidden h-6 sm:block" />

        <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Сменить тему">
          {theme === 'light' ? <Moon /> : <Sun />}
        </Button>
      </div>
    </header>
  )
}

/** Имена для строки импорта: из заголовка берём латинские PascalCase-слова.
 *  Для страниц с русским заголовком (обзорных) строка импорта не показывается. */
function importNames(page: DocPage): string | null {
  const names = page.title.match(/\b[A-Z][A-Za-z]+\b/g)
  return names && names.length > 0 ? names.join(', ') : null
}

function PrevNext({ page, onPick }: { page: DocPage; onPick: (s: string) => void }) {
  const i = PAGES.findIndex((p) => p.slug === page.slug)
  const prev = i > 0 ? PAGES[i - 1] : null
  const next = i < PAGES.length - 1 ? PAGES[i + 1] : null

  return (
    <nav className="mt-16 flex items-stretch justify-between gap-3 border-t pt-6">
      {prev ? (
        <Button variant="outline" onClick={() => onPick(prev.slug)} className="h-auto justify-start py-3 text-left">
          <ChevronLeft className="shrink-0" />
          <span className="min-w-0">
            <span className="text-muted-foreground block text-xs">Назад</span>
            <span className="block truncate font-medium">{prev.title}</span>
          </span>
        </Button>
      ) : <span />}

      {next ? (
        <Button variant="outline" onClick={() => onPick(next.slug)} className="h-auto justify-end py-3 text-right">
          <span className="min-w-0">
            <span className="text-muted-foreground block text-xs">Дальше</span>
            <span className="block truncate font-medium">{next.title}</span>
          </span>
          <ChevronRight className="shrink-0" />
        </Button>
      ) : <span />}
    </nav>
  )
}

export function DocsShell() {
  const [slug, setSlug] = useHashSlug(PAGES[0].slug)
  const page = PAGES.find((p) => p.slug === slug) ?? PAGES[0]
  const names = importNames(page)

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [slug])

  return (
    <div className="flex min-h-dvh">
      <Sidebar current={page.slug} onPick={setSlug} />

      <div className="min-w-0 flex-1">
        <Topbar current={page.slug} onPick={setSlug} />

        <div className="flex justify-center">
          <main className="w-full max-w-3xl min-w-0 px-4 py-10 sm:px-6">
            <div className="mb-8">
              <div className="text-muted-foreground mb-2 text-xs font-medium tracking-wide uppercase">
                {page.group}
              </div>
              <h1 className="text-3xl font-semibold tracking-tight">{page.title}</h1>
              <p className="text-muted-foreground mt-2 text-base">{page.description}</p>
            </div>

            {names && (
              <section id="ustanovka" data-toc="Импорт" className="mb-8 scroll-mt-20">
                <CodeBlock code={`import { ${names} } from '@cloudplus/ui'`} />
              </section>
            )}

            <Separator className="mb-8" />
            {page.render()}
            <PrevNext page={page} onPick={setSlug} />
          </main>

          <TableOfContents slug={page.slug} />
        </div>
      </div>
    </div>
  )
}
