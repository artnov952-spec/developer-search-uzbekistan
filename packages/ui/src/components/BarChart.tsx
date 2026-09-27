import { cn } from '../lib/utils'

/** Ширина системы координат SVG. Реальная ширина задаётся контейнером. */
const VBW = 300

/** Столбец `BarChart`. */
export interface BarChartDatum {
  /** Подпись под столбцом. */
  label: string
  /** Значение — высота считается от максимума в наборе. */
  value: number
  /** Свой цвет столбца. По умолчанию — цвет акцента. */
  color?: string
}

/** Лёгкий SVG-график без внешних зависимостей. Когда нужны оси, легенда
 *  и тултипы — берите `ChartContainer` из shadcn (он на Recharts). */
export interface BarChartProps {
  /** Набор столбцов. */
  data: BarChartDatum[]
  /** Высота области графика в пикселях. */
  height?: number
  /** Форматирование подписи значения: суммы, проценты. */
  formatValue?: (value: number) => string
  /** Дополнительные CSS-классы корневого элемента. */
  className?: string
}

export function BarChart({ data, height = 160, formatValue, className }: BarChartProps) {
  const n = data.length
  const maxVal = data.reduce((m, d) => Math.max(m, d.value), 0) || 1
  const barMaxH = Math.max(height - 8, 1)
  const slot = n > 0 ? VBW / n : VBW
  const barW = slot * 0.6
  const fmt = formatValue ?? ((v: number) => String(v))

  return (
    <div className={cn('w-full', className)}>
      <svg
        viewBox={`0 0 ${VBW} ${height}`}
        width="100%"
        height={height}
        preserveAspectRatio="none"
        role="img"
        className="overflow-visible"
      >
        {data.map((d, i) => {
          const h = (Math.max(d.value, 0) / maxVal) * barMaxH
          return (
            <rect
              key={i}
              x={i * slot + (slot - barW) / 2}
              y={height - h}
              width={barW}
              height={h}
              rx={2}
              className={cn('transition-opacity hover:opacity-80', !d.color && 'fill-primary')}
              style={d.color ? { fill: d.color } : undefined}
            >
              <title>{`${d.label}: ${fmt(d.value)}`}</title>
            </rect>
          )
        })}
        <line
          x1={0}
          y1={height}
          x2={VBW}
          y2={height}
          className="stroke-border"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <div className="mt-1.5 flex">
        {data.map((d, i) => (
          <span
            key={i}
            title={d.label}
            className="text-muted-foreground min-w-0 flex-1 truncate text-center text-xs"
          >
            {d.label}
          </span>
        ))}
      </div>
    </div>
  )
}
