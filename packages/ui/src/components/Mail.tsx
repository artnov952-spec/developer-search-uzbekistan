import { Paperclip, Star } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { cn } from '../lib/utils'
import { initials } from '../utils'

/** Список писем — оболочка для `MailRow`. */
export interface MailListProps {
  /** Строки `MailRow`. */
  children: React.ReactNode
  /** Дополнительные CSS-классы корневого элемента. */
  className?: string
}

export function MailList({ children, className }: MailListProps) {
  return <div className={cn('divide-y rounded-lg border', className)} role="list">{children}</div>
}

/** Строка письма в списке. */
export interface MailRowProps {
  /** Отправитель. */
  from: string
  /** Тема письма. */
  subject: string
  /** Начало текста письма — показывается после темы серым. */
  preview?: string
  /** Время или дата строкой. */
  time?: string
  /** Непрочитанное — выделяется жирным. */
  unread?: boolean
  /** Отмечено звездой. */
  starred?: boolean
  /** Показать скрепку. */
  hasAttachment?: boolean
  /** URL аватара отправителя. */
  avatarSrc?: string
  /** Открыть письмо. */
  onClick?: () => void
  /** Переключение звезды. Клик не всплывает в `onClick`. */
  onStar?: () => void
}

export function MailRow({
  from, subject, preview, time, unread, starred, hasAttachment, avatarSrc, onClick, onStar,
}: MailRowProps) {
  return (
    <div
      role="listitem"
      onClick={onClick}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault()
          onClick()
        }
      }}
      className={cn(
        'flex items-start gap-2.5 px-3 py-2.5 transition-colors first:rounded-t-lg last:rounded-b-lg',
        unread && 'bg-accent/40',
        onClick && 'hover:bg-accent focus-visible:ring-ring/50 cursor-pointer focus-visible:ring-[3px] focus-visible:outline-none',
      )}
    >
      <button
        type="button"
        aria-label={starred ? 'Убрать из избранного' : 'В избранное'}
        onClick={(e) => {
          e.stopPropagation()
          onStar?.()
        }}
        className={cn(
          'focus-visible:ring-ring/50 mt-0.5 shrink-0 rounded-sm p-0.5 transition-colors focus-visible:ring-[3px] focus-visible:outline-none',
          starred ? 'text-(--warning)' : 'text-muted-foreground/40 hover:text-muted-foreground',
        )}
      >
        <Star className="size-4" fill={starred ? 'currentColor' : 'none'} />
      </button>

      <Avatar className="mt-0.5 size-7 shrink-0">
        {avatarSrc && <AvatarImage src={avatarSrc} alt="" />}
        <AvatarFallback className="text-[10px]">{initials(from)}</AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className={cn('min-w-0 flex-1 truncate text-sm', unread && 'font-semibold')}>{from}</span>
          {hasAttachment && <Paperclip className="text-muted-foreground size-3.5 shrink-0" aria-label="Есть вложение" />}
          {time && <span className="text-muted-foreground shrink-0 text-xs">{time}</span>}
        </div>
        <div className={cn('truncate text-sm', unread ? 'font-medium' : 'text-foreground/90')}>{subject}</div>
        {preview && <div className="text-muted-foreground truncate text-sm">{preview}</div>}
      </div>
    </div>
  )
}
