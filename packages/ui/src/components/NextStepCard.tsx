import { Card, CardContent, CardFooter } from './ui/card'
import { cn } from '../lib/utils'

/** Карточка следующего шага по сделке: что и когда сделать. */
export interface NextStepCardProps {
  /** Заголовок шага. */
  title: React.ReactNode
  /** Иконка слева от заголовка. */
  icon?: React.ReactNode
  /** Пары «подпись — значение»: срок, ответственный, канал. */
  rows: { label: string; value: React.ReactNode }[]
  /** Кнопка действия в подвале. */
  action?: React.ReactNode
  /** Дополнительные CSS-классы корневого элемента. */
  className?: string
}

export function NextStepCard({ title, icon, rows, action, className }: NextStepCardProps) {
  return (
    <Card className={cn('gap-0 py-4', className)}>
      <CardContent className="px-4">
        <div className="flex items-center gap-2 text-sm font-medium">
          {icon && <span className="text-muted-foreground shrink-0" aria-hidden>{icon}</span>}
          {title}
        </div>

        <dl className="mt-3 space-y-1.5">
          {rows.map((r) => (
            <div key={r.label} className="flex items-baseline justify-between gap-3 text-sm">
              <dt className="text-muted-foreground shrink-0">{r.label}</dt>
              <dd className="min-w-0 truncate text-right font-medium">{r.value}</dd>
            </div>
          ))}
        </dl>
      </CardContent>

      {action && <CardFooter className="mt-3 px-4 [.border-t]:pt-3">{action}</CardFooter>}
    </Card>
  )
}
