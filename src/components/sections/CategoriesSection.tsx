import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { saunas, homes } from '@/data'
import { catalogCardImage } from '@/lib/catalog-image'
import { modelCountWord } from '@/lib/catalog-labels'

const directions = [
  {
    name: 'Исток',
    href: '/katalog/bani?series=Исток',
    image: '/images/catalog/bg-05/model.png',
    alt: 'Исток Семейный 7',
    count: saunas.filter(model => model.series === 'Исток').length,
    description: 'Мобильные бани серии Исток. Выберите размер и планировку.',
  },
  {
    name: 'Скандинавия',
    href: '/katalog/bani?series=Скандинавия',
    image: '/images/catalog/bg-21/model.png',
    alt: 'Север Панорама 8 — направление Скандинавия',
    count: saunas.filter(model => model.series === 'Скандинавия' || model.series === 'Север').length,
    description: 'Бани серий Скандинавия и Север в одном направлении.',
  },
  {
    name: 'Барн',
    href: '/katalog/bani?series=Барн',
    image: '/images/catalog/bg-28/model.png',
    alt: 'Барн Премиум',
    count: saunas.filter(model => model.series === 'Барн').length,
    description: 'Баня Барн Премиум. Планировка и комплектация модели.',
  },
  {
    name: 'Усадьба',
    href: '/katalog/doma',
    image: '/images/catalog/bg-25/model.png',
    alt: 'Усадьба Практик',
    count: homes.length,
    description: 'Модели серии Усадьба. Планировки, размеры и комплектации.',
  },
]

export function CategoriesSection() {
  return (
    <section className="py-20">
      <div className="site-container">
        <div className="text-center mb-12">
          <div className="section-tag mb-4">Направления</div>
          <h2 className="text-4xl font-bold text-cream mb-3">Что мы производим</h2>
          <p className="text-cream/60 max-w-lg mx-auto">
            Четыре направления — выберите модели, планировки и комплектации
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {directions.map(direction => (
            <Link key={direction.name} href={direction.href} className="group block rounded-3xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-400">
              <div className="relative overflow-hidden rounded-3xl min-h-80 glass-card border-0 flex items-end">
                <picture className="absolute inset-0 block">
                  <source type="image/avif" srcSet={catalogCardImage(direction.image, 'avif')} />
                  <Image
                    src={catalogCardImage(direction.image)}
                    alt={direction.alt}
                    fill
                    loading="lazy"
                    className="object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none motion-reduce:transform-none"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </picture>
                <div className="absolute inset-0 bg-gradient-to-t from-graphite-950/90 via-graphite-950/30 to-transparent" />
                <div className="theme-on-image relative w-full p-7 pt-24">
                  <div className="section-tag mb-3 text-[10px]">{direction.count} {modelCountWord(direction.count)}</div>
                  <h3 className="text-2xl font-bold text-cream mb-2">{direction.name}</h3>
                  <p className="text-cream/70 text-sm mb-5">{direction.description}</p>
                  <div className="flex items-center gap-2 text-gold-400 font-semibold text-sm group-hover:gap-3 transition-all motion-reduce:transition-none">
                    Смотреть модели <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
