import { useState } from 'react'
import {
  AppRail, AppRailItem, AppNav, AppNavGroup, AppNavItem,
  BarChart, ChecklistProgress, DataGrid, DonutChart, Fab, FilterChip, InlineEdit,
  KanbanBoard, KanbanCard, Leaderboard, MoneyInput, MultiSelect, NotificationItem, NotificationList, OrgChart,
  OverflowMenu, PageHeader, PhoneInput, Rating, SavedViews, SearchInput,
  SegmentedControl, Sparkline, StatCard, StatChips, Stepper, Tag, Timeline, TimelineItem,
  Toolbar, Tree, TreeItem,
} from '@cloudplus/ui'
import type { DataGridColumn, SortState } from '@cloudplus/ui'
import { Building2, Home, Plus, Settings, Trash2, Users } from 'lucide-react'
import { Demo } from './Demo'
import { ApiSection } from './PropsTable'

type Row = { id: string; company: string; owner: string; stage: string; sum: number }

const ROWS: Row[] = [
  { id: '1', company: 'ООО «Ромашка»', owner: 'Анна И.', stage: 'В работе', sum: 1240000 },
  { id: '2', company: 'АО «Вектор»', owner: 'Марк К.', stage: 'Новая', sum: 480000 },
  { id: '3', company: 'ИП Соколов', owner: 'Дарья П.', stage: 'Выиграна', sum: 95000 },
]

type Deal = { id: string; company: string; sum: string; stage: string }

const DEALS: Deal[] = [
  { id: '1', company: 'ООО «Ромашка»', sum: '1,24 млн ₽', stage: 'work' },
  { id: '2', company: 'АО «Вектор»', sum: '480 тыс ₽', stage: 'new' },
  { id: '3', company: 'ИП Соколов', sum: '95 тыс ₽', stage: 'won' },
]

export function CrmExtrasData() {
  const [sort, setSort] = useState<SortState>({ key: 'sum', dir: 'desc' })
  const [selected, setSelected] = useState<string[]>([])

  const columns: DataGridColumn<Row>[] = [
    { key: 'company', header: 'Компания', sortable: true },
    { key: 'owner', header: 'Ответственный' },
    { key: 'stage', header: 'Стадия', render: (r) => <Tag>{r.stage}</Tag> },
    {
      key: 'sum',
      header: 'Сумма',
      align: 'right',
      sortable: true,
      render: (r) => <span className="ui-mono">{r.sum.toLocaleString('ru-RU')} ₽</span>,
    },
  ]

  return (
    <div className="space-y-10">
      <Demo
        title="DataGrid"
        description="Сортировка, выбор строк, липкая шапка, состояния загрузки/пустоты/ошибки. Аналога в shadcn нет — там Table как разметка."
        block
        code={`const columns: DataGridColumn<Row>[] = [
  { key: 'company', header: 'Компания', sortable: true },
  { key: 'sum', header: 'Сумма', align: 'right', sortable: true,
    render: (r) => <span className="ui-mono">{r.sum} ₽</span> },
]

<DataGrid
  columns={columns}
  rows={rows}
  getRowId={(r) => r.id}
  sort={sort}
  onSortChange={setSort}
  selectable
  selectedIds={selected}
  onSelectionChange={setSelected}
/>`}
      >
        <DataGrid
          columns={columns}
          rows={ROWS}
          getRowId={(r) => r.id}
          sort={sort}
          onSortChange={setSort}
          selectable
          selectedIds={selected}
          onSelectionChange={setSelected}
        />
      </Demo>

      <Demo
        title="Toolbar, FilterChip, StatChips, SavedViews"
        description="Панель над таблицей: сохранённые виды, фильтры-пилюли и счётчики."
        block
        code={`<SavedViews views={[{ key: 'my', label: 'Мои' }]} value="my" onChange={…} />
<Toolbar>
  <SearchInput placeholder="Поиск…" />
  <FilterChip label="Стадия" value="В работе" />
</Toolbar>
<StatChips items={[{ key: 'all', label: 'Все', count: 128 }]} value="all" onChange={…} />`}
      >
        <div className="w-full space-y-3">
          <SavedViews
            views={[
              { key: 'my', label: 'Мои' },
              { key: 'attention', label: 'Требуют внимания' },
              { key: 'new', label: 'Новые' },
            ]}
            value="my"
            onChange={() => {}}
          />
          <Toolbar>
            <SearchInput placeholder="Поиск компании…" className="w-56" />
            <FilterChip label="Стадия" value="В работе" />
            <FilterChip label="Ответственный" value="Анна И." />
          </Toolbar>
          <StatChips
            items={[
              { key: 'all', label: 'Все', count: 128 },
              { key: 'work', label: 'В работе', count: 42 },
              { key: 'new', label: 'Новые', count: 17 },
            ]}
            value="all"
            onChange={() => {}}
          />
        </div>
      </Demo>

      <ApiSection of={['DataGrid', 'Toolbar', 'FilterChip', 'StatChips', 'SavedViews']} />
    </div>
  )
}

