import http from 'node:http'
import { getSession, loginAttemptLimited, recordFailedCode, recordLoginAttempt, revokeSession, verifyCode } from './auth.mjs'
import { handleUpdate } from './telegram.mjs'
import { candidateRow, criterionRow, runMonitoringCycle, validateCandidate, validateCriterion } from './product.mjs'

const COOKIE = 'developer_search_session'
function cookies(req) { return Object.fromEntries((req.headers.cookie || '').split(';').map(v=>v.trim().split('=').map(decodeURIComponent)).filter(v=>v.length===2)) }
function json(res, status, body, headers={}) { res.writeHead(status, {'content-type':'application/json; charset=utf-8','cache-control':'no-store',...headers}); res.end(JSON.stringify(body)) }
async function body(req) {
  const chunks=[]; let size=0
  for await (const chunk of req) { size+=chunk.length; if(size>1024*1024) throw Object.assign(new Error('Body too large'),{status:413}); chunks.push(chunk) }
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}') } catch { throw Object.assign(new Error('Invalid JSON'),{status:400}) }
}
function cookie(value, config, clear=false) { return `${COOKIE}=${clear?'':encodeURIComponent(value)}; Path=/; HttpOnly; SameSite=Strict; ${config.secureCookies?'Secure; ':''}Max-Age=${clear?0:2592000}` }
function sameOrigin(req, config) { return !req.headers.origin || req.headers.origin === config.appOrigin }
export function createServer({ config, db, signal, telegramRuntime }) {
  return http.createServer(async (req,res)=>{
    try {
      const url=new URL(req.url,'http://local')
      if(req.method==='GET'&&url.pathname==='/api/health') return json(res,signal?.aborted?503:200,{status:signal?.aborted?'stopping':'ok'})
      if(req.method==='GET'&&url.pathname==='/api/ready') {
        if(signal?.aborted)return json(res,503,{status:'stopping',ready:false})
        db.prepare('SELECT 1').get()
        const migrations=Number(db.prepare('SELECT count(*) n FROM schema_migrations').get().n)
        const telegramReady=config.mode==='disabled'||config.mode==='webhook'||Boolean(telegramRuntime?.running&&telegramRuntime?.status!=='error')
        return json(res,telegramReady?200:503,{status:telegramReady?'ok':'not_ready',database:'ok',migrations,telegramMode:config.mode,telegram:telegramRuntime?.status||config.mode,ready:telegramReady})
      }
      if(url.pathname.startsWith('/api/')&&!sameOrigin(req,config)) return json(res,403,{error:'origin_not_allowed'})
      if(req.method==='GET'&&url.pathname==='/api/auth/me') {
        const session=getSession(db,cookies(req)[COOKIE],config.sessionSecret)
        return session?json(res,200,{user:{telegramUserId:session.telegram_user_id,displayName:session.display_name}}):json(res,401,{error:'unauthenticated'})
      }
      if(req.method==='POST'&&url.pathname==='/api/auth/verify') {
        const key=`verify:${req.socket.remoteAddress||'unknown'}`
        if(loginAttemptLimited(db,key,config.sessionSecret)) return json(res,429,{error:'rate_limited'},{'retry-after':'300'})
        const input=await body(req); const code=String(input.code||'')
        const result=verifyCode(db,code,config.sessionSecret)
        recordLoginAttempt(db,key,config.sessionSecret,Boolean(result))
        if(!result){recordFailedCode(db,code,config.sessionSecret);return json(res,401,{error:'invalid_or_expired_code'})}
        return json(res,200,{user:result.user},{'set-cookie':cookie(result.token,config)})
      }
      if(req.method==='POST'&&url.pathname==='/api/auth/logout') { revokeSession(db,cookies(req)[COOKIE],config.sessionSecret); return json(res,200,{ok:true},{'set-cookie':cookie('',config,true)}) }
      if(req.method==='POST'&&url.pathname==='/api/telegram/webhook'&&config.mode==='webhook') {
        if(telegramRuntime?.enabled===false)return json(res,503,{error:'telegram_disconnected'})
        if(!config.webhookSecret||req.headers['x-telegram-bot-api-secret-token']!==config.webhookSecret)return json(res,401,{error:'invalid_webhook_secret'})
        await handleUpdate(await body(req),{config,db,signal});return json(res,200,{ok:true})
      }
      const session=getSession(db,cookies(req)[COOKIE],config.sessionSecret)
      if(url.pathname.startsWith('/api/')&&!session)return json(res,401,{error:'unauthenticated'})
      const criterionMatch=url.pathname.match(/^\/api\/criteria\/(\d+)$/)
      if(req.method==='GET'&&url.pathname==='/api/criteria'){const rows=db.prepare('SELECT * FROM saved_criteria WHERE user_id=? ORDER BY id DESC').all(session.user_id);return json(res,200,{criteria:rows.map(criterionRow)})}
      if(req.method==='POST'&&url.pathname==='/api/criteria'){const v=validateCriterion(await body(req));const now=Date.now(),r=db.prepare('INSERT INTO saved_criteria(user_id,name,query,filters_json,enabled,interval_minutes,next_run_at,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?)').run(session.user_id,v.name,v.query,JSON.stringify(v.filters),v.enabled===false?0:1,v.intervalMinutes||60,now,now,now);return json(res,201,{criterion:criterionRow(db.prepare('SELECT * FROM saved_criteria WHERE id=?').get(r.lastInsertRowid))})}
      if(criterionMatch&&req.method==='GET'){const row=db.prepare('SELECT * FROM saved_criteria WHERE id=? AND user_id=?').get(criterionMatch[1],session.user_id);return row?json(res,200,{criterion:criterionRow(row)}):json(res,404,{error:'not_found'})}
      if(criterionMatch&&req.method==='PATCH'){const old=db.prepare('SELECT * FROM saved_criteria WHERE id=? AND user_id=?').get(criterionMatch[1],session.user_id);if(!old)return json(res,404,{error:'not_found'});const v=validateCriterion(await body(req),true),now=Date.now();db.prepare('UPDATE saved_criteria SET name=?,query=?,filters_json=?,enabled=?,interval_minutes=?,next_run_at=?,updated_at=? WHERE id=? AND user_id=?').run(v.name??old.name,v.query??old.query,JSON.stringify(v.filters??JSON.parse(old.filters_json)),v.enabled===undefined?old.enabled:Number(v.enabled),v.intervalMinutes??old.interval_minutes,(v.enabled===true||v.intervalMinutes)?now:old.next_run_at,now,old.id,session.user_id);return json(res,200,{criterion:criterionRow(db.prepare('SELECT * FROM saved_criteria WHERE id=?').get(old.id))})}
      if(criterionMatch&&req.method==='DELETE'){const r=db.prepare('DELETE FROM saved_criteria WHERE id=? AND user_id=?').run(criterionMatch[1],session.user_id);return r.changes?json(res,200,{ok:true}):json(res,404,{error:'not_found'})}
      if(req.method==='POST'&&url.pathname==='/api/monitoring/run'){const input=await body(req),id=input.criterionId==null?null:Number(input.criterionId);if(id&&!db.prepare('SELECT 1 FROM saved_criteria WHERE id=? AND user_id=?').get(id,session.user_id))return json(res,404,{error:'not_found'});const runs=runMonitoringCycle(db,{criterionId:id,userId:session.user_id});return json(res,200,{runs})}
      if(req.method==='GET'&&url.pathname==='/api/monitoring/runs'){const rows=db.prepare('SELECT r.* FROM monitoring_runs r JOIN saved_criteria c ON c.id=r.criterion_id WHERE c.user_id=? ORDER BY r.id DESC LIMIT 100').all(session.user_id);return json(res,200,{runs:rows})}
      if(req.method==='GET'&&url.pathname==='/api/monitoring/matches'){const rows=db.prepare('SELECT m.id,m.matched_at,m.criterion_id,m.candidate_id FROM monitoring_matches m JOIN saved_criteria sc ON sc.id=m.criterion_id WHERE sc.user_id=? ORDER BY m.id DESC LIMIT 200').all(session.user_id);return json(res,200,{matches:rows.map(r=>({id:r.id,criterionId:r.criterion_id,matchedAt:r.matched_at,candidate:candidateRow(db.prepare('SELECT * FROM candidates WHERE id=?').get(r.candidate_id))}))})}
      const candidateMatch=url.pathname.match(/^\/api\/candidates\/(\d+)$/)
      if(req.method==='GET'&&url.pathname==='/api/candidates'){const q=(url.searchParams.get('q')||'').trim(),limit=Math.min(200,Math.max(1,Number(url.searchParams.get('limit'))||50)),offset=Math.max(0,Number(url.searchParams.get('offset'))||0),like=`%${q}%`;const rows=db.prepare('SELECT * FROM candidates WHERE ?=\'\' OR name LIKE ? OR headline LIKE ? OR location LIKE ? ORDER BY updated_at DESC,id DESC LIMIT ? OFFSET ?').all(q,like,like,like,limit,offset);return json(res,200,{candidates:rows.map(candidateRow),limit,offset})}
      if(req.method==='POST'&&url.pathname==='/api/candidates'){const input=await body(req),items=Array.isArray(input)?input:[input],now=Date.now(),saved=[];db.exec('BEGIN IMMEDIATE');try{for(const item of items){const v=validateCandidate(item);const r=db.prepare('INSERT INTO candidates(external_id,name,headline,location,experience_years,skills_json,contacts_json,source_url,photo_url,photo_source_url,photo_method,data_json,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(external_id) DO UPDATE SET name=excluded.name,headline=excluded.headline,location=excluded.location,experience_years=excluded.experience_years,skills_json=excluded.skills_json,contacts_json=excluded.contacts_json,source_url=excluded.source_url,photo_url=excluded.photo_url,photo_source_url=excluded.photo_source_url,photo_method=excluded.photo_method,data_json=excluded.data_json,updated_at=excluded.updated_at RETURNING *').get(v.externalId??null,v.name,v.headline??null,v.location??null,v.experienceYears??null,JSON.stringify(v.skills||[]),JSON.stringify(v.contacts||[]),v.sourceUrl??null,v.photo?.url??null,v.photo?.sourceUrl??null,v.photo?.method??null,JSON.stringify(v.data||{}),now,now);saved.push(candidateRow(r))}db.exec('COMMIT')}catch(e){db.exec('ROLLBACK');throw e}return json(res,201,{candidates:saved})}
      if(candidateMatch&&req.method==='GET'){const row=db.prepare('SELECT * FROM candidates WHERE id=?').get(candidateMatch[1]);return row?json(res,200,{candidate:candidateRow(row)}):json(res,404,{error:'not_found'})}
      if(candidateMatch&&req.method==='PATCH'){const old=db.prepare('SELECT * FROM candidates WHERE id=?').get(candidateMatch[1]);if(!old)return json(res,404,{error:'not_found'});const v=validateCandidate(await body(req),true),now=Date.now(),photo=v.photo===undefined?{url:old.photo_url,sourceUrl:old.photo_source_url,method:old.photo_method}:v.photo;db.prepare('UPDATE candidates SET external_id=?,name=?,headline=?,location=?,experience_years=?,skills_json=?,contacts_json=?,source_url=?,photo_url=?,photo_source_url=?,photo_method=?,data_json=?,updated_at=? WHERE id=?').run(v.externalId===undefined?old.external_id:v.externalId,v.name??old.name,v.headline===undefined?old.headline:v.headline,v.location===undefined?old.location:v.location,v.experienceYears??old.experience_years,JSON.stringify(v.skills??JSON.parse(old.skills_json)),JSON.stringify(v.contacts??JSON.parse(old.contacts_json)),v.sourceUrl===undefined?old.source_url:v.sourceUrl,photo?.url??null,photo?.sourceUrl??null,photo?.method??null,JSON.stringify(v.data??JSON.parse(old.data_json)),now,old.id);return json(res,200,{candidate:candidateRow(db.prepare('SELECT * FROM candidates WHERE id=?').get(old.id))})}
      if(candidateMatch&&req.method==='DELETE'){const r=db.prepare('DELETE FROM candidates WHERE id=?').run(candidateMatch[1]);return r.changes?json(res,200,{ok:true}):json(res,404,{error:'not_found'})}
      if(req.method==='GET'&&url.pathname==='/api/telegram/status'){const row=db.prepare('SELECT * FROM telegram_connections WHERE user_id=?').get(session.user_id);const configured=config.mode!=='disabled'&&Boolean(config.token);return json(res,200,{telegram:{configured,mode:config.mode,status:telegramRuntime?.status||row?.status||(configured?'connected':'disconnected'),lastConnectedAt:telegramRuntime?.lastConnectedAt||row?.last_connected_at||null,lastError:telegramRuntime?.lastError||row?.last_error||null}})}
      if(req.method==='POST'&&url.pathname==='/api/telegram/reconnect'){const now=Date.now();if(!telegramRuntime?.reconnect)return json(res,503,{error:'telegram_not_configured'});db.prepare("INSERT INTO telegram_connections(user_id,status,reconnect_requested_at,updated_at) VALUES (?,'reconnecting',?,?) ON CONFLICT(user_id) DO UPDATE SET status='reconnecting',reconnect_requested_at=excluded.reconnect_requested_at,updated_at=excluded.updated_at").run(session.user_id,now,now);try{await telegramRuntime.reconnect();db.prepare("UPDATE telegram_connections SET status='connected',last_connected_at=?,last_error=NULL,updated_at=? WHERE user_id=?").run(Date.now(),Date.now(),session.user_id);return json(res,200,{telegram:{status:'connected',reconnectRequestedAt:now}})}catch(error){db.prepare("UPDATE telegram_connections SET status='error',last_error=?,updated_at=? WHERE user_id=?").run(String(error.message).slice(0,500),Date.now(),session.user_id);return json(res,503,{error:'telegram_unavailable'})}}
      if(req.method==='POST'&&url.pathname==='/api/telegram/disconnect'){const now=Date.now();await telegramRuntime?.disconnect?.();db.prepare("INSERT INTO telegram_connections(user_id,status,updated_at) VALUES (?,'disconnected',?) ON CONFLICT(user_id) DO UPDATE SET status='disconnected',updated_at=excluded.updated_at").run(session.user_id,now);return json(res,200,{telegram:{status:'disconnected'}})}
      return json(res,404,{error:'not_found'})
    } catch(error) { console.error('Request failed:', error?.message || 'unknown'); const busy=String(error?.message||'').includes('database is locked')||String(error?.code||'').includes('SQLITE_BUSY');return json(res,error.status|| (busy?503:500),{error:error.status?'bad_request':busy?'database_busy':'internal_error'}) }
  })
}
