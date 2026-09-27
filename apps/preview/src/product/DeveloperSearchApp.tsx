import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Avatar, AvatarFallback, Badge, Button, Input,
  Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle,
  Tooltip, TooltipContent, TooltipTrigger,
} from '@cloudplus/ui'
import {
  ArrowRight, BarChart3, Bookmark, Check,
  ChevronDown, CircleHelp, Command, ExternalLink, Filter,
  MapPin, MessageSquare, Search, SlidersHorizontal,
  Users, X,
} from 'lucide-react'
import { BrandLogo } from './BrandLogo'
import './developer-search.css'

type Candidate = {
  id: number
  initials: string
  name: string
  role: string
  level: string
  city: string
  mode: string
  experience: string
  focus: string
  salary: string
  skills: string[]
  status: string
  statusTone: 'green' | 'amber'
  source: string
  sourceUrl: string
  color: string
  bio: string
  company: string
  companyRole: string
  period: string
  contributions: number
  match: number
  verified?: boolean
  contact: string
  contactType: 'Telegram' | 'Телефон' | 'Email' | 'Соцсеть'
}

// UI adapter target for tools/contact-crawler output. The static candidates below are
// explicitly presentation fixtures; production must populate this shape from a crawl result.
export type DiscoveredContact = {
  type: 'email' | 'phone' | 'telegram' | 'social'
  value: string
  normalized: string
  sourceUrl: string
  discoveryChain: string[]
  profileUrl?: string
}

const candidates: Candidate[] = [
  {
    id: 1, initials: 'АМ', name: 'Алишер Мирзаев', role: 'Frontend-разработчик', level: 'Senior', city: 'Ташкент', mode: 'Удаленно',
    experience: '7 лет опыта', focus: 'Финтех и дизайн-системы', salary: 'от 32 000 000 сум', skills: ['React', 'TypeScript', 'Next.js'],
    status: 'Открыт к предложениям', statusTone: 'green', source: 'Talent Park', sourceUrl: 'https://t.me/talent_park_bot', contact: '@alisher_frontend', contactType: 'Telegram', color: '#d9e7df', verified: true,
    bio: 'Создаю быстрые интерфейсы и дизайн-системы. Люблю сложные продуктовые задачи и понятный код.', company: 'Uzum', companyRole: 'Senior Frontend', period: '2021 – сейчас', contributions: 842, match: 96,
  },
  {
    id: 2, initials: 'МВ', name: 'Малика Валиева', role: 'Fullstack-разработчик', level: 'Senior', city: 'Ташкент', mode: 'Гибрид',
    experience: '6 лет опыта', focus: 'B2B-продукты и платежные сервисы', salary: 'от 35 000 000 сум', skills: ['React', 'Node.js', 'PostgreSQL'],
    status: 'Готова к интервью', statusTone: 'green', source: 'Talent Park', sourceUrl: 'https://t.me/talent_park_bot', contact: '+998 90 123 45 67', contactType: 'Телефон', color: '#eadfd8', verified: true,
    bio: 'Веду продукты от архитектуры до запуска. Сильна в сложной бизнес-логике и надежных интеграциях.', company: 'Click', companyRole: 'Lead Fullstack', period: '2022 – сейчас', contributions: 614, match: 93,
  },
  {
    id: 3, initials: 'ДК', name: 'Данияр Каримов', role: 'Backend-разработчик', level: 'Senior', city: 'Самарканд', mode: 'Удаленно',
    experience: '8 лет опыта', focus: 'Высоконагруженные сервисы', salary: 'от 38 000 000 сум', skills: ['Python', 'Django', 'PostgreSQL'],
    status: 'Рассматривает предложения', statusTone: 'amber', source: 'IT Market', sourceUrl: 'https://it-market.uz', contact: 'daniyar.dev@mail.uz', contactType: 'Email', color: '#dce6ee', verified: true,
    bio: 'Проектирую надежные платформы для больших команд. Фокус на производительности и качестве разработки.', company: 'EPAM', companyRole: 'Senior Backend', period: '2020 – сейчас', contributions: 1036, match: 89,
  },
  {
    id: 4, initials: 'АС', name: 'Азиза Саидова', role: 'Mobile-разработчик', level: 'Middle+', city: 'Ташкент', mode: 'В офисе',
    experience: '4 года опыта', focus: 'Мобильный банкинг и e-commerce', salary: 'от 24 000 000 сум', skills: ['Flutter', 'Dart', 'Firebase'],
    status: 'Готова к интервью', statusTone: 'green', source: '@ITresume_Uzbekistan', sourceUrl: 'https://t.me/ITresume_Uzbekistan', contact: '@aziza_flutter', contactType: 'Telegram', color: '#e7dfec', verified: true,
    bio: 'Собираю доступные мобильные продукты и аккуратно работаю с дизайн-системами.', company: 'TBC Uzbekistan', companyRole: 'Mobile Developer', period: '2023 – сейчас', contributions: 437, match: 87,
  },
]

