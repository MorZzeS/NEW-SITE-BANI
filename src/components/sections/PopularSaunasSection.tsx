import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { SaunaCard } from '@/components/catalog/SaunaCard'
import { saunas } from '@/data'
import { homepageBestSellerSlug, homepagePopularIds } from '@/data/homepage'

export function PopularSaunasSection() {
  const popular = homepagePopularIds.flatMap((id) => {
    const sauna = saunas.find((model) => model.id === id)
    return sauna ? [sauna] : []
  })

  return (
    <section className="homepage-popular py-20" aria-labelledby="popular-heading">
      <div className="site-container">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="section-tag mb-3">Популярные модели</div>
            <h2 id="popular-heading" className="text-4xl font-bold text-cream">Часто выбирают</h2>
          </div>
          <Link href="/katalog/bani" className="btn-secondary px-5 py-2.5 text-sm whitespace-nowrap">
            Весь каталог <ArrowRight aria-hidden="true" className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {popular.map((sauna) => (
            <SaunaCard key={sauna.id} sauna={sauna} bestSeller={sauna.slug === homepageBestSellerSlug} />
          ))}
        </div>
      </div>
    </section>
  )
}
