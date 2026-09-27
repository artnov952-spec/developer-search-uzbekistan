import { useState } from 'react'
import {
  ExternalLink, Pencil, MessageSquarePlus, X,
  ChevronDown, Phone, Smartphone, Mail, Paperclip, Users, CheckCircle2, CalendarClock,
  PhoneCall, GripVertical, Settings2, Check,
  PhoneOutgoing, PhoneMissed, StickyNote, FileText, Send, RefreshCcw,
} from 'lucide-react'
import {
  Button, Badge, Textarea, Input, Field, FieldDescription, FieldLabel, DatePicker,
  SegmentedControl, MultiSelect, AiButton, OverflowMenu,
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose,
} from '@cloudplus/ui'
import { PersonAvatar, SimpleSelect } from './kit-helpers'

type Popup = null | 'call' | 'callback' | 'meeting' | 'plan'
type Group = 'sales' | 'req'

const members = [
  { value: 'saliev', label: 'Салиев Мухаммадойбек' },
  { value: 'artem', label: 'Логунов Артём' },
  { value: 'damirov', label: 'Дамиров Бехрузбек' },
  { value: 'sovet', label: 'Советбаева Сабина' },
]

const fieldLabels: Record<string, string> = {
  status: 'Статус', reason: 'Причина отказа', direction: 'Направление',
  stage1c: 'Этап (1С)', ndsType: '[1С] Тип НДС', inn: 'ИНН', site: 'Сайт',
}

/* Свёртываемая группа полей */
function GroupBox({ title, children, onDropEnd, over }: {
  title: string; children: React.ReactNode; onDropEnd?: () => void; over?: boolean
}) {
  const [open, setOpen] = useState(true)
  return (
    <div className={`cd-group${over ? ' cd-group--over' : ''}`}>
      <button type="button" className="cd-group__head" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <ChevronDown size={15} className={`cd-group__chev${open ? ' cd-group__chev--open' : ''}`} />
        {title}
      </button>
      {open && (
        <div className="cd-group__body" onDragOver={onDropEnd ? (e) => e.preventDefault() : undefined} onDrop={onDropEnd}>
          {children}
        </div>
      )}
    </div>
  )
}

const histFilters = ['Все', 'Звонки', 'Комментарии', 'Заметки', 'Файлы', 'Telegram', 'Дела']
const topTabs = ['Общие', 'Аналитика', 'История', 'Telegram', 'Проекты']

type Feed =
  | { kind: 'call'; dir: 'in' | 'out'; ok: boolean; dur?: string; author: string; time: string; note?: string }
  | { kind: 'comment'; author: string; time: string; text: string }
  | { kind: 'note'; author: string; time: string; text: string }
  | { kind: 'file'; author: string; time: string; name: string; size: string }
  | { kind: 'telegram'; author: string; time: string; text: string }
  | { kind: 'status'; time: string; text: string }

const feed: Feed[] = [
  { kind: 'call', dir: 'out', ok: true, dur: '2:14', author: 'Логунов Артём', time: 'сегодня, 10:42', note: 'Договорились о встрече 13 августа, интересует мультиюзер.' },
  { kind: 'comment', author: 'Советбаева Сабина', time: 'сегодня, 09:15', text: 'Клиент просил КП с НДС и разбивкой по филиалам.' },
  { kind: 'file', author: 'Дамиров Бехрузбек', time: 'вчера, 17:30', name: 'Договор_285.pdf', size: '240 КБ' },
  { kind: 'call', dir: 'in', ok: false, author: 'Входящий', time: 'вчера, 14:05' },
  { kind: 'telegram', author: 'Дилшод Рахимов', time: 'вчера, 11:20', text: 'Добрый день! Когда сможете подъехать?' },
  { kind: 'note', author: 'Логунов Артём', time: '11 авг', text: 'Важно: у клиента 3 филиала, нужен мультиюзер и раздельный учёт.' },
  { kind: 'status', time: '8 авг', text: 'Статус изменён: Новая → В работе' },
]

