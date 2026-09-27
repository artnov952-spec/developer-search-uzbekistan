import { ShieldCheck, X } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { initials } from '../utils'

/** Строка участника с выбором роли — для страницы доступа к объекту. */
export interface PermissionRowProps {
  /** Имя участника. */
  name: string
  /** Почта под именем. */
  email: string
  /** URL аватара. Без него — инициалы. */
  avatarSrc?: string
  /** Текущая роль. */
  role: string
  /** Доступные роли в выпадающем списке. */
  roleOptions?: string[]
  /** Смена роли. */
  onRoleChange?: (role: string) => void
  /** Владелец: роль не меняется и не удаляется. */
  isOwner?: boolean
  /** Убрать участника. Без обработчика кнопки нет. */
  onRemove?: () => void
}

export function PermissionRow({
  name,
  email,
  avatarSrc,
  role,
  roleOptions,
  onRoleChange,
  isOwner,
  onRemove,
}: PermissionRowProps) {
  return (
    <div className="flex items-center gap-3 py-2.5">
      <Avatar className="size-8 shrink-0">
        {avatarSrc && <AvatarImage src={avatarSrc} alt="" />}
        <AvatarFallback className="text-xs">{initials(name)}</AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium">{name}</div>
        <div className="text-muted-foreground truncate text-sm">{email}</div>
      </div>

      {isOwner ? (
        <Badge variant="secondary" className="shrink-0 gap-1">
          <ShieldCheck aria-hidden />
          {role}
        </Badge>
      ) : (
        <Select value={role} onValueChange={(v: string) => onRoleChange?.(v)}>
          <SelectTrigger size="sm" className="w-36 shrink-0" aria-label={`Роль: ${name}`}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(roleOptions ?? [role]).map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
          </SelectContent>
        </Select>
      )}

      {!isOwner && onRemove && (
        <Button
          variant="ghost"
          size="icon-sm"
          className="shrink-0"
          onClick={onRemove}
          aria-label={`Удалить доступ: ${name}`}
        >
          <X aria-hidden />
        </Button>
      )}
    </div>
  )
}
