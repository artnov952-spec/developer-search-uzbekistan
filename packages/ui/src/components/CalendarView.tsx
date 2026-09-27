import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from './ui/button'
import { cn } from '../lib/utils'
import { addDays, addMonths, isSameDay, startOfDay } from '../lib/date'

export type CalendarEventVariant = 'accent' | 'success' | 'warning' | 'danger' | 'info'

const EVENT: Record<CalendarEventVariant, string> = {
  accent: 'bg-primary/10 text-primary',
  success: 'bg-(--success-soft) text-(--success-soft-fg)',
  warning: 'bg-(--warning-soft) text-(--warning-soft-fg)',
  danger: 'bg-(--danger-soft) text-(--danger-soft-fg)',
  info: 'bg-(--info-soft) text-(--info-soft-fg)',
}

/** Событие в `CalendarView`. */
export interface CalendarEvent {
  /** Уникальный идентификатор — приходит в `onEventClick`. */
  id: string
  /** День события. Время игнорируется. */
  date: Date
  /** Текст в ячейке дня. */
  title: string
  /** Цвет метки события. */
  variant?: CalendarEventVariant
}

/** Месячная сетка с событиями. Для выбора даты в поле используйте `DatePicker`. */
export interface CalendarViewProps {
  /** Месяц, открытый при первом рендере. Дальше месяц переключается внутри. */
  initialMonth: Date
  /** События всех месяцев — компонент сам отбирает нужные. */
  events: CalendarEvent[]
  /** Клик по пустому месту в ячейке дня. */
  onSelectDay?: (date: Date) => void
  /** Клик по конкретному событию. */
  onEventClick?: (id: string) => void
  /** Дополнительные CSS-классы корневого элемента. */
  className?: string
}

const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
const titleFmt = new Intl.DateTimeFormat('ru-RU', { month: 'long', year: 'numeric' })

/** Сдвиг до понедельника: в РФ неделя начинается с него, а getDay() — с воскресенья. */
function mondayOffset(d: Date): number {
  return (d.getDay() + 6) % 7
}

function cap(s: string): string {
  return s.length === 0 ? s : s[0].toUpperCase() + s.slice(1)
}

export function CalendarView({ initialMonth, events, onSelectDay, onEventClick, className }: CalendarViewProps) {
  const [view, setView] = useState<Date>(
    () => new Date(initialMonth.getFullYear(), initialMonth.getMonth(), 1),
  )

  const today = startOfDay(initialMonth)
  const first = new Date(view.getFullYear(), view.getMonth(), 1)
  const start = addDays(first, -mondayOffset(first))
  const viewMonth = view.getMonth()

  // Всегда 6 недель: высота сетки не скачет при смене месяца.
  const days: Date[] = []
  for (let i = 0; i < 42; i++) days.push(addDays(start, i))

  return (
    <div className={cn('overflow-hidden rounded-lg border', className)}>
      <div className="flex items-center justify-between gap-2 border-b px-3 py-2">
        <div className="text-sm font-medium">{cap(titleFmt.format(view))}</div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setView((v) => addMonths(v, -1))}
            aria-label="Предыдущий месяц"
          >
            <ChevronLeft />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setView((v) => addMonths(v, 1))}
            aria-label="Следующий месяц"
          >
            <ChevronRight />
          </Button>
        </div>
      </div>

      <div className="bg-muted/30 grid grid-cols-7 border-b">
        {WEEKDAYS.map((w) => (
          <span key={w} className="text-muted-foreground py-1.5 text-center text-xs font-medium">
            {w}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {days.map((day) => {
          const outside = day.getMonth() !== viewMonth
          const isToday = isSameDay(day, today)
          const dayEvents = events.filter((e) => isSameDay(e.date, day))
          const shown = dayEvents.slice(0, 3)
          const extra = dayEvents.length - shown.length

          return (
            <div
              key={day.getTime()}
              onClick={() => onSelectDay?.(startOfDay(day))}
              className={cn(
                'min-h-24 space-y-0.5 border-r border-b p-1 nth-[7n]:border-r-0',
                outside && 'bg-muted/20',
                onSelectDay && 'hover:bg-accent/40 cursor-pointer transition-colors',
              )}
            >
              <span
                className={cn(
                  'grid size-6 place-items-center rounded-full text-xs tabular-nums',
                  outside && 'text-muted-foreground/50',
                  isToday && 'bg-primary text-primary-foreground font-medium',
                )}
              >
                {day.getDate()}
              </span>

              {shown.map((e) => (
                <button
                  key={e.id}
                  type="button"
                  title={e.title}
                  onClick={(ev) => {
                    ev.stopPropagation()
                    onEventClick?.(e.id)
                  }}
                  className={cn(
                    'block w-full truncate rounded px-1 py-0.5 text-left text-[11px] transition-opacity hover:opacity-80',
                    EVENT[e.variant ?? 'accent'],
                  )}
                >
                  {e.title}
                </button>
              ))}

              {extra > 0 && (
                <span className="text-muted-foreground block px-1 text-[11px]">+{extra} ещё</span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
