/* Блоки — готовые составные экраны.
   Специально НЕ экспортируются из библиотеки: оболочка страницы — самая
   изменчивая часть между демками, и лишний экспортируемый AppShell дал бы
   третий способ собрать layout вдобавок к AppRail и Sidebar. Копируйте код
   и правьте под задачу — так же устроены Blocks у shadcn. */
import { useState } from 'react'
import {
  Avatar, AvatarFallback, Badge, Button,
  Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
  Checkbox, DataGrid, type DataGridColumn, type SortState,
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
  Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle,
  Field, FieldDescription, FieldGroup, FieldLabel,
  Input, Label, Progress, SearchInput, Separator,
  StatCard, Tabs, TabsContent, TabsList, TabsTrigger, Textarea,
} from '@cloudplus/ui'
import {
  Building2, Inbox, MoreHorizontal, Plus, Search, Trash2, TrendingUp, Users, Wallet,
} from 'lucide-react'
import { CodeBlock, CopyButton } from './CodeBlock'

/** Блок: полноразмерное превью плюс кнопка «скопировать целиком». */
function Block({
  id, title, description, code, children,
}: {
  id: string; title: string; description: string; code: string; children: React.ReactNode
}) {
  return (
    <section id={id} data-toc={title} className="scroll-mt-20">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
          <p className="text-muted-foreground mt-1 text-sm">{description}</p>
        </div>
        <CopyButton text={code.trim()} label="Скопировать блок" />
      </div>

      <Tabs defaultValue="preview">
        <TabsList>
          <TabsTrigger value="preview">Превью</TabsTrigger>
          <TabsTrigger value="code">Код</TabsTrigger>
        </TabsList>
        <TabsContent value="preview">
          <div className="bg-background overflow-hidden rounded-lg border">{children}</div>
        </TabsContent>
        <TabsContent value="code">
          <CodeBlock code={code} className="max-h-[32rem]" />
        </TabsContent>
      </Tabs>
    </section>
  )
}

/* ── 1. Вход ────────────────────────────────────────────────── */

const LOGIN_CODE = `import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
  Field, FieldGroup, FieldLabel, Input, Separator } from '@cloudplus/ui'

export function LoginPage() {
  return (
    <div className="flex min-h-dvh items-center justify-center p-6">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Вход в Cloudplus</CardTitle>
          <CardDescription>Введите рабочую почту и пароль.</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email">Рабочая почта</FieldLabel>
              <Input id="email" type="email" placeholder="name@cloudplus.uz" />
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Пароль</FieldLabel>
              <Input id="password" type="password" />
            </Field>
          </FieldGroup>
        </CardContent>
        <CardFooter className="flex-col gap-3">
          <Button className="w-full">Войти</Button>
          <Separator />
          <Button variant="outline" className="w-full">Войти через SSO</Button>
        </CardFooter>
      </Card>
    </div>
  )
}`

