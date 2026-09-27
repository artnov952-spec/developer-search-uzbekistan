import { useMemo, useState } from 'react'
import {
  LayoutGrid, Building2, MessageSquare, Calendar, BarChart3, Boxes, Settings,
  Users, Target, Columns3, Layers, GitBranch, BookOpen, ScrollText, Clock, Users2,
  Plus, Download, Trash2, SlidersHorizontal, Phone,
} from 'lucide-react'
import {
  AppRail, AppRailItem, AppNav, AppNavGroup, AppNavItem,
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator, SearchInput, Button, Input, DataGrid, Badge, Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious,
} from '@cloudplus/ui'
import { PersonAvatar, SimpleSelect } from './kit-helpers'
import type { DataGridColumn, SortState } from '@cloudplus/ui'
import {
  companies, companyStatusLabel, companyStatusVariant, companyOwners, totalCompanies,
} from './companiesData'
import type { Company, CompanyStatus } from './companiesData'

const railItems = [
  { icon: <LayoutGrid size={19} />, label: 'Обзор', id: 'home' },
  { icon: <Building2 size={19} />, label: 'CRM', id: 'crm' },
  { icon: <MessageSquare size={19} />, label: 'Коммуникации', id: 'comms' },
  { icon: <Calendar size={19} />, label: 'Календарь', id: 'cal' },
  { icon: <BarChart3 size={19} />, label: 'Аналитика', id: 'stats' },
  { icon: <Boxes size={19} />, label: 'Митос', id: 'mitos' },
]

function faintContact(v: string): boolean {
  return v === 'Контактов нет' || v === 'Без ФИО'
}

