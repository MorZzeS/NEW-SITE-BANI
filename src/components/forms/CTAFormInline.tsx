"use client"
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { siteSettings } from '@/data'
import { leadEndpoint, sendLead } from '@/lib/leads'
import { mergeConfigurationComment } from '@/lib/equipment-selection'

export function CTAFormInline({ modelName, configurationNote }: { modelName?: string; configurationNote?: string }) {
 const [status,setStatus]=useState<'idle'|'sending'|'success'|'error'>('idle')
 const [error,setError]=useState('')
 const [name,setName]=useState(''),[phone,setPhone]=useState(''),[model,setModel]=useState(modelName || ''),[comment,setComment]=useState('')
 const [consent,setConsent]=useState(false)
 const started=useRef(Date.now()), pending=useRef(false)
 const request=useRef<{ id: string; body: string }>()
 useEffect(() => { if (!modelName) setModel(new URLSearchParams(location.search).get('model')?.slice(0,160) || '') }, [modelName])
 const configured=/^https:\/\//.test(leadEndpoint)
 async function submit(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault()
  if(pending.current || status==='success')return
  if(!/^[78]\d{10}$/.test(phone.replace(/\D/g,''))) {setError('Введите телефон в формате +7 900 000-00-00');setStatus('error');return}
  if(!consent)return
  let submittedComment: string
  try { submittedComment=mergeConfigurationComment(comment,configurationNote) }
  catch(err){setError(err instanceof Error?err.message:'Сократите комментарий.');setStatus('error');return}
  const website=new FormData(event.currentTarget).get('website')?.toString() || ''
  pending.current=true;setStatus('sending');setError('')
  try {
   const body=JSON.stringify([name.trim(),phone,model,submittedComment])
   if(!request.current || request.current.body!==body)request.current={id:crypto.randomUUID(),body}
   await sendLead({requestId:request.current.id,name:name.trim(),phone,model,page:location.href,comment:submittedComment,createdAt:new Date().toISOString(),consent,website,startedAt:started.current});setStatus('success')
  }
  catch(err){setError(err instanceof Error?err.message:'Не удалось отправить заявку. Свяжитесь напрямую.');setStatus('error')}
  finally{pending.current=false}
 }
 return <section className="glass rounded-2xl p-5 sm:p-8" aria-label="Заявка на консультацию">
  <h2 className="text-2xl font-bold text-cream mb-3">{modelName?`Узнать цену на ${modelName}`:'Оставить заявку'}</h2>
  {!configured && <p className="text-sm text-cream/70 mb-4">Онлайн-отправка пока не настроена. Позвоните или напишите нам напрямую.</p>}
  {status==='success'?<p role="status" className="text-cream">Заявка отправлена. Менеджер свяжется с вами.</p>:<form onSubmit={submit} className="space-y-3">
   <label className="block text-sm text-cream">Имя<input aria-label="Ваше имя" autoComplete="name" value={name} onChange={e=>setName(e.target.value)} required minLength={2} maxLength={80} className="lead-input" /></label>
   <label className="block text-sm text-cream">Телефон<input aria-label="Телефон для заявки" type="tel" autoComplete="tel" value={phone} onChange={e=>setPhone(e.target.value)} required maxLength={30} placeholder="+7 900 000-00-00" className="lead-input" /></label>
   <label className="block text-sm text-cream">Модель<input value={model} onChange={e=>setModel(e.target.value)} maxLength={160} className="lead-input" /></label>
   {configurationNote && <div className="text-sm text-cream/70 border-l-2 border-gold-400 pl-4" aria-label="Выбранные опции для заявки"><p className="whitespace-pre-line">{configurationNote}</p><p className="text-xs mt-2">Этот список будет отправлен вместе с вашим комментарием.</p></div>}
   <label className="block text-sm text-cream">Комментарий<textarea value={comment} onChange={e=>setComment(e.target.value)} maxLength={1500} rows={3} className="lead-input" /></label>
   <div className="lead-honeypot" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
   <label className="flex gap-3 text-xs text-cream/70 items-start"><input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)} required className="mt-1" /><span>Согласен с <Link href="/privacy" className="underline">политикой конфиденциальности</Link> и обработкой данных для ответа на заявку.</span></label>
   {error && <p role="alert" className="text-sm text-cream">{error}</p>}
   <button type="submit" disabled={!configured || status==='sending'} className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-default">{status==='sending'?'Отправляем…':'Отправить заявку'}</button>
  </form>}
  <div className="flex flex-wrap gap-4 mt-5 text-sm text-gold-400">
   <a href={`tel:${siteSettings.phone}`}>{siteSettings.phoneDisplay}</a><a href={`tel:${siteSettings.phone2}`}>{siteSettings.phoneDisplay2}</a>
   <a href={siteSettings.max} target="_blank" rel="noopener noreferrer">MAX</a><a href={siteSettings.telegram} target="_blank" rel="noopener noreferrer">Telegram</a>
  </div>
 </section>
}
