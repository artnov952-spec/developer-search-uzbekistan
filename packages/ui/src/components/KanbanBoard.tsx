import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from './ui/button'
import { cn } from '../lib/utils'

export type KanbanAccent = 'accent' | 'success' | 'warning' | 'danger' | 'info' | 'neutral'

const DOT: Record<KanbanAccent, string> = {
  accent: 'bg-primary',
  success: 'bg-(--success)',
  warning: 'bg-(--warning)',
  danger: 'bg-(--danger)',
  info: 'bg-(--info)',
  neutral: 'bg-muted-foreground',
}

/** Колонка доски. */
export interface KanbanColumn {
  /** Идентификатор — с ним сравнивается результат `getColumnId`. */
  id: string
  /** Заголовок колонки. */
  title: string
  /** Цвет точки в шапке колонки. */
  accent?: KanbanAccent
}

/** Доска с колонками и перетаскиванием карточек. Карточки хранит родитель —
 *  компонент только сообщает о перемещении. */
export interface KanbanBoardProps<T> {
  /** Колонки слева направо. */
  columns: KanbanColumn[]
  /** Все карточки одним списком; по колонкам их разносит `getColumnId`. */
  cards: T[]
  /** Стабильный идентификатор карточки. */
  getCardId: (c: T) => string
  /** В какой колонке находится карточка. */
  getColumnId: (c: T) => string
  /** Как отрисовать карточку. Обычно `KanbanCard` внутри. */
  renderCard: (c: T) => React.ReactNode
  /** Карточку перетащили. Переставить её в данных должен родитель. */
  onCardMove?: (cardId: string, toColumnId: string, toIndex: number) => void
  /** Кнопка «добавить» в шапке колонки. Без обработчика кнопки нет. */
  onAddCard?: (columnId: string) => void
}

/** Готовая карточка для `renderCard`: рамка, отступы, курсор перетаскивания. */
export interface KanbanCardProps {
  /** Содержимое карточки. */
  children: React.ReactNode
  /** Клик по карточке — открыть запись. */
  onClick?: () => void
}

export function KanbanCard({ children, onClick }: KanbanCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-card rounded-lg border p-3 text-sm shadow-sm transition-colors',
        onClick && 'hover:border-foreground/20 cursor-pointer',
      )}
    >
      {children}
    </div>
  )
}

export function KanbanBoard<T>({
  columns, cards, getCardId, getColumnId, renderCard, onCardMove, onAddCard,
}: KanbanBoardProps<T>) {
  const [dragId, setDragId] = useState<string | null>(null)
  const [overCol, setOverCol] = useState<string | null>(null)

  function drop(colId: string, index: number) {
    if (dragId && onCardMove) onCardMove(dragId, colId, index)
    setDragId(null)
    setOverCol(null)
  }

  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {columns.map((col) => {
        const colCards = cards.filter((c) => getColumnId(c) === col.id)
        return (
          <div
            key={col.id}
            onDragOver={(e) => {
              e.preventDefault()
              setOverCol(col.id)
            }}
            onDragLeave={() => setOverCol((c) => (c === col.id ? null : c))}
            onDrop={() => drop(col.id, colCards.length)}
            className={cn(
              'bg-muted/40 flex w-64 shrink-0 flex-col rounded-lg border p-2 transition-colors',
              overCol === col.id && 'border-primary bg-primary/5',
            )}
          >
            <div className="mb-2 flex items-center gap-2 px-1">
              <span className={cn('size-2 shrink-0 rounded-full', DOT[col.accent ?? 'neutral'])} aria-hidden />
              <span className="min-w-0 flex-1 truncate text-sm font-medium">{col.title}</span>
              <span className="text-muted-foreground shrink-0 text-xs tabular-nums">{colCards.length}</span>
              {onAddCard && (
                <Button
                  variant="ghost"
                  size="icon-xs"
                  className="shrink-0"
                  onClick={() => onAddCard(col.id)}
                  aria-label={`Добавить в «${col.title}»`}
                >
                  <Plus />
                </Button>
              )}
            </div>

            <div className="flex flex-1 flex-col gap-2">
              {colCards.map((c, i) => {
                const id = getCardId(c)
                return (
                  <div
                    key={id}
                    draggable
                    tabIndex={0}
                    onDragStart={() => setDragId(id)}
                    onDragEnd={() => {
                      setDragId(null)
                      setOverCol(null)
                    }}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.stopPropagation()
                      drop(col.id, i)
                    }}
                    className={cn(
                      'focus-visible:ring-ring/50 cursor-grab rounded-lg focus-visible:ring-[3px] focus-visible:outline-none active:cursor-grabbing',
                      dragId === id && 'opacity-40',
                    )}
                  >
                    {renderCard(c)}
                  </div>
                )
              })}

              {colCards.length === 0 && (
                <div className="text-muted-foreground rounded-lg border border-dashed py-6 text-center text-sm">
                  Пусто
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
