import { cn } from '../lib/utils'

export type SparklineVariant = 'accent' | 'success' | 'warning' | 'danger' | 'info'

const STROKE: Record<SparklineVariant, string> = {
  accent: 'stroke-primary',
  success: 'stroke-(--success)',
  warning: 'stroke-(--warning)',
  danger: 'stroke-(--danger)',
  info: 'stroke-(--info)',
}

/** Микрографик тренда внутри строки или карточки. Без осей и подписей. */
export interface SparklineProps {
  /** Значения по порядку. Масштаб — по минимуму и максимуму набора. */
  data: number[]
  /** Ширина в пикселях. */
  width?: number
  /** Высота в пикселях. */
  height?: number
  /** Цвет линии: акцент или смысловой цвет. */
  variant?: SparklineVariant
  /** Дополнительные CSS-классы корневого элемента. */
  className?: string
}

export function Sparkline({ data, width = 80, height = 24, variant = 'accent', className }: SparklineProps) {
  if (data.length < 2) return <svg width={width} height={height} className={className} aria-hidden />

  const min = Math.min(...data)
  const max = Math.max(...data)
  const span = max - min || 1
  const step = width / (data.length - 1)
  const pts = data.map((v, i) => {
    const x = (i * step).toFixed(1)
    const y = (height - ((v - min) / span) * (height - 2) - 1).toFixed(1)
    return x + ',' + y
  })

  return (
    <svg
      width={width}
      height={height}
      viewBox={'0 0 ' + width + ' ' + height}
      className={cn('overflow-visible', STROKE[variant], className)}
      aria-hidden
    >
      <polyline points={pts.join(' ')} fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
