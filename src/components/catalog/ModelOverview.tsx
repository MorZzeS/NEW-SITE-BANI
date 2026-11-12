import Link from 'next/link'
import { ArrowDown, ArrowLeft } from 'lucide-react'
import type { Sauna, Home } from '@/types'
import { ProductGallery } from './ProductGallery'
import { ModelPrices } from './ModelPrices'
import { siteSettings } from '@/data'

export function ModelOverview({ model }: { model: Sauna | Home }) {
  const modelImageAspectRatio = model.image.includes('/bg-28/') ? 1664 / 928 : 3 / 2
  const isSauna = 'series' in model
  const catalogHref = isSauna ? '/katalog/bani' : '/katalog/doma'

  return <section className="mb-10 lg:mb-12" data-model-overview={model.id}>
    <div className="mb-4">
      <Link href={catalogHref} className="inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-cream/70 transition-colors hover:text-gold-400 focus-visible:outline-2 focus-visible:outline-gold-400 focus-visible:outline-offset-4">
        <ArrowLeft aria-hidden="true" size={16} /> К моделям
      </Link>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.2fr)_minmax(360px,1fr)] gap-5 lg:gap-8 items-stretch">
      <ProductGallery compact items={[
        { src: model.image, type: 'MAIN', alt: model.name, label: 'Визуализация модели', aspectRatio: modelImageAspectRatio },
        ...(model.floorPlan ? [{ src: model.floorPlan, type: 'PLAN' as const, alt: `${model.name} — планировка`, label: 'Планировка модели' }] : []),
        ...model.images.filter(src => src !== model.image).map((src, i) => ({ src, type: 'MODEL_PHOTO' as const, alt: `${model.name} — изображение ${i + 1}`, aspectRatio: modelImageAspectRatio })),
      ]} />
      <div className="model-overview-details glass rounded-2xl p-4 sm:p-5 min-w-0">
        <p className="text-xs font-semibold tracking-[0.12em] text-gold-400 mb-1">{model.article}</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-cream mb-2">{model.name}</h1>
        <p className="text-sm text-cream/70 leading-relaxed mb-3">{model.subtitle}</p>
        <dl className="model-parameters model-overview-parameters mb-3">
          <div><dt>Размер</dt><dd>{model.size}</dd></div>
          <div><dt>Площадь застройки</dt><dd>{model.area} м²</dd></div>
          {model.rooms && <div><dt>Помещения</dt><dd>{model.rooms}</dd></div>}
        </dl>
        <ModelPrices model={model} />
        <div className="model-overview-actions">
          <Link href={`/kontakty?model=${encodeURIComponent(model.name)}`} className="btn-primary justify-center">Получить расчёт</Link>
          <a href={siteSettings.max} className="btn-secondary justify-center" target="_blank" rel="noopener noreferrer">MAX</a>
        </div>
        {model.slug !== 'barn-premium' && <Link href={`#model-calculator-${model.id}`} className="model-calculator-link inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-gold-400 underline decoration-gold-400/50 underline-offset-4 transition-colors hover:text-gold-300 focus-visible:outline-2 focus-visible:outline-gold-400 focus-visible:outline-offset-4">
          <ArrowDown aria-hidden="true" size={16} /> {isSauna ? 'Рассчитать баню с дополнительными услугами' : 'Рассчитать комплектацию дома'}
        </Link>}
      </div>
    </div>
  </section>
}

