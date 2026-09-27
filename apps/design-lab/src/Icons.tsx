import { useMemo, useState } from 'react'
import { ICONS, ICON_GROUPS, CpIcon } from './icons/index'
import './icons/icons.css'
import './icons.css'

/** Разделы боевого сайдбара CRM - показываем набор в реальном контексте. */
const SIDEBAR: { icon: string; label: string }[] = [
  { icon: 'crm', label: 'CRM' },
  { icon: 'logos', label: 'Логос' },
  { icon: 'mitos', label: 'Митос' },
  { icon: 'telegram', label: 'Telegram' },
  { icon: 'communications', label: 'Коммуникации' },
  { icon: 'calendar', label: 'Календарь' },
  { icon: 'database', label: 'Платная База 1С' },
  { icon: 'structure', label: 'Структура' },
  { icon: 'sales-rating', label: 'Рейтинг продаж' },
  { icon: 'knowledge', label: 'База знаний' },
  { icon: 'assistant', label: 'Помощник' },
  { icon: 'action-log', label: 'Журнал действий' },
  { icon: 'invoice', label: 'Выдача' },
  { icon: 'revenue', label: 'Расходы Codex' },
  { icon: 'employee', label: 'HR' },
  { icon: 'dev', label: 'DEV' },
]

const SIZES = [16, 20, 24, 32] as const

const PARAMS = new URLSearchParams(window.location.search)
const SHEET = PARAMS.get('sheet') === '1'

export function Icons() {
  const [q, setQ] = useState(PARAMS.get('q') || '')
  const [size, setSize] = useState<number>(Number(PARAMS.get('size')) || 24)
  const [duo, setDuo] = useState(true)
  const [copied, setCopied] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return ICONS
    return ICONS.filter(
      (i) =>
        i.name.includes(s) ||
        i.label.toLowerCase().includes(s) ||
        i.group.toLowerCase().includes(s) ||
        i.keywords.some((k) => k.includes(s)),
    )
  }, [q])

  const copy = (name: string) => {
    navigator.clipboard?.writeText(`<CpIcon name="${name}" />`)
    setCopied(name)
    setTimeout(() => setCopied((c) => (c === name ? null : c)), 1400)
  }

  return (
    <div className={`ic-root${duo ? ' ic-root--duo' : ''}`}>
      {!SHEET && (<>
      <header className="ic-hero">
        <div>
          <div className="ic-hero__kicker">Cloudplus Icons · v1</div>
          <h1 className="ic-hero__title">100 авторских иконок</h1>
          <p className="ic-hero__lead">
            Собственный набор под CRM. Не Lucide и не Feather: диагональная асимметрия радиусов,
            акцентная точка на смысловом центре, сетка 2px, углы только 0/45/90.
          </p>
        </div>
        <div className="ic-hero__specimen">
          <CpIcon name="deal" size={64} strokeWidth={1.4} />
          <CpIcon name="funnel" size={64} strokeWidth={1.4} />
          <CpIcon name="assistant" size={64} strokeWidth={1.4} />
          <CpIcon name="target" size={64} strokeWidth={1.4} />
        </div>
      </header>

      <section className="ic-anatomy">
        <div className="ic-anatomy__item">
          <div className="ic-anatomy__demo">
            <svg viewBox="0 0 24 24" width="88" height="88" className="ic-grid">
              <defs>
                <pattern id="g2" width="2" height="2" patternUnits="userSpaceOnUse">
                  <path d="M2 0H0v2" fill="none" stroke="currentColor" strokeWidth=".08" />
                </pattern>
              </defs>
              <rect width="24" height="24" fill="url(#g2)" opacity=".5" />
              <rect x="2" y="2" width="20" height="20" fill="none" stroke="currentColor" strokeWidth=".18" strokeDasharray="1 1" opacity=".6" />
              <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 4h9a2 2 0 0 1 2 2v9a5 5 0 0 1-5 5H6a2 2 0 0 1-2-2V9a5 5 0 0 1 5-5Z" />
              </g>
            </svg>
          </div>
          <div>
            <b>Радиус 5 / радиус 2 по диагонали</b>
            <span>Верхний-левый и нижний-правый углы скруглены сильно, два других - слабо. Форма
              совпадает с собой при повороте на 180° и не совпадает зеркально. Это и есть подпись набора.</span>
          </div>
        </div>
        <div className="ic-anatomy__item">
          <div className="ic-anatomy__demo">
            <CpIcon name="calendar" size={88} strokeWidth={1.6} />
          </div>
          <div>
            <b>Акцентная точка</b>
            <span>Не более одной залитой точки на иконку. Стоит там, где происходит действие -
              выбранный день, активная запись, фокус. Красится в цвет бренда отдельно от контура.</span>
          </div>
        </div>
        <div className="ic-anatomy__item">
          <div className="ic-anatomy__demo ic-anatomy__demo--row">
            <CpIcon name="company" size={16} />
            <CpIcon name="company" size={20} />
            <CpIcon name="company" size={24} />
            <CpIcon name="company" size={32} />
          </div>
          <div>
            <b>Четкость на 16px</b>
            <span>Узлы лежат на четной сетке, обводка ужимается под размер автоматически.
              В плотной таблице иконка не превращается в кашу.</span>
          </div>
        </div>
      </section>

      <section className="ic-context">
        <div className="ic-context__head">
          <h2>В боевом сайдбаре</h2>
          <span>тот же список разделов, что в CRM - слева наш набор</span>
        </div>
        <div className="ic-sidebar">
          <div className="ic-sidebar__brand">Cloudplus CRM</div>
          <div className="ic-sidebar__search">
            <CpIcon name="search" size={16} /> <span>Поиск...</span>
          </div>
          {SIDEBAR.map((s, i) => (
            <div key={s.label} className={`ic-sidebar__item${i === 6 ? ' is-active' : ''}`}>
              <CpIcon name={s.icon} size={20} />
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      </>)}
      {!SHEET && <div className="ic-toolbar">
        <div className="ic-search">
          <CpIcon name="search" size={16} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Поиск: сделка, воронка, звонок, экспорт..."
          />
          {q && (
            <button className="ic-search__clear" onClick={() => setQ('')} aria-label="Очистить">
              <CpIcon name="error" size={16} />
            </button>
          )}
        </div>
        <div className="ic-sizes">
          {SIZES.map((s) => (
            <button key={s} className="ic-size" aria-pressed={size === s} onClick={() => setSize(s)}>
              {s}
            </button>
          ))}
        </div>
        <button className="ic-size ic-duo" aria-pressed={duo} onClick={() => setDuo((v) => !v)}>
          Акцент
        </button>
        <div className="ic-count">{filtered.length} из {ICONS.length}</div>
      </div>}

      {ICON_GROUPS.map((g) => {
        const items = filtered.filter((i) => i.group === g)
        if (!items.length) return null
        return (
          <section key={g} className="ic-group">
            <h3 className="ic-group__title">
              {g} <span>{items.length}</span>
            </h3>
            <div className="ic-grid-list">
              {items.map((i) => (
                <button
                  key={i.name}
                  className={`ic-cell${copied === i.name ? ' is-copied' : ''}`}
                  onClick={() => copy(i.name)}
                  title={`${i.label} · ${i.name} - клик копирует тег`}
                >
                  <span className="ic-cell__art" style={{ height: size + 16 }}>
                    <CpIcon name={i.name} size={size} className={duo ? 'cp-icon--duo' : undefined} />
                  </span>
                  <span className="ic-cell__name">{copied === i.name ? 'скопировано' : i.name}</span>
                </button>
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
