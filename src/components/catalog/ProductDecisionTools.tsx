'use client'

import Link from 'next/link'
import Image from 'next/image'
import { createPortal } from 'react-dom'
import { catalogCardImage } from '@/lib/catalog-image'
import { catalogPriceLabel } from '@/lib/catalog-labels'
import { modelBaseConfiguration, modelFeatures } from '@/data/model-configuration'
import styles from './ProductDecisionTools.module.css'
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { ArrowRight, ChevronDown, GitCompareArrows, SlidersHorizontal, X } from 'lucide-react'
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
  const [filtersOpen, setFiltersOpen] = useState(false)
  const compareTriggerRef = useRef<HTMLButtonElement>(null)
  const compareReturnRef = useRef<HTMLElement>(null)
  const closeCompareRef = useRef<HTMLButtonElement>(null)
  const compareDialogRef = useRef<HTMLDivElement>(null)

  const selected = useMemo(
    () => selectedIds.map((id) => products.find((product) => product.id === id)).filter(Boolean) as DecisionProduct[],
    [products, selectedIds],
  )

  const comparisonRows: { label: string; value: (product: DecisionProduct) => string | string[] }[] = [
    { label: 'Цена', value: product => formatPrice(product.priceFrom) },
    { label: 'Комплектация по этой цене', value: catalogPriceLabel },
    { label: 'Габариты', value: product => product.size },
    { label: 'Площадь застройки', value: product => `${product.area.toLocaleString('ru-RU')} м²` },
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
    <section ref={compareReturnRef} tabIndex={-1} className="mb-6 grid items-start gap-3 lg:grid-cols-[minmax(0,1.55fr)_minmax(280px,.85fr)]" aria-label="Подбор и сравнение моделей">
      <div className="glass min-w-0 rounded-2xl px-4 py-2 sm:p-5 md:p-6">
        <h2 className="font-bold text-cream">
          <button type="button" className="flex min-h-11 w-full items-center gap-2 text-left sm:hidden" aria-expanded={filtersOpen} aria-controls={`catalog-filters-${kind}`} onClick={() => setFiltersOpen(open => !open)}>
            <SlidersHorizontal size={17} aria-hidden="true" /> Фильтры и сортировка
            <ChevronDown size={16} aria-hidden="true" className={`ml-auto shrink-0 ${filtersOpen ? 'rotate-180' : ''}`} />
          </button>
          <span className="hidden text-xl sm:block">Фильтры и сортировка</span>
        </h2>
        <div id={`catalog-filters-${kind}`} className={`${filtersOpen ? 'block' : 'hidden'} border-t border-cream/10 py-4 sm:mt-4 sm:block sm:pb-0`}>{children}</div>
      </div>

      <div className="glass min-w-0 rounded-2xl p-4 sm:p-5 md:p-6">
        <h2 className="flex items-center gap-2 text-lg font-bold text-cream sm:text-xl"><GitCompareArrows className="h-5 w-5 shrink-0 text-gold-400" aria-hidden="true" /> Сравнение моделей</h2>
        <p className="mt-2 text-sm text-cream/70">Отметьте в каталоге от двух до четырёх моделей.</p>
        <button ref={compareTriggerRef} type="button" className="btn-primary mt-3 inline-flex w-full items-center justify-center gap-2" disabled={selected.length < 2} onClick={() => setCompareOpen(true)}>
          Сравнить выбранные ({selected.length}/4)
        </button>
        {selected.length > 0 && <div className="mt-3 flex flex-wrap gap-2">{selected.map((product) => <button key={product.id} type="button" aria-label={`Убрать из сравнения: ${product.name}, ${product.article ?? product.id}`} className="inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-cream/15 px-2.5 py-1.5 text-left text-xs text-cream/80" onClick={() => onToggleCompare(product.id)}>{product.name} · {product.article ?? product.id}<X className="h-3 w-3 shrink-0" aria-hidden="true" /></button>)}</div>}
      </div>

      {compareOpen && createPortal(<div className={styles.overlay} onClick={closeCompare}>
        <div ref={compareDialogRef} tabIndex={-1} className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby="compare-title" onClick={(event) => event.stopPropagation()}>
          <div className={styles.heading}><div><p className="section-tag mb-2">Сопоставление</p><h2 id="compare-title">Сравнение моделей по характеристикам ({selected.length}/4)</h2></div><button ref={closeCompareRef} type="button" className={styles.close} aria-label="Закрыть сравнение" onClick={closeCompare}><X className="mx-auto h-5 w-5" /></button></div>
          {selected.length ? <div className={styles.scroll} role="region" aria-label="Таблица сравнения — прокручивается по горизонтали" tabIndex={0}>
            <table className={styles.table} style={{ minWidth: `calc(var(--compare-label-width, 144px) + ${selected.length * 176}px)` }}>
              <caption className="sr-only">Сравнение характеристик выбранных моделей. Строки с отличиями выделены фоном.</caption>
              <colgroup><col className={styles.parameter} />{selected.map(product => <col key={product.id} className={styles.model} />)}</colgroup>
              <thead><tr><th scope="col">Модель</th>{selected.map(product => <th scope="col" key={product.id}>
                <div className={styles.image}><Image src={catalogCardImage(product.image)} alt="" fill className="object-cover" sizes="220px" /></div>
                <span className={styles.name}>{product.name}</span><span className={styles.article}>{product.article ?? product.id}</span>
                <button className={styles.remove} type="button" aria-label={`Убрать из сравнения: ${product.name}, ${product.article ?? product.id}`} onClick={() => { closeCompareRef.current?.focus(); onToggleCompare(product.id) }}><X size={14} aria-hidden="true" />Убрать</button>
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
