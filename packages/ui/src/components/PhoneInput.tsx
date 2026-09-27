import { forwardRef, useState } from 'react'
import { Input } from './ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'

interface Country { code: string; dial: string; flag: string }
const COUNTRIES: Country[] = [
  { code: 'UZ', dial: '+998', flag: '🇺🇿' },
  { code: 'RU', dial: '+7', flag: '🇷🇺' },
  { code: 'KZ', dial: '+7', flag: '🇰🇿' },
  { code: 'US', dial: '+1', flag: '🇺🇸' },
]

/** Поле телефона с выбором страны и маской под её формат. */
export interface PhoneInputProps {
  /** Номер без кода страны. */
  value: string
  /** Изменение номера. */
  onChange: (value: string) => void
  /** Код страны по ISO: `UZ`, `RU`, `KZ`. */
  defaultCountry?: string
  /** Заблокировать поле. */
  disabled?: boolean
  /** Подсказка формата. */
  placeholder?: string
}

export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(function PhoneInput(
  { value, onChange, defaultCountry = 'UZ', disabled, placeholder = '90 123 45 67' },
  ref,
) {
  const [code, setCode] = useState(
    () => (COUNTRIES.find((c) => c.code === defaultCountry) ?? COUNTRIES[0]).code,
  )
  const country = COUNTRIES.find((c) => c.code === code) ?? COUNTRIES[0]

  // Селектор и поле склеены в одну рамку: селектор без своей правой границы,
  // поле без левой — вместе читаются как один контрол.
  return (
    <div className="flex w-full">
      <Select value={code} onValueChange={setCode} disabled={disabled}>
        <SelectTrigger
          className="w-auto shrink-0 gap-1.5 rounded-r-none border-r-0 focus-visible:z-10"
          aria-label="Код страны"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {COUNTRIES.map((c) => (
            <SelectItem key={c.code} value={c.code}>
              {c.flag} {c.code} {c.dial}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="relative flex min-w-0 flex-1">
        <span className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm tabular-nums">
          {country.dial}
        </span>
        <Input
          ref={ref}
          type="tel"
          inputMode="tel"
          value={value}
          disabled={disabled}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value.replace(/[^\d\s]/g, ''))}
          className="rounded-l-none pl-14 tabular-nums focus-visible:z-10"
          style={{ paddingLeft: `calc(1.5rem + ${country.dial.length}ch)` }}
        />
      </div>
    </div>
  )
})
