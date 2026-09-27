/* Демо с состоянием.
   Страницы в pages.tsx описаны стрелками `render: () => <jsx/>`, а не компонентами,
   поэтому хуки в них невозможны — всё интерактивное живёт здесь и подключается
   как `render: () => <LiveSelect />`. */
import { useEffect, useState } from 'react'
import {
  Badge, Button, Checkbox,
  Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandShortcut,
  InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot,
  Label, Progress, RadioGroup, RadioGroupItem,
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
  Slider, Spinner, Switch, Toggle, ToggleGroup, ToggleGroupItem,
} from '@cloudplus/ui'
import {
  Bold, Building2, CalendarPlus, Italic, Minus, Phone, Plus, RotateCcw, Underline,
} from 'lucide-react'
import { Demo } from './Demo'
import { Keys } from './Keys'

/** Строка «текущее значение» под превью — без неё непонятно, работает демо или нет. */
function Readout({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <p className="text-muted-foreground text-sm">
      {label}: <span className="text-foreground font-medium">{value}</span>
    </p>
  )
}

/* ── Select ─────────────────────────────────────────────────── */

const STAGES = [
  { value: 'new', label: 'Новая' },
  { value: 'work', label: 'В работе' },
  { value: 'won', label: 'Выиграна' },
  { value: 'lost', label: 'Проиграна' },
]