export function Companies() {
  const [rail, setRail] = useState('crm')
  const [nav, setNav] = useState('companies')
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')
  const [type, setType] = useState('all')
  const [owner, setOwner] = useState('all')
  const [contactQ, setContactQ] = useState('')
  const [selected, setSelected] = useState<string[]>([])
  const [sort, setSort] = useState<SortState>({ key: 'created', dir: 'desc' })
  const [page, setPage] = useState(1)

  const counts = useMemo(() => {
    const by: Record<CompanyStatus, number> = { active: 0, 'no-contact': 0, inactive: 0 }
    for (const c of companies) by[c.status]++
    return by
  }, [])

  const rows = useMemo(() => {
    let r = companies.slice()
    if (query.trim()) {
      const q = query.toLowerCase()
      r = r.filter((c) => c.name.toLowerCase().includes(q) || c.contact.toLowerCase().includes(q))
    }
    if (status !== 'all') r = r.filter((c) => c.status === status)
    if (owner !== 'all') r = r.filter((c) => c.owner === owner)
    if (contactQ.trim()) r = r.filter((c) => c.contact.toLowerCase().includes(contactQ.toLowerCase()))
    r.sort((a, b) => {
      const dir = sort.dir === 'asc' ? 1 : -1
      if (sort.key === 'name') return a.name.localeCompare(b.name) * dir
      return (a.createdDays - b.createdDays) * dir
    })
    return r
  }, [query, status, owner, contactQ, sort])

  const columns: DataGridColumn<Company>[] = [
    {
      key: 'name', header: 'Компания', sortable: true,
      render: (c) => (
        <div className="cx-cell-company">
          <PersonAvatar name={c.name.replace(/^(ООО|ИП ООО|ИП)\s+"?/, '').replace(/"$/, '')} size="sm" shape="square" />
          <span className="cx-cell-company__name">{c.name}</span>
        </div>
      ),
    },
    {
      key: 'status', header: 'Состояние',
      render: (c) => <Badge variant={companyStatusVariant[c.status]}>{companyStatusLabel[c.status]}</Badge>,
    },
    {
      key: 'owner', header: 'Ответственный',
      render: (c) => (c.owner ? (
        <div className="cx-cell-owner"><PersonAvatar name={c.owner} size="xs" /><span>{c.owner}</span></div>
      ) : <span className="cx-muted">—</span>),
    },
    {
      key: 'contact', header: 'Контакты',
      render: (c) => <span className={faintContact(c.contact) ? 'cx-muted' : 'cx-strong'}>{c.contact}</span>,
    },
    {
      key: 'created', header: 'Создана', align: 'right', sortable: true,
      render: (c) => <span className="cx-muted">{12 - c.createdDays} авг.</span>,
    },
  ]

  return (
    <div className="cx">
      <AppRail
        top={<div className="cx-rail__logo">A</div>}
        bottom={<>
          <AppRailItem icon={<Settings size={19} />} label="Настройки" />
          <div className="cx-rail__avatar"><PersonAvatar name="Тагир Солиев" size="sm" /></div>
        </>}
      >
        {railItems.map((r) => (
          <AppRailItem key={r.id} icon={r.icon} label={r.label} active={rail === r.id} onClick={() => setRail(r.id)} />
        ))}
      </AppRail>

      <AppNav
        header={<div className="cx-ws"><span className="cx-ws__mark">A</span><div><div className="cx-ws__name">Cloudplus CRM</div><div className="cx-ws__sub">Отдел продаж</div></div></div>}
      >
        <AppNavGroup label="CRM" action={<Plus size={13} />}>
          <AppNavItem icon={<Building2 size={16} />} label="Компании" count={totalCompanies} active={nav === 'companies'} onClick={() => setNav('companies')} />
          <AppNavItem icon={<Users size={16} />} label="Контакты" count={3480} active={nav === 'contacts'} onClick={() => setNav('contacts')} />
          <AppNavItem icon={<Target size={16} />} label="Лиды" count={126} active={nav === 'leads'} onClick={() => setNav('leads')} />
          <AppNavItem icon={<Columns3 size={16} />} label="Доска" active={nav === 'board'} onClick={() => setNav('board')} />
        </AppNavGroup>
        <AppNavGroup label="Работа">
          <AppNavItem icon={<MessageSquare size={16} />} label="Коммуникации" count={12} active={nav === 'comms'} onClick={() => setNav('comms')} />
          <AppNavItem icon={<Boxes size={16} />} label="Митос" active={nav === 'mitos'} onClick={() => setNav('mitos')} />
          <AppNavItem icon={<Layers size={16} />} label="Логос" active={nav === 'logos'} onClick={() => setNav('logos')} />
          <AppNavItem icon={<GitBranch size={16} />} label="Структура" active={nav === 'struct'} onClick={() => setNav('struct')} />
          <AppNavItem icon={<Calendar size={16} />} label="Календарь" active={nav === 'cal'} onClick={() => setNav('cal')} />
        </AppNavGroup>
        <AppNavGroup label="Прочее">
          <AppNavItem icon={<BarChart3 size={16} />} label="Рейтинг продаж" active={nav === 'rating'} onClick={() => setNav('rating')} />
          <AppNavItem icon={<BookOpen size={16} />} label="База знаний" active={nav === 'kb'} onClick={() => setNav('kb')} />
          <AppNavItem icon={<ScrollText size={16} />} label="Журнал действий" active={nav === 'log'} onClick={() => setNav('log')} />
          <AppNavItem icon={<Clock size={16} />} label="Рабочее время" active={nav === 'time'} onClick={() => setNav('time')} />
          <AppNavItem icon={<Users2 size={16} />} label="HR" active={nav === 'hr'} onClick={() => setNav('hr')} />
        </AppNavGroup>
        <div className="cx-nav-foot">
          <span className="cx-nav-foot__dot" /> Телефония · <span className="cx-nav-foot__on">на связи</span>
        </div>
      </AppNav>

      <div className="cx-main">
        <header className="cx-head">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem><BreadcrumbLink href="#">CRM</BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbPage>Компании</BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="cx-head__actions">
            <Button variant="ghost" size="sm" aria-label="Выгрузить"><Download size={16} /></Button>
            <Button variant="outline" size="sm"><Trash2 size={14} />Корзина</Button>
            <Button variant="default" size="sm"><Plus size={14} />Новая компания</Button>
          </div>
        </header>

        <div className="cx-hero">
          <div className="cx-hero__title">
            <h1>Компании</h1>
            <span className="cx-hero__count">{totalCompanies.toLocaleString('ru-RU')} записей</span>
          </div>
          <div className="cx-hero__search">
            <SearchInput placeholder="Умный поиск по всей информации" value={query} onChange={(e) => setQuery(e.target.value)} onClear={() => setQuery('')} />
          </div>
        </div>

        <div className="cx-stats">
          <button className={`cx-stat${status === 'all' ? ' cx-stat--on' : ''}`} onClick={() => setStatus('all')}>
            <span className="cx-stat__n">{companies.length}</span><span className="cx-stat__l">Все</span>
          </button>
          <button className={`cx-stat${status === 'active' ? ' cx-stat--on' : ''}`} onClick={() => setStatus('active')}>
            <span className="cx-stat__n"><i className="cx-dot cx-dot--success" />{counts.active}</span><span className="cx-stat__l">В работе</span>
          </button>
          <button className={`cx-stat${status === 'no-contact' ? ' cx-stat--on' : ''}`} onClick={() => setStatus('no-contact')}>
            <span className="cx-stat__n"><i className="cx-dot cx-dot--warning" />{counts['no-contact']}</span><span className="cx-stat__l">Контакта не было</span>
          </button>
          <button className={`cx-stat${status === 'inactive' ? ' cx-stat--on' : ''}`} onClick={() => setStatus('inactive')}>
            <span className="cx-stat__n"><i className="cx-dot cx-dot--neutral" />{counts.inactive}</span><span className="cx-stat__l">Не в работе</span>
          </button>
        </div>

        <div className="cx-filters">
          <SimpleSelect size="sm" value={type} onValueChange={setType}
            options={[{ value: 'all', label: 'Все типы' }, { value: 'ooo', label: 'ООО' }, { value: 'ip', label: 'ИП' }]} />
          <SimpleSelect size="sm" value={owner} onValueChange={setOwner}
            options={[{ value: 'all', label: 'Все ответственные' }, ...companyOwners.map((o) => ({ value: o, label: o }))]} />
          <div className="cx-filters__contact">
            <Input placeholder="Контакт: ФИО, телефон, email" value={contactQ} onChange={(e) => setContactQ(e.target.value)} />
          </div>
          <Button variant="ghost" size="sm"><SlidersHorizontal size={14} />Ещё фильтры</Button>
          {(status !== 'all' || type !== 'all' || owner !== 'all' || contactQ) && (
            <Button variant="ghost" size="sm" onClick={() => { setStatus('all'); setType('all'); setOwner('all'); setContactQ('') }}>Сбросить</Button>
          )}
          <div className="cx-filters__spacer" />
          {selected.length > 0 && <span className="cx-sel">{selected.length} выбрано</span>}
        </div>

        <div className="cx-table">
          <DataGrid
            columns={columns}
            rows={rows}
            getRowId={(c) => c.id}
            selectable
            selectedIds={selected}
            onSelectionChange={setSelected}
            sort={sort}
            onSortChange={setSort}
            state={rows.length === 0 ? 'empty' : 'idle'}
            emptyContent="Компаний по фильтру не найдено"
          />
        </div>

        <footer className="cx-foot">
          <span className="cx-foot__count">Показаны {rows.length} из <b>{totalCompanies.toLocaleString('ru-RU')}</b></span>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" onClick={() => setPage((p) => Math.max(1, p - 1))} />
              </PaginationItem>
              <PaginationItem><PaginationLink href="#" isActive>{page}</PaginationLink></PaginationItem>
              <PaginationItem><PaginationEllipsis /></PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" onClick={() => setPage((p) => p + 1)} />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </footer>
      </div>

      <div className="cx-fab" aria-hidden><Phone size={18} /></div>
    </div>
  )
}
