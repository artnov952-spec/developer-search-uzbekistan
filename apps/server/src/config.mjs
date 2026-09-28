import path from 'node:path'

function required(name) {
  const value = process.env[name]?.trim()
  if (!value) throw new Error(`Missing required environment variable: ${name}`)
  return value
}
function integer(name, fallback) {
  const raw = process.env[name]
  const value = raw === undefined ? fallback : Number(raw)
  if (!Number.isInteger(value) || value < 1) throw new Error(`${name} must be a positive integer`)
  return value
}
export function loadConfig({ requireTelegram = true } = {}) {
  const mode = process.env.TELEGRAM_MODE?.trim() || 'polling'
  if (!['polling', 'webhook', 'disabled'].includes(mode)) throw new Error('TELEGRAM_MODE must be polling, webhook, or disabled')
  const token = process.env.DEVELOPER_SEARCH_TELEGRAM_BOT_TOKEN?.trim()
  if (requireTelegram && mode !== 'disabled' && !token) required('DEVELOPER_SEARCH_TELEGRAM_BOT_TOKEN')
  const allowedIds = new Set(required('DEVELOPER_SEARCH_ALLOWED_TELEGRAM_USER_IDS').split(',').map(v => v.trim()).filter(Boolean))
  if (!allowedIds.size || [...allowedIds].some(id => !/^\d+$/.test(id))) throw new Error('DEVELOPER_SEARCH_ALLOWED_TELEGRAM_USER_IDS must be comma-separated numeric IDs')
  const sessionSecret = required('DEVELOPER_SEARCH_SESSION_SECRET')
  if (sessionSecret.length < 32) throw new Error('DEVELOPER_SEARCH_SESSION_SECRET must be at least 32 characters')
  return {
    port: integer('PORT', 4182), host: process.env.HOST || '127.0.0.1', mode, token,
    allowedIds, sessionSecret, dbPath: path.resolve(process.env.DEVELOPER_SEARCH_DB_PATH || './data/developer-search.sqlite'),
    appOrigin: process.env.DEVELOPER_SEARCH_APP_ORIGIN || 'http://localhost:4180',
    secureCookies: process.env.NODE_ENV === 'production',
    webhookSecret: process.env.DEVELOPER_SEARCH_TELEGRAM_WEBHOOK_SECRET?.trim()
  }
}
