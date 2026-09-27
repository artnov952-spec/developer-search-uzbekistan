/* Cloudplus UI — единственный публичный вход.

   import { Button, DataGrid, KanbanBoard } from '@cloudplus/ui'
   import '@cloudplus/ui/styles.css'   // один раз в точке входа приложения

   Состав:
   1. Компоненты shadcn/ui — база. Всё, что есть в shadcn, берётся ОТСЮДА,
      своё не пишется. Обновление: npx shadcn@latest add <name> в packages/ui.
   2. CRM-надстройка — только то, чего в shadcn нет (таблица с сортировкой,
      канбан, оргструктура, телефония, чарты, почта, чаты). Заморожена:
      новые базовые компоненты сюда не добавляются.
   3. Тема и утилиты. */

// Стили: токены + сброс + Tailwind + CSS компонентов надстройки → dist/style.css
import './tokens/tokens.css'
import './tokens/global.css'
import './tokens/tailwind.css'
import './tokens/development.css'

// ── 1. shadcn/ui ────────────────────────────────────────────────
export * from './shadcn'
// Тосты: <Toaster /> из shadcn + императивный toast() из sonner,
// реэкспортим, чтобы потребителю не нужна была отдельная зависимость.
export { toast } from 'sonner'

// ── 2. Тема и утилиты ───────────────────────────────────────────
export { ThemeProvider, useTheme, ACCENTS, FONTS } from './theme'
export type { Theme, BrandProfile, Density, Accent, Font } from './theme'
export { cn } from './lib/utils'
export { cx, initials, hashIndex } from './utils'
export { useCommandK } from './hooks/use-command-k'

// ── 3. CRM-надстройка ───────────────────────────────────────────

// Данные и таблицы
export { DataGrid } from './components/DataGrid'
export type { DataGridColumn, SortState } from './components/DataGrid'

// Даты (поверх собственного календаря — у shadcn Calendar другой API)
export { DatePicker } from './components/DatePicker'
export { DateRangePicker } from './components/DateRangePicker'
export type { DateRange } from './components/DateRangePicker'
export { TimePicker } from './components/TimePicker'
export { CalendarView } from './components/CalendarView'

// Ввод
export { SearchInput } from './components/SearchInput'
export { PasswordInput } from './components/PasswordInput'
export { PhoneInput } from './components/PhoneInput'
export { MoneyInput } from './components/MoneyInput'
export { InlineEdit } from './components/InlineEdit'
export { MultiSelect } from './components/MultiSelect'
export { Combobox } from './components/Combobox'
export { SegmentedControl } from './components/SegmentedControl'
export { Rating } from './components/Rating'
export { EmojiPicker } from './components/EmojiPicker'
export { RichEditor } from './components/RichEditor'

// Навигация и раскладка (тёмный rail CRM; app-shell от shadcn — Sidebar*)
export {
  AppRail, AppRailItem, AppNav, AppNavGroup, AppNavItem, AppNavCollapse,
} from './components/AppRail'
export { PageHeader } from './components/PageHeader'
export { OverflowMenu } from './components/OverflowMenu'
export { Toolbar, FilterChip } from './components/Toolbar'
export { SavedViews } from './components/SavedViews'
export { StatChips } from './components/StatChips'
export { Tree, TreeItem } from './components/Tree'
export { Stepper } from './components/Stepper'
export { Timeline, TimelineItem } from './components/Timeline'

// Аналитика
export { StatCard } from './components/StatCard'
export { BarChart } from './components/BarChart'
export { DonutChart } from './components/DonutChart'
export { Sparkline } from './components/Sparkline'
export { Leaderboard } from './components/Leaderboard'

// Доска, оргструктура, права
export { KanbanBoard, KanbanCard } from './components/KanbanBoard'
export { OrgChart } from './components/OrgChart'
export { PermissionMatrix } from './components/PermissionMatrix'
export { PermissionRow } from './components/PermissionRow'

// Коммуникации
export { ChatMessage, MessageComposer, ChatThread } from './components/Chat'
export { MailList, MailRow } from './components/Mail'
export { Softphone } from './components/Softphone'
export { NotificationItem, NotificationList } from './components/Notification'

// Файлы
export { FileUpload, AttachmentRow } from './components/FileUpload'
export { FileGrid, FileCard } from './components/FileGrid'

// Действия и подсказки
export { Fab } from './components/Fab'
export { SpeedDial } from './components/SpeedDial'
export { AiButton } from './components/AiButton'
export { Tag } from './components/Tag'
export { InsightCard } from './components/InsightCard'
export { ChecklistProgress } from './components/ChecklistProgress'
export { NextStepCard } from './components/NextStepCard'
