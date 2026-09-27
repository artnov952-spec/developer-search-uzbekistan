import { ChevronsLeft } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'
import { cn } from '../lib/utils'

/* Токены --rail-* заданы в tokens.css и остаются тёмными в обеих темах:
   это осознанное решение продукта, а не наследие старого CSS. */

/** Узкая тёмная полоса с иконками разделов — крайняя левая колонка CRM.
 *  Тёмная в обеих темах. Это НЕ `Sidebar` из shadcn: тот — полноценная
 *  оболочка приложения со сворачиванием. */
export interface AppRailProps {
  /** Пункты `AppRailItem`. */
  children: React.ReactNode
  /** Логотип или аватар над списком пунктов. */
  top?: React.ReactNode
  /** Прижатый к низу блок: настройки, профиль. */
  bottom?: React.ReactNode
}

export function AppRail({ children, top, bottom }: AppRailProps) {
  return (
    <nav
      aria-label="Основная навигация"
      className="flex h-full w-14 shrink-0 flex-col items-center gap-1 bg-(--rail-bg) py-3 text-(--rail-fg)"
    >
      {top && <div className="mb-2 flex flex-col items-center gap-1">{top}</div>}
      <div className="flex flex-1 flex-col items-center gap-1">{children}</div>
      {bottom && <div className="mt-2 flex flex-col items-center gap-1">{bottom}</div>}
    </nav>
  )
}

/** Пункт `AppRail`: только иконка, подпись показывается тултипом. */
export interface AppRailItemProps {
  /** Иконка 20×20, обычно из lucide-react. */
  icon: React.ReactNode
  /** Текущий раздел — подсвечивается. */
  active?: boolean
  /** Подпись для тултипа и скринридера. */
  label?: string
  /** Обработчик выбора раздела. */
  onClick?: () => void
}

export function AppRailItem({ icon, active, label, onClick }: AppRailItemProps) {
  const button = (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'grid size-9 shrink-0 place-items-center rounded-lg transition-colors [&_svg]:size-5',
        'focus-visible:ring-(--rail-active-fg)/50 focus-visible:ring-2 focus-visible:outline-none',
        active
          ? 'bg-(--rail-active-bg) text-(--rail-active-fg)'
          : 'hover:bg-(--rail-hover-bg) hover:text-(--rail-fg-strong)',
      )}
    >
      {icon}
    </button>
  )

  // Подпись показывается тултипом — в rail для неё нет места.
  if (!label) return button

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  )
}

/* ── Вторая колонка: светлая навигация с деревом и счётчиками ── */

/** Вторая колонка навигации справа от `AppRail` — список разделов текстом. */
export interface AppNavProps {
  /** `AppNavGroup` и `AppNavItem`. */
  children: React.ReactNode
  /** Шапка колонки: название раздела, поиск. */
  header?: React.ReactNode
  /** Дополнительные CSS-классы корневого элемента. */
  className?: string
}

export function AppNav({ children, header, className }: AppNavProps) {
  return (
    <div className={cn('bg-sidebar flex h-full w-60 shrink-0 flex-col border-r', className)}>
      {header && <div className="shrink-0 border-b px-3 py-2.5">{header}</div>}
      <div className="flex-1 overflow-y-auto px-2 py-2">{children}</div>
    </div>
  )
}

/** Группа пунктов в `AppNav` с заголовком. */
export interface AppNavGroupProps {
  /** Заголовок группы. Без него группа просто разделяет пункты отступом. */
  label?: string
  /** Пункты `AppNavItem`. */
  children: React.ReactNode
  /** Кнопка в правом углу заголовка, например «добавить». */
  action?: React.ReactNode
}

export function AppNavGroup({ label, children, action }: AppNavGroupProps) {
  return (
    <div className="mb-4 last:mb-0">
      {label && (
        <div className="text-muted-foreground flex h-7 items-center justify-between px-2 text-xs font-medium tracking-wide uppercase">
          <span className="truncate">{label}</span>
          {action}
        </div>
      )}
      <div className="space-y-0.5">{children}</div>
    </div>
  )
}

/** Пункт `AppNav`. */
export interface AppNavItemProps {
  /** Иконка слева от подписи. */
  icon?: React.ReactNode
  /** Подпись пункта. */
  label: string
  /** Текущий пункт — подсвечивается. */
  active?: boolean
  /** Счётчик справа: непрочитанные, количество записей. */
  count?: number
  /** Уровень вложенности: сдвигает пункт вправо. */
  depth?: number
  /** Обработчик выбора пункта. */
  onClick?: () => void
}

export function AppNavItem({ icon, label, active, count, depth = 0, onClick }: AppNavItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      style={{ paddingLeft: `calc(0.5rem + ${depth} * 1rem)` }}
      className={cn(
        'focus-visible:ring-ring/50 flex w-full items-center gap-2 rounded-md py-1.5 pr-2 text-left text-sm transition-colors focus-visible:ring-[3px] focus-visible:outline-none',
        active
          ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
          : 'text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground',
      )}
    >
      {icon && <span className="shrink-0 [&_svg]:size-4" aria-hidden>{icon}</span>}
      <span className="min-w-0 flex-1 truncate">{label}</span>
      {count != null && <span className="text-muted-foreground shrink-0 text-xs tabular-nums">{count}</span>}
    </button>
  )
}

/** Кнопка сворачивания колонки `AppNav`, ставится в её низ. */
export interface AppNavCollapseProps {
  /** Переключение состояния — состоянием управляет родитель. */
  onClick?: () => void
  /** Текущее состояние: разворачивает стрелку. */
  collapsed?: boolean
}

export function AppNavCollapse({ onClick, collapsed }: AppNavCollapseProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={collapsed ? 'Развернуть' : 'Свернуть'}
      className="text-muted-foreground hover:bg-sidebar-accent hover:text-foreground focus-visible:ring-ring/50 flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors focus-visible:ring-[3px] focus-visible:outline-none"
    >
      <ChevronsLeft className={cn('size-4 transition-transform', collapsed && 'rotate-180')} aria-hidden />
    </button>
  )
}