function LoginPreview() {
  return (
    <div className="bg-muted/30 flex items-center justify-center p-8">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Вход в Cloudplus</CardTitle>
          <CardDescription>Введите рабочую почту и пароль.</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="bl-email">Рабочая почта</FieldLabel>
              <Input id="bl-email" type="email" placeholder="name@cloudplus.uz" />
            </Field>
            <Field>
              <FieldLabel htmlFor="bl-password">Пароль</FieldLabel>
              <Input id="bl-password" type="password" />
              <FieldDescription>Забыли пароль? Обратитесь к администратору.</FieldDescription>
            </Field>
          </FieldGroup>
        </CardContent>
        <CardFooter className="flex-col gap-3">
          <Button className="w-full">Войти</Button>
          <Separator />
          <Button variant="outline" className="w-full">Войти через SSO</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

/* ── 2. Дашборд ─────────────────────────────────────────────── */

const DASHBOARD_CODE = `import { Card, CardContent, CardHeader, CardTitle, StatCard, Progress } from '@cloudplus/ui'
import { TrendingUp, Users, Wallet } from 'lucide-react'

const stats = [
  { label: 'Выручка за месяц', value: '18,4 млн ₽', delta: 12.5, icon: <Wallet size={16} /> },
  { label: 'Новых сделок',     value: 47,           delta: -3.2, icon: <TrendingUp size={16} /> },
  { label: 'Активных клиентов', value: 312,          delta: 4.1,  icon: <Users size={16} /> },
]

export function Dashboard() {
  return (
    <div className="space-y-6 p-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => <StatCard key={s.label} {...s} hint="за 30 дней" />)}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Воронка продаж</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {funnel.map((f) => (
              <div key={f.stage}>
                <div className="mb-1.5 flex justify-between text-sm">
                  <span>{f.stage}</span>
                  <span className="text-muted-foreground tabular-nums">{f.count}</span>
                </div>
                <Progress value={f.percent} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}`

const FUNNEL = [
  { stage: 'Первичный контакт', count: 128, percent: 100 },
  { stage: 'Квалификация', count: 84, percent: 66 },
  { stage: 'Коммерческое предложение', count: 41, percent: 32 },
  { stage: 'Договор', count: 23, percent: 18 },
  { stage: 'Оплата', count: 17, percent: 13 },
]

function DashboardPreview() {
  return (
    <div className="bg-muted/30 space-y-6 p-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Выручка за месяц" value="18,4 млн ₽" delta={12.5} hint="за 30 дней" icon={<Wallet size={16} />} />
        <StatCard label="Новых сделок" value={47} delta={-3.2} hint="за 30 дней" icon={<TrendingUp size={16} />} />
        <StatCard label="Активных клиентов" value={312} delta={4.1} hint="за 30 дней" icon={<Users size={16} />} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Воронка продаж</CardTitle>
          <CardDescription>По количеству сделок</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {FUNNEL.map((f) => (
            <div key={f.stage}>
              <div className="mb-1.5 flex justify-between text-sm">
                <span>{f.stage}</span>
                <span className="text-muted-foreground tabular-nums">{f.count}</span>
              </div>
              <Progress value={f.percent} />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

/* ── 3. Страница со списком ─────────────────────────────────── */

const LIST_CODE = `import { Button, DataGrid, type DataGridColumn, type SortState,
  Badge, SearchInput } from '@cloudplus/ui'
import { Plus } from 'lucide-react'

type Deal = { id: string; company: string; stage: string; owner: string; amount: number }

const columns: DataGridColumn<Deal>[] = [
  { key: 'company', header: 'Компания', sortable: true,
    render: (r) => <span className="font-medium">{r.company}</span> },
  { key: 'stage', header: 'Стадия',
    render: (r) => <Badge variant="secondary">{r.stage}</Badge> },
  { key: 'owner', header: 'Ответственный' },
  { key: 'amount', header: 'Сумма', align: 'right', sortable: true,
    render: (r) => r.amount.toLocaleString('ru-RU') + ' ₽' },
]

export function DealsPage() {
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<SortState>({ key: 'amount', dir: 'desc' })
  const [selected, setSelected] = useState<string[]>([])

  // DataGrid НЕ сортирует сам — данные готовит страница.
  const rows = useMemo(() => {
    const filtered = deals.filter((d) =>
      d.company.toLowerCase().includes(query.trim().toLowerCase()))
    const dir = sort.dir === 'asc' ? 1 : -1
    return [...filtered].sort((a, b) => {
      const x = a[sort.key as keyof Deal], y = b[sort.key as keyof Deal]
      return x < y ? -dir : x > y ? dir : 0
    })
  }, [query, sort])

  return (
    <div className="space-y-4 p-6">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-semibold">Сделки</h1>
        <Badge variant="secondary">{rows.length}</Badge>
        <div className="ml-auto flex gap-2">
          <SearchInput value={query} onChange={(e) => setQuery(e.target.value)}
            onClear={() => setQuery('')} placeholder="Поиск компании…" className="w-56" />
          <Button><Plus />Сделка</Button>
        </div>
      </div>

      {selected.length > 0 && (
        <div className="bg-muted flex items-center gap-3 rounded-md px-3 py-2 text-sm">
          Выбрано: {selected.length}
          <Button size="sm" variant="ghost" onClick={() => setSelected([])}>Снять</Button>
        </div>
      )}

      <DataGrid
        columns={columns} rows={rows} getRowId={(r) => r.id}
        selectable selectedIds={selected} onSelectionChange={setSelected}
        sort={sort} onSortChange={setSort}
        state={rows.length === 0 ? 'empty' : 'idle'}
      />
    </div>
  )
}`

type Deal = { id: string; company: string; stage: string; owner: string; amount: number }

const DEALS: Deal[] = [
  { id: '1', company: 'ООО «Ромашка»', stage: 'В работе', owner: 'А. Иванов', amount: 1240000 },
  { id: '2', company: 'АО «Вектор»', stage: 'Новая', owner: 'М. Кузнецова', amount: 480000 },
  { id: '3', company: 'ИП Соколов', stage: 'Выиграна', owner: 'Д. Петров', amount: 95000 },
  { id: '4', company: 'ООО «Гранит»', stage: 'Согласование', owner: 'А. Иванов', amount: 2100000 },
  { id: '5', company: 'ЗАО «Мираж»', stage: 'В работе', owner: 'М. Кузнецова', amount: 730000 },
]

function ListPreview() {
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<SortState>({ key: 'amount', dir: 'desc' })
  const [selected, setSelected] = useState<string[]>([])

  const filtered = DEALS.filter((d) => d.company.toLowerCase().includes(query.trim().toLowerCase()))
  const dir = sort.dir === 'asc' ? 1 : -1
  const rows = [...filtered].sort((a, b) => {
    const x = a[sort.key as keyof Deal]
    const y = b[sort.key as keyof Deal]
    return x < y ? -dir : x > y ? dir : 0
  })

  const columns: DataGridColumn<Deal>[] = [
    { key: 'company', header: 'Компания', sortable: true, render: (r) => <span className="font-medium">{r.company}</span> },
    { key: 'stage', header: 'Стадия', render: (r) => <Badge variant="secondary">{r.stage}</Badge> },
    { key: 'owner', header: 'Ответственный' },
    {
      key: 'amount', header: 'Сумма', align: 'right', sortable: true,
      render: (r) => <span className="tabular-nums">{r.amount.toLocaleString('ru-RU')} ₽</span>,
    },
  ]

  return (
    <div className="space-y-4 p-6">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">Сделки</h1>
        <Badge variant="secondary">{rows.length}</Badge>
        <div className="ml-auto flex flex-wrap gap-2">
          <SearchInput
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onClear={() => setQuery('')}
            placeholder="Поиск компании…"
            className="w-56"
          />
          <Button><Plus />Сделка</Button>
        </div>
      </div>

      {selected.length > 0 && (
        <div className="bg-muted flex items-center gap-3 rounded-md px-3 py-2 text-sm">
          Выбрано: <span className="font-medium">{selected.length}</span>
          <Button size="sm" variant="ghost" className="ml-auto" onClick={() => setSelected([])}>Снять выделение</Button>
          <Button size="sm" variant="ghost"><Trash2 />Удалить</Button>
        </div>
      )}

      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={(r) => r.id}
        selectable
        selectedIds={selected}
        onSelectionChange={setSelected}
        sort={sort}
        onSortChange={setSort}
        state={rows.length === 0 ? 'empty' : 'idle'}
        emptyContent={
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon"><Search /></EmptyMedia>
              <EmptyTitle>Ничего не найдено</EmptyTitle>
              <EmptyDescription>Измените запрос или сбросьте фильтры.</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button size="sm" variant="outline" onClick={() => setQuery('')}>Сбросить поиск</Button>
            </EmptyContent>
          </Empty>
        }
      />
    </div>
  )
}

/* ── 4. Настройки ───────────────────────────────────────────── */

const SETTINGS_CODE = `import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
  Checkbox, Field, FieldDescription, FieldGroup, FieldLabel, Input, Label,
  Separator, Tabs, TabsContent, TabsList, TabsTrigger, Textarea } from '@cloudplus/ui'

export function SettingsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Настройки</h1>
        <p className="text-muted-foreground mt-1">Профиль, уведомления и доступ.</p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Профиль</TabsTrigger>
          <TabsTrigger value="notifications">Уведомления</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Профиль организации</CardTitle>
              <CardDescription>Данные видны всем участникам.</CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="org">Название</FieldLabel>
                  <Input id="org" defaultValue="Cloudplus" />
                </Field>
                <Field>
                  <FieldLabel htmlFor="about">Описание</FieldLabel>
                  <Textarea id="about" rows={3} />
                  <FieldDescription>До 200 символов.</FieldDescription>
                </Field>
              </FieldGroup>
            </CardContent>
            <CardFooter className="gap-2 border-t">
              <Button>Сохранить</Button>
              <Button variant="ghost">Отмена</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}`

const NOTIFY = [
  ['Новая сделка', 'Когда в воронке появляется запись'],
  ['Смена стадии', 'Когда сделка переходит на следующий этап'],
  ['Просроченная задача', 'За час до дедлайна и после него'],
]

function SettingsPreview() {
  return (
    <div className="bg-muted/30 p-6">
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Настройки</h1>
          <p className="text-muted-foreground mt-1 text-sm">Профиль, уведомления и доступ.</p>
        </div>

        <Tabs defaultValue="profile">
          <TabsList>
            <TabsTrigger value="profile">Профиль</TabsTrigger>
            <TabsTrigger value="notifications">Уведомления</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Профиль организации</CardTitle>
                <CardDescription>Данные видны всем участникам.</CardDescription>
              </CardHeader>
              <CardContent>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="bs-org">Название</FieldLabel>
                    <Input id="bs-org" defaultValue="Cloudplus" />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="bs-about">Описание</FieldLabel>
                    <Textarea id="bs-about" rows={3} defaultValue="Внутренние системы и демо-стенды." />
                    <FieldDescription>До 200 символов.</FieldDescription>
                  </Field>
                </FieldGroup>
              </CardContent>
              <CardFooter className="gap-2 border-t">
                <Button>Сохранить</Button>
                <Button variant="ghost">Отмена</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Уведомления</CardTitle>
                <CardDescription>Что присылать на почту.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {NOTIFY.map(([title, hint], i) => (
                  <div key={title} className="flex items-start gap-3">
                    <Checkbox id={`bs-n${i}`} defaultChecked={i < 2} className="mt-0.5" />
                    <div className="grid gap-0.5">
                      <Label htmlFor={`bs-n${i}`}>{title}</Label>
                      <span className="text-muted-foreground text-sm">{hint}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

/* ── 5. Карточка сущности ───────────────────────────────────── */

const ENTITY_CODE = `import { Avatar, AvatarFallback, Badge, Button, Card, CardAction, CardContent,
  CardDescription, CardHeader, CardTitle, DropdownMenu, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
  Separator } from '@cloudplus/ui'
import { Building2, MoreHorizontal, Trash2 } from 'lucide-react'

export function CompanyCard({ company }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Avatar className="size-10">
            <AvatarFallback><Building2 className="size-4" /></AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{company.name}</CardTitle>
            <CardDescription>{company.city} · {company.industry}</CardDescription>
          </div>
        </div>
        <CardAction>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Ещё"><MoreHorizontal /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Действия</DropdownMenuLabel>
              <DropdownMenuItem>Редактировать</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive"><Trash2 />Удалить</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardAction>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2">
        {fields.map((f) => (
          <div key={f.label}>
            <div className="text-muted-foreground text-xs">{f.label}</div>
            <div className="mt-0.5 text-sm font-medium">{f.value}</div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}`

const FIELDS = [
  ['ИНН', '7712345678'],
  ['Ответственный', 'А. Иванов'],
  ['Открытых сделок', '3'],
  ['Оборот за год', '24,8 млн ₽'],
]

function EntityPreview() {
  return (
    <div className="bg-muted/30 p-6">
      <Card className="mx-auto max-w-xl">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Avatar className="size-10">
              <AvatarFallback><Building2 className="size-4" /></AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>ООО «Ромашка»</CardTitle>
              <CardDescription>Москва · Оптовая торговля</CardDescription>
            </div>
          </div>
          <CardAction>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Ещё"><MoreHorizontal /></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Действия</DropdownMenuLabel>
                <DropdownMenuItem>Редактировать</DropdownMenuItem>
                <DropdownMenuItem>Создать сделку</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive"><Trash2 />Удалить</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardAction>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">Клиент</Badge>
            <Badge variant="outline">VIP</Badge>
            <Badge variant="outline" className="border-transparent bg-[var(--success-soft)] text-[var(--success-soft-fg)]">
              Оплаты вовремя
            </Badge>
          </div>
          <Separator />
          <div className="grid gap-4 sm:grid-cols-2">
            {FIELDS.map(([label, value]) => (
              <div key={label}>
                <div className="text-muted-foreground text-xs">{label}</div>
                <div className="mt-0.5 text-sm font-medium">{value}</div>
              </div>
            ))}
          </div>
        </CardContent>

        <CardFooter className="gap-2 border-t">
          <Button size="sm">Открыть сделки</Button>
          <Button size="sm" variant="outline">Написать</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

/* ── 6. Пустое состояние ────────────────────────────────────── */

const EMPTY_CODE = `import { Button, Empty, EmptyContent, EmptyDescription,
  EmptyHeader, EmptyMedia, EmptyTitle } from '@cloudplus/ui'
import { Inbox, Plus } from 'lucide-react'

export function NoDeals({ onCreate }: { onCreate: () => void }) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon"><Inbox /></EmptyMedia>
        <EmptyTitle>Сделок пока нет</EmptyTitle>
        <EmptyDescription>
          Создайте первую сделку — она появится в воронке и в отчётах.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button onClick={onCreate}><Plus />Создать сделку</Button>
      </EmptyContent>
    </Empty>
  )
}`

function EmptyPreview() {
  return (
    <div className="p-10">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon"><Inbox /></EmptyMedia>
          <EmptyTitle>Сделок пока нет</EmptyTitle>
          <EmptyDescription>Создайте первую сделку — она появится в воронке и в отчётах.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button><Plus />Создать сделку</Button>
        </EmptyContent>
      </Empty>
    </div>
  )
}

/* ── Страница ───────────────────────────────────────────────── */

export function Blocks() {
  return (
    <div className="space-y-12">
      <Block
        id="vhod"
        title="Страница входа"
        description="Карточка по центру экрана, поля через Field, альтернативный способ входа под разделителем."
        code={LOGIN_CODE}
      >
        <LoginPreview />
      </Block>

      <Block
        id="dashboard"
        title="Дашборд"
        description="Показатели в сетке плюс воронка на Progress. StatCard берёт знак delta и сам красит стрелку."
        code={DASHBOARD_CODE}
      >
        <DashboardPreview />
      </Block>

      <Block
        id="spisok"
        title="Страница со списком"
        description="Поиск, выбор строк с панелью массовых действий, сортировка и пустое состояние. Обратите внимание: DataGrid не сортирует сам — данные готовит страница."
        code={LIST_CODE}
      >
        <ListPreview />
      </Block>

      <Block
        id="nastroyki-blok"
        title="Настройки"
        description="Разделы вкладками, форма в карточке, действия в подвале с верхней границей."
        code={SETTINGS_CODE}
      >
        <SettingsPreview />
      </Block>

      <Block
        id="kartochka"
        title="Карточка сущности"
        description="Шапка с аватаром и меню действий, статусы, поля в две колонки."
        code={ENTITY_CODE}
      >
        <EntityPreview />
      </Block>

      <Block
        id="pusto"
        title="Пустое состояние"
        description="Всегда с понятным следующим действием — не просто «данных нет»."
        code={EMPTY_CODE}
      >
        <EmptyPreview />
      </Block>
    </div>
  )
}
