import { Bell, CheckCircle2, AlertTriangle, XCircle, Info } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { cn } from '../lib/utils'

export type NotificationVariant = 'info' | 'success' | 'warning' | 'danger'

const ICON: Record<NotificationVariant, React.ReactNode> = {
  info: <Info />,
  success: <CheckCircle2 />,
  warning: <AlertTriangle />,
  danger: <XCircle />,
}

const TONE: Record<NotificationVariant, string> = {
  info: 'bg-(--info-soft) text-(--info-soft-fg)',
  success: 'bg-(--success-soft) text-(--success-soft-fg)',
  warning: 'bg-(--warning-soft) text-(--warning-soft-fg)',
  danger: 'bg-(--danger-soft) text-(--danger-soft-fg)',
}

/** Список уведомлений — оболочка для `NotificationItem`. */
export interface NotificationListProps {
  /** Элементы `NotificationItem`. */
  children: React.ReactNode
  /** Дополнительные CSS-классы корневого элемента. */
  className?: string
}

export function NotificationList({ children, className }: NotificationListProps) {
  return <div className={cn('divide-y rounded-lg border', className)} role="list">{children}</div>
}

/** Уведомление в списке. */
export interface NotificationItemProps {
  /** Заголовок уведомления. */
  title: React.ReactNode
  /** Подробности под заголовком. */
  description?: React.ReactNode
  /** Когда пришло: «5 мин назад». */
  time?: React.ReactNode
  /** Непрочитанное — точка слева и выделенный фон. */
  unread?: boolean
  /** Смысловой цвет: информация, успех, предупреждение, ошибка. */
  variant?: NotificationVariant
  /** Аватар инициатора вместо иконки. */
  avatarSrc?: string
  /** Своя иконка. По умолчанию — по `variant`. */
  icon?: React.ReactNode
  /** Переход к объекту уведомления. */
  onClick?: () => void
}

export function NotificationItem({
  title, description, time, unread, variant = 'info', avatarSrc, icon, onClick,
}: NotificationItemProps) {
  const interactive = onClick != null

  return (
    <div
      role="listitem"
      onClick={onClick}
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
      className={cn(
        'flex items-start gap-3 px-3 py-3 transition-colors first:rounded-t-lg last:rounded-b-lg',
        unread && 'bg-accent/40',
        interactive && 'hover:bg-accent focus-visible:ring-ring/50 cursor-pointer focus-visible:ring-[3px] focus-visible:outline-none',
      )}
    >
      {avatarSrc ? (
        <Avatar className="size-8 shrink-0">
          <AvatarImage src={avatarSrc} alt="" />
          <AvatarFallback><Bell className="size-3.5" /></AvatarFallback>
        </Avatar>
      ) : (
        <span
          className={cn('grid size-8 shrink-0 place-items-center rounded-full [&_svg]:size-4', TONE[variant])}
          aria-hidden
        >
          {icon ?? ICON[variant]}
        </span>
      )}

      <div className="min-w-0 flex-1">
        <div className={cn('text-sm', unread ? 'font-medium' : 'font-normal')}>{title}</div>
        {description && <div className="text-muted-foreground mt-0.5 text-sm">{description}</div>}
        {time && <div className="text-muted-foreground mt-1 text-xs">{time}</div>}
      </div>

      {unread && (
        <span className="bg-primary mt-1.5 size-2 shrink-0 rounded-full" aria-label="Непрочитано" />
      )}
    </div>
  )
}
