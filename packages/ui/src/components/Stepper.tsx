import { Check } from 'lucide-react'
import { cn } from '../lib/utils'

/** Шаг в `Stepper`. */
export interface Step {
  /** Название шага. */
  label: string
  /** Пояснение под названием. */
  description?: string
}

/** Индикатор прогресса по шагам мастера. */
export interface StepperProps {
  /** Шаги по порядку. */
  steps: Step[]
  /** Индекс текущего шага, с нуля. Предыдущие помечаются выполненными. */
  current: number
  /** Клик по шагу. Без обработчика шаги некликабельны. */
  onStepClick?: (index: number) => void
  /** Дополнительные CSS-классы корневого элемента. */
  className?: string
}

export function Stepper({ steps, current, onStepClick, className }: StepperProps) {
  return (
    <ol className={cn('flex w-full items-start', className)}>
      {steps.map((s, i) => {
        const done = i < current
        const active = i === current

        return (
          <li key={s.label} className="flex min-w-0 flex-1 items-start last:flex-none">
            <div className="flex min-w-0 flex-col items-center gap-1.5 text-center">
              <button
                type="button"
                onClick={onStepClick ? () => onStepClick(i) : undefined}
                disabled={!onStepClick}
                aria-current={active ? 'step' : undefined}
                className={cn(
                  'focus-visible:ring-ring/50 grid size-7 shrink-0 place-items-center rounded-full border text-xs font-medium transition-colors focus-visible:ring-[3px] focus-visible:outline-none',
                  done && 'bg-primary text-primary-foreground border-transparent',
                  active && 'border-primary text-foreground ring-primary/20 ring-2',
                  !done && !active && 'bg-background text-muted-foreground',
                  onStepClick && 'cursor-pointer',
                )}
              >
                {done ? <Check className="size-3.5" /> : i + 1}
              </button>

              <div className="min-w-0 px-1">
                <div className={cn('truncate text-sm', active ? 'text-foreground font-medium' : 'text-muted-foreground')}>
                  {s.label}
                </div>
                {s.description && (
                  <div className="text-muted-foreground truncate text-xs">{s.description}</div>
                )}
              </div>
            </div>

            {/* Соединитель тянется в оставшуюся ширину; у последнего шага его нет. */}
            {i < steps.length - 1 && (
              <span className={cn('mt-3.5 h-px min-w-6 flex-1', done ? 'bg-primary' : 'bg-border')} aria-hidden />
            )}
          </li>
        )
      })}
    </ol>
  )
}
