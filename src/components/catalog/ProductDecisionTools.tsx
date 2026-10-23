'use client'

import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowRight, Check, GitCompareArrows, SlidersHorizontal, X } from 'lucide-react'
import type { Home, Sauna } from '@/types'
import { formatPrice } from '@/data'

type DecisionProduct = Sauna | Home

type Props = {
  kind: 'bani' | 'doma'
  products: DecisionProduct[]
  selectedIds: string[]
  onToggleCompare: (id: string) => void
}

const lengthOptions = [
  { value: 'any', label: 'Любой размер' },
  { value: 'compact', label: 'До 6 м' },
  { value: 'medium', label: '6–7,5 м' },
  { value: 'large', label: 'От 8 м' },
] as const

function lengthInMeters(size: string) {
  const match = size.replace(',', '.').match(/[0-9]+(?:\.[0-9]+)?/)
  return match ? Number(match[0]) : 0
}

function matchesLength(size: string, value: typeof lengthOptions[number]['value']) {
  const length = lengthInMeters(size)
  if (value === 'compact') return length < 6
  if (value === 'medium') return length >= 6 && length < 8
  if (value === 'large') return length >= 8
  return true
}

export function ProductDecisionTools({ kind, products, selectedIds, onToggleCompare }: Props) {
  const [compareOpen, setCompareOpen] = useState(false)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [length, setLength] = useState<typeof lengthOptions[number]['value']>('any')
  const [budget, setBudget] = useState<'any' | 'under600' | 'under800'>('any')
  const [feature, setFeature] = useState<'any' | 'terrace' | 'shower'>('any')
  const compareTriggerRef = useRef<HTMLButtonElement>(null)
  const closeCompareRef = useRef<HTMLButtonElement>(null)
  const compareDialogRef = useRef<HTMLDivElement>(null)

  const selected = useMemo(
    () => selectedIds.map((id) => products.find((product) => product.id === id)).filter(Boolean) as DecisionProduct[],
    [products, selectedIds],
  )

  const recommendations = useMemo(() => products.filter((product) => {
    if (!matchesLength(product.size, length)) return false
    if (budget === 'under600' && product.priceFrom > 600000) return false
    if (budget === 'under800' && product.priceFrom > 800000) return false
    if (feature === 'terrace' && !('hasTerrace' in product && product.hasTerrace)) return false
    if (feature === 'shower' && !('hasShower' in product && product.hasShower)) return false
    return true
  }).slice(0, 4), [budget, feature, length, products])

  const hrefFor = (product: DecisionProduct) => `/${kind === 'bani' ? 'banya' : 'dom'}/${product.slug}`

  const closeCompare = () => {
    setCompareOpen(false)
    requestAnimationFrame(() => compareTriggerRef.current?.focus())
  }

  useEffect(() => {
    if (!compareOpen) return
    closeCompareRef.current?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        closeCompare()
        return
      }
      if (event.key !== 'Tab' || !compareDialogRef.current) return
      const focusable = Array.from(compareDialogRef.current.querySelectorAll<HTMLElement>('button, a, select, input, [tabindex]:not([tabindex="-1"])')).filter((element) => !element.hasAttribute('disabled'))
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [compareOpen])

  return (
    <section className="mb-8 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(280px,360px)]" aria-label="Помощь с выбором модели">
      <div className="glass rounded-2xl p-5 md:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="section-tag mb-2">Помощь с выбором</p>
            <h2 className="text-2xl font-bold text-cream">Сравните модели по фактам</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-cream/60">
              Выберите до трёх вариантов. В сравнении используются только размеры, площадь, цена и заявленные особенности каталога.
            </p>
          </div>
          <button type="button" className="btn-secondary inline-flex items-center gap-2" onClick={() => setPickerOpen((open) => !open)} aria-expanded={pickerOpen}>
            <SlidersHorizontal className="h-4 w-4" />
            {pickerOpen ? 'Скрыть подбор' : 'Подобрать модель'}
          </button>
        </div>

        {pickerOpen && (
          <div className="mt-5 grid gap-3 border-t border-cream/10 pt-5 md:grid-cols-3">
            <label className="text-sm text-cream/70">Размер
              <select value={length} onChange={(event) => setLength(event.target.value as typeof length)} className="input-glass mt-1 w-full rounded-xl px-3 py-2 text-sm text-cream">
                {lengthOptions.map((option) => <option key={option.value} value={option.value} className="bg-graphite-900">{option.label}</option>)}
              </select>
            </label>
            <label className="text-sm text-cream/70">Бюджет от каталога
              <select value={budget} onChange={(event) => setBudget(event.target.value as typeof budget)} className="input-glass mt-1 w-full rounded-xl px-3 py-2 text-sm text-cream">
                <option value="any" className="bg-graphite-900">Без ограничения</option>
                <option value="under600" className="bg-graphite-900">До 600 000 ₽</option>
                <option value="under800" className="bg-graphite-900">До 800 000 ₽</option>
              </select>
            </label>
            <label className="text-sm text-cream/70">Особенность
              <select value={feature} onChange={(event) => setFeature(event.target.value as typeof feature)} className="input-glass mt-1 w-full rounded-xl px-3 py-2 text-sm text-cream">
                <option value="any" className="bg-graphite-900">Неважно</option>
                <option value="terrace" className="bg-graphite-900">Терраса / крыльцо</option>
                {kind === 'bani' && <option value="shower" className="bg-graphite-900">Душ</option>}
              </select>
            </label>
            <div className="md:col-span-3 rounded-xl border border-gold-400/20 bg-gold-400/5 p-3 text-sm text-cream/70">
              Найдено по выбранным параметрам: <strong className="text-cream">{recommendations.length}</strong>. Это предварительный подбор, а не рекомендация по строительству или бюджету.
              {recommendations.length > 0 && <div className="mt-3 flex flex-wrap gap-2">{recommendations.map((product) => <Link key={product.id} href={hrefFor(product)} className="inline-flex items-center gap-1 rounded-lg border border-cream/15 px-3 py-2 text-xs text-cream transition-colors hover:border-gold-400/50 hover:text-gold-300">{product.name}<ArrowRight className="h-3 w-3" /></Link>)}</div>}
            </div>
          </div>
        )}
      </div>

      <div className="glass rounded-2xl p-5 md:p-6">
        <div className="flex items-center gap-2 text-gold-300"><GitCompareArrows className="h-4 w-4" /><span className="text-sm font-semibold">Сравнение</span></div>
        <p className="mt-2 text-sm text-cream/60">Отметьте модели в каталоге, чтобы сопоставить их рядом.</p>
        <button ref={compareTriggerRef} type="button" className="btn-primary mt-4 inline-flex w-full items-center justify-center gap-2" disabled={selected.length < 2} onClick={() => setCompareOpen(true)}>
          Сравнить выбранные ({selected.length}/3)
        </button>
        {selected.length > 0 && <div className="mt-3 flex flex-wrap gap-2">{selected.map((product) => <button key={product.id} type="button" className="inline-flex items-center gap-1 rounded-lg border border-cream/15 px-2.5 py-1.5 text-xs text-cream/80" onClick={() => onToggleCompare(product.id)}>{product.name}<X className="h-3 w-3" /></button>)}</div>}
      </div>

      {compareOpen && <div className="fixed inset-0 z-50 flex items-end justify-center bg-graphite-950/80 p-3 backdrop-blur-sm md:items-center md:p-8" role="dialog" aria-modal="true" aria-labelledby="compare-title" onClick={closeCompare}>
        <div ref={compareDialogRef} tabIndex={-1} className="glass max-h-[90vh] w-full max-w-5xl overflow-auto rounded-2xl border border-gold-400/20 p-5 md:p-7" onClick={(event) => event.stopPropagation()}>
          <div className="flex items-center justify-between gap-4"><div><p className="section-tag mb-2">Сопоставление</p><h2 id="compare-title" className="text-2xl font-bold text-cream">Выбранные модели</h2></div><button ref={closeCompareRef} type="button" className="btn-secondary min-h-11 min-w-11 p-0" aria-label="Закрыть сравнение" onClick={closeCompare}><X className="mx-auto h-5 w-5" /></button></div>
          <div className="mt-6 grid min-w-[620px] grid-cols-[150px_repeat(3,minmax(150px,1fr))] gap-px overflow-hidden rounded-xl border border-cream/10 bg-cream/10">
            <div className="bg-[var(--color-surface-2)] p-3 text-xs font-semibold uppercase tracking-wide text-cream/50">Параметр</div>
            {Array.from({ length: 3 }).map((_, index) => <div key={`head-${index}`} className="bg-[var(--color-surface-2)] p-3 text-sm font-semibold text-cream">{selected[index]?.name ?? '—'}</div>)}
            <div className="bg-[var(--color-surface)] p-3 text-xs text-cream/50">Ссылка</div>
            {Array.from({ length: 3 }).map((_, index) => <div key={`link-${index}`} className="bg-[var(--color-surface)] p-3 text-sm text-cream">{selected[index] ? <Link className="text-gold-300 hover:text-gold-200" href={hrefFor(selected[index])}>Открыть модель <ArrowRight className="inline h-3 w-3" /></Link> : '—'}</div>)}
            <div className="bg-[var(--color-surface)] p-3 text-xs text-cream/50">Размер</div>
            {Array.from({ length: 3 }).map((_, index) => <div key={`size-${index}`} className="bg-[var(--color-surface)] p-3 text-sm text-cream">{selected[index]?.size ?? '—'}</div>)}
            <div className="bg-[var(--color-surface)] p-3 text-xs text-cream/50">Площадь</div>
            {Array.from({ length: 3 }).map((_, index) => <div key={`area-${index}`} className="bg-[var(--color-surface)] p-3 text-sm text-cream">{selected[index] ? `${selected[index].area} м²` : '—'}</div>)}
            <div className="bg-[var(--color-surface)] p-3 text-xs text-cream/50">Цена от</div>
            {Array.from({ length: 3 }).map((_, index) => <div key={`price-${index}`} className="bg-[var(--color-surface)] p-3 text-sm font-semibold text-cream">{selected[index] ? formatPrice(selected[index].priceFrom) : '—'}</div>)}
            <div className="bg-[var(--color-surface)] p-3 text-xs text-cream/50">Особенности</div>
            {Array.from({ length: 3 }).map((_, index) => <div key={`features-${index}`} className="bg-[var(--color-surface)] p-3 text-sm text-cream/70">{selected[index] ? <ul className="space-y-1">{selected[index].features.slice(0, 3).map((item) => <li key={item} className="flex gap-1"><Check className="mt-0.5 h-3 w-3 shrink-0 text-gold-300" />{item}</li>)}</ul> : '—'}</div>)}
          </div>
          <p className="mt-4 text-xs text-cream/45">Цена указана как «от» и зависит от выбранного исполнения и согласованной комплектации.</p>
        </div>
      </div>}
    </section>
  )
}
