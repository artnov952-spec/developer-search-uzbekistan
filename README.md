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

Приложение доступно на `http://localhost:4180/search`. Рабочие разделы имеют отдельные адреса:

- `/search` — поиск по серверной базе кандидатов;
- `/candidates/:id` — профиль кандидата с публичными контактами и источниками;
- `/tracking` — серверные критерии, запуски мониторинга и история совпадений;
- `/settings` — профиль и реальное состояние Telegram-подключения.

Продуктовые данные хранятся в SQLite и загружаются только через защищенный API. Демонстрационных профилей, `localStorage` и имитации отправки сообщений в рабочем приложении нет.

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

## Backend и вход через Telegram

Первый backend-срез находится в `apps/server` и использует встроенный `node:sqlite` (Node.js 22.5+). Он предоставляет `/api/health`, `/api/auth/verify`, `/api/auth/me`, `/api/auth/logout`, хранит миграции SQLite и выдает защищенную `HttpOnly; SameSite=Strict` сессию. Одноразовый шестизначный код хранится только в виде HMAC-SHA-256, действует 5 минут и помечается использованным атомарно.

```bash
cp .env.example .env.local
# заполните значения локально, затем экспортируйте их в окружение, например:
set -a; source .env.local; set +a
npm run dev:server      # API: http://127.0.0.1:4182
npm run dev:preview     # UI:  http://localhost:4180/search
```

Для локального Mac mini используйте `TELEGRAM_MODE=polling`: бот принимает `/start` или `/login` только от ID из `DEVELOPER_SEARCH_ALLOWED_TELEGRAM_USER_IDS` и присылает одноразовый код. Токен читается исключительно из `DEVELOPER_SEARCH_TELEGRAM_BOT_TOKEN` и не сохраняется в SQLite. Для production задайте `NODE_ENV=production` (cookie получает `Secure`) и HTTPS.

Webhook-режим предусмотрен через `TELEGRAM_MODE=webhook`: Telegram должен отправлять update на `POST /api/telegram/webhook` с заголовком `X-Telegram-Bot-Api-Secret-Token`, равным `DEVELOPER_SEARCH_TELEGRAM_WEBHOOK_SECRET`. Backend намеренно не регистрирует webhook сам — внешний URL и изменение настроек бота остаются отдельным подтверждаемым действием.

Проверки:

```bash
npm test
npm run typecheck
npm run build
```

### Безопасный локальный runtime на macOS

Токен бота хранится в macOS Keychain под service name `DEVELOPER_SEARCH_TELEGRAM_BOT_TOKEN`. Скрипт запуска получает его через `/usr/bin/security` непосредственно в переменную окружения процесса, не записывает на диск и не печатает. Остальные локальные параметры создаются один раз в игнорируемом `.runtime/server.env` с правами `600`:

```bash
./scripts/setup-local-runtime.sh
./scripts/run-server-local.sh
```

Повторный setup сохраняет существующий session secret, чтобы не инвалидировать активные сессии. В runtime-файле задаются разрешенный Telegram ID `910449149`, polling, loopback host, путь SQLite и абсолютный путь Node.js.

Шаблоны пользовательских launchd-сервисов находятся в `ops/`. На рабочем Mac mini `com.developer-search.server` и `com.developer-search.frontend` автоматически запускаются после входа пользователя и обслуживают API на `127.0.0.1:4182` и собранный React-интерфейс на `127.0.0.1:4180/search`. `com.developer-search.crawler` ежедневно в 21:00 по локальному времени запускает полный возобновляемый обход и импортирует результат в SQLite. Для локального хостинга frontend собирается командой `VITE_BASE_PATH=/ npm run build -w apps/preview`; обычная production-сборка сохраняет GitHub Pages base path.

Проверка:

```bash
curl --fail http://127.0.0.1:4182/api/health
curl --fail http://127.0.0.1:4182/api/ready
curl --fail http://127.0.0.1:4180/search
```

## Developer Search: текущая серверная архитектура

Продуктовый интерфейс больше не использует `localStorage`, демонстрационные профили или имитацию Telegram. После входа React-клиент получает кандидатов, критерии, историю совпадений и состояние Telegram только из защищенного API.

Основные API после авторизации: `/api/candidates`, `/api/criteria`, `/api/monitoring/runs`, `/api/monitoring/matches`, `/api/telegram/status`. Изменяющие запросы защищены проверкой Origin, все данные пользователя изолированы серверной сессией. Планировщик каждые 30 секунд запускает просроченные критерии; уникальность `(criterion_id, candidate_id)` и transactional outbox исключают повторные уведомления.

Полный возобновляемый обход публичных источников:

```bash
npm run crawl -- \
  --input tools/contact-crawler/sources.json \
  --output data/crawler-full.json \
  --checkpoint data/crawler-full.checkpoint.json \
  --resume --listing-pages 0 --candidates 0
```

Нули означают отсутствие искусственного лимита. CLI пишет checkpoint и итог атомарно, не использует LLM, исключает закрытые профили, платные контакты, списки участников Telegram и публикации, не являющиеся резюме.
