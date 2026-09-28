import { loadConfig } from './config.mjs'
import { cleanupAuth } from './auth.mjs'
import { openDatabase, migrate } from './db.mjs'
import { createServer } from './server.mjs'
import { runPolling, telegramCall } from './telegram.mjs'
import { drainOutbox, recoverBackgroundState, runMonitoringCycle } from './product.mjs'

const config=loadConfig(); const db=openDatabase(config.dbPath); migrate(db)
cleanupAuth(db); recoverBackgroundState(db)
const controller=new AbortController()
let pollingController=null, pollingPromise=null
const telegramRuntime={enabled:config.mode!=='disabled',running:false,status:config.mode==='disabled'?'disconnected':'connecting',lastConnectedAt:null,lastError:null}
async function startPolling(){
  if(config.mode!=='polling'||!config.token||pollingPromise)return
  pollingController=new AbortController()
  const onStop=()=>pollingController.abort();controller.signal.addEventListener('abort',onStop,{once:true})
  telegramRuntime.enabled=true;telegramRuntime.status='connecting'
  const context={config,db,signal:pollingController.signal,telegramRuntime}
  pollingPromise=runPolling(context).finally(()=>{controller.signal.removeEventListener('abort',onStop);pollingPromise=null;pollingController=null})
}
telegramRuntime.disconnect=async()=>{telegramRuntime.enabled=false;telegramRuntime.status='disconnected';pollingController?.abort();if(pollingPromise)await pollingPromise}
telegramRuntime.reconnect=async()=>{
  if(!config.token||config.mode==='disabled')throw new Error('telegram_not_configured')
  await telegramRuntime.disconnect()
  await telegramCall(config.token,'getMe',{},controller.signal)
  telegramRuntime.enabled=true;telegramRuntime.status='connected';telegramRuntime.lastConnectedAt=Date.now();telegramRuntime.lastError=null
  if(config.mode==='polling')await startPolling()
}
const context={config,db,signal:controller.signal,telegramRuntime}
const server=createServer(context)
server.listen(config.port,config.host,()=>console.log(`Developer Search API listening on http://${config.host}:${config.port}`))
if(config.mode==='polling')void startPolling()
else if(config.mode==='webhook')telegramRuntime.status='connected'
let schedulerPromise=null
const scheduler=setInterval(()=>{if(schedulerPromise||controller.signal.aborted)return;schedulerPromise=(async()=>{try{runMonitoringCycle(db);if(config.token&&telegramRuntime.status==='connected')await drainOutbox(db,(chatId,payload)=>telegramCall(config.token,'sendMessage',{chat_id:chatId,text:`Новый кандидат: ${payload.candidate.name}\nКритерий: ${payload.criterionName}`},controller.signal))}catch(error){console.error('Monitoring scheduler failed:',error?.message||'unknown')}finally{schedulerPromise=null}})()},30_000)
scheduler.unref()
let stopping=false
async function shutdown(){
  if(stopping)return;stopping=true;clearInterval(scheduler);controller.abort();pollingController?.abort()
  await new Promise(resolve=>server.close(resolve))
  await Promise.race([Promise.allSettled([pollingPromise,schedulerPromise].filter(Boolean)),new Promise(resolve=>setTimeout(resolve,8000))])
  db.close();process.exit(0)
}
for(const event of ['SIGINT','SIGTERM']) process.on(event,()=>{void shutdown()})
