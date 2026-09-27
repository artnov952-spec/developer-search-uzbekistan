import { forwardRef } from 'react'
import { ToggleGroup, ToggleGroupItem } from './ui/toggle-group'
import { cn } from '../lib/utils'

/** Сегмент переключателя. */
export interface SegmentOption {
  /** Значение сегмента. */
  value: string
  /** Подпись сегмента. */
  label: React.ReactNode
  /** Иконка вместо подписи или перед ней. */
  icon?: React.ReactNode
}

export type SegmentedControlSize = 'compact' | 'default'

/** Переключатель из нескольких слитых кнопок — для 2–4 взаимоисключающих режимов.
 *  Поверх shadcn ToggleGroup: клавиатурная модель (стрелки, Home/End) и roving
 *  tabindex приходят от Radix, руками они больше не реализуются. */
export interface SegmentedControlProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue' | 'dir'> {
  /** Сегменты слева направо. */
  options: SegmentOption[]
  /** Выбранное значение. */
  value: string
  /** Смена сегмента. */
  onValueChange: (value: string) => void
  /** Габарит переключателя. */
  size?: SegmentedControlSize
  /** Заблокировать все сегменты. */
  disabled?: boolean
}

export const SegmentedControl = forwardRef<HTMLDivElement, SegmentedControlProps>(function SegmentedControl(
  { options, value, onValueChange, size = 'default', disabled = false, className, ...rest },
  ref,
) {
  return (
    <ToggleGroup
      ref={ref}
      type="single"
      variant="outline"
      value={value}
      // Radix отдаёт пустую строку при попытке снять выбор: у радиогруппы
      // всегда должен остаться выбранный сегмент, поэтому такое игнорируем.
      onValueChange={(v: string) => { if (v) onValueChange(v) }}
      disabled={disabled}
      size={size === 'compact' ? 'sm' : 'default'}
      className={cn('w-fit', className)}
      {...rest}
    >
      {options.map((o) => (
        <ToggleGroupItem key={o.value} value={o.value} aria-label={typeof o.label === 'string' ? o.label : o.value}>
          {o.icon}
          {o.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
})
