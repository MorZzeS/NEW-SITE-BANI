'use client'
import { useRef, useState } from 'react'
export function PrintModelButton() {
  const busy = useRef(false)
  const [preparing, setPreparing] = useState(false)
  const [error, setError] = useState('')
  async function print() {
    if (busy.current) return
    busy.current = true; setPreparing(true); setError('')
    try {
      const images = Array.from(document.querySelectorAll<HTMLImageElement>('.model-sheet img'))
      if (!images.length) throw new Error('No model image')
      await Promise.all(images.map(image => image.decode()))
      if (images.some(image => !image.naturalWidth)) throw new Error('Missing image')
      await document.fonts.ready
      window.print()
    } catch { setError('Не удалось подготовить изображения для печати. Дождитесь загрузки страницы и попробуйте снова.') }
    finally { busy.current = false; setPreparing(false) }
  }
  return <><button type="button" disabled={preparing} className="btn-primary print-model-action disabled:opacity-60" onClick={print}>{preparing ? 'Готовим документ…' : 'Сохранить в PDF / печать'}</button>{error && <p role="alert" className="mt-3 text-sm">{error}</p>}</>
}
