import { ModelBaseConfiguration } from '@/components/catalog/ModelBaseConfiguration'
import { modelFeatures } from '@/data/model-configuration'
import { ModelOverview } from '@/components/catalog/ModelOverview'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Check, Phone } from 'lucide-react'
import { saunas, siteSettings } from '@/data'
import { SaunaCard } from '@/components/catalog/SaunaCard'
import { saunaInteriorExamples, barnInteriorExamples } from '@/data/interior-examples'
import { ModelPrices } from '@/components/catalog/ModelPrices'
import { ProductGallery } from '@/components/catalog/ProductGallery'
import { CTAFormInline } from '@/components/forms/CTAFormInline'
import type { Metadata } from 'next'

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  return saunas.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const sauna = saunas.find((s) => s.slug === params.slug)
  if (!sauna) return {}
  const BASE = 'https://banger.su'
  const canonical = `${BASE}/banya/${sauna.slug}`
  // OG image: prefer full URL
  const ogImage = sauna.image.startsWith('http') ? sauna.image : `${BASE}${sauna.image.replace('/NEW-SITE-BANI', '')}`
  return {
    title: `${sauna.name} — мобильная баня ${sauna.size} | Бани Герасимов`,
    description: `${sauna.name} (${sauna.article}): ${sauna.subtitle}. Размер ${sauna.size}, ${sauna.area} м². ${sauna.description} Доставка по Москве и МО.`,
    alternates: { canonical },
    openGraph: {
      url: canonical,
      title: `${sauna.name} — мобильная баня ${sauna.size}`,
      description: `${sauna.subtitle}. Размер ${sauna.size}. ${sauna.description}`,
      images: [{ url: ogImage, alt: sauna.name }],
    },
  }
}

export default function SaunaPage({ params }: Props) {
  const sauna = saunas.find((s) => s.slug === params.slug)
  if (!sauna) notFound()

  const interiorImages = sauna.slug === 'barn-premium' && barnInteriorExamples.length ? barnInteriorExamples : saunaInteriorExamples

  const related = saunas.filter((s) => s.series === sauna.series && s.id !== sauna.id).slice(0, 3)

  return (
    <div className="pt-24 pb-20">
      <div className="site-container">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-cream/50 mb-8">
          <Link href="/" className="hover:text-cream transition-colors">Главная</Link>
          <span>/</span>
          <Link href="/katalog/bani" className="hover:text-cream transition-colors">Мобильные бани</Link>
          <span>/</span>
          <span className="text-cream">{sauna.name}</span>
        </div>

        <ModelOverview model={sauna} />
        {!sauna.floorPlan && <p className="text-sm text-cream/60 mb-6">Нет подтверждённого исходника планировки. Планировка согласуется при заказе.</p>}
        {!!interiorImages.length && <div className="mb-16">
          <p className="text-sm text-cream/60 mb-6">Пример внутреннего исполнения. Фактическое исполнение зависит от выбранной комплектации.</p>
          <ProductGallery title="Варианты внутреннего исполнения" items={interiorImages.map((src, i) => ({
            src, type: 'INTERIOR_EXAMPLE' as const,
            alt: `Вариант внутреннего исполнения — фото ${i + 1}`,
            label: 'Вариант внутреннего исполнения',
          }))} />
        </div>}

        {/* Description */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-cream mb-4">О модели</h2>
            <p className="text-cream/70 leading-relaxed text-base mb-6">{sauna.description}</p>

            {/* Features */}
            <dl className="model-parameters">
              {modelFeatures(sauna).map((feature, i) => <div key={feature}><dt>Особенность {i + 1}</dt><dd>{feature}</dd></div>)}
            </dl>
          </div>

          {/* Specs */}
          <div>
            <h2 className="text-2xl font-bold text-cream mb-4">Характеристики</h2>
            <div className="glass rounded-2xl overflow-hidden">
              {sauna.specs.map((spec, i) => (
                <div key={spec.label}
                  className={`grid grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] gap-4 px-5 py-3.5 ${i !== sauna.specs.length - 1 ? 'border-b border-white/8' : ''}`}>
                  <span className="text-sm text-cream/55">{spec.label}</span>
                  <span className="text-sm font-semibold text-cream text-right break-words">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <ModelBaseConfiguration model={sauna} />

        {/* Inline form */}
        <div className="mb-16">
          <CTAFormInline modelName={sauna.name} />
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-cream mb-6">Похожие модели</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {related.map((s) => <SaunaCard key={s.id} sauna={s} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
