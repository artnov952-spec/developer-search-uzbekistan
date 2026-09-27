import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { cn } from '../lib/utils'
import { initials } from '../utils'

/** Строка рейтинга. */
export interface LeaderboardEntry {
  /** Имя участника. */
  name: string
  /** Показатель, по которому строится рейтинг. */
  value: string | number
  /** URL аватара. Без него — инициалы. */
  avatarSrc?: string
  /** Изменение позиции в процентах. Знак задаёт цвет и стрелку. */
  delta?: number
}

/** Рейтинг участников. Порядок берётся как есть — сортируйте до передачи. */
export interface LeaderboardProps {
  /** Участники в нужном порядке. */
  items: LeaderboardEntry[]
  /** Подпись единицы измерения справа от значения. */
  valueLabel?: string
  /** Дополнительные CSS-классы корневого элемента. */
  className?: string
}

/** Призовые места выделяются, остальные идут нейтральным номером. */
const RANK = [
  'bg-(--warning) text-white',
  'bg-muted-foreground/70 text-background',
  'bg-(--warning)/45 text-foreground',
]

export function Leaderboard({ items, valueLabel, className }: LeaderboardProps) {
  return (
    <div className={cn('divide-y rounded-lg border', className)}>
      {items.map((it, i) => (
        <div key={it.name} className="flex items-center gap-3 px-3 py-2.5">
          <span
            className={cn(
              'grid size-6 shrink-0 place-items-center rounded-full text-xs font-semibold tabular-nums',
              RANK[i] ?? 'text-muted-foreground',
            )}
          >
            {i + 1}
          </span>

          <Avatar className="size-7 shrink-0">
            {it.avatarSrc && <AvatarImage src={it.avatarSrc} alt="" />}
            <AvatarFallback className="text-[10px]">{initials(it.name)}</AvatarFallback>
          </Avatar>

          <span className="min-w-0 flex-1 truncate text-sm">{it.name}</span>

          {typeof it.delta === 'number' && (
            <span
              className={cn(
                'inline-flex shrink-0 items-center gap-0.5 text-xs font-medium tabular-nums',
                it.delta >= 0 ? 'text-(--success)' : 'text-(--danger)',
              )}
            >
              {it.delta >= 0 ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
              {Math.abs(it.delta)}%
            </span>
          )}

          <span className="shrink-0 text-sm font-medium tabular-nums">
            {it.value}
            {valueLabel && <span className="text-muted-foreground font-normal"> {valueLabel}</span>}
          </span>
        </div>
      ))}
    </div>
  )
}
