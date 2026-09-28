#!/usr/bin/env node
import { readFile, rename, writeFile } from 'node:fs/promises'
import { dirname, basename, join } from 'node:path'
import { randomUUID } from 'node:crypto'
import { crawlCandidates } from './crawler.mjs'

const args=process.argv.slice(2)
const take=(name,fallback)=>{const i=args.indexOf(name);return i<0?fallback:args[i+1]}
const usage='Usage: npm run crawl -- --input sources.json [--output contacts.json] [--checkpoint crawl.checkpoint.json] [--resume] [--depth 3] [--pages 30] [--listing-pages 3] [--candidates 50] [--timeout 8000] [--delay 150]'
if(args.includes('--help')||!take('--input')){console.log(usage);process.exit(args.includes('--help')?0:1)}

async function atomicWrite(path,text){
  const tmp=join(dirname(path),`.${basename(path)}.${process.pid}.${randomUUID()}.tmp`)
  await writeFile(tmp,text,{encoding:'utf8',mode:0o600})
  await rename(tmp,path)
}
function number(name,fallback){const value=Number(take(name,fallback));if(!Number.isFinite(value)||value<0)throw new Error(`${name} must be a non-negative number`);return value}

const input=JSON.parse(await readFile(take('--input'),'utf8'))
const output=take('--output')
const checkpoint=take('--checkpoint',output?`${output}.checkpoint.json`:undefined)
let resumeState
if(args.includes('--resume')){
  if(!checkpoint)throw new Error('--resume requires --checkpoint or --output')
  try{resumeState=JSON.parse(await readFile(checkpoint,'utf8'))}catch(error){if(error.code!=='ENOENT')throw error}
}
const options={maxDepth:number('--depth',3),maxPages:number('--pages',30),maxListingPages:number('--listing-pages',3),maxCandidates:number('--candidates',50),timeoutMs:number('--timeout',8000),delayMs:number('--delay',150),resumeState}
if(checkpoint)options.onCheckpoint=state=>atomicWrite(checkpoint,JSON.stringify({...state,schemaVersion:1,updatedAt:new Date().toISOString()},null,2)+'\n')
const result=await crawlCandidates(input,options)
const json=JSON.stringify(result,null,2)+'\n'
if(output)await atomicWrite(output,json);else process.stdout.write(json)
