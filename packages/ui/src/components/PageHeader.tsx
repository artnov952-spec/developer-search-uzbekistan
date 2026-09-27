import { cn } from '../lib/utils'

/** Шапка страницы: заголовок, статусы и действия в одной строке. */
export interface PageHeaderProps {
  /** Слева от заголовка: кнопка «назад», аватар, иконка. */
  leading?: React.ReactNode
  /** Заголовок страницы. */
  title: React.ReactNode
  /** Пояснение под заголовком. */
  subtitle?: React.ReactNode
  /** Статусы рядом с заголовком. */
  badges?: React.ReactNode
  /** Кнопки действий справа. */
  children?: React.ReactNode
  /** Дополнительные CSS-классы корневого элемента. */
  className?: string
}

export function PageHeader({ leading, title, subtitle, badges, children, className }: PageHeaderProps) {
  return (
    <header className={cn('flex flex-wrap items-start gap-x-4 gap-y-3', className)}>
      {leading && <div className="flex shrink-0 items-center pt-0.5">{leading}</div>}

      <div className="min-w-0 flex-1">
        <h1 className="truncate text-2xl font-semibold tracking-tight">{title}</h1>
        {(subtitle || badges) && (
          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            {badges}
            {subtitle && <span className="text-muted-foreground text-sm">{subtitle}</span>}
          </div>
        )}
      </div>

      {children && <div className="flex shrink-0 flex-wrap items-center gap-2">{children}</div>}
    </header>
  )
}
