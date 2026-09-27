import { useState } from 'react'
import { Phone, PhoneOff, Delete, Mic, MicOff, Pause } from 'lucide-react'
import { Button } from './ui/button'
import { cn } from '../lib/utils'

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#']

/** Панель звонка: номеронабиратель и управление вызовом. */
export interface SoftphoneProps {
  /** Начало звонка — приходит набранный номер. */
  onCall?: (number: string) => void
  /** Завершение звонка. */
  onHangup?: () => void
  /** Состояние линии: определяет, какие кнопки показаны. */
  status?: 'idle' | 'calling' | 'in-call'
  /** Дополнительные CSS-классы корневого элемента. */
  className?: string
}

export function Softphone({ onCall, onHangup, status = 'idle', className }: SoftphoneProps) {
  const [num, setNum] = useState('')
  const [muted, setMuted] = useState(false)
  const [held, setHeld] = useState(false)
  const active = status !== 'idle'

  return (
    <div className={cn('bg-card w-64 rounded-lg border p-3', className)}>
      <div className="bg-muted/50 mb-3 flex min-h-14 items-center gap-2 rounded-md px-3 py-2">
        <div className="min-w-0 flex-1">
          <div className={cn('truncate text-lg tabular-nums', !num && 'text-muted-foreground text-sm')}>
            {num || 'Введите номер'}
          </div>
          {status === 'calling' && <div className="text-muted-foreground text-xs">Вызов…</div>}
          {status === 'in-call' && <div className="text-xs text-(--success)">Разговор</div>}
        </div>

        {num && !active && (
          <Button
            variant="ghost"
            size="icon-sm"
            className="shrink-0"
            onClick={() => setNum((n) => n.slice(0, -1))}
            aria-label="Стереть цифру"
          >
            <Delete />
          </Button>
        )}
      </div>

      {!active ? (
        <>
          <div className="grid grid-cols-3 gap-1.5">
            {KEYS.map((k) => (
              <Button
                key={k}
                variant="ghost"
                className="h-11 text-base font-normal tabular-nums"
                onClick={() => setNum((n) => n + k)}
              >
                {k}
              </Button>
            ))}
          </div>

          <Button
            className="mt-3 w-full bg-(--success) text-white hover:bg-(--success)/90"
            onClick={() => num && onCall?.(num)}
            disabled={!num}
          >
            <Phone />
            Позвонить
          </Button>
        </>
      ) : (
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={muted ? 'default' : 'outline'}
              onClick={() => setMuted((m) => !m)}
              aria-pressed={muted}
            >
              {muted ? <MicOff /> : <Mic />}
              {muted ? 'Вкл. звук' : 'Микрофон'}
            </Button>
            <Button
              variant={held ? 'default' : 'outline'}
              onClick={() => setHeld((h) => !h)}
              aria-pressed={held}
            >
              <Pause />
              {held ? 'Снять' : 'Удержать'}
            </Button>
          </div>

          <Button variant="destructive" className="w-full" onClick={onHangup}>
            <PhoneOff />
            Завершить
          </Button>
        </div>
      )}
    </div>
  )
}
