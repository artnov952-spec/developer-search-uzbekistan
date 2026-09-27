import { useRef, useState } from 'react'
import { UploadCloud, FileText, X } from 'lucide-react'
import { Button } from './ui/button'
import { cn } from '../lib/utils'

/** Зона загрузки: клик или перетаскивание файлов. */
export interface FileUploadProps {
  /** Выбранные файлы. Загрузку выполняет родитель. */
  onFiles?: (files: File[]) => void
  /** Подсказка про форматы и размер. */
  hint?: string
  /** Фильтр в диалоге выбора, как у `<input type="file">`. */
  accept?: string
  /** Дополнительные CSS-классы корневого элемента. */
  className?: string
}

export function FileUpload({ onFiles, hint = 'PNG, PDF, DOCX до 20 МБ', accept, className }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [drag, setDrag] = useState(false)

  function emit(list: FileList | null) {
    if (list && list.length) onFiles?.(Array.from(list))
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          inputRef.current?.click()
        }
      }}
      onDragOver={(e) => {
        e.preventDefault()
        setDrag(true)
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => {
        e.preventDefault()
        setDrag(false)
        emit(e.dataTransfer.files)
      }}
      className={cn(
        'focus-visible:ring-ring/50 flex cursor-pointer flex-col items-center gap-1.5 rounded-lg border border-dashed px-6 py-8 text-center transition-colors focus-visible:ring-[3px] focus-visible:outline-none',
        drag ? 'border-primary bg-primary/5' : 'hover:bg-accent/40',
        className,
      )}
    >
      <UploadCloud className="text-muted-foreground size-6" aria-hidden />
      <div className="text-sm">
        <span className="font-medium">Нажмите</span> или перетащите файлы
      </div>
      <div className="text-muted-foreground text-xs">{hint}</div>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept={accept}
        className="sr-only"
        onChange={(e) => emit(e.target.files)}
      />
    </div>
  )
}

/** Строка прикреплённого файла под полем ввода или в карточке записи. */
export interface AttachmentRowProps {
  /** Имя файла с расширением. */
  name: string
  /** Размер строкой, уже отформатированный: «2,4 МБ». */
  size?: string
  /** Иконка типа файла. По умолчанию — по расширению. */
  icon?: React.ReactNode
  /** Показывает крестик удаления. Без обработчика крестика нет. */
  onRemove?: () => void
}

export function AttachmentRow({ name, size, icon, onRemove }: AttachmentRowProps) {
  return (
    <div className="flex items-center gap-2 rounded-md border px-2.5 py-1.5 text-sm">
      <span className="text-muted-foreground shrink-0 [&_svg]:size-4" aria-hidden>
        {icon ?? <FileText />}
      </span>
      <span className="min-w-0 flex-1 truncate">{name}</span>
      {size && <span className="text-muted-foreground shrink-0 text-xs tabular-nums">{size}</span>}
      {onRemove && (
        <Button variant="ghost" size="icon-xs" className="-mr-1 shrink-0" onClick={onRemove} aria-label="Удалить файл">
          <X />
        </Button>
      )}
    </div>
  )
}
