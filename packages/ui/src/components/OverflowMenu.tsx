import { MoreHorizontal } from 'lucide-react'
import { Button } from './ui/button'
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator,
} from './ui/dropdown-menu'

/** Пункт меню `OverflowMenu`. */
export interface OverflowItem {
  /** Текст пункта. */
  label: string
  /** Иконка слева. */
  icon?: React.ReactNode
  /** Выбор пункта. */
  onSelect?: () => void
  variant?: 'default' | 'destructive'
  /** Разделитель перед пунктом. */
  separatorBefore?: boolean
}

/** Кнопка «⋯» с меню действий, которые не поместились в панель. */
export interface OverflowMenuProps {
  /** Пункты меню. */
  items: OverflowItem[]
  /** Подпись кнопки для скринридера. */
  label?: string
  /** Габарит кнопки. */
  size?: 'sm' | 'default'
}

export function OverflowMenu({ items, label = 'Ещё', size = 'sm' }: OverflowMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size={size}>
          <MoreHorizontal />
          {label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {items.map((it, i) => (
          <div key={i}>
            {it.separatorBefore && <DropdownMenuSeparator />}
            <DropdownMenuItem variant={it.variant} onSelect={it.onSelect}>
              {it.icon}
              {it.label}
            </DropdownMenuItem>
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
