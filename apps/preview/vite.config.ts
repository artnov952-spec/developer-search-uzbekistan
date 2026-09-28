import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ command }) => ({
  base: process.env.VITE_BASE_PATH || (command === 'build' ? '/developer-search-uzbekistan/' : '/'),
  plugins: [react(), tailwindcss()],
  server: { port: 4180, host: true, proxy: { '/api': 'http://127.0.0.1:4182' } },
  preview: { port: 4180, host: '127.0.0.1', strictPort: true, proxy: { '/api': 'http://127.0.0.1:4182' } },
}))
