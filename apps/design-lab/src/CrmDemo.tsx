import { useMemo, useState } from 'react'
import {
  Home, Users, BarChart3, Settings, Inbox, Building2,
  Plus, MoreHorizontal, Filter, Share2, ShieldCheck, Link2,
} from 'lucide-react'
import {
  AppRail, AppRailItem, AppNav, AppNavGroup, AppNavItem,
  DataGrid, Badge, Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount, initials, SearchInput, Button, Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage,
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose,
  PermissionRow, SegmentedControl, toast,
} from '@cloudplus/ui'
import { PersonAvatar, SimpleSelect } from './kit-helpers'
import type { DataGridColumn, SortState } from '@cloudplus/ui'
import { deals, stageLabels, stageVariant, owners, accessPeople, formatSum } from './mockData'
import type { Deal } from './mockData'

const relFmt = new Intl.DateTimeFormat('ru-RU', { day: '2-digit', month: 'short' })

export function CrmDemo() {
  const [rail, setRail] = useState('deals')
  const [nav, setNav] = useState('all')
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<string[]>([])
  const [sort, setSort] = useState<SortState>({ key: 'updated', dir: 'desc' })
  const [ownerFilter, setOwnerFilter] = useState('all')
  const [view, setView] = useState('table')
  const [accessOpen, setAccessOpen] = useState(false)
  const [people, setPeople] = useState(accessPeople)

  const rows = useMemo(() => {
    let r = deals.slice()
    if (query.trim()) {
      const q = query.toLowerCase()
      r = r.filter((d) => d.company.toLowerCase().includes(q) || d.contact.toLowerCase().includes(q))
    }
    if (ownerFilter !== 'all') r = r.filter((d) => d.owner === ownerFilter)
    r.sort((a, b) => {
      const dir = sort.dir === 'asc' ? 1 : -1
      const av = a[sort.key as keyof Deal]
      const bv = b[sort.key as keyof Deal]
      if (av < bv) return -1 * dir
      if (av > bv) return 1 * dir
      return 0
    })
    return r
  }, [query, ownerFilter, sort])

  const columns: DataGridColumn<Deal>[] = [
    { key: 'company', header: 'Компания', sortable: true, render: (d) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <PersonAvatar name={d.company} size="sm" shape="square" />
        <span style={{ fontWeight: 500 }}>{d.company}</span>
      </div>
    ) },
    { key: 'contact', header: 'Контакт', render: (d) => d.contact },
    { key: 'stage', header: 'Этап', sortable: true, render: (d) => (
      <Badge variant={stageVariant[d.stage]}>{stageLabels[d.stage]}</Badge>
    ) },
    { key: 'owner', header: 'Ответственный', render: (d) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <PersonAvatar name={d.owner} size="xs" />
        <span>{d.owner}</span>
      </div>
    ) },
    { key: 'amount', header: 'Сумма', align: 'right', sortable: true, render: (d) => (
      <span className="ui-mono">{formatSum(d.amount)}</span>
    ) },
    { key: 'updated', header: 'Обновлено', align: 'right', sortable: true, render: (d) => (
      <span style={{ color: 'var(--tx-muted)' }}>{relFmt.format(new Date(d.updated))}</span>
    ) },
  ]

  return (
    <div className="crm">
      <AppRail
        top={<div className="crm__logo">S</div>}
        bottom={<AppRailItem icon={<Settings size={19} />} label="Настройки" />}
      >
        <AppRailItem icon={<Home size={19} />} label="Обзор" active={rail === 'home'} onClick={() => setRail('home')} />
        <AppRailItem icon={<Building2 size={19} />} label="Сделки" active={rail === 'deals'} onClick={() => setRail('deals')} />
        <AppRailItem icon={<Users size={19} />} label="Клиенты" active={rail === 'clients'} onClick={() => setRail('clients')} />
        <AppRailItem icon={<Inbox size={19} />} label="Задачи" active={rail === 'tasks'} onClick={() => setRail('tasks')} />
        <AppRailItem icon={<BarChart3 size={19} />} label="Аналитика" active={rail === 'stats'} onClick={() => setRail('stats')} />
      </AppRail>

      <AppNav header={<div className="crm__workspace"><span className="crm__ws-mark">N</span><span>Cloudplus Sales</span></div>}>
        <AppNavGroup label="Воронка" action={<Plus size={14} />}>
          <AppNavItem label="Все сделки" count={deals.length} active={nav === 'all'} onClick={() => setNav('all')} />
          <AppNavItem label="Новые" count={3} depth={1} active={nav === 'new'} onClick={() => setNav('new')} />
          <AppNavItem label="Квалификация" count={3} depth={1} active={nav === 'q'} onClick={() => setNav('q')} />
          <AppNavItem label="Предложение" count={3} depth={1} active={nav === 'p'} onClick={() => setNav('p')} />
          <AppNavItem label="Выиграны" count={2} depth={1} active={nav === 'won'} onClick={() => setNav('won')} />
        </AppNavGroup>
        <AppNavGroup label="Виды">
          <AppNavItem label="Мои сделки" active={nav === 'mine'} onClick={() => setNav('mine')} />
          <AppNavItem label="Требуют внимания" count={4} active={nav === 'att'} onClick={() => setNav('att')} />
          <AppNavItem label="Архив" active={nav === 'arch'} onClick={() => setNav('arch')} />
        </AppNavGroup>
      </AppNav>

      <div className="crm__main">
        <div className="crm__topbar">
          <Breadcrumb><BreadcrumbList><BreadcrumbItem><BreadcrumbPage>CRM</BreadcrumbPage></BreadcrumbItem></BreadcrumbList></Breadcrumb>
          <div className="crm__topbar-actions">
            <AvatarGroup>
              {owners.slice(0, 4).map((o) => (
                <Avatar key={o} className="size-6"><AvatarFallback className="text-[10px]">{initials(o)}</AvatarFallback></Avatar>
              ))}
              {owners.length > 4 && <AvatarGroupCount>+{owners.length - 4}</AvatarGroupCount>}
            </AvatarGroup>
            <Button variant="outline" size="sm" onClick={() => setAccessOpen(true)}><Share2 size={14} />
              Доступ
            </Button>
          </div>
        </div>

        <div className="crm__toolbar">
          <SearchInput
            placeholder="Поиск по сделкам…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onClear={() => setQuery('')}
            style={{ width: 260 }}
          />
          <SimpleSelect
            options={[{ value: 'all', label: 'Все ответственные' }, ...owners.map((o) => ({ value: o, label: o }))]}
            value={ownerFilter}
            onValueChange={setOwnerFilter}
            size="sm"
          />
          <Button variant="ghost" size="sm"><Filter size={14} />Фильтры</Button>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
            <SegmentedControl
              size="compact"
              options={[{ value: 'table', label: 'Таблица' }, { value: 'board', label: 'Доска' }]}
              value={view}
              onValueChange={setView}
            />
            <Button variant="default" size="sm"
              onClick={() => toast.success('Сделка создана', { description: 'Черновик добавлен в воронку' })}><Plus size={14} />
              Новая сделка
            </Button>
          </div>
        </div>

        {selected.length > 0 && (
          <div className="crm__selbar">
            <span>{selected.length} выбрано</span>
            <Button variant="ghost" size="sm" onClick={() => setSelected([])}>Снять выбор</Button>
            <Button variant="ghost" size="sm"><MoreHorizontal size={14} />Действия</Button>
          </div>
        )}

        <div className="crm__content">
          <DataGrid
            columns={columns}
            rows={rows}
            getRowId={(d) => d.id}
            selectable
            selectedIds={selected}
            onSelectionChange={setSelected}
            sort={sort}
            onSortChange={setSort}
            state={rows.length === 0 ? 'empty' : 'idle'}
            emptyContent="Сделок не найдено — измените фильтр или запрос"
            onRowClick={(d) => toast(d.company, { description: stageLabels[d.stage] })}
          />
        </div>
      </div>

      <Dialog open={accessOpen} onOpenChange={setAccessOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Доступ к воронке</DialogTitle>
            <DialogDescription>Управляйте, кто видит и редактирует эти сделки.</DialogDescription>
          </DialogHeader>
          <div className="crm__invite">
            <SearchInput placeholder="Email или имя…" style={{ flex: 1 }} />
            <Button variant="default">Пригласить</Button>
          </div>
          <div className="crm__access-list">
            {people.map((p) => (
              <PermissionRow
                key={p.id}
                name={p.name}
                email={p.email}
                role={p.role}
                isOwner={p.isOwner}
                roleOptions={['Читатель', 'Редактор', 'Владелец']}
                onRoleChange={(r) => setPeople((prev) => prev.map((x) => (x.id === p.id ? { ...x, role: r } : x)))}
                onRemove={() => {
                  setPeople((prev) => prev.filter((x) => x.id !== p.id))
                  toast.warning('Доступ отозван', { description: p.name })
                }}
              />
            ))}
          </div>
          <div className="crm__access-foot">
            <span className="crm__access-link"><Link2 size={14} /> cloudplus.uz/pipe/k37x</span>
            <div style={{ display: 'flex', gap: 8 }}>
              <Button variant="ghost"
                onClick={() => toast('Ссылка скопирована')}><ShieldCheck size={14} />Копировать ссылку</Button>
              <DialogClose asChild><Button variant="secondary">Готово</Button></DialogClose>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
