import { ModelOverview } from '@/components/catalog/ModelOverview'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Phone, Check } from 'lucide-react'
import { homes, siteSettings } from '@/data'
import { HomeCard } from '@/components/catalog/HomeCard'
import { homeInteriorExamples } from '@/data/interior-examples'
import { ModelPrices } from '@/components/catalog/ModelPrices'
import { ProductGallery } from '@/components/catalog/ProductGallery'
import { CTAFormInline } from '@/components/forms/CTAFormInline'
import type { Metadata } from 'next'

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  return homes.map((h) => ({ slug: h.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const home = homes.find((h) => h.slug === params.slug)
  if (!home) return {}
  const BASE = 'https://banger.su'
  const canonical = `${BASE}/dom/${home.slug}`
  const ogImage = home.image.startsWith('http') ? home.image : `${BASE}${home.image.replace('/NEW-SITE-BANI', '')}`
  return {
    title: `${home.name} — ${home.size} | Бани Герасимов`,
    description: `${home.name} (${home.article}): ${home.subtitle}. Размер ${home.size}, ${home.area} м². ${home.description} Доставка по Москве и МО.`,
    alternates: { canonical },
    openGraph: {
      url: canonical,
      title: `${home.name} — ${home.size}`,
      description: `${home.subtitle}. ${home.description}`,
      images: [{ url: ogImage, alt: home.name }],
    },
  }
}

export default function HomePage({ params }: Props) {
  const home = homes.find((h) => h.slug === params.slug)
  if (!home) notFound()

  const related = homes.filter((h) => h.id !== home.id).slice(0, 3)

  return (
    <div className="pt-24 pb-20">
      <div className="site-container">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-cream/50 mb-8">
          <Link href="/" className="hover:text-cream transition-colors">Главная</Link>
          <span>/</span>
          <Link href="/katalog/doma" className="hover:text-cream transition-colors">Мобильные дома</Link>
          <span>/</span>
          <span className="text-cream">{home.name}</span>
        </div>

        <ModelOverview model={home} />
        {!home.floorPlan && <p className="text-sm text-cream/60 mb-6">Нет подтверждённого исходника планировки. Планировка согласуется при заказе.</p>}
        <div className="mb-16">
          <p className="text-sm text-cream/60 mb-6">Пример внутреннего исполнения. Фактическое исполнение зависит от выбранной комплектации.</p>
          <ProductGallery title="Варианты внутреннего исполнения" items={homeInteriorExamples.map((src, i) => ({
            src, type: 'INTERIOR_EXAMPLE' as const,
            alt: `Вариант внутреннего исполнения — фото ${i + 1}`,
            label: 'Вариант внутреннего исполнения',
          }))} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-cream mb-4">О модели</h2>
            <p className="text-cream/70 leading-relaxed mb-6">{home.description}</p>
            <dl className="model-parameters">
              {home.features.map((feature, i) => <div key={feature}><dt>Особенность {i + 1}</dt><dd>{feature}</dd></div>)}
            </dl>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-cream mb-4">Характеристики</h2>
            <div className="glass rounded-2xl overflow-hidden">
              {home.specs.map((spec, i) => (
                <div key={spec.label} className={`grid grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] gap-4 px-5 py-3.5 ${i !== home.specs.length - 1 ? 'border-b border-white/8' : ''}`}>
                  <span className="text-sm text-cream/55">{spec.label}</span>
                  <span className="text-sm font-semibold text-cream text-right break-words">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-16"><CTAFormInline modelName={home.name} /></div>

        {related.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-cream mb-6">Другие модели</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {related.map((h) => <HomeCard key={h.id} home={h} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
