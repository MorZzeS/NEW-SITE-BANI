'use client'

import { useState, useMemo } from 'react'
import { HomeCard } from '@/components/catalog/HomeCard'
import { homes } from '@/data'
import clsx from 'clsx'

const roomOptions = ['Все', '2', '3', '4+']

export default function DomaCatalogPage() {
  const [activeRooms, setActiveRooms] = useState('Все')
  const [sort, setSort] = useState<'price_asc' | 'price_desc'>('price_asc')

  const filtered = useMemo(() => {
    let list = [...homes]

    if (activeRooms !== 'Все') {
      const n = parseInt(activeRooms)
      list = list.filter((h) => activeRooms === '4+' ? h.rooms >= 4 : h.rooms === n)
    }

    if (sort === 'price_asc') list.sort((a, b) => a.priceFrom - b.priceFrom)
    if (sort === 'price_desc') list.sort((a, b) => b.priceFrom - a.priceFrom)

    return list
  }, [activeRooms, sort])

  return (
    <div className="pt-28 pb-20">
      <div className="site-container">
        {/* Header */}
        <div className="mb-10">
          <div className="section-tag mb-4">Каталог</div>
          <h1 className="text-5xl font-extrabold text-cream mb-3">Мобильные дома</h1>
          <p className="text-cream/60 max-w-xl">
            Серия Усадьба — гостевые домики, дома для отдыха и круглогодичного проживания.
            {' '}{homes.length} моделей в каталоге.
          </p>
        </div>

        {/* Filters */}
        <div className="glass rounded-2xl p-5 mb-8 flex flex-wrap items-center gap-6">
          <div>
            <div className="text-xs text-cream/50 mb-2 font-semibold">Помещений</div>
            <div className="flex flex-wrap gap-2">
              {roomOptions.map((r) => (
                <button
                  key={r}
                  onClick={() => setActiveRooms(r)}
                  className={clsx(
                    'px-4 py-2 rounded-xl text-sm font-medium transition-all',
                    activeRooms === r
                      ? 'bg-gold-400/25 text-gold-300 border border-gold-400/40'
                      : 'glass text-cream/70 hover:text-cream'
                  )}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

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
          Найдено: <span className="text-cream font-semibold">{filtered.length}</span> моделей
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
