import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { cn } from '../lib/utils'
import { initials } from '../utils'

/** Узел оргструктуры. Дерево строится рекурсивно через `children`. */
export interface OrgNode {
  /** Идентификатор — приходит в `onNodeClick`. */
  id: string
  /** Имя сотрудника. */
  name: string
  /** Должность. */
  role?: string
  /** URL аватара. Без него — инициалы. */
  avatarSrc?: string
  /** Подчинённые. */
  children?: OrgNode[]
}

/** Дерево оргструктуры сверху вниз. */
export interface OrgChartProps {
  /** Корневой узел. */
  root: OrgNode
  /** Клик по карточке сотрудника. */
  onNodeClick?: (id: string) => void
  /** Дополнительные CSS-классы корневого элемента. */
  className?: string
}

function Card({ node, onNodeClick }: { node: OrgNode; onNodeClick?: (id: string) => void }) {
  return (
    <button
      type="button"
      onClick={() => onNodeClick?.(node.id)}
      disabled={!onNodeClick}
      className={cn(
        'bg-card relative z-10 flex w-40 flex-col items-center gap-1.5 rounded-lg border p-3 text-center transition-colors',
        onNodeClick &&
          'hover:border-foreground/20 focus-visible:ring-ring/50 cursor-pointer focus-visible:ring-[3px] focus-visible:outline-none',
      )}
    >
      <Avatar className="size-9">
        {node.avatarSrc && <AvatarImage src={node.avatarSrc} alt="" />}
        <AvatarFallback className="text-xs">{initials(node.name)}</AvatarFallback>
      </Avatar>
      <span className="text-sm leading-tight font-medium">{node.name}</span>
      {node.role && <span className="text-muted-foreground text-xs leading-tight">{node.role}</span>}
    </button>
  )
}

/** Ряд подчинённых плюс вертикаль от родителя к горизонтальной шине. */
function Children({ nodes, onNodeClick }: { nodes: OrgNode[]; onNodeClick?: (id: string) => void }) {
  if (nodes.length === 0) return null

  return (
    <>
      {/* Вертикаль вниз от родителя. */}
      <span className="bg-border h-5 w-px shrink-0" aria-hidden />
      <div className="flex items-start">
        {nodes.map((child, i) => (
          <div key={child.id} className="relative flex flex-col items-center px-2 pt-5">
            {/* Горизонтальная шина: у первого — только правая половина,
                у последнего — только левая, у единственного её нет вовсе. */}
            {nodes.length > 1 && (
              <span
                className={cn(
                  'bg-border absolute top-0 h-px',
                  i === 0 && 'right-0 left-1/2',
                  i === nodes.length - 1 && 'right-1/2 left-0',
                  i > 0 && i < nodes.length - 1 && 'right-0 left-0',
                )}
                aria-hidden
              />
            )}
            {/* Вертикаль от шины вниз к карточке. */}
            <span className="bg-border absolute top-0 h-5 w-px" aria-hidden />

            <Card node={child} onNodeClick={onNodeClick} />
            <Children nodes={child.children ?? []} onNodeClick={onNodeClick} />
          </div>
        ))}
      </div>
    </>
  )
}

export function OrgChart({ root, onNodeClick, className }: OrgChartProps) {
  return (
    <div className={cn('overflow-x-auto pb-2', className)}>
      <div className="flex min-w-max flex-col items-center px-2">
        <Card node={root} onNodeClick={onNodeClick} />
        <Children nodes={root.children ?? []} onNodeClick={onNodeClick} />
      </div>
    </div>
  )
}
