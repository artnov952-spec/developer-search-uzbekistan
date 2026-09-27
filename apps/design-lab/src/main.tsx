import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@cloudplus/ui/styles.css'
import { ThemeProvider, ACCENTS, FONTS } from '@cloudplus/ui'
import type { Theme, Density, Accent, Font } from '@cloudplus/ui'
import { DesignLab } from './DesignLab'

const params = new URLSearchParams(window.location.search)
const theme: Theme = params.get('theme') === 'dark' ? 'dark' : 'light'
const density: Density = params.get('density') === 'compact' ? 'compact' : 'default'
const accentParam = params.get('accent')
const accent: Accent = ACCENTS.some((a) => a.value === accentParam) ? (accentParam as Accent) : 'blue'
const fontParam = params.get('font')
const font: Font = FONTS.some((f) => f.value === fontParam) ? (fontParam as Font) : 'inter'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme={theme} defaultDensity={density} defaultAccent={accent} defaultFont={font}>
      <DesignLab />
    </ThemeProvider>
  </StrictMode>,
)
