import { useMemo, useState } from 'react'
import { Check, Clock } from 'lucide-react'
import { Button } from './ui/button'
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from './ui/command'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { cn } from '../lib/utils'

function buildTimes(step: number): string[] {
  const out: string[] = []
  for (let m = 0; m < 24 * 60; m += step) {
    out.push(`${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`)
  }
  return out
}

/** Выбор времени из списка с заданным шагом. Поиск в поле позволяет
 *  набрать «14» и сразу перейти к нужному часу. */
export interface TimePickerProps {
  /** Время в формате `ЧЧ:ММ`. */
  value?: string
  /** Выбор времени. */
  onChange: (value: string) => void
  /** Шаг между вариантами в минутах. */
  step?: number
  /** Заблокировать поле. */
  disabled?: boolean
  /** Подсказка в пустом поле. */
  placeholder?: string
}

export function TimePicker({ value, onChange, step = 30, disabled, placeholder = 'чч:мм' }: TimePickerProps) {
  const [open, setOpen] = useState(false)
  const times = useMemo(() => buildTimes(step), [step])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" disabled={disabled} className="w-full justify-start gap-2 font-normal">
          <Clock className="text-muted-foreground shrink-0" />
          <span className={cn('tabular-nums', !value && 'text-muted-foreground')}>{value || placeholder}</span>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-(--radix-popover-trigger-width) p-0" align="start">
        <Command>
          <CommandInput placeholder="Например, 14:30" />
          <CommandList>
            <CommandEmpty>Не найдено.</CommandEmpty>
            {times.map((t) => (
              <CommandItem
                key={t}
                value={t}
                onSelect={() => {
                  onChange(t)
                  setOpen(false)
                }}
              >
                <Check className={cn('shrink-0', t === value ? 'opacity-100' : 'opacity-0')} />
                <span className="tabular-nums">{t}</span>
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
