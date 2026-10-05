import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { Home } from '@/types'
import { formatPrice } from '@/data'
import clsx from 'clsx'

interface Props {
  home: Home
}

const tagColors: Record<string, string> = {
  'Хит': 'bg-gold-400/20 text-gold-300 border-gold-400/30',
  'Новинка': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  'В наличии': 'bg-blue-500/15 text-blue-300 border-blue-500/25',
  'Под заказ': 'bg-cream/10 text-cream/60 border-cream/20',
}

export function HomeCard({ home }: Props) {
  return (
    <Link href={`/dom/${home.slug}`} className="group block">
      <div className="glass-card h-full flex flex-col overflow-hidden">
        {/* Image */}
        <div className="relative overflow-hidden bg-graphite-900 h-52">
          <Image
            src={home.image}
            alt={home.name}
            fill
            className="object-contain transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
          />
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            {home.tags.map((tag) => (
              <span
                key={tag}
                className={clsx(
                  'px-2 py-0.5 rounded-lg text-[10px] font-semibold border backdrop-blur-sm',
                  tagColors[tag] || 'bg-cream/10 text-cream/60 border-cream/20'
                )}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-5">
          <div className="text-[10px] font-semibold tracking-widest uppercase text-gold-400/80 mb-1">
            Усадьба
          </div>
          <h3 className="text-lg font-bold text-cream mb-1 group-hover:text-gold-300 transition-colors">
            {home.name}
          </h3>
          <p className="text-sm text-cream/60 leading-relaxed mb-4 flex-1">
            {home.subtitle}
          </p>

          {/* Specs */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[
              { label: 'Размер', value: home.size },
              { label: 'Площадь', value: `${home.area} м²` },
              { label: 'Артикул', value: home.article },
            ].map((s) => (
              <div key={s.label} className="glass rounded-xl p-2.5 text-center">
                <div className="text-xs text-cream/40 mb-0.5">{s.label}</div>
                <div className="text-sm font-semibold text-cream">{s.value}</div>
              </div>
            ))}
          </div>

          {/* Price + CTA */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] text-cream/40 mb-0.5">от</div>
              <div className="text-xl font-bold text-cream">
                {formatPrice(home.priceFrom)}
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-gold-400 text-sm font-semibold group-hover:gap-3 transition-all">
              Подробнее <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
