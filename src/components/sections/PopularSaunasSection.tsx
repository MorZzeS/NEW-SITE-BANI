import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { SaunaCard } from '@/components/catalog/SaunaCard'
import { getSaunasByPopularity } from '@/data'

export function PopularSaunasSection() {
  const popular = getSaunasByPopularity().slice(0, 4)

  return (
    <section className="py-20">
      <div className="site-container">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="section-tag mb-3">Популярные модели</div>
            <h2 className="text-4xl font-bold text-cream">Часто выбирают</h2>
          </div>
          <Link href="/katalog/bani" className="btn-secondary px-5 py-2.5 text-sm whitespace-nowrap">
            Весь каталог <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {popular.map((sauna) => (
            <SaunaCard key={sauna.id} sauna={sauna} />
          ))}
        </div>
      </div>
    </section>
  )
}
