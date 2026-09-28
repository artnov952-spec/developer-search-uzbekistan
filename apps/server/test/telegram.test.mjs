import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { openDatabase, migrate } from '../src/db.mjs'
import { handleUpdate } from '../src/telegram.mjs'

const secret='x'.repeat(32)
function database(t){const dir=fs.mkdtempSync(path.join(os.tmpdir(),'devsearch-telegram-')),db=openDatabase(path.join(dir,'db.sqlite'));migrate(db);t.after(()=>{db.close();fs.rmSync(dir,{recursive:true,force:true})});return db}
function context(db){return {db,config:{token:'test',allowedIds:new Set(['123']),sessionSecret:secret},signal:undefined}}
function mockTelegram(t){const calls=[];const old=globalThis.fetch;globalThis.fetch=async(_url,init)=>{calls.push(JSON.parse(init.body));return new Response(JSON.stringify({ok:true,result:{}}),{status:200,headers:{'content-type':'application/json'}})};t.after(()=>{globalThis.fetch=old});return calls}

test('/start requests the sender phone and does not issue a code',async t=>{const db=database(t),calls=mockTelegram(t);await handleUpdate({message:{chat:{id:123},from:{id:123,first_name:'Owner'},text:'/start'}},context(db));assert.equal(db.prepare('SELECT count(*) n FROM login_codes').get().n,0);assert.equal(calls[0].reply_markup.keyboard[0][0].request_contact,true)})

test('self contact stores phone and issues a one-time code',async t=>{const db=database(t),calls=mockTelegram(t);await handleUpdate({message:{chat:{id:123},from:{id:123,first_name:'Owner'},contact:{user_id:123,phone_number:'+998901234567'}}},context(db));assert.equal(db.prepare('SELECT phone_number FROM users WHERE telegram_user_id=?').get('123').phone_number,'+998901234567');assert.equal(db.prepare('SELECT count(*) n FROM login_codes WHERE used_at IS NULL').get().n,1);assert.match(calls[0].text,/^Код входа: \d{6}/);assert.equal(calls[0].reply_markup.remove_keyboard,true)})

test('forwarded or foreign contact cannot issue a code',async t=>{const db=database(t),calls=mockTelegram(t);await handleUpdate({message:{chat:{id:123},from:{id:123},contact:{user_id:999,phone_number:'+998901234567'}}},context(db));assert.equal(db.prepare('SELECT count(*) n FROM login_codes').get().n,0);assert.match(calls[0].text,/свой контакт/)})
