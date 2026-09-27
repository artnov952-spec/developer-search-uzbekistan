import { useRef } from 'react'
import { Bold, Italic, Underline, List, ListOrdered, Link2 } from 'lucide-react'
import { Toggle } from './ui/toggle'
import { Separator } from './ui/separator'
import { cn } from '../lib/utils'

/** Редактор форматированного текста с панелью инструментов. */
export interface RichEditorProps {
  /** Начальный HTML. Компонент неконтролируемый. */
  defaultValue?: string
  /** Подсказка в пустом редакторе. */
  placeholder?: string
  /** Изменение текста — приходит HTML. */
  onChange?: (html: string) => void
  /** Дополнительные CSS-классы корневого элемента. */
  className?: string
}

const TOOLS = [
  { cmd: 'bold', icon: <Bold />, label: 'Жирный' },
  { cmd: 'italic', icon: <Italic />, label: 'Курсив' },
  { cmd: 'underline', icon: <Underline />, label: 'Подчёркнутый' },
  { cmd: 'insertUnorderedList', icon: <List />, label: 'Маркированный список' },
  { cmd: 'insertOrderedList', icon: <ListOrdered />, label: 'Нумерованный список' },
]

export function RichEditor({
  defaultValue = '',
  placeholder = 'Напишите текст…',
  onChange,
  className,
}: RichEditorProps) {
  const ref = useRef<HTMLDivElement | null>(null)

  function exec(cmd: string, value?: string) {
    ref.current?.focus()
    document.execCommand(cmd, false, value)
    onChange?.(ref.current?.innerHTML ?? '')
  }

  return (
    <div className={cn('focus-within:border-ring rounded-lg border transition-colors', className)}>
      <div className="flex flex-wrap items-center gap-0.5 border-b p-1">
        {TOOLS.map((t) => (
          <Toggle
            key={t.cmd}
            size="sm"
            aria-label={t.label}
            title={t.label}
            // onMouseDown вместо onClick: клик увёл бы фокус из области
            // редактирования и потерял бы выделение до применения команды.
            onMouseDown={(e: React.MouseEvent) => {
              e.preventDefault()
              exec(t.cmd)
            }}
          >
            {t.icon}
          </Toggle>
        ))}

        <Separator orientation="vertical" className="mx-0.5 h-5" />

        <Toggle
          size="sm"
          aria-label="Ссылка"
          title="Ссылка"
          onMouseDown={(e: React.MouseEvent) => {
            e.preventDefault()
            const url = window.prompt('URL ссылки')
            if (url) exec('createLink', url)
          }}
        >
          <Link2 />
        </Toggle>
      </div>

      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        data-placeholder={placeholder}
        dangerouslySetInnerHTML={{ __html: defaultValue }}
        onInput={() => onChange?.(ref.current?.innerHTML ?? '')}
        className={cn(
          'min-h-28 px-3 py-2 text-sm outline-none',
          // Подсказка в пустом редакторе — через attr(), без лишнего элемента.
          'empty:before:text-muted-foreground empty:before:content-[attr(data-placeholder)]',
          '[&_ol]:my-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:my-1 [&_ul]:list-disc [&_ul]:pl-5',
          '[&_a]:text-primary [&_a]:underline',
        )}
      />
    </div>
  )
}
