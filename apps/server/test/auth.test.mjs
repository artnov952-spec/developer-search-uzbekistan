import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { openDatabase, migrate } from '../src/db.mjs'
import { codeHash, getSession, issueCode, loginAttemptLimited, recordLoginAttempt, verifyCode } from '../src/auth.mjs'
const secret='test-secret-that-is-at-least-thirty-two-characters'
function database(t){const dir=fs.mkdtempSync(path.join(os.tmpdir(),'devsearch-'));const db=openDatabase(path.join(dir,'test.sqlite'));migrate(db);t.after(()=>{db.close();fs.rmSync(dir,{recursive:true,force:true})});return db}
test('codes are stored hashed, expire, and can only be used once',t=>{const db=database(t),now=1_000_000;const code=issueCode(db,'123','Owner',secret,now);assert.match(code,/^\d{6}$/);const row=db.prepare('SELECT code_hash FROM login_codes').get();assert.notEqual(row.code_hash,code);assert.equal(row.code_hash,codeHash(code,secret));const result=verifyCode(db,code,secret,now+1);assert.equal(result.user.telegramUserId,'123');assert.equal(verifyCode(db,code,secret,now+2),null);assert.equal(getSession(db,result.token,secret,now+2).telegram_user_id,'123')})
test('expired code is rejected',t=>{const db=database(t),now=2_000_000;const code=issueCode(db,'123','Owner',secret,now);assert.equal(verifyCode(db,code,secret,now+5*60_000+1),null)})
test('login attempt windows persist and expire',t=>{const db=database(t),now=3_000_000,key='verify:127.0.0.1';for(let i=0;i<10;i++)recordLoginAttempt(db,key,secret,false,now+i);assert.equal(loginAttemptLimited(db,key,secret,now+20),true);assert.equal(loginAttemptLimited(db,key,secret,now+5*60_000+1),false);recordLoginAttempt(db,key,secret,false,now+5*60_000+2);recordLoginAttempt(db,key,secret,true,now+5*60_000+3);assert.equal(loginAttemptLimited(db,key,secret,now+5*60_000+4),false)})
