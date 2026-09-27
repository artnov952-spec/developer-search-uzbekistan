import { ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react'
import { Checkbox } from './ui/checkbox'
import { Skeleton } from './ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { cn } from '../lib/utils'

export type SortDir = 'asc' | 'desc'
/** Текущая сортировка `DataGrid`. */
export interface SortState {
  /** Ключ колонки из `DataGridColumn.key`. */
  key: string
  /** Направление сортировки. */
  dir: SortDir
}

/** Описание колонки `DataGrid`. */
export interface DataGridColumn<T> {
  /** Уникальный ключ колонки. По нему же идёт сортировка. */
  key: string
  /** Содержимое шапки колонки. */
  header: React.ReactNode
  /** Ширина: число — пиксели, строка — любое CSS-значение. */
  width?: number | string
  /** Выравнивание содержимого. Числа и суммы ставьте вправо. */
  align?: 'left' | 'right' | 'center'
  /** Разрешить сортировку по этой колонке — шапка станет кнопкой. */
  sortable?: boolean
  /** Как отрисовать ячейку. Без него берётся `row[key]` как есть. */
  render?: (row: T) => React.ReactNode
}

/** Таблица с сортировкой, выбором строк и липкой шапкой. Сортировка и выбор —
 *  контролируемые: компонент только сообщает о намерении, менять данные должен
 *  родитель. Разметка — shadcn Table. */
export interface DataGridProps<T> {
  /** Описание колонок. */
  columns: DataGridColumn<T>[]
  /** Строки. Компонент их НЕ сортирует — сортируйте до передачи. */
  rows: T[]
  /** Стабильный идентификатор строки: ключ React и значение для выбора. */
  getRowId: (row: T) => string
  /** Показать колонку чекбоксов. */
  selectable?: boolean
  /** Идентификаторы выбранных строк. */
  selectedIds?: string[]
  /** Новый набор выбранных строк. */
  onSelectionChange?: (ids: string[]) => void
  /** Текущая сортировка — рисует стрелку в шапке. */
  sort?: SortState
  /** Клик по сортируемой шапке. Пересортировать `rows` должен родитель. */
  onSortChange?: (sort: SortState) => void
  /** Состояние таблицы: скелетон, пусто, ошибка. */
  state?: 'idle' | 'loading' | 'empty' | 'error'
  /** Что показать при `state="empty"`. */
  emptyContent?: React.ReactNode
  /** Что показать при `state="error"`. */
  errorContent?: React.ReactNode
  /** Клик по строке. Клик по чекбоксу сюда не попадает. */
  onRowClick?: (row: T) => void
  /** Прибить шапку при прокрутке. */
  stickyHeader?: boolean
}

const ALIGN = { left: 'text-left', right: 'text-right', center: 'text-center' } as const

export function DataGrid<T>({
  columns,
  rows,
  getRowId,
  selectable = false,
  selectedIds = [],
  onSelectionChange,
  sort,
  onSortChange,
  state = 'idle',
  emptyContent,
  errorContent,
  onRowClick,
  stickyHeader = true,
}: DataGridProps<T>) {
  const selectedSet = new Set(selectedIds)
  const allSelected = rows.length > 0 && rows.every((r) => selectedSet.has(getRowId(r)))
  const someSelected = rows.some((r) => selectedSet.has(getRowId(r))) && !allSelected
  const totalCols = columns.length + (selectable ? 1 : 0)

  function toggleAll() {
    onSelectionChange?.(allSelected ? [] : rows.map(getRowId))
  }

  function toggleRow(id: string) {
    if (!onSelectionChange) return
    const next = new Set(selectedSet)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    onSelectionChange([...next])
  }

  function onHeaderSort(col: DataGridColumn<T>) {
    if (!col.sortable || !onSortChange) return
    const dir: SortDir = sort?.key === col.key && sort.dir === 'asc' ? 'desc' : 'asc'
    onSortChange({ key: col.key, dir })
  }

  return (
    <div className={cn('relative overflow-auto rounded-lg border', stickyHeader && 'max-h-[32rem]')}>
      <Table>
        <TableHeader className={cn(stickyHeader && 'bg-background sticky top-0 z-10')}>
          <TableRow className="hover:bg-transparent">
            {selectable && (
              <TableHead className="w-10">
                <Checkbox
                  checked={someSelected ? 'indeterminate' : allSelected}
                  onCheckedChange={toggleAll}
                  aria-label="Выбрать все"
                />
              </TableHead>
            )}
            {columns.map((col) => {
              const sorted = sort?.key === col.key
              return (
                <TableHead
                  key={col.key}
                  style={{ width: col.width }}
                  className={cn(col.align && ALIGN[col.align])}
                  aria-sort={sorted ? (sort.dir === 'asc' ? 'ascending' : 'descending') : undefined}
                >
                  {col.sortable ? (
                    <button
                      type="button"
                      onClick={() => onHeaderSort(col)}
                      className={cn(
                        'hover:text-foreground focus-visible:ring-ring/50 group -mx-1 inline-flex items-center gap-1 rounded px-1 py-0.5 transition-colors focus-visible:ring-[3px] focus-visible:outline-none',
                        col.align === 'right' && 'flex-row-reverse',
                      )}
                    >
                      {col.header}
                      {sorted ? (
                        sort.dir === 'asc'
                          ? <ChevronUp className="size-3.5" aria-hidden />
                          : <ChevronDown className="size-3.5" aria-hidden />
                      ) : (
                        <ChevronsUpDown
                          className="size-3.5 opacity-0 transition-opacity group-hover:opacity-50"
                          aria-hidden
                        />
                      )}
                    </button>
                  ) : (
                    col.header
                  )}
                </TableHead>
              )
            })}
          </TableRow>
        </TableHeader>

        <TableBody>
          {state === 'loading' &&
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i} className="hover:bg-transparent">
                {selectable && <TableCell><Skeleton className="size-4 rounded-sm" /></TableCell>}
                {columns.map((col) => (
                  <TableCell key={col.key}><Skeleton className="h-4 w-full" /></TableCell>
                ))}
              </TableRow>
            ))}

          {state === 'empty' && (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={totalCols} className="text-muted-foreground h-32 text-center">
                {emptyContent ?? 'Нет данных'}
              </TableCell>
            </TableRow>
          )}

          {state === 'error' && (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={totalCols} className="text-destructive h-32 text-center">
                {errorContent ?? 'Ошибка загрузки'}
              </TableCell>
            </TableRow>
          )}

          {state === 'idle' &&
            rows.map((row) => {
              const id = getRowId(row)
              const isSel = selectedSet.has(id)
              return (
                <TableRow
                  key={id}
                  data-state={isSel ? 'selected' : undefined}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={cn(onRowClick && 'cursor-pointer')}
                >
                  {selectable && (
                    // Клик по чекбоксу не должен открывать строку.
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={isSel}
                        onCheckedChange={() => toggleRow(id)}
                        aria-label="Выбрать строку"
                      />
                    </TableCell>
                  )}
                  {columns.map((col) => (
                    <TableCell key={col.key} className={cn(col.align && ALIGN[col.align])}>
                      {col.render ? col.render(row) : String((row as Record<string, unknown>)[col.key] ?? '')}
                    </TableCell>
                  ))}
                </TableRow>
              )
            })}
        </TableBody>
      </Table>
    </div>
  )
}
