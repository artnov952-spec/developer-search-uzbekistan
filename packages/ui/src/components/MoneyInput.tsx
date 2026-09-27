import { forwardRef } from 'react'
import { Input } from './ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'

/** Поле суммы: разряды расставляются на лету, валюта выбирается рядом. */
export interface MoneyInputProps {
  /** Текущее значение. Строка — уже отформатированная сумма. */
  value?: number | string
  /** Изменение суммы. Приходит строка без разделителей разрядов. */
  onChange: (value: string) => void
  /** Выбранная валюта. */
  currency?: string
  /** Список валют в выпадающем меню. */
  currencies?: string[]
  /** Смена валюты. Без обработчика меню валют не показывается. */
  onCurrencyChange?: (currency: string) => void
  /** Заблокировать поле. */
  disabled?: boolean
  /** Подсказка в пустом поле. */
  placeholder?: string
}

function group(v: string): string {
  return v.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

export const MoneyInput = forwardRef<HTMLInputElement, MoneyInputProps>(function MoneyInput(
  {
    value,
    onChange,
    currency = 'UZS',
    currencies = ['UZS', 'USD', 'RUB'],
    onCurrencyChange,
    disabled,
    placeholder = '0',
  },
  ref,
) {
  const display = value == null ? '' : group(String(value))

  return (
    <div className="flex w-full">
      <Input
        ref={ref}
        inputMode="numeric"
        value={display}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, ''))}
        className="rounded-r-none text-right tabular-nums focus-visible:z-10"
      />

      {onCurrencyChange ? (
        <Select value={currency} onValueChange={onCurrencyChange} disabled={disabled}>
          <SelectTrigger
            className="w-auto shrink-0 rounded-l-none border-l-0 focus-visible:z-10"
            aria-label="Валюта"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {currencies.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      ) : (
        <span className="bg-muted text-muted-foreground flex h-9 shrink-0 items-center rounded-r-md border px-3 text-sm">
          {currency}
        </span>
      )}
    </div>
  )
})
