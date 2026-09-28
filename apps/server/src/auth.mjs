import crypto from 'node:crypto'

const CODE_TTL_MS = 5 * 60_000
const SESSION_TTL_MS = 30 * 24 * 60 * 60_000
const MAX_CODE_ATTEMPTS = 5
const ATTEMPT_WINDOW_MS = 5 * 60_000
const hash = (value, secret) => crypto.createHmac('sha256', secret).update(value).digest('hex')
export const codeHash = (code, secret) => hash(`code:${code}`, secret)
export const tokenHash = (token, secret) => hash(`session:${token}`, secret)
export const attemptHash = (key, secret) => hash(`attempt:${key}`, secret)

export function cleanupAuth(db, now = Date.now()) {
  db.prepare('DELETE FROM login_codes WHERE expires_at<? OR (used_at IS NOT NULL AND used_at<?)').run(now - 24 * 60 * 60_000, now - 24 * 60 * 60_000)
  db.prepare('DELETE FROM sessions WHERE expires_at<?').run(now)
  db.prepare('DELETE FROM login_attempt_windows WHERE window_started_at<? AND (blocked_until IS NULL OR blocked_until<?)').run(now - ATTEMPT_WINDOW_MS, now)
}
export function issueCode(db, telegramId, displayName, secret, now = Date.now()) {
  cleanupAuth(db, now)
  db.prepare(`INSERT INTO users(telegram_user_id,display_name) VALUES (?,?) ON CONFLICT(telegram_user_id) DO UPDATE SET display_name=excluded.display_name,updated_at=CURRENT_TIMESTAMP`).run(telegramId, displayName || null)
  const user = db.prepare('SELECT id FROM users WHERE telegram_user_id=?').get(telegramId)
  db.prepare('UPDATE login_codes SET used_at=? WHERE user_id=? AND used_at IS NULL').run(now, user.id)
  for (let attempt = 0; attempt < 20; attempt++) {
    const code = String(crypto.randomInt(0, 1_000_000)).padStart(6, '0')
    try {
      db.prepare('INSERT INTO login_codes(user_id,code_hash,expires_at,created_at) VALUES (?,?,?,?)').run(user.id, codeHash(code, secret), now + CODE_TTL_MS, now)
      return code
    } catch (error) {
      if (!String(error?.message).includes('UNIQUE')) throw error
    }
  }
  throw new Error('Unable to allocate a unique login code')
}
export function verifyCode(db, code, secret, now = Date.now()) {
  if (!/^\d{6}$/.test(code)) return null
  db.exec('BEGIN IMMEDIATE')
  try {
    const record = db.prepare(`SELECT lc.id,lc.user_id,u.telegram_user_id,u.display_name,lc.failed_attempts FROM login_codes lc JOIN users u ON u.id=lc.user_id WHERE lc.code_hash=? AND lc.used_at IS NULL AND lc.expires_at>? LIMIT 1`).get(codeHash(code, secret), now)
    if (!record || record.failed_attempts >= MAX_CODE_ATTEMPTS) { db.exec('ROLLBACK'); return null }
    const changed = db.prepare('UPDATE login_codes SET used_at=? WHERE id=? AND used_at IS NULL').run(now, record.id)
    if (!changed.changes) { db.exec('ROLLBACK'); return null }
    const token = crypto.randomBytes(32).toString('base64url')
    db.prepare('INSERT INTO sessions(user_id,token_hash,expires_at,created_at,last_seen_at) VALUES (?,?,?,?,?)').run(record.user_id, tokenHash(token, secret), now + SESSION_TTL_MS, now, now)
    db.exec('COMMIT')
    return { token, user: { telegramUserId: record.telegram_user_id, displayName: record.display_name } }
  } catch (error) { db.exec('ROLLBACK'); throw error }
}
export function recordFailedCode(db, code, secret, now = Date.now()) {
  if (!/^\d{6}$/.test(code)) return
  db.prepare('UPDATE login_codes SET failed_attempts=failed_attempts+1 WHERE code_hash=? AND used_at IS NULL AND expires_at>?').run(codeHash(code, secret), now)
}
export function loginAttemptLimited(db, key, secret, now = Date.now(), max = 10) {
  const hashed = attemptHash(key, secret)
  const row = db.prepare('SELECT * FROM login_attempt_windows WHERE attempt_key=?').get(hashed)
  if (!row || row.window_started_at + ATTEMPT_WINDOW_MS <= now) {
    db.prepare('INSERT INTO login_attempt_windows(attempt_key,attempts,window_started_at,blocked_until) VALUES (?,0,?,NULL) ON CONFLICT(attempt_key) DO UPDATE SET attempts=0,window_started_at=excluded.window_started_at,blocked_until=NULL').run(hashed, now)
    return false
  }
  return (row.blocked_until || 0) > now || row.attempts >= max
}
export function recordLoginAttempt(db, key, secret, success, now = Date.now(), max = 10) {
  const hashed = attemptHash(key, secret)
  if (success) { db.prepare('DELETE FROM login_attempt_windows WHERE attempt_key=?').run(hashed); return }
  db.prepare(`INSERT INTO login_attempt_windows(attempt_key,attempts,window_started_at,blocked_until) VALUES (?,1,?,NULL)
    ON CONFLICT(attempt_key) DO UPDATE SET attempts=attempts+1,blocked_until=CASE WHEN attempts+1>=? THEN ? ELSE blocked_until END`).run(hashed, now, max, now + ATTEMPT_WINDOW_MS)
}
export function getSession(db, token, secret, now = Date.now()) {
  if (!token) return null
  const session = db.prepare(`SELECT s.id,u.id AS user_id,u.telegram_user_id,u.display_name FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token_hash=? AND s.expires_at>?`).get(tokenHash(token, secret), now) || null
  if (session) db.prepare('UPDATE sessions SET last_seen_at=? WHERE id=? AND last_seen_at<?').run(now, session.id, now - 60_000)
  return session
}
export function revokeSession(db, token, secret) { if (token) db.prepare('DELETE FROM sessions WHERE token_hash=?').run(tokenHash(token, secret)) }
