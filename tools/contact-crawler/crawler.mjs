import { setTimeout as sleep } from 'node:timers/promises'

const SOCIAL = new Map([
  ['github.com', 'github'], ['linkedin.com', 'linkedin'], ['twitter.com', 'twitter'],
  ['x.com', 'twitter'], ['instagram.com', 'instagram'], ['facebook.com', 'facebook'],
  ['t.me', 'telegram'], ['telegram.me', 'telegram'],
])
const PRIORITY = /(?:contact|about|bio|profile|portfolio|resume|cv|соц|контакт|обо-мне)/i
const SKIP_EXT = /\.(?:png|jpe?g|gif|webp|svg|pdf|zip|mp4|mp3|css|js)(?:$|\?)/i

function canonical(raw, base) {
  try { const u = new URL(raw, base); if (!/^https?:$/.test(u.protocol)) return null; u.hash = ''; return u.href }
  catch { return null }
}
function visibleText(html) { return html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/&(?:nbsp|amp);/g, ' ') }
function links(html, base) {
  return [...html.matchAll(/\bhref\s*=\s*["']([^"']+)["']/gi)].map(m => canonical(m[1], base)).filter(Boolean)
}
function normPhone(v) { const plus = v.trim().startsWith('+'); const n = v.replace(/\D/g, ''); return n.length >= 7 && n.length <= 15 ? `${plus ? '+' : ''}${n}` : null }
function profile(link) {
  const u = new URL(link); const network = SOCIAL.get(u.hostname.replace(/^www\./, '')); if (!network) return null
  const path = u.pathname.replace(/\/+$/, ''); if (!path || /^\/(share|intent|search|home|login)/i.test(path)) return null
  return { type: network === 'telegram' ? 'telegram' : 'social', value: network === 'telegram' ? `@${path.split('/').filter(Boolean)[0]}` : `${network}:${path}`, url: link }
}
function extract(html, url, chain) {
  const text = visibleText(html); const found = []
  const add = (type, value, normalized = value, profileUrl) => found.push({ type, value, normalized, sourceUrl: url, discoveryChain: chain, ...(profileUrl ? { profileUrl } : {}) })
  for (const m of text.matchAll(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi)) add('email', m[0], m[0].toLowerCase())
  for (const m of text.matchAll(/(?:\+?\d[\d\s().-]{5,}\d)/g)) { const n = normPhone(m[0]); if (n) add('phone', m[0].trim(), n) }
  for (const link of links(html, url)) { const p = profile(link); if (p) add(p.type, p.value, p.value.toLowerCase(), p.url) }
  return found
}
async function robotsAllowed(origin, fetcher, userAgent, timeoutMs) {
  try {
    const r = await fetcher(`${origin}/robots.txt`, { headers: { 'user-agent': userAgent }, signal: AbortSignal.timeout(timeoutMs) })
    if (!r.ok) return () => true
    const lines = (await r.text()).split(/\r?\n/); let applies = false; const denied = []
    for (const raw of lines) { const line = raw.replace(/#.*/, '').trim(); const [k, ...rest] = line.split(':'); const v = rest.join(':').trim(); if (/^user-agent$/i.test(k)) applies = v === '*' || v.toLowerCase() === userAgent.toLowerCase(); else if (applies && /^disallow$/i.test(k) && v) denied.push(v) }
    return path => !denied.some(d => path.startsWith(d))
  } catch { return () => true }
}

export async function crawlCandidates(inputs, options = {}) {
  const maxDepth = options.maxDepth ?? 2, maxPages = options.maxPages ?? 20, timeoutMs = options.timeoutMs ?? 8000
  const delayMs = options.delayMs ?? 100, userAgent = options.userAgent ?? 'PublicContactCrawler/1.0'
  const fetcher = options.fetch ?? fetch, results = []
  for (const input of inputs) {
    const seed = canonical(input.url); if (!seed) continue
    const allow = await robotsAllowed(new URL(seed).origin, fetcher, userAgent, timeoutMs)
    const queue = [{ url: seed, depth: 0, chain: [seed] }], seen = new Set(), contacts = [], pages = []
    while (queue.length && seen.size < maxPages) {
      queue.sort((a,b) => Number(PRIORITY.test(b.url)) - Number(PRIORITY.test(a.url)) || a.depth-b.depth || a.url.localeCompare(b.url))
      const item = queue.shift(); if (!item || seen.has(item.url)) continue
      const u = new URL(item.url); if (!allow(u.pathname)) { seen.add(item.url); continue }
      seen.add(item.url)
      try {
        const r = await fetcher(item.url, { headers: { 'user-agent': userAgent, accept: 'text/html' }, redirect: 'follow', signal: AbortSignal.timeout(timeoutMs) })
        if (!r.ok || !(r.headers.get('content-type') || '').includes('text/html')) continue
        const html = await r.text(); pages.push(item.url); contacts.push(...extract(html, item.url, item.chain))
        if (item.depth < maxDepth) for (const link of links(html, item.url)) {
          const lu = new URL(link); const related = lu.origin === new URL(seed).origin || SOCIAL.has(lu.hostname.replace(/^www\./, ''))
          if (related && !SKIP_EXT.test(link) && !seen.has(link)) queue.push({ url: link, depth: item.depth + 1, chain: [...item.chain, link] })
        }
      } catch { /* bounded network failures are recorded by omission */ }
      if (delayMs) await sleep(delayMs)
    }
    const deduped = new Map(); for (const contact of contacts) { const key = `${contact.type}:${contact.normalized}`; if (!deduped.has(key)) deduped.set(key, contact) }
    const unique = [...deduped.values()].sort((a,b) => a.type.localeCompare(b.type) || a.normalized.localeCompare(b.normalized))
    if (unique.length) results.push({ candidateId: input.id, inputUrl: seed, contacts: unique, crawledPages: pages })
  }
  return { generatedAt: new Date().toISOString(), candidates: results, limits: { maxDepth, maxPages, timeoutMs, delayMs } }
}
