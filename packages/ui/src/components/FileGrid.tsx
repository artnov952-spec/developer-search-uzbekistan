import { File, FileText, Image as ImageIcon, FileSpreadsheet, Folder, MoreHorizontal } from 'lucide-react'
import { Button } from './ui/button'
import { cn } from '../lib/utils'

export type FileKind = 'folder' | 'doc' | 'image' | 'sheet' | 'pdf' | 'file'

const ICON: Record<FileKind, React.ReactNode> = {
  folder: <Folder />,
  doc: <FileText />,
  image: <ImageIcon />,
  sheet: <FileSpreadsheet />,
  pdf: <FileText />,
  file: <File />,
}

/** Цвет иконки подсказывает тип файла быстрее, чем её форма. */
const TONE: Record<FileKind, string> = {
  folder: 'text-(--warning)',
  doc: 'text-(--info)',
  image: 'text-(--success)',
  sheet: 'text-(--success)',
  pdf: 'text-(--danger)',
  file: 'text-muted-foreground',
}

/** Плитка файла в `FileGrid`. */
export interface FileCardProps {
  /** Имя файла. */
  name: string
  /** Тип файла — определяет иконку. */
  kind?: FileKind
  /** Строка под именем: размер, дата. */
  meta?: string
  /** Превью изображения вместо иконки. */
  thumbnailSrc?: string
  /** Клик или двойной клик по плитке. */
  onOpen?: () => void
  /** Кнопка «ещё» в углу. Без обработчика кнопки нет. */
  onMenu?: () => void
}

export function FileCard({ name, kind = 'file', meta, thumbnailSrc, onOpen, onMenu }: FileCardProps) {
  return (
    <div
      onClick={onOpen}
      tabIndex={onOpen ? 0 : undefined}
      role={onOpen ? 'button' : undefined}
      onKeyDown={(e) => {
        if (onOpen && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault()
          onOpen()
        }
      }}
      className={cn(
        'group bg-card overflow-hidden rounded-lg border transition-colors',
        onOpen && 'hover:border-foreground/20 focus-visible:ring-ring/50 cursor-pointer focus-visible:ring-[3px] focus-visible:outline-none',
      )}
    >
      <div className="bg-muted/50 grid h-24 place-items-center border-b">
        {thumbnailSrc ? (
          <img src={thumbnailSrc} alt="" className="size-full object-cover" />
        ) : (
          <span className={cn('[&_svg]:size-7', TONE[kind])} aria-hidden>{ICON[kind]}</span>
        )}
      </div>

      <div className="flex items-start gap-1 p-2.5">
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium" title={name}>{name}</div>
          {meta && <div className="text-muted-foreground truncate text-xs">{meta}</div>}
        </div>
        {onMenu && (
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Меню файла"
            className="-mt-0.5 -mr-1 shrink-0 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
            onClick={(e) => {
              e.stopPropagation()
              onMenu()
            }}
          >
            <MoreHorizontal />
          </Button>
        )}
      </div>
    </div>
  )
}

/** Сетка файлов, подстраивающаяся под ширину. */
export interface FileGridProps {
  /** Плитки `FileCard`. */
  children: React.ReactNode
  /** Дополнительные CSS-классы корневого элемента. */
  className?: string
}

export function FileGrid({ children, className }: FileGridProps) {
  return (
    <div className={cn('grid grid-cols-[repeat(auto-fill,minmax(9rem,1fr))] gap-3', className)}>
      {children}
    </div>
  )
}
