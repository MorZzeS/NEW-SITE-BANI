'use client'
import { useRef, useState } from 'react'
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
    } catch { setError('Не удалось создать PDF. Проверьте соединение и попробуйте снова.') }
    finally { busy.current = false; setPreparing(false) }
  }
  return <div><button type="button" disabled={preparing} aria-busy={preparing} data-model-pdf-button onClick={download} className="inline-flex min-h-11 items-center text-sm text-gold-400 underline underline-offset-4 disabled:opacity-60">{preparing ? 'Готовим PDF…' : 'Скачать информацию о модели (PDF)'}</button><span className="sr-only" role="status">{preparing ? 'Создаём PDF с текущей комплектацией' : ''}</span>{error && <p role="alert" className="mt-2 text-sm">{error}</p>}</div>
}
