import { useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { Button } from './ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/command'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { cn } from '../lib/utils'

/** Вариант в `Combobox`. */
export interface ComboboxOption {
  /** Значение, которое уходит в `onValueChange`. */
  value: string
  /** Текст, видимый пользователю; по нему же идёт поиск. */
  label: string
}

/** Выпадающий список с поиском. В отличие от `Select`, ищет по подстроке.
 *  Штатный рецепт shadcn: Popover + Command. Фильтрация, подсветка активного
 *  пункта и клавиатура приходят от cmdk — руками они больше не реализуются. */
export interface ComboboxProps {
  /** Варианты выбора. */
  options: ComboboxOption[]
  /** Выбранное значение. */
  value?: string
  /** Выбор варианта. */
  onValueChange?: (value: string) => void
  /** Текст в кнопке, пока ничего не выбрано. */
  placeholder?: string
  /** Заблокировать поле. */
  disabled?: boolean
}

export function Combobox({
  options,
  value,
  onValueChange,
  placeholder = 'Выберите…',
  disabled,
}: ComboboxProps) {
  const [open, setOpen] = useState(false)
  const selected = options.find((o) => o.value === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className="w-full justify-between font-normal"
        >
          <span className={cn('truncate', !selected && 'text-muted-foreground')}>
            {selected ? selected.label : placeholder}
          </span>
          <ChevronsUpDown className="text-muted-foreground shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-(--radix-popover-trigger-width) p-0" align="start">
        <Command>
          <CommandInput placeholder="Поиск…" />
          <CommandList>
            <CommandEmpty>Ничего не найдено.</CommandEmpty>
            <CommandGroup>
              {options.map((o) => (
                <CommandItem
                  key={o.value}
                  // cmdk ищет по value, поэтому кладём сюда подпись, а не код.
                  value={o.label}
                  onSelect={() => {
                    onValueChange?.(o.value)
                    setOpen(false)
                  }}
                >
                  <Check className={cn('shrink-0', o.value === value ? 'opacity-100' : 'opacity-0')} />
                  {o.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
