import { FormEvent, useEffect, useState } from 'react'
import { Button, Input } from '@cloudplus/ui'
import { BrandLogo } from './BrandLogo'
import './mobile-auth-fix.css'
import { apiUrl } from './api'

type User = { telegramUserId: string; displayName: string | null }
export function AuthGate({children}:{children:(user:User)=>React.ReactNode}) {
  const [user,setUser]=useState<User|null>(null),[loading,setLoading]=useState(true),[code,setCode]=useState(''),[error,setError]=useState(''),[sending,setSending]=useState(false)
  useEffect(()=>{fetch(apiUrl('/api/auth/me'),{credentials:'include'}).then(async r=>{if(r.ok)setUser((await r.json()).user)}).finally(()=>setLoading(false))},[])
  const submit=async(e:FormEvent)=>{e.preventDefault();setError('');setSending(true);try{const response=await fetch(apiUrl('/api/auth/verify'),{method:'POST',credentials:'include',headers:{'content-type':'application/json'},body:JSON.stringify({code})});if(response.ok)setUser((await response.json()).user);else setError(response.status===429?'Слишком много попыток. Попробуйте через 5 минут.':'Код неверен, истек или уже использован.')}catch{setError('Сервер недоступен. Проверьте, что backend запущен.')}finally{setSending(false)}}
  if(loading)return <div className="auth-screen"><BrandLogo/><p>Проверяем сессию…</p></div>
  if(user)return <>{children(user)}</>
  const botUrl=import.meta.env.VITE_TELEGRAM_BOT_URL||'https://t.me/an952_bot'
  return <main className="auth-screen"><section className="auth-intro"><BrandLogo/><h1>Разработчики Узбекистана</h1><p>Поиск специалистов по проверяемым публичным профилям и контактам.</p><div className="auth-points"><span>01 <b>Точные критерии</b></span><span>02 <b>Новые совпадения</b></span><span>03 <b>Уведомления в Telegram</b></span></div></section><form className="auth-card" onSubmit={submit}><BrandLogo/><div><h2>Войти через Telegram</h2><p>Откройте бота, получите короткий одноразовый код и введите его ниже.</p></div><a className="auth-bot-link" href={botUrl} target="_blank" rel="noreferrer">Открыть Telegram-бота</a><label htmlFor="login-code">Код из Telegram</label><Input id="login-code" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} value={code} onChange={e=>setCode(e.target.value.replace(/\D/g,'').slice(0,6))} placeholder="000000" required/>{error&&<p className="auth-error" role="alert">{error}</p>}<Button type="submit" disabled={sending||code.length!==6}>{sending?'Проверяем…':'Войти'}</Button><small>Код действует 5 минут и подходит только для одного входа.</small></form></main>
}
