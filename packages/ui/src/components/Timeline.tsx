import { cn } from '../lib/utils'

/** Лента событий по записи — оболочка для `TimelineItem`. */
export interface TimelineProps {
  /** События `TimelineItem`. */
  children: React.ReactNode
  /** Дополнительные CSS-классы корневого элемента. */
  className?: string
}

export function Timeline({ children, className }: TimelineProps) {
  return <div className={cn('relative', className)}>{children}</div>
}

export type TimelineVariant = 'accent' | 'success' | 'warning' | 'danger' | 'neutral'

const DOT: Record<TimelineVariant, string> = {
  neutral: 'bg-muted text-muted-foreground border-border',
  accent: 'bg-primary text-primary-foreground border-transparent',
  success: 'bg-(--success) text-white border-transparent',
  warning: 'bg-(--warning) text-white border-transparent',
  danger: 'bg-(--danger) text-white border-transparent',
}

/** Событие в ленте. */
export interface TimelineItemProps {
  /** Смысловой цвет точки на линии. */
  variant?: TimelineVariant
  /** Когда произошло. */
  time?: React.ReactNode
  /** Иконка вместо точки. */
  icon?: React.ReactNode
  /** Заголовок события. */
  title?: React.ReactNode
  /** Подробности под заголовком. */
  children?: React.ReactNode
}

export function TimelineItem({ variant = 'neutral', time, icon, title, children }: TimelineItemProps) {
  return (
    // Соединительная линия — псевдоэлемент от точки вниз; у последнего элемента
    // группы её скрывает last:before:hidden, поэтому хвост не торчит.
    <div className="group relative flex gap-3 pb-5 last:pb-0">
      <div className="relative flex flex-col items-center">
        <span
          className={cn(
            'z-10 grid size-6 shrink-0 place-items-center rounded-full border text-[11px] font-medium [&_svg]:size-3',
            DOT[variant],
          )}
        >
          {icon}
        </span>
        <span className="bg-border absolute top-6 bottom-0 w-px group-last:hidden" aria-hidden />
      </div>

      <div className="min-w-0 flex-1 pb-0.5">
        {title && <div className="text-sm font-medium">{title}</div>}
        {children && <div className="text-muted-foreground mt-0.5 text-sm">{children}</div>}
        {time && <div className="text-muted-foreground mt-1 text-xs">{time}</div>}
      </div>
    </div>
  )
}
