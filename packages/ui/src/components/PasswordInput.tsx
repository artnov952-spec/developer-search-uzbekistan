import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Input } from './ui/input'
import { cn } from '../lib/utils'

export type PasswordInputProps = Omit<React.ComponentProps<'input'>, 'type'>

/** Поле пароля с переключателем видимости. Обёртка над shadcn Input. */
export function PasswordInput({ className, ...rest }: PasswordInputProps) {
  const [visible, setVisible] = useState(false)
  return (
    <div className="relative">
      <Input type={visible ? 'text' : 'password'} className={cn('pr-9', className)} {...rest} />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? 'Скрыть пароль' : 'Показать пароль'}
        tabIndex={-1}
        className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2.5 -translate-y-1/2 cursor-pointer"
      >
        {visible ? <EyeOff className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}
      </button>
    </div>
  )
}
