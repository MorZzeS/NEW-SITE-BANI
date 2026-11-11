'use client'

import { useEffect, useId, useRef, useState, type FormEvent } from 'react'
import { saunas, homes, siteSettings } from '@/data'
import { leadContract, leadDocumentBundle, verifyLeadDocumentBundle, consentEvidence } from '@/lib/lead-consent'
import { leadEndpoint, sendLead, LeadSubmissionError, type Lead } from '@/lib/leads'
import { leadAttemptMarker, discardRejectedLeadAttempt } from '@/lib/lead-attempt'
import { calculateModelConfiguration, configurationManagerText, mergeManagerComment, type ModelConfigurationCalculation } from '@/lib/model-configuration-selection'
import type { DeliveryDistrict } from '@/lib/logistics'
import { resolveLeadContext } from '@/lib/lead-context'
import { LEAD_TOPIC_EVENT } from '@/lib/lead-topics'
import { withBasePath } from '@/lib/site-path'
import { ApprovedLeadText } from './ApprovedLeadText'

const LEGAL_CONSENT_TEXT = 'Я согласен на обработку персональных данных в соответствии с Согласием на обработку персональных данных и Политикой обработки персональных данных.'

export type EquipmentLeadSelection = { selectedIds: string[]; quantities: Record<string, number>; deliveryDistrict: DeliveryDistrict; deliveryAddress: string }

