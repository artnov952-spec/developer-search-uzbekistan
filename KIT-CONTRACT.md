# UI Kit — контракт для агентов

Единственный источник правды по тому, что можно брать и откуда.

## Главное правило

**Всё, что есть в shadcn/ui, берётся из shadcn. Свои компоненты не пишутся.**

Один импорт на всё:

```tsx
import { Button, Card, Select, DataGrid, KanbanBoard } from '@cloudplus/ui'
import '@cloudplus/ui/styles.css'   // один раз в точке входа приложения
```

Подпутей `@cloudplus/ui/shadcn` больше нет — всё идёт из корня пакета.

## Что делать, если компонента не хватает

Порядок именно такой, шаги не пропускать:

1. **Проверить shadcn.** Каталог: https://ui.shadcn.com/docs/components. Если компонент там есть, но не установлен —
   поставить: `cd packages/ui && npx shadcn@latest add <name>`, затем перегенерировать barrel:
   `node scripts/gen-shadcn-barrel.cjs` (см. `packages/ui/src/shadcn.ts` — правится только генератором).
2. **Собрать композицией** из имеющихся примитивов (так устроен сам shadcn: DatePicker = Popover + Calendar).
3. **Только если ни то, ни другое не подходит** — новый компонент в CRM-надстройку, с обоснованием, почему
   его нельзя собрать из shadcn.

Выдумывать свою кнопку/инпут/диалог запрещено — они есть.

## Состав

### 1. shadcn/ui — база (53 компонента, весь каталог)

Стоят их официальным CLI, исходники в `packages/ui/src/components/ui/`. Это настоящий shadcn:
`asChild`/Slot, компаунд-API, `data-slot`, `focus-visible:ring-[3px]`, авторазмер иконок.

accordion, alert, alert-dialog, aspect-ratio, avatar, badge, breadcrumb, button, button-group, calendar,
card, carousel, chart, checkbox, collapsible, command, context-menu, dialog, drawer, dropdown-menu, empty,
field, form, hover-card, input, input-group, input-otp, item, kbd, label, menubar, navigation-menu,
pagination, popover, progress, radio-group, resizable, scroll-area, select, separator, sheet, sidebar,
skeleton, slider, sonner, spinner, switch, table, tabs, textarea, toggle, toggle-group, tooltip

API этих компонентов — по документации shadcn, здесь не дублируется. Прописывать пропсы, которых нет
в их документации, нельзя.

### 2. CRM-надстройка — только то, чего нет в shadcn

Закрыта для новых базовых компонентов: если что-то есть в shadcn, берётся оттуда.
Все компоненты надстройки собраны **из примитивов shadcn и Tailwind** — собственного CSS
у них нет, визуальный язык один на всю библиотеку.

| Группа | Компоненты |
|---|---|
| Данные | `DataGrid` (+ типы `DataGridColumn<T>`, `SortState`) — сортировка, выбор строк, липкая шапка, состояния loading/empty/error |
| Даты | `DatePicker`, `DateRangePicker` (+ тип `DateRange`), `TimePicker`, `CalendarView` |
| Ввод | `SearchInput`, `PasswordInput`, `PhoneInput`, `MoneyInput`, `InlineEdit`, `MultiSelect`, `Combobox`, `SegmentedControl`, `Rating`, `EmojiPicker`, `RichEditor` |
| Оболочка | `AppRail`, `AppRailItem`, `AppNav`, `AppNavGroup`, `AppNavItem`, `AppNavCollapse` (тёмный icon-rail CRM), `PageHeader`, `OverflowMenu`, `Toolbar`, `FilterChip`, `SavedViews`, `StatChips`, `Tree`, `TreeItem`, `Stepper`, `Timeline`, `TimelineItem` |
| Аналитика | `StatCard`, `BarChart`, `DonutChart`, `Sparkline`, `Leaderboard` |
| Доска и права | `KanbanBoard`, `KanbanCard`, `OrgChart`, `PermissionMatrix`, `PermissionRow` |
| Коммуникации | `ChatMessage`, `MessageComposer`, `ChatThread`, `MailList`, `MailRow`, `Softphone`, `NotificationItem`, `NotificationList` |
| Файлы | `FileUpload`, `AttachmentRow`, `FileGrid`, `FileCard` |
| Прочее | `Fab`, `SpeedDial`, `AiButton`, `Tag`, `InsightCard`, `ChecklistProgress`, `NextStepCard` |

