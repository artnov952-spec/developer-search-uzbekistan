import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@cloudplus/ui/styles.css'
import './tailwind.css'
import { ThemeProvider, ACCENTS, FONTS, TooltipProvider, Toaster } from '@cloudplus/ui'
import type { Theme, BrandProfile, Density, Accent, Font } from '@cloudplus/ui'
import { DocsShell } from './docs/DocsShell'
import { ProductApp } from './product/ProductApp'
import { AuthGate } from './product/AuthGate'

const params = new URLSearchParams(window.location.search)
const theme: Theme = params.get('theme') === 'dark' ? 'dark' : 'light'
const brand: BrandProfile = params.get('brand') === 'default' ? 'default' : 'development'
const density: Density = params.get('density') === 'compact' ? 'compact' : 'default'
const accentParam = params.get('accent')
const accent: Accent = ACCENTS.some((a) => a.value === accentParam) ? (accentParam as Accent) : 'neutral'
const fontParam = params.get('font')
const font: Font = FONTS.some((f) => f.value === fontParam) ? (fontParam as Font) : 'onest'
const showDocs = params.get('docs') === '1'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme={theme} defaultBrand={brand} defaultDensity={density} defaultAccent={accent} defaultFont={font}>
      <TooltipProvider>
        {showDocs ? <DocsShell /> : <AuthGate>{user => <ProductApp user={user} />}</AuthGate>}
        <Toaster />
      </TooltipProvider>
    </ThemeProvider>
  </StrictMode>,
)