const filters = [
  { label: 'Специализация', value: 'Frontend' },
  { label: 'Стек', value: 'React' },
  { label: 'Опыт', value: 'Senior' },
  { label: 'Локация', value: 'Ташкент' },
  { label: 'Статус поиска', value: 'Готова к интервью' },
]
const activeFilters: string[] = []

function Verified() {
  return <span className="verified" aria-label="Профиль проверен"><Check size={10} strokeWidth={3} /></span>
}

function RailButton({ icon, label, active, dot, count, onClick }: { icon: React.ReactNode; label: string; active?: boolean; dot?: boolean; count?: number; onClick?: () => void }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button className={`rail-button ${active ? 'is-active' : ''}`} aria-label={label} onClick={onClick}>
          {icon}{dot && <span className="notification-dot" />}{Boolean(count) && <span className="rail-count">{count}</span>}
        </button>
      </TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  )
}

function CandidateRow({ candidate, selected, saved, onSelect, onSave }: {
  candidate: Candidate; selected: boolean; saved: boolean; onSelect: () => void; onSave: () => void
}) {
  return (
    <article
      className={`candidate-row ${selected ? 'is-selected' : ''}`}
      onClick={onSelect}
      tabIndex={0}
      onKeyDown={(event) => { if (event.key === 'Enter') onSelect() }}
    >
      <div className="candidate-person">
        <Avatar className="candidate-avatar" style={{ background: candidate.color }}>
          <AvatarFallback style={{ background: candidate.color }}>{candidate.initials}</AvatarFallback>
        </Avatar>
        <div className="candidate-main">
          <div className="candidate-name-line"><strong>{candidate.name}</strong>{candidate.verified && <Verified />}</div>
          <div className="candidate-role">{candidate.role} · {candidate.level}</div>
          <div className="candidate-location"><MapPin size={12} /> {candidate.city} · {candidate.mode}</div>
          <div className="contact-kind"><span>{candidate.contactType}</span>{candidate.contact}</div>
          <div className={`candidate-status ${candidate.statusTone}`}><span />{candidate.status}</div>
        </div>
      </div>
      <div className="candidate-fit">
        <div className="fit-summary"><span>{candidate.experience} · {candidate.focus}</span><strong>{candidate.match}% match</strong></div>
        <div className="skill-list">{candidate.skills.map((skill) => <Badge key={skill} className="skill-badge" variant="secondary">{skill}</Badge>)}</div>
      </div>
      <div className="candidate-compensation">
        <strong>{candidate.salary}</strong>
        <button
          className={`save-button ${saved ? 'is-saved' : ''}`}
          aria-label={saved ? 'Убрать из подборки' : 'Сохранить в подборку'}
          onClick={(event) => { event.stopPropagation(); onSave() }}
        ><Bookmark size={19} fill={saved ? 'currentColor' : 'none'} /></button>
        <a className="source-link" href={candidate.sourceUrl} target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()} aria-label={`Открыть оригинал на ${candidate.source}`}>Источник: {candidate.source} <ExternalLink size={11} /></a>
      </div>
    </article>
  )
}

function ContributionGrid({ value }: { value: number }) {
  return (
    <div className="contribution-grid" aria-label={`${value} вкладов за последний год`}>
      {Array.from({ length: 105 }, (_, index) => {
        const level = ((index * 7 + index % 9 + Math.floor(index / 15)) % 5)
        return <span key={index} data-level={level} />
      })}
    </div>
  )
}

