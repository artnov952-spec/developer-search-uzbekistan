/* Утилиты дат для CRM-компонентов.
   Раньше жили в components/Calendar.tsx — самописном календаре, который
   дублировал shadcn Calendar. Календарь удалён, утилиты остались здесь. */

/** Полночь того же дня — чтобы сравнения не зависели от времени. */
export function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

/** Один ли это календарный день. `null`/`undefined` считаются несовпадением. */
export function isSameDay(a: Date | null | undefined, b: Date | null | undefined): boolean {
  if (!a || !b) return false
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

export function addDays(d: Date, n: number): Date {
  const next = new Date(d)
  next.setDate(next.getDate() + n)
  return next
}

export function addMonths(d: Date, n: number): Date {
  const next = new Date(d)
  next.setMonth(next.getMonth() + n)
  return next
}
