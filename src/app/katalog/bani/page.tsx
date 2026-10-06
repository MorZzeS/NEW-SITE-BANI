'use client'
import { modelCountWord } from '@/lib/catalog-labels'

import { useState, useMemo } from 'react'
import { SaunaCard } from '@/components/catalog/SaunaCard'
import { saunas } from '@/data'
import clsx from 'clsx'

const series = ['Все', 'Исток', 'Север', 'Скандинавия', 'Барн']
const lengths = ['Все', '4–5 м', '6–7 м', '8+ м']

export default function BaniCatalogPage() {
  const [activeSeries, setActiveSeries] = useState('Все')
  const [activeLength, setActiveLength] = useState('Все')
  const [sort, setSort] = useState<'price_asc' | 'price_desc' | 'area'>('price_asc')
  const [minPrice, setMinPrice] = useState(0)
  const [maxPrice, setMaxPrice] = useState<number | ''>('')
  const [hasShowerFilter, setHasShowerFilter] = useState(false)
  const [hasTerraceFilter, setHasTerraceFilter] = useState(false)

  const filtered = useMemo(() => {
    let list = [...saunas]

    if (activeSeries !== 'Все') {
      list = list.filter((s) => s.series === activeSeries)
    }

    if (activeLength !== 'Все') {
      list = list.filter((s) => {
        const len = parseFloat(s.size)
        if (activeLength === '4–5 м') return len >= 4 && len < 6
        if (activeLength === '6–7 м') return len >= 6 && len < 8
        if (activeLength === '8+ м') return len >= 8
        return true
      })
    }

    if (minPrice > 0) list = list.filter(s => s.priceFrom >= minPrice)
    if (maxPrice !== '') list = list.filter(s => s.priceFrom <= maxPrice)
    if (hasShowerFilter) list = list.filter(s => s.hasShower)
    if (hasTerraceFilter) list = list.filter(s => s.hasTerrace)

    if (sort === 'price_asc') list.sort((a, b) => a.priceFrom - b.priceFrom)
    if (sort === 'price_desc') list.sort((a, b) => b.priceFrom - a.priceFrom)
    if (sort === 'area') list.sort((a, b) => b.area - a.area)

    return list
  }, [activeSeries, activeLength, sort, minPrice, maxPrice, hasShowerFilter, hasTerraceFilter])

  return (
    <div className="pt-28 pb-20">
      <div className="site-container">
        {/* Header */}
        <div className="mb-10">
          <div className="section-tag mb-4">Каталог</div>
          <h1 className="text-5xl font-extrabold text-cream mb-3">Мобильные бани</h1>
          <p className="text-cream/60 max-w-xl">
            {saunas.length} моделей собственного производства. Доставка и установка по Москве и Московской области.
          </p>
        </div>

        {/* Filters */}
        <div className="glass rounded-2xl p-5 mb-8 flex flex-wrap items-center gap-6">
          {/* Series filter */}
          <div>
            <div className="text-xs text-cream/50 mb-2 font-semibold">Серия</div>
            <div className="flex flex-wrap gap-2">
              {series.map((s) => (
                <button
                  key={s}
                  aria-pressed={activeSeries === s}
                  onClick={() => setActiveSeries(s)}
                  className={clsx(
                    'px-4 py-2 rounded-xl text-sm font-medium transition-all',
                    activeSeries === s
                      ? 'bg-gold-400/25 text-gold-300 border border-gold-400/40'
                      : 'glass text-cream/70 hover:text-cream'
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Length filter */}
          <div>
            <div className="text-xs text-cream/50 mb-2 font-semibold">Длина</div>
            <div className="flex flex-wrap gap-2">
              {lengths.map((l) => (
                <button
                  key={l}
                  aria-pressed={activeLength === l}
                  onClick={() => setActiveLength(l)}
                  className={clsx(
                    'px-4 py-2 rounded-xl text-sm font-medium transition-all',
                    activeLength === l
                      ? 'bg-gold-400/25 text-gold-300 border border-gold-400/40'
                      : 'glass text-cream/70 hover:text-cream'
                  )}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Features */}
          <div>
            <div className="text-xs text-cream/50 mb-2 font-semibold">Особенности</div>
            <div className="flex flex-wrap gap-2">
              <button aria-pressed={hasShowerFilter} onClick={() => setHasShowerFilter(!hasShowerFilter)} className={clsx('px-3 py-1.5 rounded-lg text-xs font-medium transition-all border', hasShowerFilter ? 'bg-gold-400/25 text-gold-300 border-gold-400/40' : 'glass text-cream/70 border-transparent')}>Душ</button>
              <button aria-pressed={hasTerraceFilter} onClick={() => setHasTerraceFilter(!hasTerraceFilter)} className={clsx('px-3 py-1.5 rounded-lg text-xs font-medium transition-all border', hasTerraceFilter ? 'bg-gold-400/25 text-gold-300 border-gold-400/40' : 'glass text-cream/70 border-transparent')}>Терраса / крыльцо</button>
            </div>
          </div>

          <div>
            <div className="text-xs text-cream/50 mb-2 font-semibold">Цена, ₽</div>
            <div className="flex gap-2">
              <input aria-label="Цена от" type="number" min="0" value={minPrice || ''}
                onChange={(e) => setMinPrice(Math.max(0, Number(e.target.value)))} placeholder="От"
                className="input-glass rounded-xl px-3 py-2 text-sm w-32" />
              <input aria-label="Цена до" type="number" min="0" value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value === '' ? '' : Math.max(0, Number(e.target.value)))} placeholder="До"
                className="input-glass rounded-xl px-3 py-2 text-sm w-32" />
            </div>
          </div>

          {/* Sort */}
          <div className="ml-auto">
            <div className="text-xs text-cream/50 mb-2 font-semibold">Сортировка</div>
            <select
              aria-label="Сортировка моделей"
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              className="glass rounded-xl px-4 py-2 text-sm text-cream bg-transparent outline-none cursor-pointer"
            >
              <option value="price_asc" className="bg-graphite-900">Сначала дешевле</option>
              <option value="price_desc" className="bg-graphite-900">Сначала дороже</option>
              <option value="area" className="bg-graphite-900">По площади</option>
            </select>
          </div>
        </div>

        {/* Count */}
        <div className="text-sm text-cream/50 mb-6">
          Найдено: <span className="text-cream font-semibold">{filtered.length}</span> {modelCountWord(filtered.length)}
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((sauna) => (
              <SaunaCard key={sauna.id} sauna={sauna} />
            ))}
          </div>
        ) : (
          <div className="glass rounded-3xl p-16 text-center">
            <p className="text-cream/50 text-lg">По выбранным фильтрам ничего не найдено</p>
            <button
              onClick={() => { setActiveSeries('Все'); setActiveLength('Все'); setMinPrice(0); setMaxPrice(''); setHasShowerFilter(false); setHasTerraceFilter(false) }}
              className="btn-secondary mt-4 mx-auto"
            >
              Сбросить фильтры
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
