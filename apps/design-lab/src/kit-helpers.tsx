/* Мелкие обёртки для макетов.

   Макеты писались под старый API кита (<Avatar name size shape />,
   <Select options />), которого в shadcn нет: там это компаунд-компоненты.
   Ошибки не были видны, потому что @types/react не резолвились из корневого
   node_modules и типы библиотеки вырождались в any.

   Библиотеку под макеты не подгоняем — она следует shadcn. Удобный API живёт
   здесь, в коде приложения. */
import {
  Avatar, AvatarFallback, AvatarImage,
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
  cn, initials,
} from '@cloudplus/ui'

const AVATAR_SIZE = {
  xs: 'size-6 text-[10px]',
  sm: 'size-7 text-[11px]',
  md: 'size-9 text-xs',
  lg: 'size-11 text-sm',
} as const

export type PersonAvatarProps = {
  /** Имя — из него берутся инициалы для заглушки. */
  name: string
  /** URL картинки. Без неё — инициалы. */
  src?: string
  size?: keyof typeof AVATAR_SIZE
  /** Квадратная форма для компаний, круглая — для людей. */
  shape?: 'circle' | 'square'
  className?: string
}

export function PersonAvatar({ name, src, size = 'md', shape = 'circle', className }: PersonAvatarProps) {
  return (
    <Avatar className={cn(AVATAR_SIZE[size], shape === 'square' && 'rounded-md', className)}>
      {src && <AvatarImage src={src} alt="" />}
      <AvatarFallback className={cn(shape === 'square' && 'rounded-md')}>{initials(name)}</AvatarFallback>
    </Avatar>
  )
}

export type SimpleSelectProps = {
  options: { value: string; label: string }[]
  value: string
  onValueChange: (v: string) => void
  size?: 'sm' | 'default'
  placeholder?: string
  className?: string
}

export function SimpleSelect({
  options, value, onValueChange, size = 'default', placeholder, className,
}: SimpleSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger size={size} className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
      </SelectContent>
    </Select>
  )
}
