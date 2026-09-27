import { useState } from 'react'
import { Paperclip, Send } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { cn } from '../lib/utils'
import { initials } from '../utils'

/** Сообщение в переписке. */
export interface ChatMessageProps {
  /** Имя отправителя. Первые буквы идут в аватар-заглушку. */
  author: string
  /** Тело сообщения. Можно передать разметку. */
  text: React.ReactNode
  /** Время строкой: «14:32». */
  time?: React.ReactNode
  /** Сообщение текущего пользователя — прижимается вправо. */
  own?: boolean
  /** URL аватара. Без него — инициалы. */
  avatarSrc?: string
  /** Канал: помечает сообщения, пришедшие из Telegram. */
  channel?: 'internal' | 'telegram'
}

export function ChatMessage({ author, text, time, own, avatarSrc, channel }: ChatMessageProps) {
  return (
    <div className={cn('flex gap-2', own && 'flex-row-reverse')}>
      {!own && (
        <Avatar className="mt-0.5 size-7 shrink-0">
          {avatarSrc && <AvatarImage src={avatarSrc} alt="" />}
          <AvatarFallback className="text-[10px]">{initials(author)}</AvatarFallback>
        </Avatar>
      )}

      <div className={cn('flex max-w-[75%] min-w-0 flex-col gap-1', own && 'items-end')}>
        {!own && (
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-medium">{author}</span>
            {channel === 'telegram' && (
              <Badge variant="outline" className="px-1 py-0 text-[10px]">Telegram</Badge>
            )}
          </div>
        )}

        <div
          className={cn(
            'rounded-lg px-3 py-2 text-sm break-words',
            own ? 'bg-primary text-primary-foreground' : 'bg-muted',
          )}
        >
          {text}
        </div>

        {time && <div className="text-muted-foreground text-xs">{time}</div>}
      </div>
    </div>
  )
}

/** Поле написания сообщения с кнопкой отправки. Enter отправляет, Shift+Enter переносит строку. */
export interface MessageComposerProps {
  /** Контролируемое значение. Без него компонент хранит текст сам. */
  value?: string
  /** Изменение текста — нужен только в контролируемом режиме. */
  onChange?: (v: string) => void
  /** Отправка: по кнопке или Enter. Поле очищается само. */
  onSend?: (text: string) => void
  /** Подсказка в пустом поле. */
  placeholder?: string
}

export function MessageComposer({ value, onChange, onSend, placeholder = 'Написать сообщение…' }: MessageComposerProps) {
  const [internal, setInternal] = useState('')
  const val = value ?? internal
  const set = (v: string) => (onChange ? onChange(v) : setInternal(v))

  function send() {
    const t = val.trim()
    if (!t) return
    onSend?.(t)
    set('')
  }

  return (
    <div className="flex items-end gap-1.5">
      <Button variant="ghost" size="icon" className="shrink-0" aria-label="Прикрепить файл">
        <Paperclip />
      </Button>

      <Textarea
        value={val}
        placeholder={placeholder}
        rows={1}
        onChange={(e) => set(e.target.value)}
        onKeyDown={(e: React.KeyboardEvent) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            send()
          }
        }}
        className="max-h-32 min-h-9 flex-1 resize-none py-2"
      />

      <Button size="icon" className="shrink-0" onClick={send} disabled={!val.trim()} aria-label="Отправить">
        <Send />
      </Button>
    </div>
  )
}

/** Оболочка переписки: прокручиваемый список сообщений между шапкой и полем ввода. */
export interface ChatThreadProps {
  /** Сообщения `ChatMessage`. */
  children: React.ReactNode
  /** Шапка: собеседник, статус, действия. */
  header?: React.ReactNode
  /** Обычно `MessageComposer`. */
  footer?: React.ReactNode
  /** Дополнительные CSS-классы корневого элемента. */
  className?: string
}

export function ChatThread({ children, header, footer, className }: ChatThreadProps) {
  return (
    <div className={cn('bg-card flex min-h-0 flex-col overflow-hidden rounded-lg border', className)}>
      {header && <div className="shrink-0 border-b px-4 py-2.5">{header}</div>}
      <div className="flex-1 space-y-3 overflow-y-auto p-4">{children}</div>
      {footer && <div className="shrink-0 border-t p-2">{footer}</div>}
    </div>
  )
}
