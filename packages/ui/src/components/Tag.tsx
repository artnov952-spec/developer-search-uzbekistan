import { forwardRef } from 'react'
import { X } from 'lucide-react'
import { Badge } from './ui/badge'
import { cn } from '../lib/utils'

export type TagColor =
  | 'neutral'
  | 'accent'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'

/** Мягкие подложки смысловых цветов. Токены -soft/-soft-fg заданы в tokens.css
 *  и уже учитывают тему, поэтому отдельного тёмного варианта не нужно. */
const COLORS: Record<TagColor, string> = {
  neutral: 'bg-muted text-muted-foreground',
  accent: 'bg-primary/10 text-primary',
  success: 'bg-(--success-soft) text-(--success-soft-fg)',
  warning: 'bg-(--warning-soft) text-(--warning-soft-fg)',
  danger: 'bg-(--danger-soft) text-(--danger-soft-fg)',
  info: 'bg-(--info-soft) text-(--info-soft-fg)',
}

/** Цветная метка записи. Для статусов без удаления берите `Badge` из shadcn. */
export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Текст метки. */
  children?: React.ReactNode
  /** Показывает крестик. Без обработчика крестика нет. */
  onRemove?: () => void
  /** Цвет метки. */
  color?: TagColor
}

export const Tag = forwardRef<HTMLSpanElement, TagProps>(function Tag(
  { children, onRemove, color = 'neutral', className, ...rest },
  ref,
) {
  return (
    <Badge
      ref={ref}
      variant="secondary"
      className={cn('border-transparent', COLORS[color], onRemove && 'pr-1', className)}
      {...rest}
    >
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label="Удалить"
          className="focus-visible:ring-ring/50 -mr-0.5 ml-0.5 grid size-4 shrink-0 place-items-center rounded-sm opacity-60 transition-opacity hover:opacity-100 focus-visible:ring-[3px] focus-visible:outline-none"
        >
          <X className="size-3" aria-hidden />
        </button>
      )}
    </Badge>
  )
})
