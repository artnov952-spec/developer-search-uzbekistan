import type { SVGProps } from 'react'

type BrandLogoProps = SVGProps<SVGSVGElement> & {
  compact?: boolean
  tone?: 'ink' | 'inverse' | 'accent'
}

/** Официальный знак сервиса: фирменная K, окрашенная токенами текущей продуктовой палитры. */
export function BrandLogo({ compact = false, tone = 'ink', className, ...props }: BrandLogoProps) {
  const toneClass = tone === 'inverse' ? 'brand-logo--inverse' : tone === 'accent' ? 'brand-logo--accent' : ''
  const common = { role: 'img', 'aria-label': 'Разработка', className: `${className ?? ''} brand-logo ${toneClass}`.trim(), ...props }

  if (compact) {
    return (
      <svg viewBox="0 0 36 36" {...common}>
        <path className="brand-logo__body" d="M8 7h6v8.1L21.2 7h7.4l-9.2 10.1L29 29h-7.5L15.2 21 14 22.3V29H8V7Z" />
        <path className="brand-logo__accent" d="M25 7h5v5h-5z" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 188 36" {...common}>
      <path className="brand-logo__body" d="M8 7h6v8.1L21.2 7h7.4l-9.2 10.1L29 29h-7.5L15.2 21 14 22.3V29H8V7Z" />
      <path className="brand-logo__accent" d="M25 7h5v5h-5z" />
      <text x="43" y="25" fill="currentColor" fontFamily="Onest, Inter, system-ui, sans-serif" fontSize="20" fontWeight="720" letterSpacing="-0.7">Разработка</text>
    </svg>
  )
}
