import { useEffect, useRef, useState } from 'react'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { cn } from '../lib/utils'

/** Текст, который превращается в поле по клику. Enter сохраняет, Escape отменяет. */
export interface InlineEditProps {
  /** Текущее значение. */
  value: string
  /** Подтверждение изменения. При отмене не вызывается. */
  onSave: (value: string) => void
  /** Что показать вместо пустого значения. */
  placeholder?: string
  /** Многострочное поле вместо однострочного. */
  multiline?: boolean
  /** Дополнительные CSS-классы корневого элемента. */
  className?: string
}

export function InlineEdit({ value, onSave, placeholder = 'Пусто', multiline = false, className }: InlineEditProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  const ref = useRef<HTMLTextAreaElement | HTMLInputElement | null>(null)

  useEffect(() => { if (editing) ref.current?.focus() }, [editing])
  useEffect(() => { setDraft(value) }, [value])

  function commit() {
    setEditing(false)
    if (draft !== value) onSave(draft)
  }

  function cancel() {
    setDraft(value)
    setEditing(false)
  }

  if (editing) {
    const common = {
      value: draft,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setDraft(e.target.value),
      onBlur: commit,
      className: cn('w-full', className),
    }

    return multiline ? (
      <Textarea
        ref={ref as React.RefObject<HTMLTextAreaElement>}
        {...common}
        rows={3}
        onKeyDown={(e: React.KeyboardEvent) => { if (e.key === 'Escape') cancel() }}
      />
    ) : (
      <Input
        ref={ref as React.RefObject<HTMLInputElement>}
        {...common}
        onKeyDown={(e: React.KeyboardEvent) => {
          if (e.key === 'Enter') commit()
          if (e.key === 'Escape') cancel()
        }}
      />
    )
  }

  return (
    <button
      type="button"
      onClick={() => setEditing(true)}
      className={cn(
        'hover:bg-accent focus-visible:ring-ring/50 -mx-2 w-full rounded-md px-2 py-1.5 text-left text-sm transition-colors focus-visible:ring-[3px] focus-visible:outline-none',
        !value && 'text-muted-foreground',
        className,
      )}
    >
      {value || placeholder}
    </button>
  )
}