const hiringStages = ['Новый кандидат', 'Скрининг', 'Интервью', 'Оффер'] as const
type HiringStage = typeof hiringStages[number]

function ProfilePanel({ candidate, saved, invited, stage, onStageChange, onSave, onInvite, onClose }: { candidate: Candidate; saved: boolean; invited: boolean; stage: HiringStage; onStageChange: (stage: HiringStage) => void; onSave: () => void; onInvite: () => void; onClose?: () => void }) {
  return (
    <aside className="profile-panel">
      <div className="profile-kicker">Профиль разработчика</div>
      <p className="fixture-notice">Демонстрационный профиль — не результат живого поиска</p>
      {onClose && <button className="profile-close" onClick={onClose} aria-label="Закрыть"><X /></button>}
      <Avatar className="profile-avatar" style={{ background: candidate.color }}>
        <AvatarFallback style={{ background: candidate.color }}>{candidate.initials}</AvatarFallback>
      </Avatar>
      <div className="profile-title"><h2>{candidate.name}</h2>{candidate.verified && <Verified />}</div>
      <p className="profile-role">{candidate.level} {candidate.role}</p>
      <p className="profile-location">{candidate.city} · {candidate.mode}</p>
      <p className={`candidate-status ${candidate.statusTone}`}><span />{candidate.status}</p>

      <div className="profile-metrics">
        <div><strong>{candidate.experience.replace(' опыта', '')}</strong><small>опыт</small></div>
        <div><strong>{candidate.salary.replace('от ', '')}</strong><small>ожидания в месяц</small></div>
      </div>

      <section className="pipeline-section" aria-label="Этап найма">
        <div className="pipeline-heading"><h3>Этап найма</h3><span>{hiringStages.indexOf(stage) + 1} из {hiringStages.length}</span></div>
        <div className="pipeline-track">{hiringStages.map((item) => <button key={item} className={item === stage ? 'is-current' : hiringStages.indexOf(item) < hiringStages.indexOf(stage) ? 'is-complete' : ''} onClick={() => onStageChange(item)} aria-label={`Перевести на этап «${item}»`}><span />{item}</button>)}</div>
      </section>

      <section className="profile-section">
        <h3>О себе</h3><p>{candidate.bio}</p>
      </section>
      <section className="profile-section experience-section">
        <h3>Последний опыт</h3>
        <div className="company-mark">{candidate.company.slice(0, 1)}</div>
        <div><strong>{candidate.company}</strong><p>{candidate.companyRole} · {candidate.period}</p><p>Развивал продуктовые интерфейсы и библиотеку компонентов.</p></div>
      </section>
      <section className="profile-section github-section">
        <div className="section-heading"><h3>Активность GitHub</h3><small>{candidate.contributions} вкладов за последний год</small></div>
        <ContributionGrid value={candidate.contributions} />
        <div className="verification-line"><span><Check />Профиль подтвержден</span><span><Check />Опыт проверен</span></div>
        <div className="profile-contact"><strong>{candidate.contactType}</strong><span>{candidate.contact}</span></div>
        <a className="profile-source-link" href={candidate.sourceUrl} target="_blank" rel="noreferrer">Открыть объявление на {candidate.source} <ExternalLink size={13} /></a>
      </section>
      <div className="profile-actions">
        <Button size="lg" className={`invite-button ${invited ? 'is-invited' : ''}`} onClick={onInvite}>{invited ? <><Check /> Сообщение отправлено</> : <>Связаться с кандидатом <ArrowRight /></>}</Button>
        <Button variant="ghost" onClick={onSave}>{saved ? 'Сохранено в подборку' : 'Сохранить в подборку'}</Button>
      </div>
    </aside>
  )
}