export function CrmExtrasAnalytics() {
  return (
    <div className="space-y-10">
      <Demo
        title="StatCard и Sparkline"
        block
        code={`<StatCard label="Выручка" value="4,2 млн ₽" delta={12.4} />
<Sparkline data={[4, 7, 5, 9, 8, 12, 11]} />`}
      >
        <div className="grid w-full grid-cols-2 gap-3 lg:grid-cols-3">
          <StatCard label="Выручка" value="4,2 млн ₽" delta={12.4} />
          <StatCard label="Сделок" value="128" delta={-3.1} />
          <StatCard label="Конверсия" value="18%" delta={0.8} />
        </div>
        <Sparkline data={[4, 7, 5, 9, 8, 12, 11, 14]} />
      </Demo>

      <Demo
        title="BarChart, DonutChart, Leaderboard"
        block
        code={`<BarChart data={[{ label: 'Янв', value: 42 }, …]} />
<DonutChart data={[{ label: 'Выиграно', value: 42 }, …]} />
<Leaderboard items={[{ name: 'Анна И.', value: '1,2 млн ₽' }, …]} />`}
      >
        <div className="grid w-full gap-6 lg:grid-cols-2">
          <BarChart
            data={[
              { label: 'Янв', value: 42 }, { label: 'Фев', value: 58 },
              { label: 'Мар', value: 35 }, { label: 'Апр', value: 71 },
            ]}
          />
          <DonutChart
            data={[
              { label: 'Выиграно', value: 42 },
              { label: 'В работе', value: 31 },
              { label: 'Проиграно', value: 12 },
            ]}
          />
        </div>
        <Leaderboard
          items={[
            { name: 'Анна Иванова', value: '1,24 млн ₽' },
            { name: 'Марк Ковалёв', value: '0,86 млн ₽' },
            { name: 'Дарья Петрова', value: '0,54 млн ₽' },
          ]}
        />
      </Demo>

      <Demo
        title="ChecklistProgress, Stepper, Timeline"
        block
        code={`<ChecklistProgress items={[{ label: 'ИНН', done: true }, { label: 'Адрес', done: false }]} />
<Stepper steps={[{ label: 'Заявка' }, { label: 'Договор' }]} current={1} />
<Timeline><TimelineItem title="Звонок" time="10:24" /></Timeline>`}
      >
        <div className="grid w-full gap-6">
          <ChecklistProgress
            title="Заполнение карточки"
            items={[
              { label: 'Название', done: true },
              { label: 'ИНН', done: true },
              { label: 'Юридический адрес', done: false },
              { label: 'Контактное лицо', done: false },
            ]}
          />
          <Stepper steps={[{ label: 'Заявка' }, { label: 'Согласование' }, { label: 'Договор' }, { label: 'Оплата' }]} current={1} />
          <Timeline>
            <TimelineItem title="Входящий звонок" time="10:24">Обсудили условия</TimelineItem>
            <TimelineItem title="Отправлено КП" time="11:02" />
            <TimelineItem title="Назначена встреча" time="14:30" />
          </Timeline>
        </div>
      </Demo>

      <ApiSection
        of={['StatCard', 'Sparkline', 'BarChart', 'DonutChart', 'Leaderboard', 'ChecklistProgress', 'Stepper', 'Timeline', 'TimelineItem']}
      />
    </div>
  )
}