export function LiveSelect() {
  const [stage, setStage] = useState('')

  return (
    <div className="space-y-10">
    <Demo
      block
      code={`const [stage, setStage] = useState('')

<Select value={stage} onValueChange={setStage}>
  <SelectTrigger className="w-56">
    <SelectValue placeholder="Выберите стадию" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="new">Новая</SelectItem>
    <SelectItem value="work">В работе</SelectItem>
    <SelectItem value="won">Выиграна</SelectItem>
    <SelectItem value="lost">Проиграна</SelectItem>
  </SelectContent>
</Select>`}
    >
      <div className="space-y-3">
        <Select value={stage} onValueChange={setStage}>
          <SelectTrigger className="w-56"><SelectValue placeholder="Выберите стадию" /></SelectTrigger>
          <SelectContent>
            {STAGES.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
          </SelectContent>
        </Select>
        <Readout label="value" value={stage ? `"${stage}"` : '—'} />
      </div>
    </Demo>

    <Keys
      rows={[
        [['Space'], 'Открыть список.'],
        [['↑', '↓'], 'Переход между вариантами.'],
        [['A', '—', 'Z'], 'Прыжок к варианту по первой букве.'],
        [['Enter'], 'Выбрать вариант и закрыть список.'],
        [['Esc'], 'Закрыть без изменения.'],
      ]}
    />
    </div>
  )
}

/* ── Checkbox / Switch / Radio / Slider ─────────────────────── */

export function LiveControls() {
  const [notify, setNotify] = useState(true)
  const [active, setActive] = useState(true)
  const [channel, setChannel] = useState('call')
  const [amount, setAmount] = useState([40])

  return (
    <div className="space-y-10">
      <Demo
        title="Checkbox и Switch"
        block
        code={`const [notify, setNotify] = useState(true)

<Checkbox id="notify" checked={notify} onCheckedChange={(v) => setNotify(v === true)} />
<Label htmlFor="notify">Отправить уведомление</Label>

<Switch id="active" checked={active} onCheckedChange={setActive} />
<Label htmlFor="active">Активная запись</Label>`}
      >
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Checkbox id="d-notify" checked={notify} onCheckedChange={(v: boolean | 'indeterminate') => setNotify(v === true)} />
            <Label htmlFor="d-notify">Отправить уведомление</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch id="d-active" checked={active} onCheckedChange={setActive} />
            <Label htmlFor="d-active">Активная запись</Label>
          </div>
          <Readout
            label="Состояние"
            value={
              <>
                {notify ? 'уведомим' : 'без уведомления'} · {active ? 'активна' : 'в архиве'}
              </>
            }
          />
        </div>
      </Demo>

      <Demo
        title="RadioGroup"
        block
        code={`const [channel, setChannel] = useState('call')

<RadioGroup value={channel} onValueChange={setChannel} className="flex gap-5">
  <div className="flex items-center gap-2">
    <RadioGroupItem value="call" id="call" /><Label htmlFor="call">Звонок</Label>
  </div>
  <div className="flex items-center gap-2">
    <RadioGroupItem value="mail" id="mail" /><Label htmlFor="mail">Письмо</Label>
  </div>
</RadioGroup>`}
      >
        <div className="space-y-3">
          <RadioGroup value={channel} onValueChange={setChannel} className="flex gap-5">
            {[['call', 'Звонок'], ['mail', 'Письмо'], ['meet', 'Встреча']].map(([v, l]) => (
              <div key={v} className="flex items-center gap-2">
                <RadioGroupItem value={v} id={`d-${v}`} /><Label htmlFor={`d-${v}`}>{l}</Label>
              </div>
            ))}
          </RadioGroup>
          <Readout label="value" value={`"${channel}"`} />
        </div>
      </Demo>

      <Demo
        title="Slider"
        block
        code={`const [amount, setAmount] = useState([40])

<Slider value={amount} onValueChange={setAmount} max={100} step={1} />`}
      >
        <div className="max-w-sm space-y-3">
          <div className="flex items-baseline justify-between">
            <Label>Вероятность сделки</Label>
            <span className="text-sm font-medium tabular-nums">{amount[0]}%</span>
          </div>
          <Slider value={amount} onValueChange={setAmount} max={100} step={1} />
        </div>
      </Demo>
    </div>
  )
}

/* ── Command ────────────────────────────────────────────────── */

const COMMANDS = [
  { group: 'Действия', items: [
    { icon: Plus, label: 'Создать сделку', hint: '⌘D' },
    { icon: Building2, label: 'Добавить компанию', hint: '⌘B' },
    { icon: CalendarPlus, label: 'Запланировать встречу' },
    { icon: Phone, label: 'Позвонить контакту' },
  ] },
  { group: 'Переход', items: [
    { icon: Building2, label: 'Компании' },
    { icon: CalendarPlus, label: 'Календарь' },
  ] },
]

export function LiveCommand() {
  const [picked, setPicked] = useState<string | null>(null)

  return (
    <Demo
      block
      code={`<Command>
  <CommandInput placeholder="Поиск команды…" />
  <CommandList>
    <CommandEmpty>Ничего не найдено.</CommandEmpty>
    <CommandGroup heading="Действия">
      <CommandItem onSelect={() => run('deal')}>
        <Plus />
        Создать сделку
        <CommandShortcut>⌘D</CommandShortcut>
      </CommandItem>
    </CommandGroup>
  </CommandList>
</Command>`}
    >
      <div className="max-w-md space-y-3">
        <Command className="rounded-lg border">
          <CommandInput placeholder="Поиск команды…" />
          <CommandList>
            <CommandEmpty>Ничего не найдено.</CommandEmpty>
            {COMMANDS.map(({ group, items }) => (
              <CommandGroup key={group} heading={group}>
                {items.map(({ icon: Icon, label, hint }) => (
                  <CommandItem key={label} onSelect={() => setPicked(label)}>
                    <Icon />
                    {label}
                    {hint && <CommandShortcut>{hint}</CommandShortcut>}
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
        <Readout label="Выполнено" value={picked ?? '—'} />
      </div>
    </Demo>
  )
}

/* ── InputOTP ───────────────────────────────────────────────── */

export function LiveOtp() {
  const [code, setCode] = useState('')

  return (
    <Demo
      title="InputOTP"
      description="Ввод одноразового кода: вставка из буфера разносит цифры по ячейкам, стрелки и Backspace работают как в одном поле."
      block
      code={`const [code, setCode] = useState('')

<InputOTP maxLength={6} value={code} onChange={setCode}>
  <InputOTPGroup>
    <InputOTPSlot index={0} />
    <InputOTPSlot index={1} />
    <InputOTPSlot index={2} />
  </InputOTPGroup>
  <InputOTPSeparator />
  <InputOTPGroup>
    <InputOTPSlot index={3} />
    <InputOTPSlot index={4} />
    <InputOTPSlot index={5} />
  </InputOTPGroup>
</InputOTP>`}
    >
      <div className="space-y-3">
        <InputOTP maxLength={6} value={code} onChange={setCode}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
        <Readout label="Код" value={code || '—'} />
      </div>
    </Demo>
  )
}

export function LiveCommandPage() {
  return (
    <div className="space-y-10">
      <LiveCommand />
      <Keys
        rows={[
          [['↑'], 'Предыдущий пункт.'],
          [['↓'], 'Следующий пункт — переходит между группами.'],
          [['Enter'], 'Выполнить выбранный пункт (onSelect).'],
          [['Esc'], 'Закрыть палитру, если она в CommandDialog.'],
          [['⌘', 'K'], 'Открыть палитру. Хук useCommandK вешает это глобально.'],
        ]}
      />
    </div>
  )
}

/* ── Progress ───────────────────────────────────────────────── */

export function LiveProgress() {
  const [value, setValue] = useState(62)
  const [loading, setLoading] = useState(false)

  // Имитация загрузки: показывает, что Progress анимирован, а не прибит гвоздями.
  useEffect(() => {
    if (!loading) return
    const id = window.setInterval(() => {
      setValue((v) => {
        if (v >= 100) {
          setLoading(false)
          return 100
        }
        return v + 4
      })
    }, 120)
    return () => window.clearInterval(id)
  }, [loading])

  return (
    <Demo
      title="Progress, Spinner, Skeleton"
      block
      code={`const [value, setValue] = useState(62)

<Progress value={value} />
<Spinner />
<Skeleton className="h-4 w-full" />`}
    >
      <div className="max-w-md space-y-4">
        <div className="flex items-baseline justify-between text-sm">
          <span className="text-muted-foreground">Импорт записей</span>
          <span className="font-medium tabular-nums">{value}%</span>
        </div>
        <Progress value={value} />
        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm" variant="outline" onClick={() => setValue((v) => Math.max(0, v - 10))}>
            <Minus />10
          </Button>
          <Button size="sm" variant="outline" onClick={() => setValue((v) => Math.min(100, v + 10))}>
            <Plus />10
          </Button>
          <Button size="sm" variant="outline" onClick={() => { setValue(0); setLoading(true) }} disabled={loading}>
            {loading ? <Spinner /> : <RotateCcw />}
            {loading ? 'Идёт импорт' : 'Запустить'}
          </Button>
        </div>
      </div>
    </Demo>
  )
}

/* ── Toggle ─────────────────────────────────────────────────── */

export function LiveToggle() {
  const [marks, setMarks] = useState<string[]>(['bold'])
  const [pinned, setPinned] = useState(false)

  return (
    <Demo
      title="Toggle"
      block
      code={`const [marks, setMarks] = useState<string[]>(['bold'])

<ToggleGroup type="multiple" variant="outline" value={marks} onValueChange={setMarks}>
  <ToggleGroupItem value="bold" aria-label="Жирный"><Bold /></ToggleGroupItem>
  <ToggleGroupItem value="italic" aria-label="Курсив"><Italic /></ToggleGroupItem>
  <ToggleGroupItem value="underline" aria-label="Подчёркнутый"><Underline /></ToggleGroupItem>
</ToggleGroup>

<Toggle pressed={pinned} onPressedChange={setPinned}>Закрепить</Toggle>`}
    >
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <ToggleGroup type="multiple" variant="outline" value={marks} onValueChange={setMarks}>
            <ToggleGroupItem value="bold" aria-label="Жирный"><Bold /></ToggleGroupItem>
            <ToggleGroupItem value="italic" aria-label="Курсив"><Italic /></ToggleGroupItem>
            <ToggleGroupItem value="underline" aria-label="Подчёркнутый"><Underline /></ToggleGroupItem>
          </ToggleGroup>
          <Toggle pressed={pinned} onPressedChange={setPinned}>Закрепить</Toggle>
          {pinned && <Badge variant="secondary">Закреплено</Badge>}
        </div>

        <p
          className={[
            'text-sm',
            marks.includes('bold') && 'font-semibold',
            marks.includes('italic') && 'italic',
            marks.includes('underline') && 'underline',
          ].filter(Boolean).join(' ')}
        >
          Форматирование применяется к этому тексту.
        </p>
      </div>
    </Demo>
  )
}
