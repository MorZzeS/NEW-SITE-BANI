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

        <div className="text-sm text-gold-400 mb-2">{home.article}</div>
        <h1 className="text-4xl font-extrabold text-cream mb-6">{home.name}</h1>

        {/* Hero grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8 mb-16">
          <div className="relative w-full max-w-[320px]">
            <ProductGallery compact items={[
              { src: home.image, type: 'MAIN', alt: home.name },
            ]} />
            <div className="absolute top-4 left-4 flex gap-2 pointer-events-none">
              {home.tags.map((tag) => <span key={tag} className="px-3 py-1 rounded-lg text-xs font-semibold bg-graphite-950/80 backdrop-blur text-gold-300 border border-gold-400/30">{tag}</span>)}
            </div>
          </div>

          <div className="flex flex-col">
            <div className="text-xs font-bold tracking-widest uppercase text-gold-400/80 mb-2">Усадьба</div>
            <p className="text-lg text-cream/60 mb-6">{home.subtitle}</p>

            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { label: 'Размер', value: home.size },
                { label: 'Площадь', value: `${home.area} м²` },
                { label: 'Артикул', value: home.article },
              ].map((s) => (
                <div key={s.label} className="glass rounded-2xl p-4 text-center">
                  <div className="text-xs text-cream/40 mb-1">{s.label}</div>
                  <div className="text-base font-bold text-cream">{s.value}</div>
                </div>
              ))}
            </div>

            <ModelPrices model={home} />

            <div className="flex flex-wrap gap-3 mb-4">
              <a href={`tel:${siteSettings.phone}`} className="btn-primary flex-1 justify-center py-3.5">
                <Phone className="w-4 h-4" />
                Позвонить
              </a>
              <a href={siteSettings.telegram} target="_blank" rel="noopener noreferrer" className="btn-secondary flex-1 justify-center py-3.5">
                Telegram
              </a>
            </div>
            <div className="flex flex-wrap gap-3 mb-6">
              <a
                href="https://max.ru/u/f9LHodD0cOIxMWBIqevncnKjjJjmhro04Avs206ALKtkVorTXnbzx5mVTVs"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary flex-1 justify-center py-3"
              >
                MAX
              </a>
              <Link href={`/kontakty?model=${encodeURIComponent(home.name)}`} className="btn-secondary flex-1 justify-center py-3">
                Получить расчёт
              </Link>
            </div>

            <a href={`tel:${siteSettings.phone}`} className="flex items-center gap-2 text-sm text-cream/60 hover:text-cream transition-colors">
              <Phone className="w-4 h-4 text-gold-400" />
              {siteSettings.phoneDisplay} — консультация
            </a>
          </div>
        </div>

        {!home.floorPlan && <p className="text-sm text-cream/60 mb-6">Планировка и комплектация согласуются при заказе</p>}
        <ProductGallery title="Галерея модели" items={[
          { src: home.image, type: 'MAIN', alt: home.name },
          ...(home.floorPlan ? [{ src: home.floorPlan, type: 'PLAN' as const, alt: `${home.name} — планировка`, label: 'Планировка модели' }] : []),
          ...home.images.filter((img) => img !== home.image).map((src, i) => ({ src, type: 'MODEL_PHOTO' as const, alt: `${home.name} — фото ${i + 1}` })),
        ]} />

        <div className="mb-16">
          <p className="text-sm text-cream/60 mb-6">Примеры отделки и мебели. Фотографии показывают общие варианты исполнения и не относятся к конкретной модели дома.</p>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {home.features.map((f) => (
                <div key={f} className="flex items-center gap-3 glass rounded-xl px-4 py-3">
                  <Check className="w-4 h-4 text-gold-400 shrink-0" />
                  <span className="text-sm text-cream/80">{f}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-cream mb-4">Характеристики</h2>
            <div className="glass rounded-2xl overflow-hidden">
              {home.specs.map((spec, i) => (
                <div key={spec.label} className={`flex items-center justify-between px-5 py-3.5 ${i !== home.specs.length - 1 ? 'border-b border-white/8' : ''}`}>
                  <span className="text-sm text-cream/55">{spec.label}</span>
                  <span className="text-sm font-semibold text-cream text-right max-w-[55%]">{spec.value}</span>
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
