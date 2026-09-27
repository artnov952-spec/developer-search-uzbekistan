import { Plus } from 'lucide-react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { cn } from '../lib/utils'

/** Сохранённое представление списка. */
export interface SavedView {
  /** Идентификатор представления. */
  key: string
  /** Название на вкладке. */
  label: string
  /** Количество записей — показывается рядом с названием. */
  count?: number
}

/** Вкладки сохранённых фильтров над списком: «Мои», «Просроченные». */
export interface SavedViewsProps {
  /** Представления слева направо. */
  views: SavedView[]
  /** Ключ активного представления. */
  value?: string
  /** Переключение представления. */
  onChange?: (key: string) => void
  /** Кнопка «+» в конце. Без обработчика кнопки нет. */
  onAdd?: () => void
  /** Дополнительные CSS-классы корневого элемента. */
  className?: string
}

export function SavedViews({ views, value, onChange, onAdd, className }: SavedViewsProps) {
  return (
    <div className={cn('flex items-center gap-1 overflow-x-auto border-b', className)} role="tablist">
      {views.map((v) => {
        const on = value === v.key
        return (
          <button
            key={v.key}
            type="button"
            role="tab"
            aria-selected={on}
            onClick={() => onChange?.(v.key)}
            className={cn(
              'focus-visible:ring-ring/50 -mb-px flex shrink-0 items-center gap-1.5 border-b-2 px-3 py-2 text-sm whitespace-nowrap transition-colors focus-visible:ring-[3px] focus-visible:outline-none',
              on
                ? 'border-primary text-foreground font-medium'
                : 'text-muted-foreground hover:text-foreground border-transparent',
            )}
          >
            {v.label}
            {v.count != null && (
              <Badge variant="secondary" className="px-1.5 py-0 text-[11px] tabular-nums">{v.count}</Badge>
            )}
          </button>
        )
      })}

      {onAdd && (
        <Button variant="ghost" size="icon-sm" className="ml-1 shrink-0" onClick={onAdd} aria-label="Новый вид">
          <Plus />
        </Button>
      )}
    </div>
  )
}
