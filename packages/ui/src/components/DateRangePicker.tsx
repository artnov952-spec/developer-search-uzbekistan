import { useState } from 'react'
import { CalendarIcon } from 'lucide-react'
import type { DateRange as DayPickerRange } from 'react-day-picker'
import { Button } from './ui/button'
import { Calendar } from './ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { cn } from '../lib/utils'

const fmt = new Intl.DateTimeFormat('ru-RU', { day: '2-digit', month: 'short', year: 'numeric' })

/** Диапазон дат. Пока выбрана только первая граница, `end` пустой. */
export interface DateRange {
  /** Начало периода. */
  start: Date | null
  /** Конец периода. */
  end: Date | null
}

/** Поле выбора периода: два месяца в поповере, подсветка диапазона при наведении.
 *  Внутри — shadcn Calendar в режиме range; react-day-picker оперирует парой
 *  `{ from, to }`, поэтому на границе она переводится в `{ start, end }` кита. */
export interface DateRangePickerProps {
  /** Выбранный период. */
  value?: DateRange
  /** Изменение периода. Срабатывает и после выбора первой границы. */
  onChange?: (value: DateRange) => void
  /** Текст, пока период не выбран. */
  placeholder?: string
  /** Заблокировать поле. */
  disabled?: boolean
}

function label(value: DateRange | undefined, placeholder: string) {
  if (!value?.start) return placeholder
  if (!value.end) return `${fmt.format(value.start)} — …`
  return `${fmt.format(value.start)} — ${fmt.format(value.end)}`
}

export function DateRangePicker({ value, onChange, placeholder = 'Период', disabled }: DateRangePickerProps) {
  const [open, setOpen] = useState(false)

  const selected: DayPickerRange | undefined = value?.start
    ? { from: value.start, to: value.end ?? undefined }
    : undefined

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" disabled={disabled} className="w-full justify-start gap-2 font-normal">
          <CalendarIcon className="text-muted-foreground shrink-0" />
          <span className={cn('truncate', !value?.start && 'text-muted-foreground')}>
            {label(value, placeholder)}
          </span>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          numberOfMonths={2}
          selected={selected}
          defaultMonth={value?.start ?? undefined}
          onSelect={(r?: DayPickerRange) => {
            const next: DateRange = { start: r?.from ?? null, end: r?.to ?? null }
            onChange?.(next)
            // Закрываем только когда период выбран целиком.
            if (next.start && next.end) setOpen(false)
          }}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  )
}
