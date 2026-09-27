import { cn } from '../lib/utils'

/** Круглая кнопка основного действия, плавающая над содержимым. */
export interface FabProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Иконка внутри кнопки. */
  icon: React.ReactNode
  /** Подпись: разворачивает кнопку в «таблетку». Без неё — круг. */
  label?: string
  /** Цвет: акцентный или нейтральный. */
  variant?: 'accent' | 'neutral'
}

export function Fab({ icon, label, variant = 'accent', className, ...rest }: FabProps) {
  return (
    <button
      aria-label={label}
      className={cn(
        'inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full text-sm font-medium shadow-lg transition-all',
        'focus-visible:ring-ring/50 hover:shadow-xl focus-visible:ring-[3px] focus-visible:outline-none',
        'disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-5 [&_svg]:shrink-0',
        label ? 'px-5' : 'w-12',
        variant === 'accent'
          ? 'bg-primary text-primary-foreground hover:bg-primary/90'
          : 'bg-card text-foreground hover:bg-accent border',
        className,
      )}
      {...rest}
    >
      {icon}
      {label}
    </button>
  )
}
