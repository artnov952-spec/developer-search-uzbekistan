import { useState } from 'react'
import { CalendarIcon } from 'lucide-react'
import { Button } from './ui/button'
import { Calendar } from './ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { cn } from '../lib/utils'

const fmt = new Intl.DateTimeFormat('ru-RU', { day: '2-digit', month: 'long', year: 'numeric' })

/** Поле выбора даты: кнопка с датой плюс shadcn Calendar в поповере. */
export interface DatePickerProps {
  /** Выбранная дата. `null` — не выбрана. */
  value?: Date | null
  /** Выбор даты или её очистка. */
  onChange?: (date: Date | null) => void
  /** Текст, пока дата не выбрана. */
  placeholder?: string
  /** Заблокировать поле. */
  disabled?: boolean
}

export function DatePicker({ value, onChange, placeholder = 'Выберите дату', disabled }: DatePickerProps) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" disabled={disabled} className="w-full justify-start gap-2 font-normal">
          <CalendarIcon className="text-muted-foreground shrink-0" />
          <span className={cn('truncate', !value && 'text-muted-foreground')}>
            {value ? fmt.format(value) : placeholder}
          </span>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value ?? undefined}
          defaultMonth={value ?? undefined}
          onSelect={(d?: Date) => {
            onChange?.(d ?? null)
            setOpen(false)
          }}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  )
}
