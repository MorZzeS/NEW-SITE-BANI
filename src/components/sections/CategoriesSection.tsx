import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { saunas } from '@/data'

export function CategoriesSection() {
  return (
    <section className="py-20">
      <div className="site-container">
        <div className="text-center mb-12">
          <div className="section-tag mb-4">Направления</div>
          <h2 className="text-4xl font-bold text-cream mb-3">Что мы производим</h2>
          <p className="text-cream/60 max-w-lg mx-auto">
            Два независимых направления — каждое со своей линейкой моделей, планировок и комплектаций
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Saunas */}
          <Link href="/katalog/bani" className="group block">
            <div className="relative overflow-hidden rounded-3xl h-80 glass-card border-0">
              <Image
                src="/images/renders/istok-8.webp"
                alt="Мобильная баня — серии Исток, Север, Скандинавия"
                fill
                loading="lazy"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-graphite-950/90 via-graphite-950/30 to-transparent" />
              <div className="theme-on-image absolute bottom-0 left-0 right-0 p-7">
                <div className="section-tag mb-3 text-[10px]">{saunas.length} моделей</div>
                <h3 className="text-2xl font-bold text-cream mb-2">Мобильные бани</h3>
                <p className="text-cream/70 text-sm mb-5">
                  Серии Исток, Север, Скандинавия. От 4 до 8 метров. Русская парная, мойка, комната отдыха.
                </p>
                <div className="flex items-center gap-2 text-gold-400 font-semibold text-sm group-hover:gap-3 transition-all">
                  Смотреть каталог бань <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </Link>

          {/* Homes */}
          <Link href="/katalog/doma" className="group block">
            <div className="relative overflow-hidden rounded-3xl h-80 glass-card border-0">
              <Image
                src="/images/renders/usadba-terra-7.webp"
                alt="Мобильный дом — серия Усадьба"
                fill
                loading="lazy"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-graphite-950/90 via-graphite-950/30 to-transparent" />
              <div className="theme-on-image absolute bottom-0 left-0 right-0 p-7">
                <div className="section-tag mb-3 text-[10px]">6 моделей</div>
                <h3 className="text-2xl font-bold text-cream mb-2">Мобильные дома</h3>
                <p className="text-cream/70 text-sm mb-5">
                  Серия Усадьба. Гостевые дома, домики для отдыха и постоянного проживания.
                </p>
                <div className="flex items-center gap-2 text-gold-400 font-semibold text-sm group-hover:gap-3 transition-all">
                  Смотреть каталог домов <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  )
}
