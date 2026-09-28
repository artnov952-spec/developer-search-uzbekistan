import fs from 'node:fs/promises'
import path from 'node:path'
import {createHash} from 'node:crypto'
import {extractCandidatePhoto} from './crawler.mjs'

const BLOCKED_TEXT=/(?:captcha|access denied|log in to continue|sign in to continue|войдите, чтобы продолжить|profile (?:is )?(?:private|closed|unavailable)|private profile|account (?:is )?private|профиль (?:закрыт|недоступен)|закрытый профиль|subscribe to (?:view|contact)|pay to (?:view|contact)|premium (?:required|profile)|unlock (?:this )?(?:profile|contact)|контакты доступны (?:после оплаты|по подписке)|платный доступ)/i
const TELEGRAM_POST=/^\/(?:s\/)?[^/]+\/\d+\/?$/i

function candidateKey(candidate,index){return String(candidate.candidateId||candidate.inputUrl||`index:${index}`)}
function safePageUrl(raw){try{const url=new URL(raw);if(!/^https?:$/.test(url.protocol))return null;if(/^(?:t\.me|telegram\.me)$/i.test(url.hostname.replace(/^www\./,''))&&!TELEGRAM_POST.test(url.pathname))return null;url.hash='';return url.href}catch{return null}}
function pageUrls(candidate){const values=[candidate.inputUrl,...(candidate.contacts||[]).map(contact=>contact?.sourceUrl)];return [...new Set(values.map(safePageUrl).filter(Boolean))]}
function fingerprint(input){return createHash('sha256').update(JSON.stringify(input.candidates.map((candidate,index)=>[candidateKey(candidate,index),pageUrls(candidate)]))).digest('hex')}
async function atomicJson(file,value){await fs.mkdir(path.dirname(file),{recursive:true});const temp=`${file}.${process.pid}.tmp`;await fs.writeFile(temp,`${JSON.stringify(value,null,2)}\n`);await fs.rename(temp,file)}
async function robotsAllowed(raw,fetcher,userAgent,timeoutMs,cache){const url=new URL(raw);let rules=cache.get(url.origin);if(!rules){try{const response=await fetcher(`${url.origin}/robots.txt`,{headers:{'user-agent':userAgent},redirect:'follow',signal:AbortSignal.timeout(timeoutMs)});const denied=[];if(response.ok){let applies=false;for(const rawLine of (await response.text()).split(/\r?\n/)){const line=rawLine.replace(/#.*/,'').trim(),at=line.indexOf(':');if(at<0)continue;const key=line.slice(0,at).trim().toLowerCase(),value=line.slice(at+1).trim();if(key==='user-agent')applies=value==='*'||value.toLowerCase()===userAgent.toLowerCase();else if(applies&&key==='disallow'&&value)denied.push(value)}}rules=pathname=>!denied.some(prefix=>pathname.startsWith(prefix))}catch{rules=()=>true}cache.set(url.origin,rules)}return rules(url.pathname)}

export async function enrichCandidatePhotos(input,options={}){
 if(!input||!Array.isArray(input.candidates))throw new TypeError('crawler output must contain candidates')
 const fetcher=options.fetch??fetch,userAgent=options.userAgent??'PublicContactCrawler/2.0 (+photo-enrichment; public-pages-only)',timeoutMs=options.timeoutMs??8000,delayMs=options.delayMs??150
 const hash=fingerprint(input),resume=options.resumeState||{};if(resume.inputFingerprint&&resume.inputFingerprint!==hash)throw new Error('checkpoint does not match crawler output')
 const completed=new Set(Array.isArray(resume.completedIds)?resume.completedIds:[]),photos={...(resume.photos||{})},reports=[...(resume.reports||[])],robots=new Map()
 for(let index=0;index<input.candidates.length;index++){const candidate=input.candidates[index],key=candidateKey(candidate,index);if(completed.has(key))continue
  const urls=pageUrls(candidate);let photo=null;const attempts=[]
  for(const url of urls){if(!(await robotsAllowed(url,fetcher,userAgent,timeoutMs,robots))){attempts.push({url,status:'robots-disallowed'});continue}try{const response=await fetcher(url,{headers:{'user-agent':userAgent,accept:'text/html,application/xhtml+xml'},redirect:'follow',signal:AbortSignal.timeout(timeoutMs)});const type=response.headers.get('content-type')||'';if(!response.ok){attempts.push({url,status:`http-${response.status}`});continue}if(!type.includes('text/html')&&!type.includes('application/xhtml+xml')){attempts.push({url,status:'non-html'});continue}const html=await response.text();if(BLOCKED_TEXT.test(html.replace(/<[^>]+>/g,' ').slice(0,5000))){attempts.push({url,status:'restricted-page'});continue}photo=extractCandidatePhoto(html,url);attempts.push({url,status:photo?'photo-found':'no-photo'});if(photo)break}catch(error){attempts.push({url,status:error?.name==='TimeoutError'?'timeout':'network-error'})}if(delayMs)await new Promise(resolve=>setTimeout(resolve,delayMs))}
  if(photo)photos[key]=photo;reports.push({candidateId:key,status:photo?'photo-found':'no-public-photo',attempts});completed.add(key)
  const state={schemaVersion:1,inputFingerprint:hash,completedIds:[...completed],photos,reports,updatedAt:new Date().toISOString()};if(options.onCheckpoint)await options.onCheckpoint(state)
 }
 const candidates=input.candidates.map((candidate,index)=>photos[candidateKey(candidate,index)]?{...candidate,photo:photos[candidateKey(candidate,index)]}:candidate)
 return {output:{...input,schemaVersion:Math.max(5,Number(input.schemaVersion)||0),photoEnrichedAt:new Date().toISOString(),candidates},checkpoint:{schemaVersion:1,inputFingerprint:hash,completedIds:[...completed],photos,reports,updatedAt:new Date().toISOString()}}
}

export async function runPhotoEnrichment({inputFile,outputFile=inputFile,checkpointFile,fetcher,delayMs}={}){
 const input=JSON.parse(await fs.readFile(inputFile,'utf8'));let resumeState={};try{resumeState=JSON.parse(await fs.readFile(checkpointFile,'utf8'))}catch(error){if(error.code!=='ENOENT')throw error}
 const result=await enrichCandidatePhotos(input,{fetch:fetcher,delayMs,onCheckpoint:state=>atomicJson(checkpointFile,state),resumeState});await atomicJson(outputFile,result.output);await atomicJson(checkpointFile,{...result.checkpoint,completed:true,outputFile:path.resolve(outputFile)});return result
}