export function DeveloperSearchApp() {
  const initialView = new URLSearchParams(window.location.search).get('view')
  const [query, setQuery] = useState(initialView === 'search' ? 'React' : '')
  const [selectedId, setSelectedId] = useState(initialView === 'profile' ? 3 : 1)
  const [saved, setSaved] = useState<number[]>(initialView === 'saved' ? [2, 4] : [])
  const [invited, setInvited] = useState<number[]>([])
  const [appliedFilters, setAppliedFilters] = useState(initialView === 'filters' ? ['React', 'Senior', 'Ташкент'] : activeFilters)
  const [mobileProfile, setMobileProfile] = useState(initialView === 'profile' && window.innerWidth < 1120)
  const [allFilters, setAllFilters] = useState(initialView === 'filters')
  const [savedOnly, setSavedOnly] = useState(initialView === 'saved')
  const [sortBy, setSortBy] = useState<'match' | 'name'>('match')
  const [stages, setStages] = useState<Record<number, HiringStage>>({})
  const searchRef = useRef<HTMLInputElement>(null)
  const selected = candidates.find((candidate) => candidate.id === selectedId) ?? candidates[0]
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    const found = q
      ? candidates.filter((candidate) => [candidate.name, candidate.role, candidate.city, candidate.contact, candidate.contactType, ...candidate.skills].join(' ').toLowerCase().includes(q))
      : candidates
    const filtered = appliedFilters.length
      ? found.filter((candidate) => {
          const haystack = [candidate.role, candidate.level, candidate.city, candidate.mode, candidate.status, candidate.experience, ...candidate.skills].join(' ').toLowerCase()
          return appliedFilters.every((filter) => haystack.includes(filter.toLowerCase()))
        })
      : found
    const scoped = savedOnly ? filtered.filter((candidate) => saved.includes(candidate.id)) : filtered
    return [...scoped].sort((a, b) => sortBy === 'match' ? b.match - a.match : a.name.localeCompare(b.name, 'ru'))
  }, [query, appliedFilters, saved, savedOnly, sortBy])

  useEffect(() => {
    const focusSearch = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        searchRef.current?.focus()
      }
    }
    window.addEventListener('keydown', focusSearch)
    return () => window.removeEventListener('keydown', focusSearch)
  }, [])

  const toggleSaved = (id: number) => setSaved((items) => items.includes(id) ? items.filter((item) => item !== id) : [...items, id])
  const toggleInvited = (id: number) => setInvited((items) => items.includes(id) ? items.filter((item) => item !== id) : [...items, id])
  const inviteCandidate = (id: number) => {
    toggleInvited(id)
    if (!invited.includes(id)) setStages((items) => ({ ...items, [id]: 'Интервью' }))
  }

  const chooseCandidate = (id: number) => {
    setSelectedId(id)
    if (window.innerWidth < 1120) setMobileProfile(true)
  }

  return (
    <div className="talent-app">
      <nav className="app-rail" aria-label="Основная навигация">
        <BrandLogo compact className="rail-logo" />
        <div className="rail-main">
          <RailButton label="Поиск" active icon={<Search />} />
          <RailButton label="Команда" icon={<Users />} />
          <RailButton label={`Подборка${saved.length ? `: ${saved.length}` : ''}`} active={savedOnly} count={saved.length} onClick={() => setSavedOnly((value) => !value)} icon={<Bookmark />} />
          <RailButton label="Сообщения" dot icon={<MessageSquare />} />
          <RailButton label="Аналитика" icon={<BarChart3 />} />
        </div>
        <div className="rail-bottom"><RailButton label="Помощь" icon={<CircleHelp />} /><div className="user-avatar">АН<span /></div></div>
      </nav>

      <main className="search-workspace">
        <header className="workspace-header">
          <div><BrandLogo className="mobile-brand" /><h1>Разработчики, открытые к работе</h1></div>
          <div className="workspace-path"><span>Команда</span><span>/</span><strong>Найм</strong></div>
        </header>

        <div className="search-box">
          <Search /><Input ref={searchRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Должность, стек, город или имя" aria-label="Поиск разработчиков" />
          <kbd><Command /> K</kbd>
        </div>

        <div className="filter-bar">
          {filters.map((filter) => <Button key={filter.label} variant="outline" aria-pressed={appliedFilters.includes(filter.value)} onClick={() => setAppliedFilters((items) => items.includes(filter.value) ? items.filter((item) => item !== filter.value) : [...items, filter.value])}>{filter.label}<ChevronDown /></Button>)}
          <Button variant="outline" onClick={() => setAllFilters(true)}><SlidersHorizontal />Все фильтры</Button>
        </div>
        <div className="active-filter-row">
          {appliedFilters.map((filter) => <Badge key={filter} className="active-filter" variant="secondary">{filter}<button aria-label={`Убрать фильтр ${filter}`} onClick={() => setAppliedFilters((items) => items.filter((item) => item !== filter))}><X /></button></Badge>)}
          {appliedFilters.length > 0 && <button onClick={() => setAppliedFilters([])}>Сбросить</button>}
        </div>

        <div className="results-heading">
          <h2>{savedOnly ? `В подборке ${visible.length}` : `Найдено ${query || appliedFilters.length ? visible.length : 248} разработчиков`}</h2>
          <div className="results-controls">
            {saved.length > 0 && <button className={savedOnly ? 'is-active' : ''} onClick={() => setSavedOnly((value) => !value)}><Bookmark />Подборка · {saved.length}</button>}
            <button onClick={() => setSortBy((value) => value === 'match' ? 'name' : 'match')}>{sortBy === 'match' ? 'По соответствию' : 'По имени'} <ChevronDown /></button>
          </div>
        </div>
        <section className="candidate-list" aria-live="polite">
          {visible.length ? visible.map((candidate) => (
            <CandidateRow
              key={candidate.id} candidate={candidate} selected={candidate.id === selectedId}
              saved={saved.includes(candidate.id)} onSelect={() => chooseCandidate(candidate.id)}
              onSave={() => toggleSaved(candidate.id)}
            />
          )) : <div className="empty-state"><Search /><h3>{savedOnly ? 'Подборка пока пуста' : 'Ничего не нашли'}</h3><p>{savedOnly ? 'Сохраняйте сильных кандидатов закладкой в выдаче.' : 'Попробуйте изменить запрос или сбросить фильтры.'}</p>{savedOnly && <Button variant="outline" onClick={() => setSavedOnly(false)}>Вернуться к поиску</Button>}</div>}
        </section>
        <footer className="results-footer"><span>Показано {visible.length} из {query || appliedFilters.length || savedOnly ? visible.length : 248}</span><div><button className="is-current">1</button><button>2</button><button>3</button><span>…</span><button>62</button><button><ArrowRight /></button></div></footer>
      </main>

      <div className="desktop-profile"><ProfilePanel candidate={selected} saved={saved.includes(selected.id)} invited={invited.includes(selected.id)} stage={stages[selected.id] ?? 'Новый кандидат'} onStageChange={(stage) => setStages((items) => ({ ...items, [selected.id]: stage }))} onSave={() => toggleSaved(selected.id)} onInvite={() => inviteCandidate(selected.id)} /></div>
      <Sheet open={mobileProfile} onOpenChange={setMobileProfile}>
        <SheetContent side="right" className="w-full overflow-y-auto p-0 sm:max-w-md"><SheetHeader className="sr-only"><SheetTitle>Профиль разработчика</SheetTitle><SheetDescription>Подробная информация о выбранном кандидате</SheetDescription></SheetHeader><ProfilePanel candidate={selected} saved={saved.includes(selected.id)} invited={invited.includes(selected.id)} stage={stages[selected.id] ?? 'Новый кандидат'} onStageChange={(stage) => setStages((items) => ({ ...items, [selected.id]: stage }))} onSave={() => toggleSaved(selected.id)} onInvite={() => inviteCandidate(selected.id)} onClose={() => setMobileProfile(false)} /></SheetContent>
      </Sheet>
      <Sheet open={allFilters} onOpenChange={setAllFilters}>
        <SheetContent side="right"><SheetHeader><SheetTitle>Все фильтры</SheetTitle><SheetDescription>Уточните критерии поиска кандидатов из всех источников</SheetDescription></SheetHeader><div className="extended-filters">{['Специализация', 'Стек и навыки', 'Опыт', 'Локация', 'Формат работы', 'Статус поиска', 'Зарплата', 'Источник'].map((item) => <button key={item}><span>{item}</span><ChevronDown /></button>)}<Button size="lg" onClick={() => setAllFilters(false)}><Filter />Показать 248 кандидатов</Button></div></SheetContent>
      </Sheet>
    </div>
  )
}
