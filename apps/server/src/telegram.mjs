import { issueCode } from './auth.mjs'

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
const contactKeyboard = {
  keyboard: [[{ text: 'Поделиться номером телефона', request_contact: true }]],
  resize_keyboard: true,
  one_time_keyboard: true,
  input_field_placeholder: 'Нажмите кнопку ниже для входа'
}
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
  if (!message || !config.allowedIds.has(senderId)) return
  const isLoginCommand = /^\/(start|login)(?:@\w+)?(?:\s|$)/i.test(message.text || '')
  if (isLoginCommand) {
    await telegramCall(config.token, 'sendMessage', {
      chat_id: message.chat.id,
      text: 'Для входа подтвердите номер телефона. Код появится только после отправки вашего контакта.',
      reply_markup: contactKeyboard
    }, signal)
    return
  }
  if (!message.contact) return
  if (String(message.contact.user_id || '') !== senderId) {
    await telegramCall(config.token, 'sendMessage', {
      chat_id: message.chat.id,
      text: 'Нужно отправить именно свой контакт кнопкой ниже.',
      reply_markup: contactKeyboard
    }, signal)
    return
  }
  const phoneNumber = String(message.contact.phone_number || '').trim()
  if (!/^\+?[0-9]{7,15}$/.test(phoneNumber)) {
    await telegramCall(config.token, 'sendMessage', {
      chat_id: message.chat.id,
      text: 'Не удалось проверить номер. Нажмите кнопку и отправьте контакт ещё раз.',
      reply_markup: contactKeyboard
    }, signal)
    return
  }
  const name = [message.from.first_name, message.from.last_name].filter(Boolean).join(' ')
  const code = issueCode(db, senderId, name, config.sessionSecret, Date.now(), phoneNumber)
  await telegramCall(config.token, 'sendMessage', {
    chat_id: message.chat.id,
    text: `Код входа: ${code}\nОн действует 5 минут и используется один раз.`,
    protect_content: true,
    reply_markup: { remove_keyboard: true }
  }, signal)
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
