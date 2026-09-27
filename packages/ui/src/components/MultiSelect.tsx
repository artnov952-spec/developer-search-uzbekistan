import { useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Checkbox } from './ui/checkbox'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/command'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { cn } from '../lib/utils'

/** Вариант в `MultiSelect`. */
export interface MultiSelectOption {
  /** Значение, попадающее в массив. */
  value: string
  /** Текст, видимый пользователю; по нему же идёт поиск. */
  label: string
}

/** Выбор нескольких значений с поиском. Собран из Popover + Command, как
 *  рекомендует shadcn: фильтрация и клавиатура приходят от cmdk. */
export interface MultiSelectProps {
  /** Варианты выбора. */
  options: MultiSelectOption[]
  /** Выбранные значения. */
  value: string[]
  /** Новый набор выбранных значений. */
  onValueChange: (value: string[]) => void
  /** Текст в кнопке, пока ничего не выбрано. */
  placeholder?: string
  /** Подсказка в поле поиска. */
  searchPlaceholder?: string
  /** Заблокировать поле. */
  disabled?: boolean
}

export function MultiSelect({
  options,
  value,
  onValueChange,
  placeholder = 'Выберите…',
  searchPlaceholder = 'Поиск…',
  disabled = false,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false)
  const selected = options.filter((o) => value.includes(o.value))

  const toggle = (v: string) => {
    if (value.includes(v)) onValueChange(value.filter((x) => x !== v))
    else onValueChange([...value, v])
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className="h-auto min-h-9 w-full justify-between py-1.5 font-normal"
        >
          {selected.length === 0 ? (
            <span className="text-muted-foreground">{placeholder}</span>
          ) : (
            // До трёх — фишками, дальше счётчиком: иначе кнопка расползается.
            <span className="flex min-w-0 flex-wrap items-center gap-1">
              {selected.length <= 3 ? (
                selected.map((o) => (
                  <Badge key={o.value} variant="secondary" className="font-normal">{o.label}</Badge>
                ))
              ) : (
                <Badge variant="secondary" className="font-normal">Выбрано: {selected.length}</Badge>
              )}
            </span>
          )}
          <ChevronDown className="text-muted-foreground shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-(--radix-popover-trigger-width) p-0" align="start">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>Ничего не найдено.</CommandEmpty>
            <CommandGroup>
              {options.map((o) => {
                const checked = value.includes(o.value)
                return (
                  <CommandItem
                    key={o.value}
                    value={o.label}
                    // Список не закрывается: выбирают обычно несколько подряд.
                    onSelect={() => toggle(o.value)}
                  >
                    <Checkbox checked={checked} className="pointer-events-none shrink-0" tabIndex={-1} />
                    <span className={cn('flex-1', checked && 'font-medium')}>{o.label}</span>
                    {checked && <Check className="text-muted-foreground size-3.5 shrink-0" />}
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
