import { forwardRef } from 'react'
import { Sparkles } from 'lucide-react'
import { Button } from './ui/button'
import { Spinner } from './ui/spinner'
import { cn } from '../lib/utils'

/** Кнопка запуска AI-действия: иконка искры, на время работы — спиннер. */
export interface AiButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Показать спиннер вместо искры и заблокировать кнопку. */
  loading?: boolean
  /** Габарит: `compact` — для панелей инструментов и строк таблицы. */
  size?: 'compact' | 'default'
}

export const AiButton = forwardRef<HTMLButtonElement, AiButtonProps>(function AiButton(
  { loading, size = 'default', className, children, disabled, ...rest },
  ref,
) {
  return (
    <Button
      ref={ref}
      type="button"
      variant="outline"
      size={size === 'compact' ? 'sm' : 'default'}
      disabled={disabled || loading}
      className={cn('border-primary/25 text-primary hover:bg-primary/5 hover:text-primary', className)}
      {...rest}
    >
      {loading ? <Spinner /> : <Sparkles />}
      {children}
    </Button>
  )
})
