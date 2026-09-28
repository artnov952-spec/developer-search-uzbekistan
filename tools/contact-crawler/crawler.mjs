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
const CLOSED_PROFILE_HINT = /(?:profile (?:is )?(?:private|closed|unavailable)|private profile|account (?:is )?private|профиль (?:закрыт|недоступен)|закрытый профиль|this account is private)/i
const PAID_PROFILE_HINT = /(?:subscribe to (?:view|contact)|pay to (?:view|contact)|premium (?:required|profile)|unlock (?:this )?(?:profile|contact)|контакты доступны (?:после оплаты|по подписке)|платный доступ)/i

function host(raw) { return new URL(raw).hostname.replace(/^www\./, '').toLowerCase() }
export function identifySource(raw) { const h=host(raw); return SOURCE_ADAPTERS.find(a=>a.hosts.some(x=>h===x||h.endsWith(`.${x}`))) || {id:'public-web',label:'Public web',priority:99,hosts:[h],publicOnly:true} }
function canonical(raw, base) { try { const u=new URL(raw,base); if(!/^https?:$/.test(u.protocol)) return null; u.hash=''; for(const k of [...u.searchParams.keys()]) if(/^utm_|^(fbclid|gclid)$/i.test(k)) u.searchParams.delete(k); u.pathname=u.pathname.replace(/\/{2,}/g,'/'); return u.href } catch{return null} }
function decode(s) { return s.replace(/&#(\d+);/g,(_,n)=>String.fromCharCode(Number(n))).replace(/&#x([\da-f]+);/gi,(_,n)=>String.fromCharCode(parseInt(n,16))).replace(/&nbsp;/gi,' ').replace(/&amp;/gi,'&').replace(/&quot;/gi,'"').replace(/&#39;|&apos;/gi,"'") }
function visibleText(html) { return decode(html.replace(/<(script|style|template|noscript)\b[^>]*>[\s\S]*?<\/\1>/gi,' ').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ')) }
function attr(tag,name){const match=tag.match(new RegExp(`\\b${name}\\s*=\\s*(?:["']([^"']*)["']|([^\\s>]+))`,'i'));return match?decode(match[1]??match[2]):null}
const IMAGE_HINT=/(?:avatar|profile|portrait|headshot|user[-_ ]?photo|photo[-_ ]?profile|фото|аватар)/i
const IMAGE_REJECT=/(?:tracking|tracker|pixel|beacon|spacer|transparent|analytics|counter|favicon|sprite|logo|badge)(?:[._/?-]|$)/i
function publicImageUrl(raw,base){try{const value=String(raw||'').trim();if(!value||/^(?:data|blob|javascript):/i.test(value))return null;const u=new URL(value,base);if(!/^https?:$/.test(u.protocol)||IMAGE_REJECT.test(`${u.hostname}${u.pathname}`))return null;return u.href}catch{return null}}
function schemaImages(value,out=[]){if(!value||typeof value!=='object')return out;if(Array.isArray(value)){for(const item of value)schemaImages(item,out);return out}const type=String(value['@type']||'').toLowerCase();if(type==='person'&&value.image){const image=typeof value.image==='string'?value.image:value.image?.url||value.image?.contentUrl;if(image)out.push(image)}for(const key of ['@graph','mainEntity','author','about'])schemaImages(value[key],out);return out}
export function extractCandidatePhoto(html,url){const found=[];const add=(raw,method,priority)=>{const imageUrl=publicImageUrl(raw,url);if(imageUrl)found.push({url:imageUrl,sourceUrl:url,method,priority})}
 for(const tag of html.match(/<meta\b[^>]*>/gi)||[]){const key=(attr(tag,'property')||attr(tag,'name')||'').toLowerCase();if(key==='og:image'||key==='og:image:url')add(attr(tag,'content'),'og:image',10);else if(key==='twitter:image'||key==='twitter:image:src')add(attr(tag,'content'),'twitter:image',20)}
 for(const match of html.matchAll(/<script\b[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)){try{for(const image of schemaImages(JSON.parse(match[1])))add(image,'schema.org/Person.image',30)}catch{}}
 for(const tag of html.match(/<img\b[^>]*>/gi)||[]){const descriptor=[attr(tag,'class'),attr(tag,'id'),attr(tag,'alt'),attr(tag,'itemprop')].filter(Boolean).join(' ');if(!IMAGE_HINT.test(descriptor)&&!/\bimage\b/i.test(attr(tag,'itemprop')||''))continue;const width=Number(attr(tag,'width')),height=Number(attr(tag,'height'));if((width&&width<=2)||(height&&height<=2))continue;add(attr(tag,'src')||attr(tag,'data-src')||attr(tag,'data-lazy-src'),'profile/avatar img',40)}
 return found.sort((a,b)=>a.priority-b.priority||a.url.localeCompare(b.url))[0] ? (({priority,...photo})=>photo)(found.sort((a,b)=>a.priority-b.priority||a.url.localeCompare(b.url))[0]) : null
}
export function extractLinks(html,base) { const out=[]; for(const m of html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)){const hm=m[1].match(/\bhref\s*=\s*(?:["']([^"']+)["']|([^\s>]+))/i); const url=hm&&canonical(decode(hm[1]||hm[2]),base); if(url)out.push({url,text:visibleText(m[2]),attrs:visibleText(m[1])})} return out }
function normPhone(v){const plus=v.trim().startsWith('+'), n=v.replace(/\D/g,''); return n.length>=7&&n.length<=15?`${plus?'+':''}${n}`:null}
function social(link){const u=new URL(link),network=SOCIAL.get(host(link));if(!network)return null;const bits=u.pathname.split('/').filter(Boolean);if(!bits.length||/^(share|intent|search|home|login|signup|explore|s|joinchat)$/i.test(bits[0]))return null;if(network==='telegram'&&!/^[a-z][a-z0-9_]{3,}$/i.test(bits[0]))return null;return {type:network==='telegram'?'telegram':'social',value:network==='telegram'?`@${bits[0]}`:`${network}:${u.pathname.replace(/\/+$/,'')}`,profileUrl:link}}
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
function reasonFor(response,html){if([401,403,429].includes(response.status))return response.status===429?'rate-limited':response.status===401?'login-required':'access-blocked';if(!response.ok)return `http-${response.status}`;const text=visibleText(html).slice(0,5000);if(LOGIN_HINT.test(text))return 'login-or-challenge';if(CLOSED_PROFILE_HINT.test(text))return 'closed-or-private-profile';if(PAID_PROFILE_HINT.test(text))return 'paid-contact-profile';return null}

const GENERIC_NAME=/^(?:candidate|candidate profile|profile|resume|résumé|cv|developer|specialist|freelancer|portfolio|view profile|open|details|подробнее|профиль|резюме|кандидат|специалист)$/i
const SITE_SUFFIX=/\s*(?:[-–—|·:]\s*)?(?:github|linkedin|hh\.uz|olx(?: uzbekistan)?|it market|telegram|ustoz shogird|uzb develop|it resume uzbekistan)\s*$/i
function cleanCandidateName(value){const name=decode(String(value||'')).replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').replace(SITE_SUFFIX,'').trim().replace(/[^\p{L}\p{N}'’.-]+$/gu,'');if(!name||name.length<2||name.length>100||GENERIC_NAME.test(name)||/^\d{1,2}:\d{2}(?:\s|$)|^https?:|^@|\S+@\S+/.test(name))return null;return name}
function nameFromListingLink(link){return cleanCandidateName(link.text)}
function telegramPostHtml(html,url){const u=new URL(url),bits=u.pathname.split('/').filter(Boolean),offset=bits[0]==='s'?1:0,channel=bits[offset],messageId=bits[offset+1];if(!channel||!/^\d+$/.test(messageId||''))return html;const escaped=channel.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),match=new RegExp(`data-post=["']${escaped}/${messageId}["']`,'i').exec(html);if(!match)return '';const at=match.index,start=html.lastIndexOf('<div class="tgme_widget_message_wrap',at),next=html.indexOf('<div class="tgme_widget_message_wrap',at+match[0].length);return html.slice(start<0?at:start,next<0?html.length:next)}
function telegramPersonName(html){const text=visibleText(html),stop="Yosh|Texnologiya|Telegram|Hudud|Narxi|Kasbi|Murojaat(?: qilish)? vaqti|Murojaat|Maqsad|Aloqa|Ish vaqti|Maosh";for(const label of ["Xodim|Shogird|Ustoz|Nomzod|Dasturchi|Developer|Employee|Candidate","Mas['’]?ul|Ism(?:i)?"]){const raw=text.match(new RegExp(`(?:${label})\\s*:\\s*(.+?)(?=\\s+[^\\p{L}\\p{N}]{0,8}(?:${stop})\\s*:|$)`,'iu'))?.[1],name=cleanCandidateName(raw);if(name)return name}return null}
function isResumePost(html){const text=visibleText(html);return /(?:#(?:резюме|resume|cv|ищу_работу|ищуработу)(?=\s|[^\p{L}\p{N}_]|$)|(?:^|[^\p{L}\p{N}_])(?:резюме|resume|curriculum vitae)(?=\s|[^\p{L}\p{N}_]|$)|(?:^|[^\p{L}\p{N}_])(?:xodim|shogird|nomzod|candidate|employee)\s*:|(?:^|[^\p{L}\p{N}_])(?:ищу|ищет|seeking|looking for)\s+(?:работу|work|job)|(?:^|[^\p{L}\p{N}_])(?:готов|открыт)\s+к\s+(?:работе|предложениям))/iu.test(text)&&!/^\s*(?:вакансия|vacancy)\b/iu.test(text)}
const PROFILE_LABELS = {
 role: /(?:должность|позиция|специализация|роль|kasbi|yo['’]?nalish|mutaxassisligi|position|role|speciali[sz]ation)\s*[:–—-]\s*([^|•\n]{2,100})/iu,
 location: /(?:город|локация|местоположение|hudud|shahar|location|city)\s*[:–—-]\s*([^|•\n]{2,80})/iu,
 experience: /(?:опыт(?: работы)?|tajriba|experience)\s*[:–—-]\s*([^|•\n]{1,80})/iu,
 skills: /(?:навыки|стек|технологии|skills|stack|texnologiyalar)\s*[:–—-]\s*([^|•\n]{2,240})/iu,
 languages: /(?:языки|tillar|languages)\s*[:–—-]\s*([^|•\n]{2,160})/iu,
 workMode: /(?:формат работы|режим работы|ish formati|work mode|format)\s*[:–—-]\s*([^|•\n]{2,80})/iu,
 employment: /(?:занятость|тип занятости|bandlik|employment)\s*[:–—-]\s*([^|•\n]{2,80})/iu,
 salary: /(?:зарплата|ожидания|maosh|salary|rate)\s*[:–—-]\s*([^|•\n]{1,100})/iu,
 availability: /(?:статус|поиск работы|готовность|holat|availability)\s*[:–—-]\s*([^|•\n]{2,100})/iu,
}
function cleanField(value,max=120){const result=String(value||'').replace(/\s+/g,' ').trim().replace(/[.,;]+$/,'');return result&&result.length<=max?result:null}
function listField(value){return [...new Set(String(value||'').split(/[,;/•|]+/).map(item=>cleanField(item,60)).filter(Boolean))].slice(0,30)}
function evidence(field,value,url){return {field,value,sourceUrl:url,method:'explicit-label'} }
export function extractCandidateProfile(html,url){
 const text=visibleText(html), profile={}, proof=[]
 const take=(field,pattern,transform=value=>cleanField(value))=>{const raw=text.match(pattern)?.[1],value=raw&&transform(raw);if(value&&(Array.isArray(value)?value.length:true)){profile[field]=value;proof.push(evidence(field,value,url))}}
 take('role',PROFILE_LABELS.role);take('location',PROFILE_LABELS.location);take('experience',PROFILE_LABELS.experience)
 take('skills',PROFILE_LABELS.skills,listField);take('languages',PROFILE_LABELS.languages,listField)
 take('workMode',PROFILE_LABELS.workMode);take('employment',PROFILE_LABELS.employment);take('availability',PROFILE_LABELS.availability)
 const salaryRaw=text.match(PROFILE_LABELS.salary)?.[1]
 if(salaryRaw){const value=cleanField(salaryRaw,100),amount=value?.match(/(?:от\s*)?([\d\s.,]{2,})\s*(USD|UZS|сум|so['’]?m|руб|RUB|EUR|€|\$)/iu);if(value&&amount){const currency=/usd|\$/i.test(amount[2])?'USD':/eur|€/i.test(amount[2])?'EUR':/rub|руб/i.test(amount[2])?'RUB':'UZS',numeric=Number(amount[1].replace(/\s/g,'').replace(',','.'));profile.salary={label:value,...(Number.isFinite(numeric)?{amount:numeric}:{}),currency};proof.push(evidence('salary',profile.salary,url))}}
 const years=String(profile.experience||'').match(/(\d+(?:[.,]\d+)?)\s*(?:года?|лет|years?|yil)/iu);if(years){profile.experienceYears=Number(years[1].replace(',','.'));proof.push(evidence('experienceYears',profile.experienceYears,url))}
 const roleAndExperience=`${profile.role||''} ${profile.experience||''}`.toLowerCase();const seniority=roleAndExperience.match(/\b(intern|стаж[её]р|junior|middle|senior|lead|trainee|jun|mid|sen)\b/i)?.[1];if(seniority){profile.seniority=({intern:'Intern','стажер':'Intern','стажёр':'Intern',trainee:'Intern',jun:'Junior',junior:'Junior',mid:'Middle',middle:'Middle',sen:'Senior',senior:'Senior',lead:'Lead'}[seniority.toLowerCase()]||seniority);proof.push(evidence('seniority',profile.seniority,url))}
 const time=html.match(/<time\b[^>]*datetime=["']([^"']+)["']/i)?.[1]||html.match(/data-time=["'](\d+)["']/i)?.[1];if(time){const date=/^\d+$/.test(time)?new Date(Number(time)*1000):new Date(time);if(!Number.isNaN(date.valueOf())){profile.publishedAt=date.toISOString();proof.push(evidence('publishedAt',profile.publishedAt,url))}}
 return {profile,evidence:proof}
}
export function extractCandidateName(html){
 const jsonLd=[...html.matchAll(/<script\b[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];for(const match of jsonLd){try{const data=JSON.parse(match[1]),items=Array.isArray(data)?data:[data];for(const item of items){if(String(item?.['@type']||'').toLowerCase()==='person'){const name=cleanCandidateName(item.name);if(name)return name}}}catch{}}
 const selectors=[/<meta\b[^>]*(?:property|name)\s*=\s*["'](?:profile:first_name|og:title|twitter:title)["'][^>]*content\s*=\s*["']([^"']+)["'][^>]*>/i,/<meta\b[^>]*content\s*=\s*["']([^"']+)["'][^>]*(?:property|name)\s*=\s*["'](?:profile:first_name|og:title|twitter:title)["'][^>]*>/i,/<h1\b[^>]*>([\s\S]*?)<\/h1>/i,/<title\b[^>]*>([\s\S]*?)<\/title>/i];for(const re of selectors){const match=html.match(re),name=match&&cleanCandidateName(visibleText(match[1]));if(name)return name}return null
}

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
function candidateCrawlUrl(adapter,raw){if(adapter.id!=='telegram-resume')return raw;const u=new URL(raw),bits=u.pathname.split('/').filter(Boolean);if(bits[0]!=='s'&&bits.length===2&&/^\d+$/.test(bits[1]))u.pathname=`/s/${bits[0]}/${bits[1]}`;return u.href}
function paginationUrl(adapter, raw, pageUrl){const u=new URL(raw),current=new URL(pageUrl);if(adapter.id==='telegram-resume'&&current.searchParams.has('q')&&!u.searchParams.has('q'))u.searchParams.set('q',current.searchParams.get('q'));return u.href}
function isNextPage(adapter, link, pageUrl) {
  const u=new URL(link.url), current=new URL(pageUrl)
  if(u.origin!==current.origin)return false
  if(/(?:rel\s*=\s*["']?next|aria-label\s*=\s*["'][^"']*(?:next|след|keyingi))/i.test(link.attrs))return true
  if(/^(?:next|следующая|далее|keyingi|›|»|→)$/i.test(link.text.trim()))return true
  if(adapter.id==='telegram-resume')return u.pathname===current.pathname&&u.searchParams.has('before')
  if(adapter.id==='github')return u.pathname===current.pathname&&u.searchParams.has('p')
  return u.searchParams.has('page')||u.searchParams.has('p')
}

export async function discoverCandidateInputs(records, options={}) {
  const fetcher=options.fetch??fetch, timeoutMs=options.timeoutMs??8000, delayMs=options.delayMs??150
  const userAgent=options.userAgent??'PublicContactCrawler/2.0 (+public-pages-only)'
  const configuredListingPages=options.maxListingPages??3, configuredCandidates=options.maxCandidates??50
  const maxListingPages=configuredListingPages>0?configuredListingPages:Infinity
  const maxCandidates=configuredCandidates>0?configuredCandidates:Infinity
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
        for(const link of extractLinks(html,page)){if(isCandidateLink(adapter,link)){const candidateUrl=candidateCrawlUrl(adapter,link.url);if(!candidates.has(candidateUrl))candidates.set(candidateUrl,{url:candidateUrl,name:adapter.id==='telegram-resume'?null:nameFromListingLink(link),chain:[start,...(page===start?[]:[page]),candidateUrl]})};if(isNextPage(adapter,link,page)){const next=paginationUrl(adapter,link.url,page);if(!seen.has(next)&&queue.length+seen.size<maxListingPages)queue.push(next)}}
      }catch(e){failures.push({url:page,reason:e?.name==='TimeoutError'?'timeout':'network-error'})}
      if(delayMs)await sleep(delayMs)
    }
    let i=0;for(const candidate of candidates.values()){if(discoveredUrls.has(candidate.url))continue;discoveredUrls.add(candidate.url);discovered.push({id:`${record.id}:${++i}`,url:candidate.url,...(candidate.name?{_listingName:candidate.name}:{}),_discoveryChain:candidate.chain,_sourceRecordId:record.id,...(record.requireResumePost?{_requireResumePost:true}:{})})}
    const status=candidates.size?'candidates-discovered':failures[0]?.reason||(seen.size?'no-candidate-links':'unreachable')
    discoveryReports.push({sourceId:record.id,url:start,source:adapter.id,label:adapter.label,status,listingPages:[...seen],candidateCount:candidates.size,failures})
  }
  return {inputs:[...direct,...discovered],discoveryReports}
}

export async function crawlCandidates(inputs,options={}){const maxDepth=options.maxDepth??3,maxPages=options.maxPages??30,timeoutMs=options.timeoutMs??8000,delayMs=options.delayMs??150,userAgent=options.userAgent??'PublicContactCrawler/2.0 (+public-pages-only)',fetcher=options.fetch??fetch,results=[],sourceReports=[]
 if(!Array.isArray(inputs))throw new TypeError('crawler input must be an array')
 const validInputs=[];const invalidReports=[];const ids=new Set();for(const input of inputs){if(!input||typeof input!=='object'||typeof input.id!=='string'||!input.id.trim()||typeof input.url!=='string'){invalidReports.push({candidateId:input?.id,status:'invalid-input',url:input?.url});continue}if(ids.has(input.id)){invalidReports.push({candidateId:input.id,status:'duplicate-input-id',url:input.url});continue}ids.add(input.id);validInputs.push(input)}sourceReports.push(...invalidReports)
 const discovery=await discoverCandidateInputs(validInputs,{...options,fetch:fetcher,timeoutMs,delayMs,userAgent})
 const sorted=[...discovery.inputs].map((x,i)=>({...x,_i:i,_source:identifySource(x.url)})).sort((a,b)=>a._source.priority-b._source.priority||a._i-b._i)
 const resume=options.resumeState||{};const completed=new Set(Array.isArray(resume.completedIds)?resume.completedIds:[]);if(Array.isArray(resume.candidates))results.push(...resume.candidates);if(Array.isArray(resume.sourceReports))sourceReports.push(...resume.sourceReports)
 for(const input of sorted){if(completed.has(input.id))continue;const seed=canonical(input.url);if(!seed){sourceReports.push({candidateId:input.id,status:'invalid-url',url:input.url});completed.add(input.id);if(options.onCheckpoint)await options.onCheckpoint({completedIds:[...completed],candidates:results,sourceReports});continue}if(input._source.id==='telegram-resume'&&!/^\/s\/[^/]+\/\d+$/i.test(new URL(seed).pathname)){sourceReports.push({candidateId:input.id,status:'unsupported-telegram-profile',url:seed,failures:[{url:seed,reason:'telegram-member-or-non-post'}]});completed.add(input.id);if(options.onCheckpoint)await options.onCheckpoint({completedIds:[...completed],candidates:results,sourceReports});continue}const policies=new Map(),initialChain=input._discoveryChain||[seed],queue=[{url:seed,depth:0,chain:initialChain}],seen=new Set(),contacts=[],pages=[],failures=[];let extractedName=null,extractedProfile={},profileEvidence=[],photo=null
 while(queue.length&&seen.size<maxPages){queue.sort((a,b)=>Number(FOLLOW_HINT.test(b.url))-Number(FOLLOW_HINT.test(a.url))||a.depth-b.depth||a.url.localeCompare(b.url));const item=queue.shift();if(!item||seen.has(item.url))continue;seen.add(item.url);const u=new URL(item.url);let allow=policies.get(u.origin);if(!allow){allow=await robotPolicy(u.origin,fetcher,userAgent,timeoutMs);policies.set(u.origin,allow)}if(!allow(u.pathname)){failures.push({url:item.url,reason:'robots-disallowed',discoveryChain:item.chain});continue}
  try{const r=await fetcher(item.url,{headers:{'user-agent':userAgent,accept:'text/html,application/xhtml+xml'},redirect:'follow',signal:AbortSignal.timeout(timeoutMs)});const type=r.headers.get('content-type')||'';if(!r.ok){failures.push({url:item.url,reason:reasonFor(r,'')});continue}if(!type.includes('text/html')&&!type.includes('application/xhtml+xml')){failures.push({url:item.url,reason:'non-html'});continue}const html=await r.text(),blocked=reasonFor(r,html);if(blocked){failures.push({url:item.url,reason:blocked});continue}pages.push(item.url);const candidateHtml=input._source.id==='telegram-resume'?telegramPostHtml(html,seed):html;if(item.url===seed&&input._source.id==='telegram-resume'&&!isResumePost(candidateHtml)){failures.push({url:item.url,reason:'not-candidate-resume'});continue}if(item.url===seed){extractedName=input._source.id==='telegram-resume'?(telegramPersonName(candidateHtml)||extractCandidateName(candidateHtml)):extractCandidateName(candidateHtml);const extracted=extractCandidateProfile(candidateHtml,item.url);extractedProfile=extracted.profile;profileEvidence=extracted.evidence;photo=extractCandidatePhoto(candidateHtml,item.url)}contacts.push(...extractContacts(candidateHtml,item.url,item.chain));if(input._source.id!=='telegram-resume'&&item.depth<maxDepth)for(const l of extractLinks(html,item.url))if(canFollow(l,item.url,seed)&&!seen.has(l.url))queue.push({url:l.url,depth:item.depth+1,chain:[...item.chain,l.url]})}catch(e){failures.push({url:item.url,reason:e?.name==='TimeoutError'?'timeout':'network-error'})}if(delayMs)await sleep(delayMs)}
 const sourceHandle=input._source.id==='telegram-resume'?`@${new URL(seed).pathname.split('/').filter(Boolean).filter(x=>x!=='s')[0]}`.toLowerCase():null;const dedupe=new Map();for(const c of contacts){if(sourceHandle&&c.type==='telegram'&&c.normalized===sourceHandle)continue;const key=`${c.type}:${c.normalized}`;const old=dedupe.get(key);if(!old||c.discoveryChain.length<old.discoveryChain.length)dedupe.set(key,c)}const unique=[...dedupe.values()].sort((a,b)=>a.type.localeCompare(b.type)||a.normalized.localeCompare(b.normalized));const status=unique.length?'contacts-found':pages.length?'no-public-contact':failures[0]?.reason||'unreachable';sourceReports.push({candidateId:input.id,source:input._source.id,label:input._source.label,url:seed,status,crawledPages:pages.length,failures});if(unique.length){const name=cleanCandidateName(input.name)||extractedName||cleanCandidateName(input._listingName);results.push({candidateId:input.id,...(name?{name}:{}),inputUrl:seed,source:{id:input._source.id,label:input._source.label},profile:extractedProfile,profileEvidence,...(photo?{photo}:{}),contacts:unique,crawledPages:pages,failures})}completed.add(input.id);if(options.onCheckpoint)await options.onCheckpoint({completedIds:[...completed],candidates:results,sourceReports})}
 const byUrl=new Map();for(const candidate of results){const old=byUrl.get(candidate.inputUrl);if(!old)byUrl.set(candidate.inputUrl,candidate);else{for(const contact of candidate.contacts)if(!old.contacts.some(x=>x.type===contact.type&&x.normalized===contact.normalized))old.contacts.push(contact)}}
 return {schemaVersion:5,generatedAt:new Date().toISOString(),candidates:[...byUrl.values()],discoveryReports:discovery.discoveryReports,sourceReports,limits:{maxDepth,maxPages,maxListingPages:(options.maxListingPages??3)>0?options.maxListingPages??3:'unlimited',maxCandidates:(options.maxCandidates??50)>0?options.maxCandidates??50:'unlimited',timeoutMs,delayMs},policy:{publicOnly:true,llm:false,profileFields:'explicit-labels-only',photos:'public-page-urls-only'}}
}
