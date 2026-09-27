/* Перегенерирует src/shadcn.ts — barrel всех компонентов shadcn.
 * Запускать после `npx shadcn@latest add <name>`:
 *   node scripts/gen-shadcn-barrel.cjs
 * Править src/shadcn.ts руками не нужно. */
const fs = require('fs')
const path = require('path')

const uiDir = path.resolve(__dirname, '../src/components/ui')
const out = path.resolve(__dirname, '../src/shadcn.ts')

const files = fs
  .readdirSync(uiDir)
  .filter((f) => f.endsWith('.tsx'))
  .sort()

const lines = [
  '/* Компоненты shadcn/ui — сгенерированный barrel.',
  '   Наружу отдаются из корня пакета: import { Button } from \'@cloudplus/ui\'',
  '   Добавление: npx shadcn@latest add <name>, затем node scripts/gen-shadcn-barrel.cjs',
  '   Править вручную не нужно. */',
  '',
  ...files.map((f) => `export * from './components/ui/${f.replace(/\.tsx$/, '')}'`),
]

fs.writeFileSync(out, lines.join('\n') + '\n')
console.log(`shadcn.ts: ${files.length} модулей`)