export function CrmExtrasBoard() {
  return (
    <div className="space-y-10">
      <Demo
        title="KanbanBoard"
        description="Доска сделок со счётчиками в колонках."
        block
        code={`<KanbanBoard
  columns={[{ id: 'new', title: 'Новые' }, { id: 'work', title: 'В работе' }]}
  cards={deals}
  getCardId={(d) => d.id}
  getColumnId={(d) => d.stage}
  renderCard={(d) => (
    <KanbanCard>
      <div className="font-medium">{d.company}</div>
      <div className="text-muted-foreground text-sm">{d.sum}</div>
    </KanbanCard>
  )}
/>`}
      >
        <KanbanBoard
          columns={[
            { id: 'new', title: 'Новые' },
            { id: 'work', title: 'В работе', accent: 'info' },
            { id: 'won', title: 'Выиграно', accent: 'success' },
          ]}
          cards={DEALS}
          getCardId={(d) => d.id}
          getColumnId={(d) => d.stage}
          renderCard={(d) => (
            <KanbanCard>
              <div className="font-medium">{d.company}</div>
              <div className="text-muted-foreground text-sm">{d.sum}</div>
            </KanbanCard>
          )}
        />
      </Demo>

      <Demo
        title="OrgChart и Tree"
        block
        code={`<OrgChart root={{ name: 'Директор', children: [...] }} />
<Tree><TreeItem label="Документы" /></Tree>`}
      >
        <div className="grid w-full gap-6 lg:grid-cols-2">
          <OrgChart
            root={{
              id: 'root',
              name: 'Иванов И.',
              role: 'Директор',
              children: [
                { id: 'sales', name: 'Анна И.', role: 'Продажи' },
                { id: 'dev', name: 'Марк К.', role: 'Разработка' },
              ],
            }}
          />
          <Tree>
            <TreeItem label="Документы" defaultExpanded>
              <TreeItem label="Договоры" />
              <TreeItem label="Счета" />
            </TreeItem>
            <TreeItem label="Отчёты" />
          </Tree>
        </div>
      </Demo>

      <ApiSection of={['KanbanBoard', 'KanbanCard', 'OrgChart', 'Tree', 'TreeItem']} />
    </div>
  )
}

export function CrmExtrasInputs() {
  const [multi, setMulti] = useState<string[]>(['a'])
  const [seg, setSeg] = useState('list')
  const [phone, setPhone] = useState('')
  const [sum, setSum] = useState('')
  const [name, setName] = useState('ООО «Ромашка»')

  return (
    <div className="space-y-10">
      <Demo
        title="Специальные поля ввода"
        description="Телефон с маской, деньги с разрядами, редактирование по клику."
        block
        code={`<PhoneInput value={phone} onChange={setPhone} />
<MoneyInput value={sum} onChange={setSum} currency="₽" />
<InlineEdit value={name} onSave={setName} />`}
      >
        <div className="grid max-w-sm gap-3">
          <PhoneInput value={phone} onChange={setPhone} />
          <MoneyInput value={sum} onChange={setSum} currency="₽" />
          <InlineEdit value={name} onSave={setName} />
          <SearchInput placeholder="Поиск…" />
        </div>
      </Demo>

      <Demo
        title="MultiSelect, SegmentedControl, Rating"
        block
        code={`<MultiSelect options={opts} value={value} onValueChange={setValue} />
<SegmentedControl options={[{ value: 'list', label: 'Список' }]} value={v} onValueChange={setV} />
<Rating value={4} />`}
      >
        <div className="grid max-w-sm gap-3">
          <MultiSelect
            options={[
              { value: 'a', label: 'Москва' },
              { value: 'b', label: 'Санкт-Петербург' },
              { value: 'c', label: 'Казань' },
            ]}
            value={multi}
            onValueChange={setMulti}
          />
          <SegmentedControl
            options={[
              { value: 'list', label: 'Список' },
              { value: 'board', label: 'Доска' },
            ]}
            value={seg}
            onValueChange={setSeg}
          />
          <Rating value={4} />
        </div>
      </Demo>

      <ApiSection
        of={['PhoneInput', 'MoneyInput', 'InlineEdit', 'MultiSelect', 'Combobox', 'SegmentedControl', 'Rating', 'SearchInput', 'PasswordInput']}
      />
    </div>
  )
}

