'use client'
import { modelCountWord } from '@/lib/catalog-labels'

import { useState, useMemo } from 'react'
import { HomeCard } from '@/components/catalog/HomeCard'
import { homes } from '@/data'


export default function DomaCatalogPage() {
  const [sort, setSort] = useState<'price_asc' | 'price_desc'>('price_asc')

  const filtered = useMemo(() => {
    let list = [...homes]

    if (sort === 'price_asc') list.sort((a, b) => a.priceFrom - b.priceFrom)
    if (sort === 'price_desc') list.sort((a, b) => b.priceFrom - a.priceFrom)

    return list
  }, [sort])

  return (
    <div className="pt-28 pb-20">
      <div className="site-container">
        {/* Header */}
        <div className="mb-10">
          <div className="section-tag mb-4">Каталог</div>
          <h1 className="text-5xl font-extrabold text-cream mb-3">Мобильные дома</h1>
          <p className="text-cream/60 max-w-xl">
            Серия Усадьба.
            {' '}{homes.length} моделей в каталоге.
          </p>
        </div>

        {/* Filters */}
        <div className="glass rounded-2xl p-5 mb-8 flex flex-wrap items-center gap-6">
          <div className="ml-auto">
            <div className="text-xs text-cream/50 mb-2 font-semibold">Сортировка</div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              className="glass rounded-xl px-4 py-2 text-sm text-cream bg-transparent outline-none cursor-pointer"
            >
              <option value="price_asc" className="bg-graphite-900">Сначала дешевле</option>
              <option value="price_desc" className="bg-graphite-900">Сначала дороже</option>
            </select>
          </div>
        </div>

        <div className="text-sm text-cream/50 mb-6">
          Найдено: <span className="text-cream font-semibold">{filtered.length}</span> {modelCountWord(filtered.length)}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((home) => (
            <HomeCard key={home.id} home={home} />
          ))}
        </div>
      </div>
    </div>
  )
}
