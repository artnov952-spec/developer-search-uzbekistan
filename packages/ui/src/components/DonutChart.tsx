import { cn } from '../lib/utils'

export type DonutVariant = 'accent' | 'success' | 'warning' | 'danger' | 'info'

const VARIANTS: DonutVariant[] = ['accent', 'success', 'warning', 'danger', 'info']

const FILL: Record<DonutVariant, string> = {
  accent: 'stroke-primary',
  success: 'stroke-(--success)',
  warning: 'stroke-(--warning)',
  danger: 'stroke-(--danger)',
  info: 'stroke-(--info)',
}

const DOT: Record<DonutVariant, string> = {
  accent: 'bg-primary',
  success: 'bg-(--success)',
  warning: 'bg-(--warning)',
  danger: 'bg-(--danger)',
  info: 'bg-(--info)',
}

/** Сегмент `DonutChart`. */
export interface DonutChartDatum {
  /** Подпись в легенде. */
  label: string
  /** Значение; доля считается от суммы всех сегментов. */
  value: number
  /** Свой цвет сегмента. По умолчанию — по порядку из палитры. */
  variant?: DonutVariant
}

/** Кольцевая диаграмма на SVG, без внешних зависимостей. */
export interface DonutChartProps {
  /** Сегменты. */
  data: DonutChartDatum[]
  /** Внешний диаметр в пикселях. */
  size?: number
  /** Толщина кольца в пикселях. */
  thickness?: number
  /** Мелкая подпись в центре кольца. */
  centerLabel?: string
  /** Крупное значение в центре кольца. */
  centerValue?: string
  /** Дополнительные CSS-классы корневого элемента. */
  className?: string
}

export function DonutChart({
  data,
  size = 140,
  thickness = 16,
  centerLabel,
  centerValue,
  className,
}: DonutChartProps) {
  const total = data.reduce((s, d) => s + Math.max(d.value, 0), 0)
  const r = (size - thickness) / 2
  const c = 2 * Math.PI * r
  const mid = size / 2

  // Сегменты рисуются одним кругом на каждый: длина штриха = доля окружности,
  // смещение — сумма предыдущих долей.
  let offset = 0
  const segments = data.map((d, i) => {
    const len = (total > 0 ? Math.max(d.value, 0) / total : 0) * c
    const seg = {
      key: i,
      variant: d.variant ?? VARIANTS[i % VARIANTS.length],
      dash: len,
      gap: c - len,
      dashOffset: -offset,
    }
    offset += len
    return seg
  })

  return (
    <div className={cn('flex flex-wrap items-center gap-5', className)}>
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img">
          <g transform={`rotate(-90 ${mid} ${mid})`}>
            <circle cx={mid} cy={mid} r={r} fill="none" strokeWidth={thickness} className="stroke-muted" />
            {segments.map((s) => (
              <circle
                key={s.key}
                cx={mid}
                cy={mid}
                r={r}
                fill="none"
                strokeWidth={thickness}
                strokeDasharray={`${s.dash} ${s.gap}`}
                strokeDashoffset={s.dashOffset}
                className={FILL[s.variant]}
              />
            ))}
          </g>
        </svg>

        {(centerValue != null || centerLabel != null) && (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            {centerValue != null && (
              <span className="text-xl font-semibold tabular-nums">{centerValue}</span>
            )}
            {centerLabel != null && (
              <span className="text-muted-foreground text-xs">{centerLabel}</span>
            )}
          </div>
        )}
      </div>

      <ul className="min-w-0 flex-1 space-y-1.5">
        {data.map((d, i) => (
          <li key={i} className="flex items-center gap-2 text-sm">
            <span
              className={cn('size-2.5 shrink-0 rounded-full', DOT[d.variant ?? VARIANTS[i % VARIANTS.length]])}
              aria-hidden
            />
            <span className="min-w-0 flex-1 truncate">{d.label}</span>
            <span className="shrink-0 font-medium tabular-nums">{d.value}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
