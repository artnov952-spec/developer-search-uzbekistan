import { Search, X } from 'lucide-react'
import { Input } from './ui/input'
import { cn } from '../lib/utils'

export type SearchInputProps = React.ComponentProps<'input'> & {
  /** Показывает кнопку очистки, когда поле не пустое. Без обработчика кнопки нет. */
  onClear?: () => void
}

/** Поле поиска: иконка слева, кнопка очистки справа. Обёртка над shadcn Input. */
export function SearchInput({ onClear, value, className, ...rest }: SearchInputProps) {
  const hasValue = value != null && String(value) !== ''
  return (
    <div className="relative">
      <Search
        className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2"
        aria-hidden
      />
      <Input
        type="text"
        value={value}
        className={cn('pl-8', hasValue && 'pr-8', className)}
        {...rest}
      />
      {hasValue && (
        <button
          type="button"
          onClick={onClear}
          aria-label="Очистить поиск"
          tabIndex={-1}
          className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2.5 -translate-y-1/2 cursor-pointer"
        >
          <X className="size-4" aria-hidden />
        </button>
      )}
    </div>
  )
}
