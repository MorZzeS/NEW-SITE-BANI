import Link from 'next/link'
import type { Sauna, Home } from '@/types'
import { ProductGallery } from './ProductGallery'
import { ModelPrices } from './ModelPrices'
import { siteSettings } from '@/data'

export function ModelOverview({ model }: { model: Sauna | Home }) {
  return <section className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-6 lg:gap-10 mb-12 items-start">
    <ProductGallery compact items={[
      { src: model.image, type: 'MAIN', alt: model.name, label: 'Визуализация модели' },
      ...(model.floorPlan ? [{ src: model.floorPlan, type: 'PLAN' as const, alt: `${model.name} — планировка`, label: 'Планировка модели' }] : []),
      ...model.images.filter(src => src !== model.image).map((src, i) => ({ src, type: 'MODEL_PHOTO' as const, alt: `${model.name} — изображение ${i + 1}` })),
    ]} />
    <div className="min-w-0">
      <p className="text-xs text-gold-400 mb-2">{model.article}</p>
      <h1 className="text-3xl sm:text-4xl font-bold text-cream mb-4">{model.name}</h1>
      <p className="text-sm text-cream/70 leading-relaxed mb-5">{model.subtitle}</p>
      <dl className="model-parameters mb-5">
        <div><dt>Размер</dt><dd>{model.size}</dd></div>
        <div><dt>Площадь</dt><dd>{model.area} м²</dd></div>
        <div><dt>Артикул</dt><dd>{model.article}</dd></div>
        {model.rooms && <div><dt>Помещения</dt><dd>{model.rooms}</dd></div>}
      </dl>
      <ModelPrices model={model} />
      <div className="flex flex-wrap gap-3 mb-4">
        <Link href={`/kontakty?model=${encodeURIComponent(model.name)}`} className="btn-primary">Получить расчёт</Link>
        <a href={siteSettings.max} className="btn-secondary" target="_blank" rel="noopener noreferrer">MAX</a>
      </div>
      <Link href={`/model-sheet/${model.id}`} target="_blank" className="inline-flex min-h-11 items-center text-sm text-gold-400 underline underline-offset-4">Скачать информацию о модели</Link>
      <div className="flex flex-wrap gap-x-4 text-sm mt-3">
        <a href={`tel:${siteSettings.phone}`}>{siteSettings.phoneDisplay}</a>
        <a href={`tel:${siteSettings.phone2}`}>{siteSettings.phoneDisplay2}</a>
      </div>
    </div>
  </section>
}
