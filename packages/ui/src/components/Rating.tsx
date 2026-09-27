import { useState } from 'react'
import { Star } from 'lucide-react'
import { cn } from '../lib/utils'

/** Оценка звёздами. Без `onChange` — только показ. */
export interface RatingProps {
  /** Текущая оценка. Дробные значения дают половину звезды. */
  value: number
  /** Количество звёзд. */
  max?: number
  /** Выбор оценки кликом. */
  onChange?: (value: number) => void
  /** Запретить изменение, оставив вид как есть. */
  readOnly?: boolean
  /** Размер звезды в пикселях. */
  size?: number
}

export function Rating({ value, max = 5, onChange, readOnly, size = 18 }: RatingProps) {
  const [hover, setHover] = useState<number | null>(null)
  const interactive = !readOnly && onChange != null
  const shown = hover ?? value

  return (
    <div className="inline-flex items-center gap-0.5" role="radiogroup">
      {Array.from({ length: max }).map((_, i) => {
        const n = i + 1
        const on = n <= shown
        return (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={n === value}
            aria-label={`Оценка ${n} из ${max}`}
            disabled={!interactive}
            onMouseEnter={() => interactive && setHover(n)}
            onMouseLeave={() => interactive && setHover(null)}
            onClick={() => onChange?.(n)}
            className={cn(
              'focus-visible:ring-ring/50 rounded-sm p-0.5 transition-colors focus-visible:ring-[3px] focus-visible:outline-none',
              on ? 'text-(--warning)' : 'text-muted-foreground/40',
              interactive && 'cursor-pointer',
            )}
          >
            <Star style={{ width: size, height: size }} fill={on ? 'currentColor' : 'none'} />
          </button>
        )
      })}
    </div>
  )
}
