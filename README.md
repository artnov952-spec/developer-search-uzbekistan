# Cloudplus UI

Внутренняя UI-библиотека на **настоящем shadcn/ui** плюс надстройка из CRM-компонентов, которых у shadcn нет.

Правило одно: **всё, что есть в shadcn, берётся из shadcn — своё не пишется.** Надстройка закрывает только
пробелы (таблица с сортировкой, канбан, оргструктура, телефония, чарты, почта, чаты) и заморожена.

Стек: React 19 + TypeScript + Vite, Tailwind v4, Radix UI, lucide-react.

## Структура

```text
packages/ui/            @cloudplus/ui — библиотека (публикуемый пакет с .d.ts)
  src/components/ui/    53 компонента shadcn — весь каталог (ставятся их CLI, руками не правятся)
  src/components/       CRM-надстройка: только то, чего в shadcn нет
  src/tokens/           палитра shadcn + псевдонимы исторических имён кита
  scripts/gen-api.cjs   генератор справочника API из исходников
apps/preview/           витрина в формате docs-сайта — документация библиотеки
apps/design-lab/        макеты экранов CRM под дизайн-аудит (не часть библиотеки)
tools/contact-crawler/  детерминированный CLI поиска публичных контактов кандидата
API.md                  сгенерированный справочник пропсов — основной вход для агентов
```

## Запуск

```bash
npm install
npm run build -w packages/ui   # собрать библиотеку → packages/ui/dist
npm run dev:preview            # витрина:  http://localhost:4180
npm run dev:design-lab         # макеты:   http://localhost:4181
npm run typecheck              # типы во всех трёх пакетах
npm run build                  # собрать всё по цепочке
npm test                       # локальные fixture-тесты краулера
npm run crawl -- --help        # CLI краулера публичных контактов
```

## Готовое приложение поиска разработчиков

После `npm install` запустите:

```bash
npm run build -w packages/ui
npm run dev:preview
```

Приложение доступно на `http://localhost:4180/search`. Разделы имеют отдельные адреса:

- `/search` — поиск и импорт результатов краулера;
- `/people` — база публичных контактов;
- `/collections` — сохраняемые подборки;
- `/messages` — локальная история коммуникаций;
- `/analytics` — статистика базы и каналов связи;
- `/settings` — профиль и параметры рабочего пространства;
- `/help` — инструкция по рабочему процессу.

Подборки, сообщения, импортированные данные и настройки сохраняются в `localStorage` браузера.
Встроенные четыре профиля явно помечены как демонстрационные и не выдаются за результат живого поиска.

### Загрузить реальные результаты

1. Подготовьте входной JSON по формату `tools/contact-crawler/example-input.json`.
2. Запустите детерминированный краулер без LLM:

```bash
npm run crawl -- --input ./input.json --output ./result.json
```

3. Откройте `/search`, нажмите «Импорт результата» и выберите `result.json`.

Интерфейс принимает формат CLI из `tools/contact-crawler`: кандидат появляется только при наличии хотя бы
одного публичного контакта. Для контакта показываются исходная страница и цепочка обнаружения.

Приложения подключают библиотеку как обычную npm-зависимость (`@cloudplus/ui`, workspace-симлинк), поэтому перед
`dev` нужна свежая сборка `packages/ui`.

## Использование

```tsx
import { Button, Card, Select, DataGrid } from '@cloudplus/ui'
import '@cloudplus/ui/styles.css'
```

Обязательные обёртки — `ThemeProvider` → `TooltipProvider` → `<App/>` + `<Toaster/>`.

- Правила для агентов и полный состав — [KIT-CONTRACT.md](KIT-CONTRACT.md)
- Пропсы всех компонентов надстройки — [API.md](API.md) (генерируется, руками не правится)

## Добавить компонент shadcn

```bash
cd packages/ui
npx shadcn@latest add <name>
npm run gen:barrel   # перегенерировать src/shadcn.ts
npm run gen:api      # обновить API.md (входит и в npm run build)
```

Установлен весь каталог shadcn, так что обычно нужно не добавлять компонент, а найти нужный.

## Темизация

Палитра — стандартная shadcn (base color `neutral`, oklch). Дефолтный акцент **neutral**: чёрный на светлой
теме, белый на тёмной. Бренд-цвет включается точечно — `defaultAccent="blue"` или `setAccent(...)`,
14 пресетов, они переопределяют `--primary`.

Тема/плотность/акцент/шрифт переключаются атрибутами на `<html>` (`data-theme`, `data-density`,
`data-accent`, `data-font`) — это ставит `ThemeProvider`. Tailwind-вариант `dark:` перенастроен
на `[data-theme='dark']` вместо класса `.dark`.

Приложению со своими Tailwind-классами нужен свой проход Tailwind с общим слоем темы:

```css
@import "tailwindcss";
@import "@cloudplus/ui/theme.css";
@source "./";
```

Рабочий пример — `apps/preview`.

## Подключение к @cloudplus/web

`@cloudplus/ui` — обычный пакет с `main`/`module`/`types`/`exports` и сгенерированными `.d.ts`.
`apps/preview` и `apps/design-lab` подключают его ровно так, как это сделает боевое приложение —
это и есть проверенный пример интеграции.

**Требуется React 19.** У актуального shadcn ref передаётся обычным пропом, на React 18 это не работает.
