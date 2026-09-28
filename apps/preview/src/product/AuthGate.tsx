import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from 'react'
import { LockKeyhole, Send } from 'lucide-react'
import { Button } from '@cloudplus/ui'
import { BrandLogo } from './BrandLogo'
import './mobile-auth-fix.css'
import { apiUrl } from './api'

type User = { telegramUserId: string; displayName: string | null }

export function AuthGate({children}:{children:(user:User)=>React.ReactNode}) {
  const [user,setUser]=useState<User|null>(null),[loading,setLoading]=useState(true),[code,setCode]=useState(''),[error,setError]=useState(''),[sending,setSending]=useState(false)
  const digitRefs=useRef<Array<HTMLInputElement|null>>([])
  useEffect(()=>{fetch(apiUrl('/api/auth/me'),{credentials:'include'}).then(async r=>{if(r.ok)setUser((await r.json()).user)}).finally(()=>setLoading(false))},[])
  const submit=async(e:FormEvent)=>{e.preventDefault();setError('');setSending(true);try{const response=await fetch(apiUrl('/api/auth/verify'),{method:'POST',credentials:'include',headers:{'content-type':'application/json'},body:JSON.stringify({code})});if(response.ok)setUser((await response.json()).user);else setError(response.status===429?'Слишком много попыток. Попробуйте через 5 минут.':'Код неверен, истек или уже использован.')}catch{setError('Сервер недоступен. Проверьте, что backend запущен.')}finally{setSending(false)}}
  const setDigit=(index:number,value:string)=>{const digit=value.replace(/\D/g,'').slice(-1),next=code.split('');if(digit)next[index]=digit;else next.splice(index,1);setCode(next.join('').slice(0,6));if(digit&&index<5)digitRefs.current[index+1]?.focus()}
  const onDigitKey=(index:number,e:KeyboardEvent<HTMLInputElement>)=>{if(e.key==='Backspace'&&!code[index]&&index>0)digitRefs.current[index-1]?.focus();if(e.key==='ArrowLeft'&&index>0)digitRefs.current[index-1]?.focus();if(e.key==='ArrowRight'&&index<5)digitRefs.current[index+1]?.focus()}
  const pasteCode=(value:string)=>{const digits=value.replace(/\D/g,'').slice(0,6);if(!digits)return;setCode(digits);digitRefs.current[Math.min(digits.length,5)]?.focus()}
  if(loading)return <div className="auth-screen auth-loading"><BrandLogo/><p>Проверяем сессию…</p></div>
  if(user)return <>{children(user)}</>
  const botUrl=import.meta.env.VITE_TELEGRAM_BOT_URL||'https://t.me/developer_search_bot'
  return <main className="auth-screen">
    <header className="auth-brandbar"><BrandLogo/><span aria-hidden="true"/><p>Разработчики Узбекистана</p></header>
    <section className="auth-intro">
      <p className="auth-eyebrow">Внутренний сервис Cloudplus</p>
      <h1>Вход в систему<br/>поиска</h1>
      <p className="auth-lead">Поиск кандидатов в Узбекистане<br/>для команды Cloudplus.</p>
    </section>
    <form className="auth-card" onSubmit={submit}>
      <h2>Вход по коду</h2>
      <a className="auth-bot-link" href={botUrl} target="_blank" rel="noreferrer"><Send aria-hidden="true"/>Открыть Telegram-бота</a>
      <fieldset className="auth-code-field">
        <legend>Одноразовый код</legend>
        <div className="auth-code-inputs" onPaste={e=>{e.preventDefault();pasteCode(e.clipboardData.getData('text'))}}>
          {Array.from({length:6},(_,index)=><input key={index} ref={node=>{digitRefs.current[index]=node}} aria-label={`Цифра ${index+1}`} inputMode="numeric" autoComplete={index===0?'one-time-code':'off'} maxLength={1} value={code[index]||''} onChange={e=>setDigit(index,e.target.value)} onKeyDown={e=>onDigitKey(index,e)} required/>)}
        </div>
      </fieldset>
      <p className="auth-code-note">Код действует 5 минут</p>
      {error&&<p className="auth-error" role="alert">{error}</p>}
      <Button type="submit" disabled={sending||code.length!==6}>{sending?'Проверяем…':'Войти'}</Button>
      <small><LockKeyhole aria-hidden="true"/>Защищенная корпоративная сессия</small>
    </form>
  </main>
}
