import type { SVGProps } from 'react'

type BrandLogoProps = SVGProps<SVGSVGElement> & {
  compact?: boolean
  tone?: 'ink' | 'inverse' | 'accent'
}

/** Сокращённый фирменный знак сервиса «Разработка». Геометрия не зависит от темы — меняется только currentColor. */
export function BrandLogo({ compact = false, tone = 'ink', className, ...props }: BrandLogoProps) {
  const toneClass = tone === 'inverse' ? 'brand-logo--inverse' : tone === 'accent' ? 'brand-logo--accent' : ''

  if (compact) {
    return (
      <svg viewBox="0 0 36 36" role="img" aria-label="Разработка" className={`${className ?? ''} brand-logo ${toneClass}`.trim()} {...props}>
        <rect x="1" y="1" width="34" height="34" rx="10" fill="currentColor" />
        <path d="M12 10h7.1c5 0 8.1 2.6 8.1 6.8 0 4.3-3.1 7-8.1 7H17V29h-5V10Zm5 4.2v5.5h2c2.1 0 3.2-1 3.2-2.8 0-1.7-1.1-2.7-3.2-2.7h-2Z" fill="var(--brand-logo-cutout, white)" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 188 36" role="img" aria-label="Разработка" className={`${className ?? ''} brand-logo ${toneClass}`.trim()} {...props}>
      <rect x="1" y="1" width="34" height="34" rx="10" fill="currentColor" />
      <path d="M12 10h7.1c5 0 8.1 2.6 8.1 6.8 0 4.3-3.1 7-8.1 7H17V29h-5V10Zm5 4.2v5.5h2c2.1 0 3.2-1 3.2-2.8 0-1.7-1.1-2.7-3.2-2.7h-2Z" fill="var(--brand-logo-cutout, white)" />
      <text x="47" y="25" fill="currentColor" fontFamily="Onest, Inter, system-ui, sans-serif" fontSize="20" fontWeight="720" letterSpacing="-0.7">Разработка</text>
    </svg>
  )
}
