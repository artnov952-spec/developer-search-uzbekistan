import { setTimeout as sleep } from 'node:timers/promises'

export const SOURCE_ADAPTERS = [
  { id: 'hh-uz', label: 'hh.uz', priority: 1, hosts: ['hh.uz'], publicOnly: true },
  { id: 'olx-uz', label: 'OLX Uzbekistan', priority: 2, hosts: ['olx.uz'], publicOnly: true },
  { id: 'talent-park', label: 'Talent Park', priority: 3, hosts: ['talentpark.uz', 'talent-park.uz'], publicOnly: true },
  { id: 'it-market', label: 'IT Market', priority: 4, hosts: ['it-market.uz', 'itmarket.uz'], publicOnly: true },
  { id: 'telegram-resume', label: 'Telegram resume channels', priority: 5, hosts: ['t.me', 'telegram.me'], publicOnly: true },
  { id: 'github', label: 'GitHub', priority: 6, hosts: ['github.com'], publicOnly: true },
  { id: 'community-school', label: 'Stack communities and schools', priority: 7, hosts: ['stackoverflow.com', 'dev.to', 'freecodecamp.org', 'najottalim.uz', 'mohirdev.uz', 'astrum.uz'], publicOnly: true },
]
const SOCIAL = new Map([['github.com','github'],['linkedin.com','linkedin'],['twitter.com','twitter'],['x.com','twitter'],['instagram.com','instagram'],['facebook.com','facebook'],['t.me','telegram'],['telegram.me','telegram'],['gitlab.com','gitlab'],['dev.to','devto'],['stackoverflow.com','stackoverflow']])
const FOLLOW_HINT = /(?:contact|about|bio|profile|portfolio|resume|résumé|cv|github|gitlab|website|homepage|social|telegram|linkedin|twitter|контакт|обо.мне|портфолио|резюме)/i
const SKIP_EXT = /\.(?:png|jpe?g|gif|webp|svg|pdf|zip|rar|mp4|mp3|css|js|xml|json)(?:$|\?)/i
const LOGIN_HINT = /(?:captcha|access denied|доступ ограничен|log in to continue|sign in to continue|войдите, чтобы продолжить|требуется авторизация)/i