export function OnlineLeadForm({ modelName, configurationNote, configurationDetails, equipmentSelection }: { modelName?: string; configurationNote?: string; configurationDetails?: ModelConfigurationCalculation; equipmentSelection?: EquipmentLeadSelection }) {
  const modelListId = useId()
  const [name, setName] = useState(''), [phone, setPhone] = useState(''), [comment, setComment] = useState('')
  const [consent, setConsent] = useState(false), [ready, setReady] = useState(false)
  const [error, setError] = useState(''), [busy, setBusy] = useState(false)
  const [result, setResult] = useState<{ status: 'sent' | 'accepted'; requestId: string } | null>(null)
  const [context, setContext] = useState<Pick<Lead, 'source'|'article'|'modelKind'|'promotion'|'model'|'page'>>({ model: modelName || '', page: '' })
  const started = useRef(Date.now()), pending = useRef(false), attempt = useRef<Lead | null>(null)
  const [locked, setLocked] = useState(false)
  const [rejected, setRejected] = useState(false)
  const documents = leadContract === 3 ? leadDocumentBundle.documents : null
  const selectedModel = [...saunas, ...homes].find(model => model.name === context.model)
  const effectiveConfiguration = configurationDetails || (equipmentSelection && selectedModel ? calculateModelConfiguration(selectedModel, equipmentSelection.selectedIds, { quantities: equipmentSelection.quantities, deliveryDistrict: equipmentSelection.deliveryDistrict, deliveryAddress: equipmentSelection.deliveryAddress }) : undefined)
  useEffect(() => {
    setContext(resolveLeadContext(location.href, modelName, saunas, homes))
    const marker = leadAttemptMarker()
    if (marker) {
      setLocked(true)
      if (marker.state === 'accepted' || marker.state === 'sent') setResult({ status: marker.state, requestId: marker.requestId })
      else setError(`Предыдущая попытка: ${marker.requestId || 'номер недоступен'}. Для уточнения свяжитесь с нами. Повторная отправка отключена.`)
    }
    let cancelled = false
    if (leadContract === 3 && location.protocol === 'https:' && /^https:\/\//.test(leadEndpoint)) {
      void verifyLeadDocumentBundle().then(() => { if (!cancelled) setReady(true) }).catch(() => { if (!cancelled) setReady(false) })
    } else if (leadContract !== 3) {
      setReady(location.protocol === 'https:' && /^https:\/\//.test(leadEndpoint))
    }
    return () => { cancelled = true }
  }, [modelName])

  // A topic from an on-page offer (for example the custom-project band) becomes the request subject.
  // It never assigns a ready model or a price; existing model/configuration props always win.
  useEffect(() => {
    function onLeadTopic(event: Event) {
      const detail = (event as CustomEvent<unknown>).detail
      const topic = typeof detail === 'string' ? detail.trim().slice(0, 160) : ''
      if (!topic || attempt.current || configurationDetails) return
      setContext(current => ({ ...current, model: topic, article: '', modelKind: '', promotion: '' }))
    }
    window.addEventListener(LEAD_TOPIC_EVENT, onLeadTopic)
    return () => window.removeEventListener(LEAD_TOPIC_EVENT, onLeadTopic)
  }, [configurationDetails])

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!ready || !consent || pending.current || locked) return
    if (name.trim().length < 2) { setError('Укажите имя: не менее двух символов.'); return }
    if (!/^[78]\d{10}$/.test(phone.replace(/\D/g, ''))) { setError('Введите телефон в формате +7 900 000-00-00.'); return }
    if (equipmentSelection?.selectedIds.length && !selectedModel) { setError('Выберите модель из списка, чтобы передать базовую стоимость и полный расчёт выбранных дополнений.'); return }
    if (equipmentSelection && effectiveConfiguration && equipmentSelection.selectedIds.some(id => !effectiveConfiguration.selectedOptionIds.includes(id))) {
      setError('В выбранной модели часть дополнений недоступна или уже включена в базу. Измените выбор модели или дополнений, чтобы передать полный расчёт.')
      return
    }
    const website = new FormData(event.currentTarget).get('website')?.toString() || ''
    pending.current = true; setBusy(true); setError('')
    try {
      const verified = leadContract === 3 ? await verifyLeadDocumentBundle() : undefined
      if (!attempt.current) {
        let managerConfiguration = effectiveConfiguration ? configurationManagerText(effectiveConfiguration) : configurationNote || ''
        // The model URL is already sent in lead.page, so it need not consume the bounded legacy comment.
        if (effectiveConfiguration && managerConfiguration.length + comment.trim().length + 2 > 1500) managerConfiguration = configurationManagerText(effectiveConfiguration, true)
        const finalComment = leadContract === 3 ? comment.trim() : mergeManagerComment(comment.trim(), managerConfiguration)
        attempt.current = {
          ...context,
          ...(verified ? consentEvidence(verified) : {}),
          requestId: crypto.randomUUID(),
          name: name.trim(),
          phone,
          comment: finalComment,
          configuration: leadContract === 3 && effectiveConfiguration ? '' : (configurationNote || ''),
          ...(leadContract === 3 && effectiveConfiguration ? { configurationDetails: { ...structuredClone(effectiveConfiguration), calculatedAt: new Date().toISOString() } } : {}),
          createdAt: new Date().toISOString(),
          consent: true,
          website,
          startedAt: started.current,
        }
      }
      const response = await sendLead(attempt.current)
      if (!response) throw new Error('Сервер не подтвердил сохранение заявки.')
      setResult(response)
      setLocked(true)
    } catch (cause) {
      setRejected(cause instanceof LeadSubmissionError && cause.state === 'rejected')
      setError(cause instanceof Error ? cause.message : 'Не удалось подтвердить приём заявки. Свяжитесь с нами.')
      if (leadAttemptMarker()) setLocked(true)
    } finally { pending.current = false; setBusy(false) }
  }
  const displayed = attempt.current || context
  const selection = [
    attempt.current?.configurationDetails ? configurationManagerText(attempt.current.configurationDetails) : attempt.current ? attempt.current.configuration : effectiveConfiguration ? configurationManagerText(effectiveConfiguration) : configurationNote,
    !configurationNote && displayed.model ? `Модель: ${displayed.model}` : '',
    !configurationNote && displayed.article ? `Артикул: ${displayed.article}` : '',
    displayed.promotion,
  ].filter(Boolean).join('\n')
  return <section className="glass rounded-2xl p-5 sm:p-8" tabIndex={-1} aria-label="Заявка на консультацию" data-release-profile="online-leads">
    <h2 className="text-2xl font-bold text-cream mb-3">Свяжитесь с нами</h2>
    <p className="text-sm text-cream/70 mb-4">Оставьте заявку — менеджер подтвердит комплектацию, совместимость опций и итоговую стоимость.</p>
    {selection && <div className="mb-5 text-sm text-cream/80" data-configuration-summary><p className="whitespace-pre-wrap break-words">{selection}</p><button type="button" className="btn-secondary mt-3" onClick={() => { void navigator.clipboard.writeText(selection).catch(() => setError('Выделите и скопируйте текст выбора вручную.')) }}>Скопировать комплектацию</button></div>}
    {!ready && <p className="text-sm text-cream/70 mb-4">Онлайн-отправка пока недоступна на этом адресе. Свяжитесь с нами напрямую.</p>}
    {result ? <p role="status" className="text-cream">{result.status === 'sent' ? 'Заявка отправлена и доставлена менеджеру в MAX.' : 'Заявка сохранена сервером. Уведомление менеджеру ожидает доставки.'} Номер: {result.requestId}</p> : <form onSubmit={submit} className="space-y-3" noValidate>
      <fieldset disabled={!ready || busy || locked || Boolean(attempt.current)} className="space-y-3">
        <label className="block text-sm text-cream">Имя<input autoComplete="name" required minLength={2} maxLength={80} className="lead-input" value={name} onChange={e => setName(e.target.value)} /></label>
        <label className="block text-sm text-cream">Телефон<input type="tel" autoComplete="tel" required maxLength={30} className="lead-input" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+7 900 000-00-00" /></label>
        <label className="block text-sm text-cream">Модель<input className="lead-input" list={modelListId} maxLength={160} value={context.model} readOnly={Boolean(configurationDetails)} onChange={e => setContext(resolveLeadContext(location.href, e.target.value, saunas, homes))} /></label>
        {!configurationDetails && <datalist id={modelListId}>{[...saunas, ...homes].map(model => <option key={model.id} value={model.name} />)}</datalist>}
        <label className="block text-sm text-cream">Комментарий<textarea rows={3} maxLength={1500} className="lead-input" value={comment} onChange={e => setComment(e.target.value)} placeholder="Пожелания, сроки, вопросы" /></label>
        <div className="lead-honeypot" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
        {documents ? <>
          <label className="flex gap-3 text-xs text-cream/70 items-start"><input type="checkbox" required checked={consent} onChange={e => setConsent(e.target.checked)} /><ApprovedLeadText kind="checkbox" document={documents.checkbox} /></label>
          <details><summary>Согласие на обработку данных</summary><p className="text-sm"><ApprovedLeadText kind="consent" document={documents.consent} /></p></details>
          <details><summary>Политика обработки данных</summary><p className="text-sm"><ApprovedLeadText kind="policy" document={documents.policy} /></p></details>
        </> : <label className="flex gap-3 text-xs text-cream/70 items-start"><input type="checkbox" required checked={consent} onChange={e => setConsent(e.target.checked)} /><span>{LEGAL_CONSENT_TEXT} <a className="text-gold-400 underline underline-offset-2" href={withBasePath('/soglasie-pd')} target="_blank" rel="noopener noreferrer">Согласие</a> · <a className="text-gold-400 underline underline-offset-2" href={withBasePath('/politika')} target="_blank" rel="noopener noreferrer">Политика</a></span></label>}
      </fieldset>
      <button type="submit" disabled={!ready || !consent || busy || locked} className="btn-primary w-full justify-center disabled:opacity-60">{busy ? 'Отправляем заявку…' : attempt.current ? 'Повторить исходную заявку' : 'Отправить заявку'}</button>
    </form>}
    {error && <p role="alert" className="mt-3 text-sm text-cream">{error}{attempt.current && ` Номер: ${attempt.current.requestId}`}</p>}
    {rejected && <button type="button" className="btn-secondary mt-3" onClick={() => { if (discardRejectedLeadAttempt()) { attempt.current = null; started.current = Date.now(); setRejected(false); setError('') } }}>Изменить данные непринятой заявки</button>}
    <div className="flex flex-wrap gap-4 mt-5 text-sm text-gold-400"><a href={`tel:${siteSettings.phone}`}>{siteSettings.phoneDisplay}</a><a href={`tel:${siteSettings.phone2}`}>{siteSettings.phoneDisplay2}</a><a href={siteSettings.max} target="_blank" rel="noopener noreferrer">MAX</a><a href={siteSettings.telegram} target="_blank" rel="noopener noreferrer">Telegram</a></div>
  </section>
}
