'use client'
import { useRef, useState } from 'react'
import { Download } from 'lucide-react'
import type { Sauna, Home } from '@/types'
import { useModelConfiguration } from './ModelConfigurationContext'

export function DownloadModelPdfButton({ model }: { model: Sauna | Home }) {
  const { configuration } = useModelConfiguration()
  const busy = useRef(false)
  const [preparing, setPreparing] = useState(false)
  const [error, setError] = useState('')
  async function download() {
    if (busy.current) return
    busy.current = true; setPreparing(true); setError('')
    try {
      const { downloadModelPdf } = await import('@/lib/model-pdf')
      await downloadModelPdf(model, configuration)
    } catch { setError('Не удалось создать PDF. Попробуйте ещё раз.') }
    finally { busy.current = false; setPreparing(false) }
  }
  return <div><button type="button" disabled={preparing} aria-busy={preparing} data-model-pdf-button onClick={download} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-gold-400/45 bg-gold-400/10 px-4 py-3 text-center text-sm font-semibold text-gold-300 transition-colors hover:border-gold-400/80 hover:bg-gold-400/20 disabled:cursor-wait disabled:opacity-60"><Download size={18} aria-hidden="true" />{preparing ? 'Готовим PDF…' : 'Скачать карточку с выбранной комплектацией (PDF)'}</button><span className="sr-only" role="status">{preparing ? 'Создаём PDF с текущей комплектацией' : ''}</span>{error && <p role="alert" className="mt-2 text-sm">{error}</p>}</div>
}
