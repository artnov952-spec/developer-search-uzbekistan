import { ChevronRight } from 'lucide-react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible'
import { cn } from '../lib/utils'

/** Дерево — оболочка для `TreeItem`. */
export interface TreeProps {
  /** Узлы `TreeItem`. */
  children: React.ReactNode
  /** Дополнительные CSS-классы корневого элемента. */
  className?: string
}

export function Tree({ children, className }: TreeProps) {
  return <div className={cn('text-sm', className)} role="tree">{children}</div>
}

/** Узел дерева. Раскрывается сам, если внутри есть вложенные узлы. */
export interface TreeItemProps {
  /** Подпись узла. */
  label: React.ReactNode
  /** Иконка слева от подписи. */
  icon?: React.ReactNode
  /** Счётчик справа. */
  count?: number
  /** Уровень вложенности: задаёт отступ слева. */
  level?: number
  /** Текущий узел — подсвечивается. */
  active?: boolean
  /** Раскрыть узел при первом рендере. */
  defaultExpanded?: boolean
  /** Клик по узлу. */
  onSelect?: () => void
  /** Вложенные `TreeItem`. */
  children?: React.ReactNode
}

export function TreeItem({
  label, icon, count, level = 0, active, defaultExpanded = false, onSelect, children,
}: TreeItemProps) {
  const hasChildren = Boolean(children)

  const row = (
    <>
      <ChevronRight
        className={cn(
          'text-muted-foreground size-3.5 shrink-0 transition-transform',
          !hasChildren && 'invisible',
          'group-data-[state=open]/tree:rotate-90',
        )}
      />
      {icon && <span className="text-muted-foreground shrink-0 [&_svg]:size-4">{icon}</span>}
      <span className="min-w-0 flex-1 truncate text-left">{label}</span>
      {count != null && <span className="text-muted-foreground shrink-0 tabular-nums">{count}</span>}
    </>
  )

  const rowClass = cn(
    'group/tree hover:bg-accent/60 focus-visible:ring-ring/50 flex w-full items-center gap-1.5 rounded-md py-1.5 pr-2 text-left transition-colors focus-visible:ring-[3px] focus-visible:outline-none',
    active && 'bg-accent text-accent-foreground font-medium',
  )
  const indent = { paddingLeft: `calc(0.5rem + ${level} * 1rem)` }

  // Лист — обычная кнопка. Узел с детьми — Collapsible: состояние раскрытия,
  // aria-expanded и связь с группой приходят от Radix.
  if (!hasChildren) {
    return (
      <button type="button" role="treeitem" className={rowClass} style={indent} onClick={onSelect}>
        {row}
      </button>
    )
  }

  return (
    <Collapsible defaultOpen={defaultExpanded} role="treeitem">
      <CollapsibleTrigger className={rowClass} style={indent} onClick={onSelect}>
        {row}
      </CollapsibleTrigger>
      <CollapsibleContent role="group">{children}</CollapsibleContent>
    </Collapsible>
  )
}
