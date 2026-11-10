'use client'

import Link from 'next/link'
import Image from 'next/image'
import { createPortal } from 'react-dom'
import { catalogCardImage } from '@/lib/catalog-image'
import { modelBaseConfiguration, modelFeatures } from '@/data/model-configuration'
import styles from './ProductDecisionTools.module.css'
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { ArrowRight, GitCompareArrows, X } from 'lucide-react'
import type { Home, Sauna } from '@/types'
import { formatPrice } from '@/data'

type DecisionProduct = Sauna | Home

type Props = {
  kind: 'bani' | 'doma'
  products: DecisionProduct[]
  selectedIds: string[]
  onToggleCompare: (id: string) => void
  children: ReactNode
}

export function ProductDecisionTools({ kind, products, selectedIds, onToggleCompare, children }: Props) {
  const [compareOpen, setCompareOpen] = useState(false)
  const compareTriggerRef = useRef<HTMLButtonElement>(null)
  const compareReturnRef = useRef<HTMLElement>(null)
  const closeCompareRef = useRef<HTMLButtonElement>(null)
  const compareDialogRef = useRef<HTMLDivElement>(null)

  const selected = useMemo(
    () => selectedIds.map((id) => products.find((product) => product.id === id)).filter(Boolean) as DecisionProduct[],
    [products, selectedIds],
  )

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
    <section ref={compareReturnRef} tabIndex={-1} className="mb-8 grid items-stretch gap-4 lg:grid-cols-[minmax(0,1.55fr)_minmax(280px,.85fr)]" aria-label="Подбор и сравнение моделей">
      <div className="glass rounded-2xl p-5 md:p-6">
        <p className="section-tag mb-2">Подбор модели</p>
        <h2 className="text-2xl font-bold text-cream">Найдите подходящий вариант</h2>
        <p className="mt-2 text-sm leading-relaxed text-cream/60">Фильтры сразу обновляют список моделей ниже.</p>
        <div className="mt-5 border-t border-cream/10 pt-5">{children}</div>
      </div>

      <div className="glass rounded-2xl p-5 md:p-6">
        <div className="flex items-center gap-2 text-gold-300"><GitCompareArrows className="h-4 w-4" /><span className="text-sm font-semibold">Сравнение моделей</span></div>
        <h2 className="mt-2 text-xl font-bold text-cream">Сравнение моделей по характеристикам</h2>
        <p className="mt-2 text-sm text-cream/60">Отметьте модели в каталоге, чтобы сопоставить их рядом.</p>
        <button ref={compareTriggerRef} type="button" className="btn-primary mt-4 inline-flex w-full items-center justify-center gap-2" disabled={selected.length < 2} onClick={() => setCompareOpen(true)}>
          Сравнить выбранные ({selected.length}/4)
        </button>
        {selected.length > 0 && <div className="mt-3 flex flex-wrap gap-2">{selected.map((product) => <button key={product.id} type="button" className="inline-flex items-center gap-1 rounded-lg border border-cream/15 px-2.5 py-1.5 text-xs text-cream/80" onClick={() => onToggleCompare(product.id)}>{product.name}<X className="h-3 w-3" /></button>)}</div>}
      </div>

      {compareOpen && createPortal(<div className={styles.overlay} onClick={closeCompare}>
        <div ref={compareDialogRef} tabIndex={-1} className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby="compare-title" onClick={(event) => event.stopPropagation()}>
          <div className={styles.heading}><div><p className="section-tag mb-2">Сопоставление</p><h2 id="compare-title">Сравнение моделей по характеристикам ({selected.length}/4)</h2></div><button ref={closeCompareRef} type="button" className={styles.close} aria-label="Закрыть сравнение" onClick={closeCompare}><X className="mx-auto h-5 w-5" /></button></div>
          {selected.length ? <div className={styles.scroll} role="region" aria-label="Таблица сравнения — прокручивается по горизонтали" tabIndex={0}>
            <table className={styles.table} style={{ minWidth: `calc(var(--compare-label-width, 144px) + ${selected.length * 176}px)` }}>
              <caption className="sr-only">Сравнение характеристик выбранных моделей. Строки с отличиями выделены фоном.</caption>
              <colgroup><col className={styles.parameter} />{selected.map(product => <col key={product.id} className={styles.model} />)}</colgroup>
              <thead><tr><th scope="col">Модель</th>{selected.map(product => <th scope="col" key={product.id}>
                <div className={styles.image} style={{ aspectRatio: product.image.includes('/bg-28/') ? '1664 / 928' : '3 / 2' }}><Image src={catalogCardImage(product.image)} alt={product.name} fill className="object-cover" sizes="220px" /></div>
                <span className={styles.name}>{product.name}</span><span className={styles.priceLabel}>{product.id === 'bg-28' ? 'Представленное исполнение' : 'Базовая комплектация'}</span><span className={styles.price}>{formatPrice(product.priceFrom)}</span>
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
