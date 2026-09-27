import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

export type Theme = 'light' | 'dark'
export type BrandProfile = 'default' | 'development'
export type Density = 'default' | 'compact'
export type Accent =
  | 'neutral'
  | 'blue' | 'indigo' | 'violet' | 'purple' | 'fuchsia' | 'pink' | 'rose'
  | 'orange' | 'amber' | 'green' | 'teal' | 'cyan' | 'sky' | 'slate'
export type Font =
  | 'inter' | 'manrope' | 'golos' | 'onest' | 'rubik' | 'plex'
  | 'montserrat' | 'nunito' | 'commissioner' | 'unbounded' | 'system'

/** Все шрифты покрывают латиницу И кириллицу. */
export const FONTS: { value: Font; label: string }[] = [
  { value: 'inter', label: 'Inter' },
  { value: 'manrope', label: 'Manrope' },
  { value: 'golos', label: 'Golos Text' },
  { value: 'onest', label: 'Onest' },
  { value: 'rubik', label: 'Rubik' },
  { value: 'plex', label: 'IBM Plex Sans' },
  { value: 'montserrat', label: 'Montserrat' },
  { value: 'nunito', label: 'Nunito Sans' },
  { value: 'commissioner', label: 'Commissioner' },
  { value: 'unbounded', label: 'Unbounded' },
  { value: 'system', label: 'Системный' },
]

/** Палитра акцентов для UI-выбора (значение = базовый HEX как в tokens.css).
    neutral — дефолт: чёрный на светлой теме / белый на тёмной, без цветового тона.
    Остальные цвета включаются точечно (defaultAccent или setAccent), когда бренду/задаче нужен акцентный цвет. */
export const ACCENTS: { value: Accent; label: string; color: string }[] = [
  { value: 'neutral', label: 'Нейтральный', color: '#18181b' },
  { value: 'blue', label: 'Синий', color: '#3e63dd' },
  { value: 'indigo', label: 'Индиго', color: '#5b5bd6' },
  { value: 'violet', label: 'Фиолетовый', color: '#7c5cff' },
  { value: 'purple', label: 'Пурпурный', color: '#9333ea' },
  { value: 'fuchsia', label: 'Фуксия', color: '#c026d3' },
  { value: 'pink', label: 'Розовый', color: '#e93d82' },
  { value: 'rose', label: 'Роза', color: '#f43f5e' },
  { value: 'orange', label: 'Оранжевый', color: '#ea580c' },
  { value: 'amber', label: 'Янтарь', color: '#cf8109' },
  { value: 'green', label: 'Зелёный', color: '#16a34a' },
  { value: 'teal', label: 'Бирюзовый', color: '#0d9488' },
  { value: 'cyan', label: 'Циан', color: '#0891b2' },
  { value: 'sky', label: 'Небесный', color: '#0284c7' },
  { value: 'slate', label: 'Графит', color: '#5b647a' },
]

type ThemeCtx = {
  theme: Theme
  brand: BrandProfile
  density: Density
  accent: Accent
  font: Font
  setTheme: (t: Theme) => void
  setBrand: (brand: BrandProfile) => void
  toggleTheme: () => void
  setDensity: (d: Density) => void
  setAccent: (a: Accent) => void
  setFont: (f: Font) => void
}

const Ctx = createContext<ThemeCtx | null>(null)

export function ThemeProvider({
  children,
  defaultTheme = 'light',
  defaultBrand = 'default',
  defaultDensity = 'default',
  defaultAccent = 'neutral',
  defaultFont = 'inter',
}: {
  children: React.ReactNode
  defaultTheme?: Theme
  defaultBrand?: BrandProfile
  defaultDensity?: Density
  defaultAccent?: Accent
  defaultFont?: Font
}) {
  const [theme, setTheme] = useState<Theme>(defaultTheme)
  const [brand, setBrand] = useState<BrandProfile>(defaultBrand)
  const [density, setDensity] = useState<Density>(defaultDensity)
  const [accent, setAccent] = useState<Accent>(defaultAccent)
  const [font, setFont] = useState<Font>(defaultFont)

  useEffect(() => {
    const root = document.documentElement
    root.setAttribute('data-theme', theme)
    root.setAttribute('data-brand', brand)
    root.setAttribute('data-density', density)
    root.setAttribute('data-accent', accent)
    root.setAttribute('data-font', font)
  }, [theme, brand, density, accent, font])

  const toggleTheme = useCallback(() => setTheme((t) => (t === 'light' ? 'dark' : 'light')), [])

  const value = useMemo(
    () => ({ theme, brand, density, accent, font, setTheme, setBrand, toggleTheme, setDensity, setAccent, setFont }),
    [theme, brand, density, accent, font, toggleTheme],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useTheme(): ThemeCtx {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useTheme must be used within <ThemeProvider>')
  return ctx
}
