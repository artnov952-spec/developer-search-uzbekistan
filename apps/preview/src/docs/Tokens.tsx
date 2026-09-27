/* Страница токенов.
   Источник правды — packages/ui/src/tokens/theme.css (палитра shadcn) и tokens.css (шкалы).
   Значения не дублируются в коде: всё читается из CSS через getComputedStyle,
   поэтому страница не может разойтись с библиотекой. */
import { useEffect, useState } from 'react'
import {
  Badge, Button, Collapsible, CollapsibleContent, CollapsibleTrigger,
  Separator, Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
  useTheme,
} from '@cloudplus/ui'
import { Check, ChevronDown, Copy } from 'lucide-react'

/** Перечитывает вычисленные значения при любой смене темы/акцента/плотности/шрифта. */
function useComputedTokens(names: string[]) {
  const { theme, accent, density, font } = useTheme()
  const [values, setValues] = useState<Record<string, string>>({})

  useEffect(() => {
    // Атрибуты на <html> ставит ThemeProvider в своём эффекте — читаем после него.
    const id = window.requestAnimationFrame(() => {
      const cs = getComputedStyle(document.documentElement)
      const next: Record<string, string> = {}
      for (const n of names) next[n] = cs.getPropertyValue(n).trim()
      setValues(next)
    })
    return () => window.cancelAnimationFrame(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme, accent, density, font, names.join(',')])

  return values
}

function useCopy() {
  const [copied, setCopied] = useState<string | null>(null)
  return {
    copied,
    copy: async (text: string) => {
      try {
        await navigator.clipboard.writeText(text)
        setCopied(text)
        window.setTimeout(() => setCopied((c) => (c === text ? null : c)), 1400)
      } catch {
        /* буфер недоступен — молча игнорируем */
      }
    },
  }
}

function Section({
  title, description, children,
}: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="scroll-mt-24">
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      {description && <p className="text-muted-foreground mt-1 text-sm">{description}</p>}
      <div className="mt-4">{children}</div>
    </section>
  )
}

/* ── Палитра ────────────────────────────────────────────────── */

/** Пара «фон + текст на нём». Именно парами их и надо применять — так устроен shadcn. */
type Pair = { bg: string; fg?: string; cls: string; note: string }

const PALETTE: Pair[] = [
  { bg: '--background', fg: '--foreground', cls: 'bg-background text-foreground', note: 'Фон страницы' },
  { bg: '--card', fg: '--card-foreground', cls: 'bg-card text-card-foreground', note: 'Карточки, панели' },
  { bg: '--popover', fg: '--popover-foreground', cls: 'bg-popover text-popover-foreground', note: 'Всплывающие слои' },
  { bg: '--primary', fg: '--primary-foreground', cls: 'bg-primary text-primary-foreground', note: 'Основное действие' },
  { bg: '--secondary', fg: '--secondary-foreground', cls: 'bg-secondary text-secondary-foreground', note: 'Второстепенное действие' },
  { bg: '--muted', fg: '--muted-foreground', cls: 'bg-muted text-muted-foreground', note: 'Приглушённый фон и текст' },
  { bg: '--accent', fg: '--accent-foreground', cls: 'bg-accent text-accent-foreground', note: 'Ховер пунктов меню' },
  { bg: '--destructive', cls: 'bg-destructive text-white', note: 'Удаление, ошибка' },
]

const LINES: { name: string; cls: string; note: string }[] = [
  { name: '--border', cls: 'border-border', note: 'Рамки карточек, таблиц, разделители' },
  { name: '--input', cls: 'border-input', note: 'Рамка полей ввода' },
  { name: '--ring', cls: 'ring-ring', note: 'Кольцо фокуса, focus-visible:ring-[3px]' },
]

const SEMANTIC = ['--success', '--warning', '--danger', '--info']
const CHARTS = ['--chart-1', '--chart-2', '--chart-3', '--chart-4', '--chart-5']

