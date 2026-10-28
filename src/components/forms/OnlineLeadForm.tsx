'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'
import { saunas, homes, siteSettings } from '@/data'
import { leadContract, leadDocumentBundle, verifyLeadDocumentBundle, consentEvidence } from '@/lib/lead-consent'
import { leadEndpoint, sendLead, LeadSubmissionError, type Lead } from '@/lib/leads'
import { leadAttemptMarker, discardRejectedLeadAttempt } from '@/lib/lead-attempt'
import { resolveLeadContext } from '@/lib/lead-context'

/** Only mounted by the existing release gate. No approval or endpoint is invented here. */
export function OnlineLeadForm({ modelName, configurationNote }: { modelName?: string; configurationNote?: string }) {
  const [name, setName] = useState(''), [phone, setPhone] = useState(''), [comment, setComment] = useState('')
  const [consent, setConsent] = useState(false), [ready, setReady] = useState(false)
  const [error, setError] = useState(''), [result, setResult] = useState(''), [busy, setBusy] = useState(false)
  const [context, setContext] = useState<Pick<Lead, 'source'|'article'|'modelKind'|'promotion'|'model'|'page'>>({ model: modelName || '', page: '' })
  const started = useRef(Date.now()), pending = useRef(false), attempt = useRef<Lead | null>(null)
  const [locked, setLocked] = useState(false)
  const [rejected, setRejected] = useState(false)
  const documents = leadDocumentBundle.documents
  useEffect(() => {
    setContext(resolveLeadContext(location.href, modelName, saunas, homes))
    const marker = leadAttemptMarker()
    if (marker) { setLocked(true); setError(`Предыдущая попытка: ${marker.requestId || 'номер недоступен'}. Для уточнения свяжитесь с нами. Повторная отправка отключена.`) }
    let cancelled = false
    if (leadContract === 3 && location.protocol === 'https:' && /^https:\/\//.test(leadEndpoint)) {
      void verifyLeadDocumentBundle().then(() => { if (!cancelled) setReady(true) }).catch(() => { if (!cancelled) setReady(false) })
    }
    return () => { cancelled = true }
  }, [modelName, configurationNote])

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!ready || !consent || pending.current || locked) return
    if (name.trim().length < 2) { setError('Укажите имя: не менее двух символов.'); return }
    if (!/^[78]\d{10}$/.test(phone.replace(/\D/g, ''))) { setError('Введите телефон в формате +7 900 000-00-00.'); return }
    const website = new FormData(event.currentTarget).get('website')?.toString() || ''
    pending.current = true; setBusy(true); setError('')
    try {
      const verified = await verifyLeadDocumentBundle()
      if (!attempt.current) attempt.current = { ...context, ...consentEvidence(verified), requestId: crypto.randomUUID(), name: name.trim(), phone, comment: comment.trim(), configuration: configurationNote || '', createdAt: new Date().toISOString(), consent: true, website, startedAt: started.current }
      const response = await sendLead(attempt.current)
      if (!response) throw new Error('Сервер не подтвердил сохранение заявки.')
      setResult(response.status === 'sent' ? 'Заявка сохранена. Уведомление доставлено менеджеру.' : 'Заявка сохранена сервером. Уведомление менеджеру ожидает доставки.')
      setLocked(true)
    } catch (cause) {
      setRejected(cause instanceof LeadSubmissionError && cause.state === 'rejected')
      setError(cause instanceof Error ? cause.message : 'Не удалось подтвердить приём заявки. Свяжитесь с нами.')
      if (leadAttemptMarker()) setLocked(true)
    } finally { pending.current = false; setBusy(false) }
  }
  const displayed = attempt.current || context
  const selection = [displayed.model && `Модель: ${displayed.model}`, displayed.article && `Артикул: ${displayed.article}`, attempt.current ? attempt.current.configuration : configurationNote, displayed.promotion].filter(Boolean).join('\n')
  return <section className="glass rounded-2xl p-5 sm:p-8" tabIndex={-1} aria-label="Заявка на консультацию">
    <h2 className="text-2xl font-bold text-cream mb-3">{context.source === 'Карточка модели' ? context.modelKind === 'house' ? 'Оставить заявку на этот дом' : 'Оставить заявку на эту баню' : 'Оставить заявку'}</h2>
    {selection && <div className="mb-5 text-sm text-cream/80"><p className="whitespace-pre-wrap">{selection}</p><button type="button" className="btn-secondary mt-3" onClick={() => { void navigator.clipboard.writeText(selection).catch(() => setError('Выделите и скопируйте текст выбора вручную.')) }}>Скопировать выбор</button></div>}
    {!ready && <p className="text-sm text-cream/70 mb-4">Онлайн-отправка пока недоступна. Свяжитесь с нами напрямую.</p>}
    {result ? <p role="status">{result} Номер: {attempt.current?.requestId}</p> : <form onSubmit={submit} className="space-y-3">
      <fieldset disabled={!ready || busy || locked || Boolean(attempt.current)} className="space-y-3">
        <label className="block text-sm text-cream">Имя<input autoComplete="name" required minLength={2} maxLength={80} className="lead-input" value={name} onChange={e => setName(e.target.value)} /></label>
        <label className="block text-sm text-cream">Телефон<input type="tel" autoComplete="tel" required maxLength={30} className="lead-input" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+7 900 000-00-00" /></label>
        <label className="block text-sm text-cream">Комментарий<textarea rows={3} maxLength={1500} className="lead-input" value={comment} onChange={e => setComment(e.target.value)} /></label>
        <div className="lead-honeypot" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
        {documents && <><label className="flex gap-3 text-xs text-cream/70 items-start"><input type="checkbox" required checked={consent} onChange={e => setConsent(e.target.checked)} /><span>{documents.checkbox.text}</span></label><details><summary>Согласие на обработку данных</summary><p className="whitespace-pre-wrap text-sm">{documents.consent.text}</p></details><details><summary>Политика обработки данных</summary><p className="whitespace-pre-wrap text-sm">{documents.policy.text}</p></details></>}
      </fieldset>
      <button type="submit" disabled={!ready || !consent || busy || locked} className="btn-primary w-full justify-center disabled:opacity-60">{busy ? 'Сохраняем заявку…' : attempt.current ? 'Повторить исходную заявку' : 'Отправить заявку'}</button>
    </form>}
    {error && <p role="alert" className="mt-3 text-sm text-cream">{error}{attempt.current && ` Номер: ${attempt.current.requestId}`}</p>}
    {rejected && <button type="button" className="btn-secondary mt-3" onClick={() => { if (discardRejectedLeadAttempt()) { attempt.current = null; started.current = Date.now(); setRejected(false); setError('') } }}>Изменить данные непринятой заявки</button>}
    <div className="flex flex-wrap gap-4 mt-5 text-sm text-gold-400"><a href={`tel:${siteSettings.phone}`}>{siteSettings.phoneDisplay}</a><a href={`tel:${siteSettings.phone2}`}>{siteSettings.phoneDisplay2}</a><a href={siteSettings.max} target="_blank" rel="noopener noreferrer">MAX</a><a href={siteSettings.telegram} target="_blank" rel="noopener noreferrer">Telegram</a></div>
  </section>
}
