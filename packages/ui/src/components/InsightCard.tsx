import { Sparkles } from 'lucide-react'
import { Card, CardContent } from './ui/card'
import { cn } from '../lib/utils'

/** Карточка подсказки или наблюдения — обычно результат работы AI. */
export interface InsightCardProps {
  /** Заголовок карточки. */
  title: React.ReactNode
  /** Тело подсказки. */
  children: React.ReactNode
  /** Кнопки в подвале: «применить», «скрыть». */
  actions?: React.ReactNode
  /** Иконка слева от заголовка. */
  icon?: React.ReactNode
  /** Дополнительные CSS-классы корневого элемента. */
  className?: string
}

export function InsightCard({ title, children, actions, icon, className }: InsightCardProps) {
  return (
    <Card className={cn('bg-primary/[0.03] border-primary/15 gap-0 py-4', className)}>
      <CardContent className="flex gap-3 px-4">
        <span className="bg-primary/10 text-primary grid size-8 shrink-0 place-items-center rounded-md" aria-hidden>
          {icon ?? <Sparkles className="size-4" />}
        </span>

        <div className="min-w-0 flex-1">
          <div className="text-sm font-medium">{title}</div>
          <div className="text-muted-foreground mt-1 text-sm">{children}</div>
          {actions && <div className="mt-3 flex flex-wrap items-center gap-2">{actions}</div>}
        </div>
      </CardContent>
    </Card>
  )
}
