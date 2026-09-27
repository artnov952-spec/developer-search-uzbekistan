import { CP_ICON_PATHS } from './icons.js'

/** Толщина обводки под размер: мелкие размеры требуют чуть более жирного штриха. */
function autoStroke(size) {
  if (size <= 16) return 1.75
  if (size <= 20) return 1.65
  return 1.6
}

/**
 * Иконка Cloudplus. Цвет наследуется от текста (currentColor).
 * <CpIcon name="deal" size={20} />
 */
export function CpIcon({ name, size = 20, strokeWidth, className, ...rest }) {
  const body = CP_ICON_PATHS[name]
  if (!body) return null
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
      aria-hidden={rest['aria-label'] ? undefined : true}
      dangerouslySetInnerHTML={{ __html: body }}
      {...rest}
    />
  )
}
