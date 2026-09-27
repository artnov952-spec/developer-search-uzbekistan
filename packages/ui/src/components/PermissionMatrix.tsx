import { Checkbox } from './ui/checkbox'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { cn } from '../lib/utils'

/** Матрица «право × роль» с чекбоксами на пересечениях. */
export interface PermissionMatrixProps {
  /** Роли — колонки матрицы. */
  roles: string[]
  /** Права — строки. `group` объединяет строки в секции. */
  permissions: { key: string; label: string; group?: string }[]
  /** Включённые пересечения. Ключ — `"<permKey>:<role>"`. */
  enabled: Set<string>
  /** Переключение чекбокса. Менять множество должен родитель. */
  onToggle?: (permKey: string, role: string) => void
  /** Дополнительные CSS-классы корневого элемента. */
  className?: string
}

export function PermissionMatrix({ roles, permissions, enabled, onToggle, className }: PermissionMatrixProps) {
  return (
    <div className={cn('overflow-x-auto rounded-lg border', className)}>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="min-w-48">Право</TableHead>
            {roles.map((r) => (
              <TableHead key={r} className="text-center whitespace-nowrap">{r}</TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {permissions.map((p) => (
            <TableRow key={p.key}>
              <TableCell>
                <div className="text-sm">{p.label}</div>
                {p.group && <div className="text-muted-foreground text-xs">{p.group}</div>}
              </TableCell>

              {roles.map((r) => {
                const on = enabled.has(`${p.key}:${r}`)
                return (
                  <TableCell key={r} className="text-center">
                    <Checkbox
                      checked={on}
                      onCheckedChange={() => onToggle?.(p.key, r)}
                      disabled={!onToggle}
                      aria-label={`${p.label} — ${r}`}
                    />
                  </TableCell>
                )
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
