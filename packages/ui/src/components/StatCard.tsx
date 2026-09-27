import type { ReactNode } from 'react'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { Card, CardContent } from './ui/card'
import { cn } from '../lib/utils'

/** Карточка показателя: значение, динамика и подпись. */
export interface StatCardProps {
  /** Название показателя. */
  label: string
  /** Значение — уже отформатированное. */
  value: string | number
  /** Изменение в процентах. Знак задаёт цвет и направление стрелки. */
  delta?: number
  /** Иконка в правом верхнем углу. */
  icon?: ReactNode
  /** Пояснение под значением: «за 30 дней». */
  hint?: string
  /** Делает карточку кликабельной. */
  onClick?: () => void
  /** Дополнительные CSS-классы корневого элемента. */
  className?: string
}

export function StatCard({ label, value, delta, icon, hint, onClick, className }: StatCardProps) {
  const interactive = onClick != null
  const hasDelta = delta != null
  const positive = hasDelta && delta >= 0

  return (
    <Card
      className={cn(
        'gap-0 py-4',
        interactive &&
          'hover:border-foreground/20 focus-visible:ring-ring/50 cursor-pointer transition-colors focus-visible:ring-[3px] focus-visible:outline-none',
        className,
      )}
      onClick={onClick}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      onKeyDown={
        interactive
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onClick()
              }
            }
          : undefined
      }
    >
      <CardContent className="px-4">
        <div className="flex items-start justify-between gap-2">
          <span className="text-muted-foreground text-sm">{label}</span>
          {icon != null && <span className="text-muted-foreground shrink-0" aria-hidden>{icon}</span>}
        </div>

        <div className="mt-1.5 text-2xl font-semibold tracking-tight tabular-nums">{value}</div>

        {(hasDelta || hint != null) && (
          <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs">
            {hasDelta && (
              <span
                className={cn(
                  'inline-flex items-center gap-0.5 font-medium tabular-nums',
                  positive ? 'text-(--success)' : 'text-(--danger)',
                )}
              >
                {positive
                  ? <ArrowUpRight className="size-3.5" aria-hidden />
                  : <ArrowDownRight className="size-3.5" aria-hidden />}
                {Math.abs(delta)}%
              </span>
            )}
            {hint != null && <span className="text-muted-foreground">{hint}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
