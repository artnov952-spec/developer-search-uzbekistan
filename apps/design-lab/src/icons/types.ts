export interface IconDef {
  /** Машинное имя, kebab-case. */
  name: string
  /** Группа каталога. */
  group: string
  /** Человеческое название (ru). */
  label: string
  /** Синонимы для поиска. */
  keywords: string[]
  /** Внутренняя разметка SVG (без обертки <svg>). */
  body: string
}
