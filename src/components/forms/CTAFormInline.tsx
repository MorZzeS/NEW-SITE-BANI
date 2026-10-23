'use client'

import { useEffect, useRef, useState } from 'react'
import { siteSettings } from '@/data'

/** Contact-only surface; the complete consent form stays in the working branch. */
export function CTAFormInline({ modelName, configurationNote }: { modelName?: string; configurationNote?: string }) {
  const [model, setModel] = useState(modelName || '')
  const [copyStatus, setCopyStatus] = useState('')
  const panel = useRef<HTMLElement>(null)
  useEffect(() => {
    setModel(modelName || new URLSearchParams(location.search).get('model')?.slice(0, 160) || '')
    setCopyStatus('')
    if (location.hash === '#zayavka') panel.current?.focus({ preventScroll: true })
  }, [modelName, configurationNote])
  const selection = [model && `Модель: ${model}`, configurationNote].filter(Boolean).join('\n\n')
  async function copySelection() {
    try {
      await navigator.clipboard.writeText(selection)
      setCopyStatus('Текст скопирован. Передайте его нам при обращении — с сайта он не отправлялся.')
    } catch {
      setCopyStatus('Не удалось скопировать автоматически. Выделите текст выше и скопируйте его вручную.')
    }
  }
  return <section ref={panel} tabIndex={-1} className="glass rounded-2xl p-5 sm:p-8" aria-label="Контакты для консультации" data-release-profile="visual-contacts">
    <h2 className="text-2xl font-bold text-cream mb-3">Свяжитесь с нами</h2>
    <p className="text-sm text-cream/70 mb-5">Онлайн-форма временно недоступна. Позвоните или напишите нам напрямую — так вы сможете получить консультацию и расчёт.</p>
    {selection && <div className="mb-5 border-l-2 border-gold-400 pl-4" aria-label="Выбранные модель и опции">
      <p className="whitespace-pre-wrap break-words text-sm text-cream/80 select-text">{selection}</p>
      <p className="mt-3 text-xs text-cream/70">Выбор не отправлен. Скопируйте его и передайте нам удобным способом.</p>
      <button type="button" onClick={copySelection} className="btn-secondary mt-3">Скопировать выбор</button>
      {copyStatus && <p role="status" className="mt-3 text-sm text-cream/80">{copyStatus}</p>}
    </div>}
    <div className="flex flex-col items-start gap-3 text-sm text-gold-400">
      <a className="inline-flex min-h-11 items-center font-semibold" href={`tel:${siteSettings.phone}`}>{siteSettings.phoneDisplay}</a>
      <a className="inline-flex min-h-11 items-center font-semibold" href={`tel:${siteSettings.phone2}`}>{siteSettings.phoneDisplay2}</a>
      <a className="inline-flex min-h-11 items-center break-all" href={`mailto:${siteSettings.email}`}>{siteSettings.email}</a>
      <div className="flex flex-wrap gap-4">
        <a className="inline-flex min-h-11 items-center" href={siteSettings.max} target="_blank" rel="noopener noreferrer">Написать в MAX</a>
        <a className="inline-flex min-h-11 items-center" href={siteSettings.telegram} target="_blank" rel="noopener noreferrer">Написать в Telegram</a>
      </div>
    </div>
    <p className="mt-4 text-xs text-cream/60">Мессенджеры открываются отдельно. Сообщение отправляете вы в выбранном приложении.</p>
  </section>
}
