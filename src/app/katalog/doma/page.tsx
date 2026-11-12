'use client'
import { modelCountWord } from '@/lib/catalog-labels'
import { withBasePath } from '@/lib/site-path'

import { useState, useMemo } from 'react'
import { HomeCard } from '@/components/catalog/HomeCard'
import { homes } from '@/data'
import { ProductDecisionTools } from '@/components/catalog/ProductDecisionTools'
import Link from 'next/link'
import { longestDimensionInMeters } from '@/lib/catalog-filters'


export default function DomaCatalogPage() {
  const [sort, setSort] = useState<'price_asc' | 'price_desc'>('price_asc')
  const [length, setLength] = useState('Все')
  const [minPrice, setMinPrice] = useState(0)
  const [maxPrice, setMaxPrice] = useState<number | ''>('')
  const [compareIds, setCompareIds] = useState<string[]>([])

  const toggleCompare = (id: string) => setCompareIds((current) => current.includes(id)
    ? current.filter((item) => item !== id)
    : current.length < 4 ? [...current, id] : current)

  const filtered = useMemo(() => {
    let list = [...homes]

    if (length !== 'Все') {
      list = list.filter((home) => {
        const meters = longestDimensionInMeters(home.size)
        if (length === 'До 6 м') return meters < 6
        if (length === '6–7,5 м') return meters >= 6 && meters < 8
        return meters >= 8
      })
    }
    if (minPrice > 0) list = list.filter(home => home.priceFrom >= minPrice)
    if (maxPrice !== '') list = list.filter(home => home.priceFrom <= maxPrice)

    if (sort === 'price_asc') list.sort((a, b) => a.priceFrom - b.priceFrom)
    if (sort === 'price_desc') list.sort((a, b) => b.priceFrom - a.priceFrom)

    return list
  }, [sort, length, minPrice, maxPrice])

  return (
    <div className="pt-28 pb-20">
      <div className="site-container">
        {/* Header */}
        <nav aria-label="Хлебные крошки" className="mb-5 text-sm text-cream/55"><ol className="flex flex-wrap items-center gap-2"><li><a className="hover:text-cream" href={withBasePath('/')}>Главная</a></li><li aria-hidden="true">/</li><li><Link className="hover:text-cream" href="/katalog/doma">Мобильные дома</Link></li></ol></nav>
        <div className="mb-8">
          <div className="section-tag mb-4">Каталог</div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-cream mb-3">Мобильные дома серии «Усадьба»</h1>
          <p className="text-cream/60 max-w-xl">{homes.length} {modelCountWord(homes.length)} в каталоге. Размер и стоимость можно уточнить фильтрами ниже.</p>
        </div>

        <ProductDecisionTools kind="doma" products={homes} selectedIds={compareIds} onToggleCompare={toggleCompare}>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm text-cream/70">Размер
              <select value={length} onChange={event => setLength(event.target.value)} className="input-glass mt-1 min-h-10 w-full rounded-xl px-3 py-2 text-sm text-cream">
                <option className="bg-graphite-900">Все</option><option className="bg-graphite-900">До 6 м</option><option className="bg-graphite-900">6–7,5 м</option><option className="bg-graphite-900">От 8 м</option>
              </select>
            </label>
            <label className="text-sm text-cream/70">Сортировка
              <select value={sort} onChange={e => setSort(e.target.value as typeof sort)} className="input-glass mt-1 min-h-10 w-full rounded-xl px-3 py-2 text-sm text-cream">
                <option value="price_asc" className="bg-graphite-900">Сначала дешевле</option><option value="price_desc" className="bg-graphite-900">Сначала дороже</option>
              </select>
            </label>
            <div className="sm:col-span-2">
              <div className="text-xs text-cream/50 mb-2 font-semibold">Бюджет базовой комплектации, ₽</div>
              <div className="grid grid-cols-2 gap-2"><input aria-label="Цена от" type="number" min="0" value={minPrice || ''} onChange={event => setMinPrice(Math.max(0, Number(event.target.value)))} placeholder="От" className="input-glass min-w-0 rounded-xl px-3 py-2 text-sm" /><input aria-label="Цена до" type="number" min="0" value={maxPrice} onChange={event => setMaxPrice(event.target.value === '' ? '' : Math.max(0, Number(event.target.value)))} placeholder="До" className="input-glass min-w-0 rounded-xl px-3 py-2 text-sm" /></div>
            </div>
            {(length !== 'Все' || minPrice !== 0 || maxPrice !== '') && <button type="button" className="text-sm text-gold-300 underline underline-offset-4 sm:col-span-2 sm:justify-self-start" onClick={() => { setLength('Все'); setMinPrice(0); setMaxPrice('') }}>Сбросить подбор</button>}
          </div>
        </ProductDecisionTools>

        <div className="text-sm text-cream/50 mb-6">
          Найдено: <span className="text-cream font-semibold">{filtered.length}</span> {modelCountWord(filtered.length)}
        </div>

        {filtered.length > 0 ? (
          <div className="grid auto-rows-fr grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((home) => (
              <HomeCard key={home.id} home={home} compareSelected={compareIds.includes(home.id)} compareDisabled={compareIds.length >= 4} onCompare={toggleCompare} />
            ))}
          </div>
        ) : (
          <div role="status" className="glass rounded-2xl px-5 py-6 text-center text-cream/75">
            По выбранным параметрам домов не найдено. Измените условия подбора или сбросьте фильтры.
          </div>
        )}
      </div>
    </div>
  )
}
