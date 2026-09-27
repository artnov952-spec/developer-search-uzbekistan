/* Справочник API, сгенерированный из исходников библиотеки.
   Источник: packages/ui/scripts/gen-api.cjs → dist/api.json.
   Обновляется вместе со сборкой пакета (npm run build -w packages/ui). */
import raw from '@cloudplus/ui/api.json'

export type PropRow = {
  name: string
  type: string
  required: boolean
  default?: string
  doc?: string
}

export type ComponentApi = {
  name: string
  file: string
  doc: string
  generics: string[]
  extends: string[]
  props: PropRow[]
}

export type VariantGroup = { options: string[]; default?: string }
export type ShadcnApi = { module: string; variants: Record<string, VariantGroup> }

const api = raw as unknown as { crm: ComponentApi[]; shadcn: ShadcnApi[] }

export const CRM_API = api.crm
export const SHADCN_API = api.shadcn

export const crmApi = (name: string) => CRM_API.find((c) => c.name === name)
export const shadcnApi = (module: string) => SHADCN_API.find((s) => s.module === module)
