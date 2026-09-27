import type { IconDef } from './types'
import { DEFS_1 } from './defs-1'
import { DEFS_2 } from './defs-2'
import { DEFS_3 } from './defs-3'

export type { IconDef }
export { CpIcon } from './CpIcon'

/** Полный набор Cloudplus Icons - 100 авторских иконок. */
export const ICONS: IconDef[] = [...DEFS_1, ...DEFS_2, ...DEFS_3]

export const ICON_GROUPS = Array.from(new Set(ICONS.map((i) => i.group)))

export type CpIconName = (typeof ICONS)[number]['name']

export const ICON_BY_NAME: Record<string, IconDef> = Object.fromEntries(ICONS.map((i) => [i.name, i]))
