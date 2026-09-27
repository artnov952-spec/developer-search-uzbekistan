import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from './ui/input'
import { cn } from '../lib/utils'

const EMOJIS = [
  { e: '👍', k: 'палец да ок' }, { e: '👎', k: 'палец нет' }, { e: '🙌', k: 'ура руки' },
  { e: '👏', k: 'хлопки браво' }, { e: '🔥', k: 'огонь' }, { e: '✅', k: 'галочка готово' },
  { e: '❌', k: 'крест нет' }, { e: '⚠️', k: 'внимание' }, { e: '💡', k: 'идея' },
  { e: '📌', k: 'закрепить' }, { e: '📎', k: 'скрепка файл' }, { e: '📞', k: 'звонок телефон' },
  { e: '📧', k: 'почта письмо' }, { e: '📅', k: 'календарь дата' }, { e: '⏰', k: 'время срок' },
  { e: '💰', k: 'деньги оплата' }, { e: '📈', k: 'рост график' }, { e: '📉', k: 'падение график' },
  { e: '🎯', k: 'цель' }, { e: '🚀', k: 'запуск ракета' }, { e: '🙂', k: 'улыбка' },
  { e: '😀', k: 'радость смех' }, { e: '😅', k: 'неловко' }, { e: '🤔', k: 'думаю вопрос' },
  { e: '😴', k: 'сон ждём' }, { e: '🎉', k: 'праздник успех' }, { e: '❤️', k: 'сердце' },
  { e: '⭐', k: 'звезда избранное' },
]

/** Панель выбора эмодзи для поля сообщения. */
export interface EmojiPickerProps {
  /** Выбор эмодзи — приходит сам символ. */
  onSelect: (emoji: string) => void
  /** Дополнительные CSS-классы корневого элемента. */
  className?: string
}

export function EmojiPicker({ onSelect, className }: EmojiPickerProps) {
  const [q, setQ] = useState('')

  const list = useMemo(() => {
    const s = q.trim().toLowerCase()
    return s ? EMOJIS.filter((x) => x.k.includes(s)) : EMOJIS
  }, [q])

  return (
    <div className={cn('bg-popover w-64 rounded-lg border p-2 shadow-md', className)}>
      <div className="relative">
        <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Поиск эмодзи…"
          className="h-8 pl-8"
        />
      </div>

      <div className="mt-2 grid max-h-48 grid-cols-7 gap-0.5 overflow-y-auto">
        {list.map((x) => (
          <button
            key={x.e}
            type="button"
            onClick={() => onSelect(x.e)}
            title={x.k}
            className="hover:bg-accent focus-visible:ring-ring/50 grid size-8 place-items-center rounded-md text-lg transition-colors focus-visible:ring-[3px] focus-visible:outline-none"
          >
            {x.e}
          </button>
        ))}
      </div>

      {list.length === 0 && (
        <p className="text-muted-foreground py-6 text-center text-sm">Ничего не найдено</p>
      )}
    </div>
  )
}
