import type { SVGProps } from 'react'
import { ICON_BY_NAME } from './index'

export interface CpIconProps extends SVGProps<SVGSVGElement> {
  /** Имя иконки из набора. */
  name: string
  /** Размер стороны в px (16 / 20 / 24). По умолчанию 20. */
  size?: number
  /** Толщина обводки. По умолчанию подбирается под размер. */
  strokeWidth?: number
}

/** Толщина обводки под размер: мелкие размеры требуют чуть более жирного штриха. */
function autoStroke(size: number): number {
  if (size <= 16) return 1.75
  if (size <= 20) return 1.65
  return 1.6
}

/**
 * Иконка набора Cloudplus. Наследует цвет от текста (currentColor).
 * Акцентная точка красится отдельно классом `cp-icon--duo`.
 */
export function CpIcon({ name, size = 20, strokeWidth, className, ...rest }: CpIconProps) {
  const def = ICON_BY_NAME[name]
  if (!def) return null
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth ?? autoStroke(size)}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={['cp-icon', className].filter(Boolean).join(' ')}
      aria-hidden={rest['aria-label' as keyof typeof rest] ? undefined : true}
      dangerouslySetInnerHTML={{ __html: def.body }}
      {...rest}
    />
  )
}
