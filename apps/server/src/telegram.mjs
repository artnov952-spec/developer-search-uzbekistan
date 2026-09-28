import { issueCode } from './auth.mjs'

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
export async function telegramCall(token, method, body, signal) {
  const response = await fetch(`https://api.telegram.org/bot${token}/${method}`, { method: 'POST', headers: { 'content-type':'application/json' }, body: JSON.stringify(body), signal })
  if (!response.ok) throw new Error(`Telegram API ${method} failed with HTTP ${response.status}`)
  const result = await response.json()
  if (!result.ok) throw new Error(`Telegram API ${method} rejected request`)
  return result.result
}
export async function handleUpdate(update, { config, db, signal }) {
  const message = update?.message
  const senderId = message?.from?.id == null ? '' : String(message.from.id)
  if (!message?.text || !config.allowedIds.has(senderId)) return
  if (!/^\/(start|login)(?:@\w+)?(?:\s|$)/i.test(message.text)) return
  const name = [message.from.first_name, message.from.last_name].filter(Boolean).join(' ')
  const code = issueCode(db, senderId, name, config.sessionSecret)
  await telegramCall(config.token, 'sendMessage', { chat_id: message.chat.id, text: `Код входа: ${code}\nОн действует 5 минут и используется один раз.`, protect_content: true }, signal)
}
export async function runPolling(context) {
  const { config, signal, db, telegramRuntime } = context
  let offset = Number(db.prepare('SELECT next_update_id FROM telegram_polling_state WHERE id=1').get()?.next_update_id || 0)
  telegramRuntime && (telegramRuntime.running = true)
  try {
    while (!signal.aborted && telegramRuntime?.enabled !== false) {
      try {
        const updates = await telegramCall(config.token, 'getUpdates', { offset, timeout: 25, allowed_updates: ['message'] }, signal)
        for (const update of updates) {
          await handleUpdate(update, context)
          offset = update.update_id + 1
          db.prepare('UPDATE telegram_polling_state SET next_update_id=?,updated_at=? WHERE id=1').run(offset, Date.now())
        }
        if (telegramRuntime) { telegramRuntime.status='connected'; telegramRuntime.lastConnectedAt=Date.now(); telegramRuntime.lastError=null }
      } catch (error) {
        if (signal.aborted || telegramRuntime?.enabled === false) return
        if (telegramRuntime) { telegramRuntime.status='error'; telegramRuntime.lastError=String(error?.message || 'polling_failed').slice(0,500) }
        console.error('Telegram polling temporarily failed; retrying')
        await sleep(2000)
      }
    }
  } finally { if (telegramRuntime) telegramRuntime.running=false }
}
