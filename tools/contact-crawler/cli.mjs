#!/usr/bin/env node
import { readFile, writeFile } from 'node:fs/promises'
import { crawlCandidates } from './crawler.mjs'
const args = process.argv.slice(2), take = (name, fallback) => { const i=args.indexOf(name); return i<0?fallback:args[i+1] }
if (args.includes('--help') || !take('--input')) { console.log('Usage: npm run crawl -- --input candidates.json [--output contacts.json] [--depth 2] [--pages 20] [--timeout 8000]'); process.exit(args.includes('--help')?0:1) }
const input = JSON.parse(await readFile(take('--input'), 'utf8'))
const result = await crawlCandidates(input, { maxDepth:+take('--depth',2), maxPages:+take('--pages',20), timeoutMs:+take('--timeout',8000), delayMs:+take('--delay',100) })
const json = JSON.stringify(result, null, 2)+'\n', output = take('--output')
if (output) await writeFile(output, json); else process.stdout.write(json)
