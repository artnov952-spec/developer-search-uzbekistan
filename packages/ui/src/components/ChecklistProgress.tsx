import { Check, Circle } from 'lucide-react'
import { Progress } from './ui/progress'
import { cn } from '../lib/utils'

/** Пункт чеклиста. */
export interface ChecklistItem {
  /** Название пункта. */
  label: string
  /** Выполнен — учитывается в проценте заполнения. */
  done: boolean
}

/** Прогресс заполнения карточки: процент плюс список незакрытых пунктов. */
export interface ChecklistProgressProps {
  /** Пункты. Процент считается как доля `done`. */
  items: ChecklistItem[]
  /** Заголовок над полосой прогресса. */
  title?: string
  /** Клик по пункту — обычно скроллит к соответствующему полю. Индекс — позиция в `items`. */
  onJump?: (index: number) => void
  /** Дополнительные CSS-классы корневого элемента. */
  className?: string
}

export function ChecklistProgress({ items, title = 'Заполнено', onJump, className }: ChecklistProgressProps) {
  const done = items.filter((i) => i.done).length
  const pct = items.length ? Math.round((done / items.length) * 100) : 0

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-baseline justify-between text-sm">
        <span className="text-muted-foreground">
          {title} {done} из {items.length}
        </span>
        <span className="font-medium tabular-nums">{pct}%</span>
      </div>

      <Progress value={pct} />

      <div className="space-y-0.5">
        {items.map((it, i) => (
          <button
            key={it.label}
            type="button"
            onClick={() => !it.done && onJump?.(i)}
            disabled={it.done || onJump == null}
            className={cn(
              'flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors',
              it.done
                ? 'text-muted-foreground'
                : onJump && 'hover:bg-accent focus-visible:ring-ring/50 cursor-pointer focus-visible:ring-[3px] focus-visible:outline-none',
            )}
          >
            {it.done ? (
              <Check className="size-3.5 shrink-0 text-(--success)" />
            ) : (
              <Circle className="text-muted-foreground/50 size-3.5 shrink-0" />
            )}
            <span className={cn('truncate', it.done && 'line-through')}>{it.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
