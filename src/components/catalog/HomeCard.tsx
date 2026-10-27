import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, GitCompareArrows } from 'lucide-react'
import type { Home } from '@/types'
import { formatPrice } from '@/data'
import clsx from 'clsx'
import { catalogCardImage } from '@/lib/catalog-image'
import styles from './CatalogCard.module.css'

interface Props {
  home: Home
  compareSelected?: boolean
  compareDisabled?: boolean
  onCompare?: (id: string) => void
}

const tagColors: Record<string, string> = {
  'Хит': 'bg-gold-400/20 text-gold-300 border-gold-400/30',
  'Новинка': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  'В наличии': 'bg-blue-500/15 text-blue-300 border-blue-500/25',
  'Под заказ': 'bg-cream/10 text-cream/60 border-cream/20',
}

export function HomeCard({ home, compareSelected = false, compareDisabled = false, onCompare }: Props) {
  return (
    <div className={styles.wrapper}>
      {onCompare && <button
        type="button"
        aria-label={`${compareSelected ? 'Убрать из' : 'Добавить в'} сравнение: ${home.name}`}
        aria-pressed={compareSelected}
        disabled={compareDisabled && !compareSelected}
        onClick={() => onCompare(home.id)}
        className={clsx('absolute right-3 top-3 z-20 inline-flex min-h-11 items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold backdrop-blur-sm transition-colors', compareSelected ? 'border-gold-300/70 bg-gold-400/25 text-gold-200' : 'border-cream/20 bg-graphite-950/60 text-cream/80 hover:border-gold-300/50', compareDisabled && !compareSelected && 'cursor-not-allowed opacity-50')}
      ><GitCompareArrows className="h-3.5 w-3.5" /> {compareSelected ? 'В сравнении' : 'Сравнить'}</button>}
      <Link href={`/dom/${home.slug}`} className={clsx("group", styles.link)}>
      <div className={clsx("glass-card", styles.card)}>
        {/* Image */}
        <div className={styles.image}>
          <picture className="absolute inset-0 block">
            <source type="image/avif" srcSet={catalogCardImage(home.image, 'avif')} />
            <Image
              src={catalogCardImage(home.image)}
              alt={home.name}
              fill
              loading="lazy"
              className="object-contain transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
            />
          </picture>
          <div className={styles.tags}>
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
        <div className={styles.content}>
          <div className="text-[10px] font-semibold tracking-widest uppercase text-gold-400/80 mb-1">
            Усадьба
          </div>
          <h3 className={clsx(styles.title, "text-lg font-bold text-cream mb-1 group-hover:text-gold-300 transition-colors")}>
            {home.name}
          </h3>
          <p className={clsx(styles.description, "text-sm text-cream/60 leading-relaxed mb-4")}>
            {home.subtitle}
          </p>

          {/* Specs */}
          <div className={clsx(styles.specs, "grid grid-cols-3 gap-2")}>
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
          <div className={styles.footer}>
            <div>
              <div className="text-[10px] text-cream/40 mb-0.5">от</div>
              <div className="text-xl font-bold text-cream">
                {formatPrice(home.priceFrom)}
              </div>
            </div>
            <div className={clsx(styles.cta, "flex items-center gap-1.5 text-gold-400 text-sm font-semibold group-hover:gap-3 transition-all")}>
              Подробнее <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
      </Link>
    </div>
  )
}