**Точные пропсы — в [API.md](API.md).** Это сгенерированный справочник: имя, тип, обязательность,
значение по умолчанию и описание каждого пропса. Читается целиком, руками не правится —
пересобирается командой `npm run gen:api -w packages/ui` (входит в `npm run build`).
Те же таблицы есть в витрине на страницах раздела «CRM-надстройка».

Живые примеры с кодом — в витрине: `npm run dev -w apps/preview`.

**Внимание на имена:** тёмный rail CRM называется `AppRail`/`AppNav*`, а не `Sidebar*` — `Sidebar*`
занят полноценным app-shell от shadcn. Это разные вещи.

### 3. Тема и утилиты

`ThemeProvider`, `useTheme`, `ACCENTS`, `FONTS`, типы `Theme`/`Density`/`Accent`/`Font`,
`cn` (clsx + tailwind-merge), `cx`/`initials`/`hashIndex`, `useCommandK`, `toast` (из sonner).

## Обязательные обёртки

```tsx
<ThemeProvider defaultTheme="light" defaultDensity="default" defaultAccent="neutral" defaultFont="inter">
  <TooltipProvider>
    <App />
    <Toaster />
  </TooltipProvider>
</ThemeProvider>
```

- `Tooltip` не работает без `TooltipProvider`;
- `toast()` ничего не покажет без смонтированного `<Toaster />`;
- без `ThemeProvider` не проставляются `data-theme`/`data-density`/`data-accent`/`data-font`,
  и компоненты остаются без токенов.

## Цвета

Источник правды — палитра shadcn (base color `neutral`, oklch) в `packages/ui/src/tokens/theme.css`.
Исторические имена кита (`--sf-*`, `--tx-*`, `--bd-*`, `--brand*`) — псевдонимы поверх неё
(`packages/ui/src/tokens/tokens.css`).

- Хардкодить цвета запрещено — только токены или Tailwind-утилиты (`bg-primary`, `text-muted-foreground`,
  `border-border`). Проверяется грепом: `grep -rE "#[0-9a-fA-F]{3,6}"` по изменённым файлам должен быть пуст.
- Дефолтный акцент — `neutral` (чёрный на светлой теме, белый на тёмной), как в стандартном shadcn.
  Бренд-цвет включается точечно: `defaultAccent="blue"` или `setAccent('blue')`, всего 14 пресетов.
  Они переопределяют `--primary`.
- Тёмная тема — атрибут `[data-theme='dark']` на `<html>` (ставит `ThemeProvider`), не класс `.dark`.
  Tailwind-вариант `dark:` уже перенастроен на этот атрибут.
- Смысловые цвета (`--success`, `--warning`, `--danger`, `--info` и их пары `-soft`/`-soft-fg`)
  подключаются каноническим синтаксисом Tailwind v4: `bg-(--success-soft) text-(--success-soft-fg)`,
  а не `bg-[var(--success-soft)]`.

## Фокус

Кольцо фокуса даёт shadcn — `focus-visible:ring-[3px] focus-visible:ring-ring/50` на самих компонентах.
Своё глобальное правило `:focus-visible` добавлять нельзя: `global.css` подключается вне CSS-слоёв,
а Tailwind целиком живёт в `@layer`, поэтому неслоёное правило перебивает любые утилиты — включая
`border-radius`, из-за чего круглые элементы схлопывались в прямоугольные при фокусе.

**Поля ввода — исключение, сделанное 26.08.** У `Input`, `Textarea` и `SelectTrigger` кольцо
тоньше по цвету (`ring-ring/15`), рамка на фокусе темнеет до `--ring`, а в покое поле залито
`bg-muted`. Общая строка классов — `packages/ui/src/lib/field.ts`, там же причина. Токены
`--ring` и `--input` на светлой теме темнее стока (`0.45` и `0.9`). Пере-установка компонента
официальным CLI эти классы затрёт — вернуть из `field.ts`.

## Приложениям-потребителям

Если приложение пишет свои Tailwind-классы, ему нужен свой проход Tailwind с общим слоем темы:

```css
@import "tailwindcss";
@import "@cloudplus/ui/theme.css";
@source "./";
```

Рабочий пример — `apps/preview` (`src/tailwind.css` + `vite.config.ts`).

## Требования к среде

React 19 (у актуального shadcn ref передаётся пропом — на React 18 это не работает), Tailwind v4, Vite.