const filterMap: Record<string, Feed['kind'][]> = {
  Звонки: ['call'], Комментарии: ['comment'], Заметки: ['note'], Файлы: ['file'], Telegram: ['telegram'], Дела: ['status'],
}

export function CompanyCard() {
  const [tab, setTab] = useState('Общие')
  const [hist, setHist] = useState('Все')
  const [status, setStatus] = useState('work')
  const [reason, setReason] = useState('none')
  const [direction, setDirection] = useState('1c')
  const [stage1c, setStage1c] = useState('none')
  const [ndsType, setNdsType] = useState('none')
  const [comment, setComment] = useState('')

  // Раскладка полей (перетаскивание внутри и между группами)
  const [editLayout, setEditLayout] = useState(false)
  const [sales, setSales] = useState<string[]>(['status', 'reason', 'direction'])
  const [req, setReq] = useState<string[]>(['stage1c', 'ndsType', 'inn', 'site'])
  const [dragId, setDragId] = useState<string | null>(null)
  const [overGroup, setOverGroup] = useState<Group | null>(null)

  function moveField(id: string, toGroup: Group, toIndex: number) {
    const nextSales = sales.filter((f) => f !== id)
    const nextReq = req.filter((f) => f !== id)
    if (toGroup === 'sales') nextSales.splice(toIndex, 0, id)
    else nextReq.splice(toIndex, 0, id)
    setSales(nextSales); setReq(nextReq); setDragId(null); setOverGroup(null)
  }

  function renderControl(id: string): React.ReactNode {
    switch (id) {
      case 'status': return <SimpleSelect size="sm" value={status} onValueChange={setStatus} options={[{ value: 'work', label: 'В работе' }, { value: 'won', label: 'Успешно' }, { value: 'lost', label: 'Отказ' }]} />
      case 'reason': return <SimpleSelect size="sm" value={reason} onValueChange={setReason} options={[{ value: 'none', label: 'Причина отказа' }, { value: 'price', label: 'Цена' }, { value: 'competitor', label: 'Ушёл к конкуренту' }]} />
      case 'direction': return <SimpleSelect size="sm" value={direction} onValueChange={setDirection} options={[{ value: '1c', label: '1С' }, { value: 'crm', label: 'CRM' }, { value: 'edo', label: 'ЭДО' }]} />
      case 'stage1c': return <SimpleSelect size="sm" value={stage1c} onValueChange={setStage1c} options={[{ value: 'none', label: '- не задано -' }, { value: 'lead', label: 'Лид' }, { value: 'client', label: 'Клиент' }]} />
      case 'ndsType': return <SimpleSelect size="sm" value={ndsType} onValueChange={setNdsType} options={[{ value: 'none', label: '- не задано -' }, { value: 'with', label: 'С НДС' }, { value: 'without', label: 'Без НДС' }]} />
      case 'inn': return <span className="ui-mono">305471028</span>
      case 'site': return <a className="cd-link" href="#!">—</a>
      default: return null
    }
  }

  function FieldRow({ id, group, index }: { id: string; group: Group; index: number }) {
    return (
      <div
        className={`cd-field${editLayout ? ' cd-field--editable' : ''}${dragId === id ? ' cd-field--dragging' : ''}`}
        draggable={editLayout}
        onDragStart={() => setDragId(id)}
        onDragEnd={() => { setDragId(null); setOverGroup(null) }}
        onDragOver={editLayout ? (e) => { e.preventDefault(); setOverGroup(group) } : undefined}
        onDrop={editLayout ? (e) => { e.preventDefault(); e.stopPropagation(); if (dragId) moveField(dragId, group, index) } : undefined}
      >
        <span className="cd-field__labelrow">
          {editLayout && <GripVertical size={14} className="cd-field__drag" />}
          <span className="cd-field__label">{fieldLabels[id]}</span>
        </span>
        <div className="cd-field__value">{renderControl(id)}</div>
      </div>
    )
  }

  // Поп-апы
  const [popup, setPopup] = useState<Popup>(() => {
    const p = new URLSearchParams(window.location.search).get('popup')
    return p === 'call' || p === 'callback' || p === 'meeting' || p === 'plan' ? p : null
  })
  const [callResult, setCallResult] = useState('answered')
  const [cbDate, setCbDate] = useState<Date | null>(null)
  const [cbOwner, setCbOwner] = useState('saliev')
  const [cbRemind, setCbRemind] = useState('15m')
  const [meetParticipants, setMeetParticipants] = useState<string[]>(['saliev'])
  const [meetDate, setMeetDate] = useState<Date | null>(null)
  const [planType, setPlanType] = useState('call')
  const [planDate, setPlanDate] = useState<Date | null>(null)
  const [planOwner, setPlanOwner] = useState('saliev')
  const close = () => setPopup(null)

  const shownFeed = hist === 'Все' ? feed : feed.filter((f) => filterMap[hist]?.includes(f.kind))

  return (
    <div className="cd">
      {/* Шапка — по аудиту: 1 primary + AI + «…Ещё», Б24 как статус */}
      <div className="cd-top">
        <div className="cd-top__title">ООО «XAMIDA TAXI XIZMAT»</div>
        <div className="cd-top__actions">
          <Badge variant="outline">Б24: нет связи</Badge>
          <Button variant="outline" size="sm"><ExternalLink size={14} />Orginfo</Button>
          <AiButton size="compact">Провести анализ</AiButton>
          <Button variant="default" size="sm"><Pencil size={14} />Редактировать</Button>
          <OverflowMenu items={[
            { label: 'Написать', icon: <MessageSquarePlus size={15} /> },
            { label: 'Доп. поля', icon: <Settings2 size={15} /> },
          ]} />
          <button className="cd-close" aria-label="Закрыть"><X size={18} /></button>
        </div>
      </div>

      <div className="cd-tabs">
        {topTabs.map((t) => (
          <button key={t} className={`cd-tab${tab === t ? ' cd-tab--on' : ''}`} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>

      <div className="cd-body">
        {/* Левая: контакт-блок + данные клиента */}
        <aside className="cd-col cd-col--left">
          {/* Контакт — отдельный выделенный блок */}
          <div className="cd-contact">
            <PersonAvatar name="Контакт Компании" size="md" />
            <div className="cd-contact__id">
              <div className="cd-contact__topline">
                <span className="cd-contact__name">Контакт компании</span>
                <Badge variant="secondary">основной</Badge>
              </div>
              <div className="cd-contact__num ui-mono">+998 99 300 10 39</div>
            </div>
            <div className="cd-contact__acts">
              <button className="cd-icon-btn" aria-label="Позвонить" onClick={() => setPopup('call')}><Phone size={15} /></button>
              <button className="cd-icon-btn" aria-label="SMS"><Smartphone size={15} /></button>
              <button className="cd-icon-btn" aria-label="Email"><Mail size={15} /></button>
            </div>
          </div>

          <div className="cd-panel">
            <div className="cd-panel__head">
              <h3>Данные клиента</h3>
              <button className={`cd-layout-btn${editLayout ? ' cd-layout-btn--on' : ''}`} onClick={() => setEditLayout((v) => !v)}>
                {editLayout ? <><Check size={14} /> Готово</> : <><Settings2 size={14} /> Поля</>}
              </button>
            </div>
            {editLayout && <div className="cd-layout-hint">Перетаскивай поля за <GripVertical size={12} /> — внутри раздела и между «Продажи и 1С» ↔ «Реквизиты».</div>}

            <GroupBox title="Продажи и 1С" over={overGroup === 'sales'} onDropEnd={() => dragId && moveField(dragId, 'sales', sales.length)}>
              {sales.map((id, i) => <FieldRow key={id} id={id} group="sales" index={i} />)}
              {sales.length === 0 && <div className="cd-group__drop">Перетащи поле сюда</div>}
            </GroupBox>

            <GroupBox title="Реквизиты" over={overGroup === 'req'} onDropEnd={() => dragId && moveField(dragId, 'req', req.length)}>
              {req.map((id, i) => <FieldRow key={id} id={id} group="req" index={i} />)}
              {req.length === 0 && <div className="cd-group__drop">Перетащи поле сюда</div>}
            </GroupBox>
          </div>
        </aside>

        {/* Центр: история взаимодействий в разных форматах */}
        <section className="cd-col cd-col--center">
          <div className="cd-panel cd-panel--flush">
            <div className="cd-panel__head"><h3>История взаимодействий</h3></div>
            <div className="cd-histfilter">
              {histFilters.map((f) => (
                <button key={f} className={`cd-chip${hist === f ? ' cd-chip--on' : ''}`} onClick={() => setHist(f)}>{f}</button>
              ))}
            </div>
            <div className="cd-composer">
              <Textarea placeholder="Написать комментарий…" value={comment} onChange={(e) => setComment(e.target.value)} />
              <div className="cd-composer__foot">
                <button className="cd-icon-btn" aria-label="Прикрепить"><Paperclip size={16} /></button>
                <Button variant="default" size="sm" disabled={!comment.trim()}>Добавить</Button>
              </div>
            </div>

            <div className="cd-feed">
              {shownFeed.length === 0 && <div className="cd-empty">По фильтру пока пусто.</div>}
              {shownFeed.map((it, i) => <FeedRow key={i} it={it} />)}
            </div>
          </div>
        </section>

        {/* Правая */}
        <aside className="cd-col cd-col--right">
          <div className="cd-panel__head cd-panel__head--bare"><h3>Следующий шаг</h3></div>
          <div className="cd-next">
            <div className="cd-next__co"><Users size={15} /> ООО «XAMIDA TAXI XIZMAT»</div>
            <div className="cd-next__rows">
              <div className="cd-next__row"><span>Плановая дата</span><b>13 авг, 10:00</b></div>
              <div className="cd-next__row"><span>Ответственный</span><b>Салиев Мухаммадойбек</b></div>
              <div className="cd-next__row"><span>Описание</span><b>Связаться с клиентом</b></div>
            </div>
            <Button variant="default" style={{ width: '100%' }}>Завершить</Button>
          </div>

          <div className="cd-panel__head cd-panel__head--bare"><h3>Быстрые действия</h3></div>
          <div className="cd-quick">
            <button className="cd-quick__item" onClick={() => setPopup('call')}><Phone size={16} /> Позвонить</button>
            <button className="cd-quick__item" onClick={() => setPopup('callback')}><PhoneCall size={16} /> Созвон</button>
            <button className="cd-quick__item" onClick={() => setPopup('meeting')}><Users size={16} /> Встреча</button>
            <button className="cd-quick__item" onClick={() => setPopup('plan')}><CheckCircle2 size={16} /> Запланировать</button>
          </div>

          <div className="cd-panel__head cd-panel__head--bare"><h3>Ближайшие дела <Badge variant="outline">1</Badge></h3></div>
          <div className="cd-todo">
            <div className="cd-todo__date"><CalendarClock size={14} /> 13 авг<br /><b>10:00</b></div>
            <div className="cd-todo__body">
              <div className="cd-todo__title">ООО «XAMIDA TAXI XIZMAT»</div>
              <div className="cd-todo__owner"><PersonAvatar name="Салиев Мухаммадойбек" size="xs" /> Салиев Мухаммадойбек</div>
            </div>
          </div>
        </aside>
      </div>

      {/* Поп-ап: Позвонить */}
      <Dialog open={popup === 'call'} onOpenChange={(o: boolean) => !o && close()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Звонок</DialogTitle>
            <DialogDescription>ООО «XAMIDA TAXI XIZMAT» · Контакт компании</DialogDescription>
          </DialogHeader>
          <div className="cd-dlg">
            <div className="cd-dlg__call">
              <span className="ui-mono cd-dlg__num">+998 99 300 10 39</span>
              <Button variant="default" size="sm"><Phone size={14} />Набрать</Button>
            </div>
            <Field><FieldLabel>Результат звонка</FieldLabel>
              <SimpleSelect value={callResult} onValueChange={setCallResult} options={[
                { value: 'answered', label: 'Дозвонился' },
                { value: 'noanswer', label: 'Не дозвонился' },
                { value: 'busy', label: 'Занято' },
                { value: 'callback', label: 'Просил перезвонить' },
              ]} />
            </Field>
            <Field><FieldLabel>Комментарий</FieldLabel><Textarea placeholder="Итог разговора…" /></Field>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Отмена</Button></DialogClose>
            <DialogClose asChild><Button variant="default">Сохранить звонок</Button></DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Поп-ап: Созвон */}
      <Dialog open={popup === 'callback'} onOpenChange={(o: boolean) => !o && close()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Запланировать созвон</DialogTitle>
            <DialogDescription>ООО «XAMIDA TAXI XIZMAT»</DialogDescription>
          </DialogHeader>
          <div className="cd-dlg">
            <div className="cd-dlg__2">
              <Field><FieldLabel>Дата</FieldLabel><DatePicker value={cbDate} onChange={setCbDate} placeholder="Выберите дату" /></Field>
              <Field><FieldLabel>Время</FieldLabel><Input placeholder="10:00" defaultValue="10:00" /></Field>
            </div>
            <Field><FieldLabel>Ответственный</FieldLabel><SimpleSelect value={cbOwner} onValueChange={setCbOwner} options={members} /></Field>
            <Field><FieldLabel>Напоминание</FieldLabel>
              <SimpleSelect value={cbRemind} onValueChange={setCbRemind} options={[
                { value: '15m', label: 'За 15 минут' }, { value: '1h', label: 'За час' }, { value: '1d', label: 'За день' },
              ]} />
            </Field>
            <Field><FieldLabel>Описание</FieldLabel><Textarea defaultValue="Связаться с клиентом" /></Field>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Отмена</Button></DialogClose>
            <DialogClose asChild><Button variant="default">Запланировать</Button></DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Поп-ап: Встреча */}
      <Dialog open={popup === 'meeting'} onOpenChange={(o: boolean) => !o && close()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Новая встреча</DialogTitle>
            <DialogDescription>ООО «XAMIDA TAXI XIZMAT»</DialogDescription>
          </DialogHeader>
          <div className="cd-dlg">
            <Field><FieldLabel>Тема *</FieldLabel><Input placeholder="Например: презентация 1С" /></Field>
            <div className="cd-dlg__2">
              <Field><FieldLabel>Дата</FieldLabel><DatePicker value={meetDate} onChange={setMeetDate} placeholder="Выберите дату" /></Field>
              <Field><FieldLabel>Время</FieldLabel><Input placeholder="15:00" defaultValue="15:00" /></Field>
            </div>
            <Field><FieldLabel>Участники</FieldLabel>
              <MultiSelect value={meetParticipants} onValueChange={setMeetParticipants} options={members} placeholder="Кто участвует…" />
            </Field>
            <Field>
              <FieldLabel>Место / ссылка</FieldLabel>
              <Input placeholder="г. Ташкент, … или https://meet…" />
              <FieldDescription>Адрес офиса или ссылка на видеозвонок</FieldDescription>
            </Field>
            <Field><FieldLabel>Описание</FieldLabel><Textarea placeholder="Повестка встречи…" /></Field>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Отмена</Button></DialogClose>
            <DialogClose asChild><Button variant="default">Создать встречу</Button></DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Поп-ап: Запланировать дело */}
      <Dialog open={popup === 'plan'} onOpenChange={(o: boolean) => !o && close()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Запланировать дело</DialogTitle>
            <DialogDescription>ООО «XAMIDA TAXI XIZMAT»</DialogDescription>
          </DialogHeader>
          <div className="cd-dlg">
            <Field><FieldLabel>Тип</FieldLabel>
              <SegmentedControl value={planType} onValueChange={setPlanType} options={[
                { value: 'call', label: 'Звонок' }, { value: 'meet', label: 'Встреча' }, { value: 'task', label: 'Задача' },
              ]} />
            </Field>
            <Field><FieldLabel>Название *</FieldLabel><Input placeholder="Что нужно сделать" defaultValue="Связаться с клиентом" /></Field>
            <div className="cd-dlg__2">
              <Field><FieldLabel>Срок</FieldLabel><DatePicker value={planDate} onChange={setPlanDate} placeholder="Дата" /></Field>
              <Field><FieldLabel>Время</FieldLabel><Input placeholder="10:00" defaultValue="10:00" /></Field>
            </div>
            <Field><FieldLabel>Ответственный</FieldLabel><SimpleSelect value={planOwner} onValueChange={setPlanOwner} options={members} /></Field>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Отмена</Button></DialogClose>
            <DialogClose asChild><Button variant="default">Запланировать</Button></DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

/* Лента: каждый тип события — своим форматом */
function FeedRow({ it }: { it: Feed }) {
  if (it.kind === 'call') {
    return (
      <div className={`cd-ev cd-ev--call${it.ok ? '' : ' cd-ev--missed'}`}>
        <span className="cd-ev__ic">{it.dir === 'out' ? <PhoneOutgoing size={15} /> : it.ok ? <Phone size={15} /> : <PhoneMissed size={15} />}</span>
        <div className="cd-ev__body">
          <div className="cd-ev__head">
            <b>{it.dir === 'out' ? 'Исходящий звонок' : 'Входящий звонок'}</b>
            {it.ok ? <Badge variant="secondary">дозвонился{it.dur ? ` · ${it.dur}` : ''}</Badge> : <Badge variant="destructive">пропущен</Badge>}
            <span className="cd-ev__time">{it.time}</span>
          </div>
          {it.note && <div className="cd-ev__text">{it.note}</div>}
          <div className="cd-ev__by">{it.author}</div>
        </div>
      </div>
    )
  }
  if (it.kind === 'comment') {
    return (
      <div className="cd-ev cd-ev--comment">
        <PersonAvatar name={it.author} size="sm" />
        <div className="cd-ev__body">
          <div className="cd-ev__head"><b>{it.author}</b><span className="cd-ev__time">{it.time}</span></div>
          <div className="cd-ev__bubble">{it.text}</div>
        </div>
      </div>
    )
  }
  if (it.kind === 'note') {
    return (
      <div className="cd-ev cd-ev--note">
        <span className="cd-ev__ic"><StickyNote size={15} /></span>
        <div className="cd-ev__body">
          <div className="cd-ev__head"><b>Заметка</b><span className="cd-ev__time">{it.time}</span></div>
          <div className="cd-ev__text">{it.text}</div>
          <div className="cd-ev__by">{it.author}</div>
        </div>
      </div>
    )
  }
  if (it.kind === 'file') {
    return (
      <div className="cd-ev cd-ev--file">
        <span className="cd-ev__ic"><FileText size={15} /></span>
        <div className="cd-ev__body">
          <div className="cd-ev__head"><b>Файл добавлен</b><span className="cd-ev__time">{it.time}</span></div>
          <div className="cd-ev__filerow"><Paperclip size={14} /><span className="cd-ev__filename">{it.name}</span><span className="cd-ev__filesize">{it.size}</span></div>
          <div className="cd-ev__by">{it.author}</div>
        </div>
      </div>
    )
  }
  if (it.kind === 'telegram') {
    return (
      <div className="cd-ev cd-ev--tg">
        <span className="cd-ev__ic"><Send size={15} /></span>
        <div className="cd-ev__body">
          <div className="cd-ev__head"><b>{it.author}</b><Badge variant="secondary">Telegram</Badge><span className="cd-ev__time">{it.time}</span></div>
          <div className="cd-ev__bubble">{it.text}</div>
        </div>
      </div>
    )
  }
  return (
    <div className="cd-ev cd-ev--status">
      <span className="cd-ev__ic"><RefreshCcw size={14} /></span>
      <div className="cd-ev__statustext">{it.text} <span className="cd-ev__time">· {it.time}</span></div>
    </div>
  )
}
