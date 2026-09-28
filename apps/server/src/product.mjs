const parse = (value, fallback) => { try { return JSON.parse(value) } catch { return fallback } }
const bool = value => Boolean(Number(value))
export function criterionRow(row) { return row && { id: row.id, name: row.name, query: row.query, filters: parse(row.filters_json, {}), enabled: bool(row.enabled), intervalMinutes: row.interval_minutes, lastRunAt: row.last_run_at, nextRunAt: row.next_run_at, createdAt: row.created_at, updatedAt: row.updated_at } }
export function candidateRow(row) { return row && { id: row.id, externalId: row.external_id, name: row.name, headline: row.headline, location: row.location, experienceYears: row.experience_years, skills: parse(row.skills_json, []), contacts: parse(row.contacts_json, []), sourceUrl: row.source_url, photo: row.photo_url ? { url: row.photo_url, sourceUrl: row.photo_source_url, method: row.photo_method } : null, data: parse(row.data_json, {}), createdAt: row.created_at, updatedAt: row.updated_at } }
export function validateCriterion(input, partial = false) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw Object.assign(new Error('invalid criterion'), { status: 400 })
  const out = {}
  if (!partial || 'name' in input) { if (typeof input.name !== 'string' || !input.name.trim() || input.name.trim().length > 120) throw Object.assign(new Error('invalid name'),{status:400}); out.name=input.name.trim() }
  if (!partial || 'query' in input) { if (input.query != null && typeof input.query !== 'string') throw Object.assign(new Error('invalid query'),{status:400}); out.query=(input.query||'').trim().slice(0,500) }
  if (!partial || 'filters' in input) { if (input.filters != null && (typeof input.filters !== 'object'||Array.isArray(input.filters))) throw Object.assign(new Error('invalid filters'),{status:400}); out.filters=input.filters||{} }
  if ('enabled' in input) { if(typeof input.enabled!=='boolean') throw Object.assign(new Error('invalid enabled'),{status:400}); out.enabled=input.enabled }
  if ('intervalMinutes' in input) { const n=Number(input.intervalMinutes); if(!Number.isInteger(n)||n<1||n>10080) throw Object.assign(new Error('invalid interval'),{status:400}); out.intervalMinutes=n }
  return out
}
export function validateCandidate(input, partial=false) {
  if(!input||typeof input!=='object'||Array.isArray(input)) throw Object.assign(new Error('invalid candidate'),{status:400}); const out={}
  if(!partial||'name'in input){if(typeof input.name!=='string'||!input.name.trim())throw Object.assign(new Error('invalid name'),{status:400});out.name=input.name.trim().slice(0,200)}
  for(const key of ['externalId','headline','location','sourceUrl']) if(key in input) out[key]=input[key]==null?null:String(input[key]).slice(0,1000)
  if('photo'in input){if(input.photo!==null&&(!input.photo||typeof input.photo!=='object'||Array.isArray(input.photo)))throw Object.assign(new Error('invalid photo'),{status:400});if(input.photo){for(const key of ['url','sourceUrl','method'])if(typeof input.photo[key]!=='string'||!input.photo[key].trim())throw Object.assign(new Error('invalid photo'),{status:400});for(const key of ['url','sourceUrl']){let url;try{url=new URL(input.photo[key])}catch{}if(!url||!/^https?:$/.test(url.protocol))throw Object.assign(new Error('invalid photo URL'),{status:400})}}out.photo=input.photo}
  if('experienceYears'in input){const n=Number(input.experienceYears);if(!Number.isFinite(n)||n<0)throw Object.assign(new Error('invalid experience'),{status:400});out.experienceYears=n}
  for(const key of ['skills','contacts']) if(key in input){if(!Array.isArray(input[key]))throw Object.assign(new Error(`invalid ${key}`),{status:400});out[key]=input[key]}
  if('data'in input){if(!input.data||typeof input.data!=='object'||Array.isArray(input.data))throw Object.assign(new Error('invalid data'),{status:400});out.data=input.data}
  return out
}
const words = value => String(value||'').toLocaleLowerCase().split(/[^\p{L}\p{N}+#.]+/u).filter(Boolean)
export function matchesCriterion(candidate, criterion) {
  const f=criterion.filters||{}, hay=words([candidate.name,candidate.headline,candidate.location,...candidate.skills,JSON.stringify(candidate.data)].join(' ')); const set=new Set(hay)
  const query=words(criterion.query); if(query.length&&!query.every(w=>set.has(w)||hay.some(x=>x.includes(w))))return false
  if(f.location&&String(candidate.location||'').toLowerCase()!==String(f.location).toLowerCase())return false
  if(Number.isFinite(Number(f.minExperienceYears))&&Number(candidate.experienceYears||0)<Number(f.minExperienceYears))return false
  if(Array.isArray(f.skills)&&f.skills.length&&!f.skills.every(s=>candidate.skills.some(x=>String(x).toLowerCase()===String(s).toLowerCase())))return false
  return true
}
export function recoverBackgroundState(db,{now=Date.now(),leaseMs=5*60_000}={}) {
  db.prepare("UPDATE notification_outbox SET status='failed',locked_at=NULL,available_at=?,last_error=COALESCE(last_error,'stale_delivery_lease') WHERE status='sending' AND (locked_at IS NULL OR locked_at<?)").run(now,now-leaseMs)
  db.prepare("UPDATE monitoring_runs SET status='failed',finished_at=?,error=COALESCE(error,'abandoned_after_restart') WHERE status='running' AND started_at<?").run(now,now-leaseMs)
}
export function runMonitoringCycle(db,{now=Date.now(),criterionId,userId}={}) {
  recoverBackgroundState(db,{now})
  const criteria=db.prepare(`SELECT * FROM saved_criteria WHERE enabled=1 AND (? IS NULL OR user_id=?) AND (? IS NOT NULL AND id=? OR ? IS NULL AND (next_run_at IS NULL OR next_run_at<=?)) ORDER BY id`).all(userId??null,userId??null,criterionId??null,criterionId??null,criterionId??null,now)
  const candidates=db.prepare('SELECT * FROM candidates ORDER BY id').all().map(candidateRow), results=[]
  for(const raw of criteria){const criterion=criterionRow(raw);let runId,found=0
    try { db.exec('BEGIN IMMEDIATE');runId=Number(db.prepare("INSERT INTO monitoring_runs(criterion_id,started_at,status) VALUES (?,?,'running')").run(raw.id,now).lastInsertRowid);for(const candidate of candidates){if(!matchesCriterion(candidate,criterion))continue;const inserted=db.prepare('INSERT OR IGNORE INTO monitoring_matches(run_id,criterion_id,candidate_id,matched_at) VALUES (?,?,?,?)').run(runId,raw.id,candidate.id,now);if(!inserted.changes)continue;found++;const match=db.prepare('SELECT id FROM monitoring_matches WHERE criterion_id=? AND candidate_id=?').get(raw.id,candidate.id);db.prepare("INSERT OR IGNORE INTO notification_outbox(user_id,match_id,payload_json,available_at,created_at) VALUES (?,?,?,?,?)").run(raw.user_id,match.id,JSON.stringify({criterionId:raw.id,criterionName:raw.name,candidate}),now,now)} db.prepare("UPDATE monitoring_runs SET finished_at=?,status='succeeded',candidates_scanned=?,matches_found=? WHERE id=?").run(now,candidates.length,found,runId);db.prepare('UPDATE saved_criteria SET last_run_at=?,next_run_at=?,updated_at=? WHERE id=?').run(now,now+raw.interval_minutes*60000,now,raw.id);db.exec('COMMIT');results.push({criterionId:raw.id,runId,matchesFound:found})
    } catch(error){try{db.exec('ROLLBACK')}catch{};if(runId)db.prepare("UPDATE monitoring_runs SET finished_at=?,status='failed',error=? WHERE id=?").run(now,String(error.message).slice(0,500),runId);throw error}
  } return results
}
export async function drainOutbox(db,send,{now=Date.now(),limit=20,leaseMs=5*60_000}={}) {recoverBackgroundState(db,{now,leaseMs});const rows=db.prepare("SELECT o.*,u.telegram_user_id FROM notification_outbox o JOIN users u ON u.id=o.user_id WHERE o.status IN ('pending','failed') AND o.available_at<=? AND o.attempts<5 ORDER BY o.id LIMIT ?").all(now,limit);for(const row of rows){const claimed=db.prepare("UPDATE notification_outbox SET status='sending',locked_at=?,attempts=attempts+1 WHERE id=? AND status IN ('pending','failed')").run(now,row.id);if(!claimed.changes)continue;try{await send(row.telegram_user_id,parse(row.payload_json,{}));db.prepare("UPDATE notification_outbox SET status='sent',sent_at=?,locked_at=NULL,last_error=NULL WHERE id=?").run(Date.now(),row.id)}catch(error){db.prepare("UPDATE notification_outbox SET status='failed',locked_at=NULL,available_at=?,last_error=? WHERE id=?").run(Date.now()+Math.min(3600000,30000*2**row.attempts),String(error.message).slice(0,500),row.id)}}return rows.length}