function host(raw) { return new URL(raw).hostname.replace(/^www\./, '').toLowerCase() }
export function identifySource(raw) { const h=host(raw); return SOURCE_ADAPTERS.find(a=>a.hosts.some(x=>h===x||h.endsWith(`.${x}`))) || {id:'public-web',label:'Public web',priority:99,hosts:[h],publicOnly:true} }
function canonical(raw, base) { try { const u=new URL(raw,base); if(!/^https?:$/.test(u.protocol)) return null; u.hash=''; for(const k of [...u.searchParams.keys()]) if(/^utm_|^(fbclid|gclid)$/i.test(k)) u.searchParams.delete(k); u.pathname=u.pathname.replace(/\/{2,}/g,'/'); return u.href } catch{return null} }
function decode(s) { return s.replace(/&#(\d+);/g,(_,n)=>String.fromCharCode(Number(n))).replace(/&#x([\da-f]+);/gi,(_,n)=>String.fromCharCode(parseInt(n,16))).replace(/&nbsp;/gi,' ').replace(/&amp;/gi,'&').replace(/&quot;/gi,'"').replace(/&#39;|&apos;/gi,"'") }
function visibleText(html) { return decode(html.replace(/<(script|style|template|noscript)\b[^>]*>[\s\S]*?<\/\1>/gi,' ').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ')) }
export function extractLinks(html,base) { const out=[]; for(const m of html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)){const hm=m[1].match(/\bhref\s*=\s*(?:["']([^"']+)["']|([^\s>]+))/i); const url=hm&&canonical(decode(hm[1]||hm[2]),base); if(url)out.push({url,text:visibleText(m[2]),attrs:visibleText(m[1])})} return out }
function normPhone(v){const plus=v.trim().startsWith('+'), n=v.replace(/\D/g,''); return n.length>=7&&n.length<=15?`${plus?'+':''}${n}`:null}
function social(link){const u=new URL(link),network=SOCIAL.get(host(link));if(!network)return null;const bits=u.pathname.split('/').filter(Boolean);if(!bits.length||/^(share|intent|search|home|login|signup|explore|s)$/i.test(bits[0]))return null;if(network==='telegram'&&!/^[a-z][a-z0-9_]{3,}$/i.test(bits[0]))return null;return {type:network==='telegram'?'telegram':'social',value:network==='telegram'?`@${bits[0]}`:`${network}:${u.pathname.replace(/\/+$/,'')}`,profileUrl:link}}
export function extractContacts(html,url,chain=[url]) { const text=visibleText(html), found=[]; const add=(type,value,normalized=value,profileUrl)=>found.push({type,value,normalized,sourceUrl:url,discoveryChain:[...chain],...(profileUrl?{profileUrl}:{})})
 for(const m of text.matchAll(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi))add('email',m[0],m[0].toLowerCase())
 for(const m of html.matchAll(/mailto:([^"'\s>?]+)/gi)){const v=decodeURIComponent(m[1]).split('?')[0];if(/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v))add('email',v,v.toLowerCase())}
 // Free-text numbers are accepted only with an international '+' or an explicit
 // contact label, preventing salaries, dates and view counts from becoming phones.
 for(const m of text.matchAll(/(?:\+\d[\d\s().-]{5,}\d)|(?:(?:phone|tel(?:ephone)?|mobile|whatsapp|телефон|тел\.?|моб(?:ильный)?)[\s:–—-]{1,5})(\d[\d\s().-]{5,}\d)/gi)){const raw=m[1]||m[0];const n=normPhone(raw);if(n)add('phone',raw.trim(),n)}
 for(const m of html.matchAll(/(?:tel:|(?:wa\.me\/|api\.whatsapp\.com\/send\?phone=))(\+?[\d(). -]{7,})/gi)){const n=normPhone(m[1]);if(n)add('phone',m[1].trim(),n)}
 for(const l of extractLinks(html,url)){const p=social(l.url);if(p)add(p.type,p.value,p.value.toLowerCase(),p.profileUrl)} return found }
async function robotPolicy(origin,fetcher,userAgent,timeoutMs){try{const r=await fetcher(`${origin}/robots.txt`,{headers:{'user-agent':userAgent},signal:AbortSignal.timeout(timeoutMs)});if(!r.ok)return ()=>true;const groups=(await r.text()).split(/\r?\n/);let applies=false;const denied=[];for(const raw of groups){const line=raw.replace(/#.*/,'').trim(),i=line.indexOf(':');if(i<0)continue;const k=line.slice(0,i).trim().toLowerCase(),v=line.slice(i+1).trim();if(k==='user-agent')applies=v==='*'||v.toLowerCase()===userAgent.toLowerCase();else if(applies&&k==='disallow'&&v)denied.push(v)}return path=>!denied.some(d=>path.startsWith(d))}catch{return ()=>true}}
function canFollow(link,current,seed){if(SKIP_EXT.test(link.url))return false;const lh=host(link.url), sh=host(seed), ch=host(current);if(lh==='telegram.org')return false;if(lh===ch||lh===sh)return true;if(SOCIAL.has(lh))return true;return FOLLOW_HINT.test(`${link.text} ${link.attrs} ${new URL(link.url).pathname}`)}
function reasonFor(response,html){if([401,403,429].includes(response.status))return response.status===429?'rate-limited':response.status===401?'login-required':'access-blocked';if(!response.ok)return `http-${response.status}`;if(LOGIN_HINT.test(visibleText(html).slice(0,3000)))return 'login-or-challenge';return null}

const GITHUB_RESERVED = new Set(['about','account','apps','collections','contact','dashboard','enterprise','events','explore','features','issues','login','marketplace','new','notifications','organizations','orgs','pricing','pulls','search','security','settings','signup','site','sponsors','topics','trending'])
function isCandidateLink(adapter, link) {
  const u=new URL(link.url), p=u.pathname.replace(/\/+$/,'')
  if(adapter.id==='hh-uz') return /^\/resume\/[\w-]+/i.test(p)
  if(adapter.id==='olx-uz') return /^\/d\/(?:obyavlenie|ogloszenie)\//i.test(p) || /(?:resume|rezyume|ish-qidiraman|ищу-работу)/i.test(p)
  if(adapter.id==='it-market') return /\/(?:specialists?|experts?|freelancers?|profile|users?)\//i.test(p)
  if(adapter.id==='telegram-resume') return /^\/s\/[^/]+\/\d+$/i.test(p) || /^\/[^/]+\/\d+$/i.test(p)
  if(adapter.id==='github') { const bits=p.split('/').filter(Boolean); return bits.length===1 && !GITHUB_RESERVED.has(bits[0].toLowerCase()) }
  if(adapter.id==='community-school'||adapter.id==='public-web') return /(?:profile|member|student|alumni|mentor|speaker|author|portfolio|resume|cv|developer|specialist|talent)/i.test(`${p} ${link.text} ${link.attrs}`)
  return false
}
function isNextPage(adapter, link, pageUrl) {
  const u=new URL(link.url), current=new URL(pageUrl)
  if(u.origin!==current.origin)return false
  if(/(?:rel\s*=\s*["']?next|aria-label\s*=\s*["'][^"']*(?:next|след|keyingi))/i.test(link.attrs))return true
  if(/^(?:next|следующая|далее|keyingi|›|»|→)$/i.test(link.text.trim()))return true
  if(adapter.id==='github')return u.pathname===current.pathname&&u.searchParams.has('p')
  return u.searchParams.has('page')||u.searchParams.has('p')
}

export async function discoverCandidateInputs(records, options={}) {
  const fetcher=options.fetch??fetch, timeoutMs=options.timeoutMs??8000, delayMs=options.delayMs??150
  const userAgent=options.userAgent??'PublicContactCrawler/2.0 (+public-pages-only)'
  const maxListingPages=options.maxListingPages??3, maxCandidates=options.maxCandidates??50
  const direct=[], discovered=[], discoveryReports=[], discoveredUrls=new Set()
  const priority=r=>{if(r.type!=='source'&&r.type!=='listing'&&r.kind!=='listing')return -1;try{return identifySource(r.url).priority}catch{return 999}}
  const ordered=[...records].map((r,i)=>({r,i,p:priority(r)})).sort((a,b)=>a.p-b.p||a.i-b.i).map(x=>x.r)
  for(const record of ordered){
    const mode=record.type||record.kind||'candidate'
    if(mode==='unsupported'||mode==='restricted'){
      discoveryReports.push({sourceId:record.id,url:record.url,source:record.source||'unconfigured',label:record.name,status:mode==='restricted'?'restricted-source':'unsupported-source',reason:record.reason||'no-deterministic-public-adapter'})
      continue
    }
    if(mode!=='source'&&mode!=='listing'){direct.push(record);continue}
    const start=canonical(record.url), adapter=start&&identifySource(start)
    if(!start){discoveryReports.push({sourceId:record.id,url:record.url,status:'invalid-url'});continue}
    if(adapter.id==='talent-park'){discoveryReports.push({sourceId:record.id,url:start,source:adapter.id,status:'unsupported-source',reason:'no-stable-public-listing-adapter'});continue}
    const queue=[start], seen=new Set(), candidates=new Map(), failures=[], policies=new Map()
    while(queue.length&&seen.size<maxListingPages&&candidates.size<maxCandidates){
      const page=queue.shift();if(seen.has(page))continue;seen.add(page)
      const u=new URL(page);let allow=policies.get(u.origin);if(!allow){allow=await robotPolicy(u.origin,fetcher,userAgent,timeoutMs);policies.set(u.origin,allow)}if(!allow(u.pathname)){failures.push({url:page,reason:'robots-disallowed'});continue}
      try{const r=await fetcher(page,{headers:{'user-agent':userAgent,accept:'text/html,application/xhtml+xml'},redirect:'follow',signal:AbortSignal.timeout(timeoutMs)});if(!r.ok){failures.push({url:page,reason:reasonFor(r,'')});continue}const type=r.headers.get('content-type')||'';if(!type.includes('text/html')&&!type.includes('application/xhtml+xml')){failures.push({url:page,reason:'non-html'});continue}const html=await r.text(),blocked=reasonFor(r,html);if(blocked){failures.push({url:page,reason:blocked});continue}
        for(const link of extractLinks(html,page)){if(isCandidateLink(adapter,link)&&!candidates.has(link.url))candidates.set(link.url,{url:link.url,chain:[start,...(page===start?[]:[page]),link.url]});if(isNextPage(adapter,link,page)&&!seen.has(link.url)&&queue.length+seen.size<maxListingPages)queue.push(link.url)}
      }catch(e){failures.push({url:page,reason:e?.name==='TimeoutError'?'timeout':'network-error'})}
      if(delayMs)await sleep(delayMs)
    }
    let i=0;for(const candidate of candidates.values()){if(discoveredUrls.has(candidate.url))continue;discoveredUrls.add(candidate.url);discovered.push({id:`${record.id}:${++i}`,name:record.name,url:candidate.url,_discoveryChain:candidate.chain,_sourceRecordId:record.id})}
    const status=candidates.size?'candidates-discovered':failures[0]?.reason||(seen.size?'no-candidate-links':'unreachable')
    discoveryReports.push({sourceId:record.id,url:start,source:adapter.id,label:adapter.label,status,listingPages:[...seen],candidateCount:candidates.size,failures})
  }
  return {inputs:[...direct,...discovered],discoveryReports}
}

export async function crawlCandidates(inputs,options={}){const maxDepth=options.maxDepth??3,maxPages=options.maxPages??30,timeoutMs=options.timeoutMs??8000,delayMs=options.delayMs??150,userAgent=options.userAgent??'PublicContactCrawler/2.0 (+public-pages-only)',fetcher=options.fetch??fetch,results=[],sourceReports=[]
 const discovery=await discoverCandidateInputs(inputs,{...options,fetch:fetcher,timeoutMs,delayMs,userAgent})
 const sorted=[...discovery.inputs].map((x,i)=>({...x,_i:i,_source:identifySource(x.url)})).sort((a,b)=>a._source.priority-b._source.priority||a._i-b._i)
 for(const input of sorted){const seed=canonical(input.url);if(!seed){sourceReports.push({candidateId:input.id,status:'invalid-url',url:input.url});continue}const policies=new Map(),initialChain=input._discoveryChain||[seed],queue=[{url:seed,depth:0,chain:initialChain}],seen=new Set(),contacts=[],pages=[],failures=[]
 while(queue.length&&seen.size<maxPages){queue.sort((a,b)=>Number(FOLLOW_HINT.test(b.url))-Number(FOLLOW_HINT.test(a.url))||a.depth-b.depth||a.url.localeCompare(b.url));const item=queue.shift();if(!item||seen.has(item.url))continue;seen.add(item.url);const u=new URL(item.url);let allow=policies.get(u.origin);if(!allow){allow=await robotPolicy(u.origin,fetcher,userAgent,timeoutMs);policies.set(u.origin,allow)}if(!allow(u.pathname)){failures.push({url:item.url,reason:'robots-disallowed',discoveryChain:item.chain});continue}
  try{const r=await fetcher(item.url,{headers:{'user-agent':userAgent,accept:'text/html,application/xhtml+xml'},redirect:'follow',signal:AbortSignal.timeout(timeoutMs)});const type=r.headers.get('content-type')||'';if(!r.ok){failures.push({url:item.url,reason:reasonFor(r,'')});continue}if(!type.includes('text/html')&&!type.includes('application/xhtml+xml')){failures.push({url:item.url,reason:'non-html'});continue}const html=await r.text(),blocked=reasonFor(r,html);if(blocked){failures.push({url:item.url,reason:blocked});continue}pages.push(item.url);contacts.push(...extractContacts(html,item.url,item.chain));if(item.depth<maxDepth)for(const l of extractLinks(html,item.url))if(canFollow(l,item.url,seed)&&!seen.has(l.url))queue.push({url:l.url,depth:item.depth+1,chain:[...item.chain,l.url]})}catch(e){failures.push({url:item.url,reason:e?.name==='TimeoutError'?'timeout':'network-error'})}if(delayMs)await sleep(delayMs)}
 const dedupe=new Map();for(const c of contacts){const key=`${c.type}:${c.normalized}`;const old=dedupe.get(key);if(!old||c.discoveryChain.length<old.discoveryChain.length)dedupe.set(key,c)}const unique=[...dedupe.values()].sort((a,b)=>a.type.localeCompare(b.type)||a.normalized.localeCompare(b.normalized));const status=unique.length?'contacts-found':pages.length?'no-public-contact':failures[0]?.reason||'unreachable';sourceReports.push({candidateId:input.id,source:input._source.id,label:input._source.label,url:seed,status,crawledPages:pages.length,failures});if(unique.length)results.push({candidateId:input.id,name:input.name,inputUrl:seed,source:{id:input._source.id,label:input._source.label},contacts:unique,crawledPages:pages,failures})}
 const byUrl=new Map();for(const candidate of results){const old=byUrl.get(candidate.inputUrl);if(!old)byUrl.set(candidate.inputUrl,candidate);else{for(const contact of candidate.contacts)if(!old.contacts.some(x=>x.type===contact.type&&x.normalized===contact.normalized))old.contacts.push(contact)}}
 return {schemaVersion:3,generatedAt:new Date().toISOString(),candidates:[...byUrl.values()],discoveryReports:discovery.discoveryReports,sourceReports,limits:{maxDepth,maxPages,maxListingPages:options.maxListingPages??3,maxCandidates:options.maxCandidates??50,timeoutMs,delayMs},policy:{publicOnly:true,llm:false}}
}
