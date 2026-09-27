import { ChevronDown, X } from 'lucide-react'
import { Button } from './ui/button'
import { cn } from '../lib/utils'

/** Панель над списком: поиск, фильтры, действия в одну строку с переносом. */
export interface ToolbarProps {
  /** Содержимое панели: `FilterChip`, кнопки, поиск. */
  children: React.ReactNode
  /** Дополнительные CSS-классы корневого элемента. */
  className?: string
}

export function Toolbar({ children, className }: ToolbarProps) {
  return <div className={cn('flex flex-wrap items-center gap-2', className)}>{children}</div>
}

/** Фишка активного фильтра в `Toolbar`. */
export interface FilterChipProps {
  /** Название фильтра: «Стадия». */
  label: string
  /** Выбранное значение: «В работе». Показывается после названия. */
  value?: string
  /** Фильтр применён — фишка подсвечена. */
  active?: boolean
  /** Клик по фишке: обычно открывает выбор значения. */
  onClick?: () => void
  /** Показывает крестик сброса. Без обработчика крестика нет. */
  onClear?: () => void
  /** Иконка слева от названия. */
  icon?: React.ReactNode
}

export function FilterChip({ label, value, active, onClick, onClear, icon }: FilterChipProps) {
  const on = active || value != null
  const clearable = onClear != null && on

  return (
    // Крестик — самостоятельная кнопка, поэтому вложить его в основную нельзя:
    // группа рисуется рамкой, а внутри две отдельные кнопки без своих рамок.
    <span
      className={cn(
        'inline-flex h-8 items-center overflow-hidden rounded-md border text-sm transition-colors',
        on ? 'border-foreground/25 bg-accent' : 'bg-background hover:bg-accent/60',
      )}
    >
      <Button
        variant="ghost"
        size="sm"
        onClick={onClick}
        className="h-8 gap-1.5 rounded-none border-0 px-2.5 font-normal hover:bg-transparent"
      >
        {icon}
        <span className={cn(on && 'text-muted-foreground')}>{label}</span>
        {value != null && <span className="font-medium">{value}</span>}
        {!clearable && <ChevronDown className="text-muted-foreground size-3.5" />}
      </Button>

      {clearable && (
        <button
          type="button"
          onClick={onClear}
          aria-label={`Сбросить фильтр «${label}»`}
          className="focus-visible:ring-ring/50 grid h-8 w-7 shrink-0 place-items-center opacity-60 transition-opacity hover:opacity-100 focus-visible:ring-[3px] focus-visible:outline-none"
        >
          <X className="size-3.5" />
        </button>
      )}
    </span>
  )
}
