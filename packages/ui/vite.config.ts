import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import tailwindcss from '@tailwindcss/vite'
import { copyFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath, URL } from 'node:url'

/* Отдаём слой темы (палитра + @theme inline) как отдельный файл: приложения-потребители
   импортируют его в свой Tailwind-энтрипоинт, чтобы утилиты вроде bg-primary резолвились
   теми же токенами, что и внутри библиотеки. */
function copyAssets(): Plugin {
  return {
    name: 'copy-assets',
    closeBundle() {
      mkdirSync(fileURLToPath(new URL('./dist', import.meta.url)), { recursive: true })
      // theme.css — слой темы, api.json — справочник пропсов для таблиц в витрине.
      for (const name of ['theme.css'] as const) {
        copyFileSync(
          fileURLToPath(new URL(`./src/tokens/${name}`, import.meta.url)),
          fileURLToPath(new URL(`./dist/${name}`, import.meta.url)),
        )
      }
      copyFileSync(
        fileURLToPath(new URL('./src/api.generated.json', import.meta.url)),
        fileURLToPath(new URL('./dist/api.json', import.meta.url)),
      )
    },
  }
}

export default defineConfig({
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  plugins: [
    react(),
    tailwindcss(),
    dts({ tsconfigPath: './tsconfig.json', rollupTypes: true, insertTypesEntry: true }),
    copyAssets(),
  ],
  build: {
    lib: {
      entry: { index: fileURLToPath(new URL('./src/index.ts', import.meta.url)) },
      formats: ['es'],
      cssFileName: 'style',
    },
    rollupOptions: {
      /* Файл на модуль, а не один dist/index.js.
         Кит собирался одним модулем, и это делало его неразрезаемым для приложения:
         импорт кнопки тянул в тот же чанк календарь, командную палитру и ящик, потому
         что все они лежали в одном файле, а `import` из «cmdk» стоял на его верхнем
         уровне. Замерено 31.08 на crm-mvp: форма входа качала 788 КБ, из них 48 КБ —
         react-day-picker, 51 — cmdk, 11 — vaul, которых на ней нет и быть не может.
         После разрезания: 599 КБ на входе и 873 на списке компаний против 788 и 940.
         Побочных действий у модулей кита нет (в package.json побочными объявлены
         только стили), поэтому
         неиспользованный файл просто не попадает в сборку потребителя. */
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',
      },
      external: [
        'react', 'react-dom', 'react/jsx-runtime',
        /^@radix-ui\/react-/, 'radix-ui', 'lucide-react',
        'cmdk', 'vaul', 'sonner', 'recharts', 'date-fns', 'react-day-picker',
        'react-hook-form', '@hookform/resolvers', 'zod', 'next-themes',
        'input-otp', 'embla-carousel-react', 'react-resizable-panels',
      ],
    },
    cssCodeSplit: false,
  },
})