function Swatch({
  pair, value, fgValue, onCopy, copied,
}: {
  pair: Pair; value?: string; fgValue?: string
  onCopy: (t: string) => void; copied: string | null
}) {
  return (
    <button
      type="button"
      onClick={() => onCopy(pair.bg)}
      className="hover:border-foreground/25 group rounded-lg border text-left transition-colors"
      title={`Скопировать ${pair.bg}`}
    >
      <div
        className="flex h-20 items-center justify-center rounded-t-lg border-b text-sm font-medium"
        style={{ background: `var(${pair.bg})`, color: pair.fg ? `var(${pair.fg})` : '#fff' }}
      >
        Аа 123
      </div>
      <div className="space-y-1 p-3">
        <div className="flex items-center gap-1.5">
          <code className="font-mono text-xs font-medium">{pair.bg}</code>
          {copied === pair.bg
            ? <Check className="size-3 shrink-0 text-emerald-600" />
            : <Copy className="text-muted-foreground size-3 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />}
        </div>
        <code className="text-muted-foreground block font-mono text-[11px] break-all">{value || '—'}</code>
        {pair.fg && (
          <code className="text-muted-foreground block font-mono text-[11px] break-all">
            {pair.fg}: {fgValue || '—'}
          </code>
        )}
        <p className="text-muted-foreground pt-1 text-xs">{pair.note}</p>
        <code className="bg-muted text-muted-foreground inline-block rounded px-1.5 py-0.5 font-mono text-[11px]">
          {pair.cls}
        </code>
      </div>
    </button>
  )
}

/* ── Шкалы ──────────────────────────────────────────────────── */

const RADII = [
  { name: '--radius-sm', note: 'calc(--radius − 4px)', cls: 'rounded-sm' },
  { name: '--radius-md', note: 'calc(--radius − 2px)', cls: 'rounded-md' },
  { name: '--radius-lg', note: '--radius', cls: 'rounded-lg' },
  { name: '--radius-xl', note: 'calc(--radius + 4px)', cls: 'rounded-xl' },
]

const HEIGHTS = [
  { name: '--h-compact', note: 'size="sm"' },
  { name: '--h-default', note: 'размер по умолчанию' },
  { name: '--h-lg', note: 'size="lg"' },
]

const SPACING = ['--sp-1', '--sp-2', '--sp-3', '--sp-4', '--sp-5', '--sp-6', '--sp-8', '--sp-10']

const SHADOWS = [
  { name: '--sh-sm', note: 'Карточки, приподнятые поверхности' },
  { name: '--sh-pop', note: 'Меню, поповеры, тултипы' },
  { name: '--sh-modal', note: 'Модальные окна, шторки' },
]

const TYPE_SCALE = [
  { size: 30, weight: 600, note: 'Заголовок страницы · text-3xl font-semibold' },
  { size: 24, weight: 600, note: 'Секция · text-2xl font-semibold' },
  { size: 20, weight: 600, note: 'Подзаголовок · text-xl font-semibold' },
  { size: 16, weight: 500, note: 'Крупный текст · text-base font-medium' },
  { size: 14, weight: 400, note: 'Базовый · text-sm' },
  { size: 12, weight: 400, note: 'Подпись · text-xs' },
]

const Z_LAYERS = [
  { name: '--z-sticky', note: 'Липкие шапки' },
  { name: '--z-dropdown', note: 'Выпадающие меню' },
  { name: '--z-overlay', note: 'Затемнение под модалкой' },
  { name: '--z-modal', note: 'Модальные окна' },
  { name: '--z-toast', note: 'Тосты' },
  { name: '--z-tooltip', note: 'Тултипы' },
]

const MOTION = [
  { name: '--dur-fast', note: 'Ховеры, мелкие смены цвета' },
  { name: '--dur', note: 'Основная длительность' },
  { name: '--dur-slow', note: 'Появление слоёв' },
]

/** Исторические имена кита. Живы только ради ещё не переписанных компонентов. */
const ALIASES: [string, string][] = [
  ['--sf-app', '--background'],
  ['--sf-1', '--card'],
  ['--sf-2', '--muted'],
  ['--sf-3', '--secondary'],
  ['--sf-overlay', '--popover'],
  ['--tx-1', '--foreground'],
  ['--tx-2 / --tx-muted', '--muted-foreground'],
  ['--tx-on-accent', '--primary-foreground'],
  ['--bd', '--border'],
  ['--bd-focus', '--ring'],
  ['--brand', '--primary'],
  ['--brand-soft', '--accent'],
  ['--danger', '--destructive'],
  ['--r-lg', '--radius'],
]

const ALL_NAMES = [
  ...PALETTE.flatMap((p) => [p.bg, ...(p.fg ? [p.fg] : [])]),
  ...LINES.map((l) => l.name),
  ...SEMANTIC, ...CHARTS,
  ...RADII.map((r) => r.name),
  ...HEIGHTS.map((h) => h.name),
  ...SPACING,
  ...SHADOWS.map((s) => s.name),
  ...Z_LAYERS.map((z) => z.name),
  ...MOTION.map((m) => m.name),
  '--radius', '--font', '--font-mono', '--ease',
]

export function Tokens() {
  const v = useComputedTokens(ALL_NAMES)
  const { copied, copy } = useCopy()
  const { theme, accent } = useTheme()

  return (
    <div className="space-y-12">
      <div className="bg-muted/40 flex flex-wrap items-center gap-x-6 gap-y-2 rounded-lg border p-4 text-sm">
        <span className="text-muted-foreground">Показаны значения для текущего состояния:</span>
        <Badge variant="secondary">тема: {theme === 'dark' ? 'тёмная' : 'светлая'}</Badge>
        <Badge variant="secondary">акцент: {accent}</Badge>
        <span className="text-muted-foreground text-xs">
          Переключатели — в шапке. Значения пересчитываются на лету.
        </span>
      </div>

      <Section
        title="Палитра"
        description="Токены применяются парами «фон + текст на нём». Никогда не берите цвет текста из другой пары — контраст гарантирован только внутри пары. Клик по карточке копирует имя токена."
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PALETTE.map((p) => (
            <Swatch key={p.bg} pair={p} value={v[p.bg]} fgValue={p.fg ? v[p.fg] : undefined} onCopy={copy} copied={copied} />
          ))}
        </div>
      </Section>

      <Section title="Линии и фокус" description="Рамки и кольцо фокуса.">
        <div className="grid gap-3 sm:grid-cols-3">
          {LINES.map((l) => (
            <div key={l.name} className="rounded-lg border p-3">
              <div
                className="mb-3 h-10 rounded-md"
                style={
                  l.name === '--ring'
                    ? { boxShadow: '0 0 0 3px color-mix(in oklch, var(--ring) 50%, transparent)', background: 'var(--background)' }
                    : { border: `1px solid var(${l.name})`, background: 'var(--background)' }
                }
              />
              <code className="font-mono text-xs font-medium">{l.name}</code>
              <code className="text-muted-foreground mt-0.5 block font-mono text-[11px] break-all">{v[l.name] || '—'}</code>
              <p className="text-muted-foreground mt-1 text-xs">{l.note}</p>
              <code className="bg-muted text-muted-foreground mt-1.5 inline-block rounded px-1.5 py-0.5 font-mono text-[11px]">
                {l.cls}
              </code>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Смысловые цвета"
        description="Не входят в базовый shadcn — добавлены китом. У каждого есть мягкая пара -soft / -soft-fg для подложек статусов."
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {SEMANTIC.map((name) => (
            <div key={name} className="overflow-hidden rounded-lg border">
              <div className="h-12" style={{ background: `var(${name})` }} />
              <div
                className="flex h-9 items-center px-3 text-xs font-medium"
                style={{ background: `var(${name}-soft)`, color: `var(${name}-soft-fg)` }}
              >
                {name}-soft
              </div>
              <div className="p-3">
                <code className="font-mono text-xs font-medium">{name}</code>
                <code className="text-muted-foreground mt-0.5 block font-mono text-[11px] break-all">{v[name] || '—'}</code>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Палитра графиков"
        description="Используется компонентом Chart через var(--chart-N). В тёмной теме набор свой — переключите тему и сравните."
      >
        <div className="flex flex-wrap gap-3">
          {CHARTS.map((name) => (
            <div key={name} className="w-32 overflow-hidden rounded-lg border">
              <div className="h-14" style={{ background: `var(${name})` }} />
              <div className="p-2">
                <code className="font-mono text-[11px] font-medium">{name}</code>
                <code className="text-muted-foreground mt-0.5 block font-mono text-[10px] break-all">{v[name] || '—'}</code>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Separator />

      <Section
        title="Радиусы"
        description={`Все выведены из одного --radius (${v['--radius'] || '…'}). Меняете его — меняется вся библиотека.`}
      >
        <div className="flex flex-wrap gap-4">
          {RADII.map((r) => (
            <div key={r.name} className="text-center">
              <div className={`bg-muted size-20 border ${r.cls}`} />
              <code className="mt-2 block font-mono text-xs font-medium">{r.cls}</code>
              <code className="text-muted-foreground block font-mono text-[11px]">{v[r.name] || r.note}</code>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Высоты контролов"
        description="Кнопки, поля и селекты выравниваются по одной шкале. Плотность (переключатель в шапке) уменьшает все три."
      >
        <div className="flex flex-wrap items-end gap-4">
          {HEIGHTS.map((h) => (
            <div key={h.name} className="text-center">
              <div
                className="bg-secondary text-secondary-foreground flex w-40 items-center justify-center rounded-md border text-sm"
                style={{ height: `var(${h.name})` }}
              >
                {v[h.name] || '—'}
              </div>
              <code className="mt-2 block font-mono text-xs font-medium">{h.name}</code>
              <p className="text-muted-foreground text-xs">{h.note}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Отступы" description="Шаг 4px. В Tailwind это p-1 … p-10 — токены нужны только компонентам на своём CSS.">
        <div className="space-y-1.5">
          {SPACING.map((name) => (
            <div key={name} className="flex items-center gap-3">
              <code className="text-muted-foreground w-16 shrink-0 font-mono text-xs">{name}</code>
              <div className="bg-primary h-3 rounded-sm" style={{ width: `var(${name})` }} />
              <code className="text-muted-foreground font-mono text-[11px]">{v[name] || '—'}</code>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Тени" description="Сдержанные, как в shadcn: подсказывают слой, а не рисуют объём.">
        <div className="grid gap-4 sm:grid-cols-3">
          {SHADOWS.map((s) => (
            <div key={s.name} className="text-center">
              <div className="bg-card h-20 rounded-lg border" style={{ boxShadow: `var(${s.name})` }} />
              <code className="mt-3 block font-mono text-xs font-medium">{s.name}</code>
              <p className="text-muted-foreground text-xs">{s.note}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Типографика"
        description="Шрифт — свапаемый токен --font, 11 вариантов в шапке. Все покрывают кириллицу."
      >
        <div className="divide-y rounded-lg border">
          {TYPE_SCALE.map((t) => (
            <div key={t.size} className="flex items-baseline gap-4 px-4 py-3">
              <code className="text-muted-foreground w-10 shrink-0 font-mono text-[11px]">{t.size}</code>
              <span className="min-w-0 flex-1 truncate" style={{ fontSize: t.size, fontWeight: t.weight }}>
                Система под ваш бизнес
              </span>
              <span className="text-muted-foreground hidden shrink-0 text-xs sm:block">{t.note}</span>
            </div>
          ))}
          <div className="flex items-baseline gap-4 px-4 py-3">
            <code className="text-muted-foreground w-10 shrink-0 font-mono text-[11px]">mono</code>
            <span className="flex-1 font-mono text-sm">const dealId = "CP-2481"</span>
            <span className="text-muted-foreground hidden shrink-0 text-xs sm:block">--font-mono · font-mono</span>
          </div>
        </div>
      </Section>

      <Section title="Слои и движение" description="z-index и длительности переходов.">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-lg border">
            <div className="border-b px-4 py-2 text-sm font-medium">Слои</div>
            <div className="divide-y">
              {Z_LAYERS.map((z) => (
                <div key={z.name} className="flex items-center gap-3 px-4 py-2 text-xs">
                  <code className="font-mono font-medium">{z.name}</code>
                  <code className="text-muted-foreground ml-auto font-mono">{v[z.name] || '—'}</code>
                  <span className="text-muted-foreground hidden w-32 shrink-0 text-right sm:block">{z.note}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-lg border">
            <div className="border-b px-4 py-2 text-sm font-medium">Движение</div>
            <div className="divide-y">
              {MOTION.map((m) => (
                <div key={m.name} className="flex items-center gap-3 px-4 py-2 text-xs">
                  <code className="font-mono font-medium">{m.name}</code>
                  <code className="text-muted-foreground ml-auto font-mono">{v[m.name] || '—'}</code>
                  <span className="text-muted-foreground hidden w-32 shrink-0 text-right sm:block">{m.note}</span>
                </div>
              ))}
              <div className="flex items-center gap-3 px-4 py-2 text-xs">
                <code className="font-mono font-medium">--ease</code>
                <code className="text-muted-foreground ml-auto font-mono break-all">{v['--ease'] || '—'}</code>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Separator />

      <Collapsible>
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            Исторические имена кита ({ALIASES.length})
            <ChevronDown className="transition-transform data-[state=open]:rotate-180" />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4">
          <p className="text-muted-foreground mb-3 text-sm">
            Эти переменные — псевдонимы, оставленные ради компонентов CRM-надстройки, которые ещё не переведены
            на Tailwind. <strong className="text-foreground">В новом коде их использовать не нужно</strong> — берите
            токены shadcn из правой колонки или Tailwind-классы (<code className="font-mono text-xs">bg-muted</code>,
            {' '}<code className="font-mono text-xs">text-muted-foreground</code>).
          </p>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Историческое имя</TableHead>
                  <TableHead>Указывает на</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ALIASES.map(([from, to]) => (
                  <TableRow key={from}>
                    <TableCell><code className="text-muted-foreground font-mono text-xs">{from}</code></TableCell>
                    <TableCell><code className="font-mono text-xs font-medium">{to}</code></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
