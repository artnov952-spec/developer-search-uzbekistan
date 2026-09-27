import { cn } from '../lib/utils'

export type StatVariant = 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info'

const DOT: Record<StatVariant, string> = {
  neutral: 'bg-muted-foreground',
  accent: 'bg-primary',
  success: 'bg-(--success)',
  warning: 'bg-(--warning)',
  danger: 'bg-(--danger)',
  info: 'bg-(--info)',
}

/** Фишка показателя в `StatChips`. */
export interface StatChip {
  /** Идентификатор фишки. */
  key: string
  /** Название показателя. */
  label: string
  /** Значение — показывается крупным над названием. */
  count: number | string
  /** Смысловой цвет точки рядом со значением. */
  variant?: StatVariant
}

/** Ряд компактных показателей, работающий и как фильтр списка. */
export interface StatChipsProps {
  /** Фишки слева направо. */
  items: StatChip[]
  /** Ключ активной фишки. */
  value?: string
  /** Клик по фишке. Без обработчика фишки некликабельны. */
  onChange?: (key: string) => void
  /** Дополнительные CSS-классы корневого элемента. */
  className?: string
}

export function StatChips({ items, value, onChange, className }: StatChipsProps) {
  const interactive = onChange != null

  return (
    <div className={cn('flex flex-wrap gap-2', className)} role={interactive ? 'tablist' : undefined}>
      {items.map((it) => {
        const on = value === it.key
        return (
          <button
            key={it.key}
            type="button"
            role={interactive ? 'tab' : undefined}
            aria-selected={interactive ? on : undefined}
            disabled={!interactive}
            onClick={() => onChange?.(it.key)}
            className={cn(
              'rounded-lg border px-3 py-2 text-left transition-colors',
              on ? 'border-foreground/25 bg-accent' : 'bg-background',
              interactive && !on && 'hover:bg-accent/60 focus-visible:ring-ring/50 cursor-pointer focus-visible:ring-[3px] focus-visible:outline-none',
            )}
          >
            <span className="flex items-center gap-1.5 text-lg leading-none font-semibold tabular-nums">
              {it.variant && it.variant !== 'neutral' && (
                <i className={cn('size-1.5 rounded-full', DOT[it.variant])} aria-hidden />
              )}
              {it.count}
            </span>
            <span className="text-muted-foreground mt-1 block text-xs whitespace-nowrap">{it.label}</span>
          </button>
        )
      })}
    </div>
  )
}