export function CrmExtrasShell() {
  return (
    <div className="space-y-10">
      <Demo
        title="AppRail и AppNav"
        description="Тёмный icon-rail плюс светлая вторичная колонка. У shadcn свой Sidebar — это отдельный, более плотный паттерн CRM."
        block
        code={`<AppRail>
  <AppRailItem icon={<Home />} label="Главная" active />
  <AppRailItem icon={<Building2 />} label="Компании" />
</AppRail>

<AppNav header="Компании">
  <AppNavGroup label="Виды">
    <AppNavItem label="Все" count={128} active />
  </AppNavGroup>
</AppNav>`}
      >
        <div className="flex h-72 w-full overflow-hidden rounded-lg border">
          <AppRail>
            <AppRailItem icon={<Home size={18} />} label="Главная" active />
            <AppRailItem icon={<Building2 size={18} />} label="Компании" />
            <AppRailItem icon={<Users size={18} />} label="Контакты" />
            <AppRailItem icon={<Settings size={18} />} label="Настройки" />
          </AppRail>
          <AppNav header="Компании">
            <AppNavGroup label="Виды">
              <AppNavItem label="Все" count={128} active />
              <AppNavItem label="Мои" count={42} />
              <AppNavItem label="Новые" count={17} />
            </AppNavGroup>
          </AppNav>
        </div>
      </Demo>

      <Demo
        title="PageHeader и OverflowMenu"
        block
        code={`<PageHeader title="ООО «Ромашка»" subtitle="Клиент · Москва" badges={<Tag>Клиент</Tag>}>
  <OverflowMenu items={[{ label: 'Удалить', variant: 'destructive' }]} />
</PageHeader>`}
      >
        <div className="w-full">
          <PageHeader
            title="ООО «Ромашка»"
            subtitle="Клиент · Москва"
            badges={<Tag>Клиент</Tag>}
          >
            <OverflowMenu
              items={[
                { label: 'Редактировать' },
                { label: 'Дублировать' },
                { label: 'Удалить', variant: 'destructive', icon: <Trash2 size={14} />, separatorBefore: true },
              ]}
            />
          </PageHeader>
        </div>
      </Demo>

      <Demo
        title="NotificationList и Fab"
        block
        code={`<NotificationList>
  <NotificationItem title="Новая заявка" description="ООО «Ромашка»" time="2 мин" unread />
</NotificationList>

<Fab icon={<Plus />} label="Создать" />`}
      >
        <div className="grid w-full gap-6 lg:grid-cols-2">
          <NotificationList>
            <NotificationItem title="Новая заявка" description="ООО «Ромашка»" time="2 мин" unread />
            <NotificationItem
              title="Задача просрочена"
              description="Перезвонить клиенту"
              time="1 ч"
              variant="warning"
            />
          </NotificationList>
          <div className="relative h-32 rounded-lg border">
            <Fab icon={<Plus size={18} />} label="Создать" />
          </div>
        </div>
      </Demo>

      <ApiSection
        of={['AppRail', 'AppRailItem', 'AppNav', 'AppNavGroup', 'AppNavItem', 'AppNavCollapse', 'PageHeader', 'OverflowMenu', 'NotificationList', 'NotificationItem', 'Fab']}
      />
    </div>
  )
}
