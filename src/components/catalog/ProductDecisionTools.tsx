'use client'

import Link from 'next/link'
import Image from 'next/image'
import { createPortal } from 'react-dom'
import { catalogCardImage } from '@/lib/catalog-image'
import { modelBaseConfiguration, modelFeatures } from '@/data/model-configuration'
import styles from './ProductDecisionTools.module.css'
import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowRight, GitCompareArrows, SlidersHorizontal, X } from 'lucide-react'
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
  const compareReturnRef = useRef<HTMLElement>(null)
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

  const comparisonRows: { label: string; value: (product: DecisionProduct) => string | string[] }[] = [
    { label: 'Габариты', value: product => product.size },
    { label: 'Площадь застройки', value: product => `${product.area} м²` },
    { label: 'Планировка / назначение', value: product => product.subtitle },
    ...Array.from(new Set(selected.flatMap(product => modelBaseConfiguration(product).map(row => row.label)))).map(label => ({ label, value: (product: DecisionProduct) => modelBaseConfiguration(product).find(row => row.label === label)?.value ?? 'Не указано в комплектации модели' })),
    ...Array.from(new Set(selected.flatMap(product => product.specs.map(row => row.label)))).filter(label => !['Размер', 'Площадь', 'Площадь застройки', ...selected.flatMap(product => modelBaseConfiguration(product).map(row => row.label))].includes(label)).map(label => ({ label, value: (product: DecisionProduct) => product.specs.find(row => row.label === label)?.value ?? 'Не указано в каталоге' })),
    { label: 'Особенности модели', value: modelFeatures },
  ]
  const hrefFor = (product: DecisionProduct) => `/${kind === 'bani' ? 'banya' : 'dom'}/${product.slug}`

  const closeCompare = () => {
    setCompareOpen(false)
    requestAnimationFrame(() => {
      if (compareTriggerRef.current?.disabled) compareReturnRef.current?.focus()
      else compareTriggerRef.current?.focus()
    })
  }

  useEffect(() => {
    if (!compareOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
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
    return () => { document.removeEventListener('keydown', onKeyDown); document.body.style.overflow = previousOverflow }
  }, [compareOpen])

  return (
    <section ref={compareReturnRef} tabIndex={-1} className="mb-8 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(280px,360px)]" aria-label="Помощь с выбором модели">
      <div className="glass rounded-2xl p-5 md:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="section-tag mb-2">Помощь с выбором</p>
            <h2 className="text-2xl font-bold text-cream">Сравните модели по фактам</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-cream/60">
              Выберите до четырёх вариантов. Сравните размеры, площадь, стоимость и подтверждённую комплектацию.
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
          Сравнить выбранные ({selected.length}/4)
        </button>
        {selected.length > 0 && <div className="mt-3 flex flex-wrap gap-2">{selected.map((product) => <button key={product.id} type="button" className="inline-flex items-center gap-1 rounded-lg border border-cream/15 px-2.5 py-1.5 text-xs text-cream/80" onClick={() => onToggleCompare(product.id)}>{product.name}<X className="h-3 w-3" /></button>)}</div>}
      </div>

      {compareOpen && createPortal(<div className={styles.overlay} onClick={closeCompare}>
        <div ref={compareDialogRef} tabIndex={-1} className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby="compare-title" onClick={(event) => event.stopPropagation()}>
          <div className={styles.heading}><div><p className="section-tag mb-2">Сопоставление</p><h2 id="compare-title">Выбранные модели ({selected.length}/4)</h2></div><button ref={closeCompareRef} type="button" className={styles.close} aria-label="Закрыть сравнение" onClick={closeCompare}><X className="mx-auto h-5 w-5" /></button></div>
          {selected.length ? <div className={styles.scroll} role="region" aria-label="Таблица сравнения — прокручивается по горизонтали" tabIndex={0}>
            <table className={styles.table} style={{ minWidth: `calc(var(--compare-label-width, 144px) + ${selected.length * 176}px)` }}>
              <caption className="sr-only">Сравнение характеристик выбранных моделей. Строки с отличиями выделены фоном.</caption>
              <colgroup><col className={styles.parameter} />{selected.map(product => <col key={product.id} className={styles.model} />)}</colgroup>
              <thead><tr><th scope="col">Модель</th>{selected.map(product => <th scope="col" key={product.id}>
                <div className={styles.image}><Image src={catalogCardImage(product.image)} alt={product.name} fill sizes="220px" /></div>
                <span className={styles.name}>{product.name}</span><span className={styles.priceLabel}>{product.id === 'bg-28' ? 'Представленное исполнение' : 'Цена от'}</span><span className={styles.price}>{formatPrice(product.priceFrom)}</span>
                <button className={styles.remove} type="button" aria-label={`Убрать из сравнения: ${product.name}`} onClick={() => { closeCompareRef.current?.focus(); onToggleCompare(product.id) }}><X size={14} aria-hidden="true" />Убрать</button>
              </th>)}</tr></thead>
              <tbody>{comparisonRows.map(row => {
                const values = selected.map(row.value)
                const different = selected.length > 1 && new Set(values.map(value => JSON.stringify(value))).size > 1
                return <tr key={row.label}><th scope="row">{row.label}</th>{values.map((value, index) => <td key={selected[index].id} className={different ? styles.different : undefined}>{Array.isArray(value) ? <ul className={styles.list}>{value.map(item => <li key={item}>{item}</li>)}</ul> : value}</td>)}</tr>
              })}<tr><th scope="row">Подробнее</th>{selected.map(product => <td key={product.id}><Link className={styles.link} href={hrefFor(product)}>Открыть модель <ArrowRight size={14} /></Link></td>)}</tr></tbody>
            </table>
          </div> : <p>В сравнении пока нет моделей. Закройте окно и отметьте варианты в каталоге.</p>}
          <p className={styles.note}>Выделены строки, значения которых отличаются. Стоимость и комплектация зависят от выбранного исполнения; параметры с пометкой «согласуется» уточняются при заказе.</p>
        </div>
      </div>, document.body)}
    </section>
  )
}
