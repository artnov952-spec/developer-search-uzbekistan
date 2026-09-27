import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { Fab } from './Fab'
import { cn } from '../lib/utils'

/** Действие в раскрытом `SpeedDial`. */
export interface SpeedDialAction {
  /** Иконка действия. */
  icon: React.ReactNode
  /** Подпись рядом с иконкой. */
  label: string
  /** Выбор действия. */
  onClick: () => void
}

/** Плавающая кнопка, раскрывающаяся в набор действий. */
export interface SpeedDialProps {
  /** Действия снизу вверх. */
  actions: SpeedDialAction[]
  /** Иконка свёрнутой кнопки. */
  icon?: React.ReactNode
  /** Дополнительные CSS-классы корневого элемента. */
  className?: string
}

export function SpeedDial({ actions, icon, className }: SpeedDialProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className={cn('flex flex-col items-end gap-2', className)}>
      {open && (
        <div className="flex flex-col items-end gap-2">
          {actions.map((a) => (
            <button
              key={a.label}
              type="button"
              onClick={() => {
                a.onClick()
                setOpen(false)
              }}
              className="focus-visible:ring-ring/50 group flex items-center gap-2 focus-visible:ring-[3px] focus-visible:outline-none"
            >
              <span className="bg-card rounded-md border px-2 py-1 text-sm shadow-sm">{a.label}</span>
              <span className="bg-card group-hover:bg-accent grid size-10 place-items-center rounded-full border shadow-sm transition-colors [&_svg]:size-4">
                {a.icon}
              </span>
            </button>
          ))}
        </div>
      )}

      <Fab
        icon={open ? <X /> : (icon ?? <Plus />)}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label="Действия"
      />
    </div>
  )
}
