#!/usr/bin/env node
import path from 'node:path'
import {runPhotoEnrichment} from './photo-enrichment.mjs'

const args=process.argv.slice(2),value=name=>{const at=args.indexOf(name);return at>=0?args[at+1]:null}
const inputFile=path.resolve(value('--input')||'data/crawler-full.json')
const outputFile=path.resolve(value('--output')||inputFile)
const checkpointFile=path.resolve(value('--checkpoint')||'data/crawler-full.photos.checkpoint.json')
const delay=Number(value('--delay-ms')||150)
if(!Number.isFinite(delay)||delay<0)throw new Error('--delay-ms must be a non-negative number')
const result=await runPhotoEnrichment({inputFile,outputFile,checkpointFile,delayMs:delay})
console.log(JSON.stringify({inputFile,outputFile,checkpointFile,candidates:result.output.candidates.length,photos:result.output.candidates.filter(x=>x.photo).length}))
