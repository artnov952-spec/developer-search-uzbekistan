import test from 'node:test'; import assert from 'node:assert/strict'; import { readFile } from 'node:fs/promises'; import { crawlCandidates } from '../crawler.mjs'
const root = new URL('./fixtures/', import.meta.url)
const files = { '/': 'index.html', '/about': 'about.html', '/contact': 'contact.html', '/private': 'contact.html' }
function response(body, status=200, type='text/html') { return new Response(body,{status,headers:{'content-type':type}}) }
const fetch = async url => { const u=new URL(url); if(u.pathname==='/robots.txt') return response('User-agent: *\nDisallow: /private\n'); const f=files[u.pathname]; return f?response(await readFile(new URL(f,root),'utf8')):response('',404) }
test('deep crawl extracts, normalizes, deduplicates, records chains and obeys robots', async()=>{
 const r=await crawlCandidates([{id:'fixture',url:'https://fixture.test/'}],{fetch,delayMs:0,maxDepth:2,maxPages:10}); const c=r.candidates[0]
 assert.equal(c.contacts.filter(x=>x.type==='email').length,1); assert.ok(c.contacts.some(x=>x.normalized==='+998901234567')); assert.ok(c.contacts.some(x=>x.type==='telegram')); assert.ok(c.contacts.some(x=>x.normalized==='linkedin:/in/fixture-dev')); assert.ok(!c.crawledPages.includes('https://fixture.test/private')); assert.equal(c.contacts.find(x=>x.type==='email').discoveryChain.length,2)
})
test('candidate without contacts is excluded', async()=>{ const r=await crawlCandidates([{id:'none',url:'https://empty.test/'}],{fetch:async()=>response('<p>Hello</p>'),delayMs:0,maxDepth:0}); assert.deepEqual(r.candidates,[]) })
