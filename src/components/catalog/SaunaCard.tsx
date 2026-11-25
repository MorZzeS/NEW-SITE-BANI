import Link from 'next/link'
import { ArrowRight, GitCompareArrows } from 'lucide-react'
import type { Sauna } from '@/types'
import { formatPrice } from '@/data'
import clsx from 'clsx'
import { catalogPriceLabel } from '@/lib/catalog-labels'
import { CatalogCardGallery } from './CatalogCardGallery'
import styles from './CatalogCard.module.css'

interface Props {
  sauna: Sauna
  featured?: boolean
  bestSeller?: boolean
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

export function SaunaCard({ sauna, featured, bestSeller = false, compareSelected = false, compareDisabled = false, onCompare }: Props) {
  return (
    <div className={styles.wrapper}>
      {onCompare && <button
        type="button"
        aria-label={`${compareSelected ? 'Убрать из сравнения' : 'Добавить в сравнение'}: ${sauna.name}, ${sauna.article ?? sauna.id}`}
        aria-pressed={compareSelected}
        disabled={compareDisabled && !compareSelected}
        onClick={() => onCompare(sauna.id)}
        className={clsx('absolute right-3 top-3 z-20 inline-flex min-h-11 items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold shadow-lg backdrop-blur-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-300', compareSelected ? 'border-gold-300/80 bg-graphite-950/95 text-gold-200' : 'border-white/50 bg-graphite-950/90 text-white hover:border-gold-300/80 hover:text-gold-200', compareDisabled && !compareSelected && 'cursor-not-allowed opacity-60')}
      >
        <GitCompareArrows className="h-3.5 w-3.5" /> {compareSelected ? 'В сравнении' : 'Сравнить'}
      </button>}
      <article className={clsx(
        'glass-card', styles.card,
        featured && styles.featured
      )}>
        <CatalogCardGallery image={sauna.image} images={sauna.images} name={sauna.name} size={sauna.size} href={`/banya/${sauna.slug}`} bestSeller={bestSeller} />

        {/* Content */}
        <Link href={`/banya/${sauna.slug}`} className={clsx('group', styles.contentLink)}>
        <div className={styles.content}>
          {sauna.tags.length > 0 && <div className="mb-3 flex flex-wrap gap-1.5">{sauna.tags.map(tag => <span key={tag} className={clsx('px-2 py-0.5 rounded-lg text-[10px] font-semibold border', tagColors[tag] || 'bg-cream/10 text-cream/60 border-cream/20')}>{tag}</span>)}</div>}
          <h3 className={clsx(styles.title, "text-lg font-bold text-cream mb-1 group-hover:text-gold-300 transition-colors")}>
            {sauna.name}
          </h3>
          <p className={clsx(styles.description, "text-sm text-cream/60 leading-relaxed mb-4")}>
            {sauna.subtitle.split('. ')[0].replace(/\.$/, '') + '.'}
          </p>

          {/* Specs */}
          <div className={clsx(styles.specs, "grid grid-cols-2 gap-2")}>
            {[
              { label: 'Площадь', value: `${sauna.area.toLocaleString('ru-RU')} м²` },
              { label: 'Артикул', value: sauna.article },
            ].map((s) => (
              <div key={s.label} className="glass rounded-xl p-2.5 text-center">
                <div className="text-xs text-cream/40 mb-0.5">{s.label}</div>
                <div className="text-sm font-semibold text-cream">{s.value}</div>
              </div>
            ))}
          </div>

          {/* Price + CTA */}
          <div className={styles.saunaFooter}>
            <div className="col-span-full text-xs text-cream/60">{catalogPriceLabel(sauna)}</div>
            <div className="text-xl font-bold text-cream whitespace-nowrap tabular-nums">{formatPrice(sauna.priceFrom)}</div>
            <div className={clsx(styles.cta, "flex items-center gap-1.5 text-gold-400 text-sm font-semibold")}>
              Подробнее <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
        </Link>
      </article>

    </div>
  )
}
