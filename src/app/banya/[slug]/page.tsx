import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Check, Phone, MessageCircle } from 'lucide-react'
import { saunas, formatPrice, siteSettings } from '@/data'
import { SaunaCard } from '@/components/catalog/SaunaCard'
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
  return {
    title: `${sauna.name} — мобильная баня ${sauna.size}`,
    description: sauna.description,
    openGraph: { images: [sauna.image] },
  }
}

export default function SaunaPage({ params }: Props) {
  const sauna = saunas.find((s) => s.slug === params.slug)
  if (!sauna) notFound()

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

        {/* Hero grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Image */}
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden glass-card border-0">
            <Image
              src={sauna.image}
              alt={sauna.name}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            {/* Tags */}
            <div className="absolute top-4 left-4 flex gap-2">
              {sauna.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 rounded-lg text-xs font-semibold bg-graphite-950/80 backdrop-blur text-gold-300 border border-gold-400/30">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <div className="text-xs font-bold tracking-widest uppercase text-gold-400/80 mb-2">{sauna.series}</div>
            <h1 className="text-4xl font-extrabold text-cream mb-2">{sauna.name}</h1>
            <p className="text-lg text-cream/60 mb-6">{sauna.subtitle}</p>

            {/* Key specs */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { label: 'Размер', value: sauna.size },
                { label: 'Площадь', value: `${sauna.area} м²` },
                { label: 'Помещений', value: sauna.rooms },
              ].map((s) => (
                <div key={s.label} className="glass rounded-2xl p-4 text-center">
                  <div className="text-xs text-cream/40 mb-1">{s.label}</div>
                  <div className="text-lg font-bold text-cream">{s.value}</div>
                </div>
              ))}
            </div>

            {/* Price */}
            <div className="glass rounded-2xl p-5 mb-6">
              <div className="text-sm text-cream/50 mb-1">Стоимость</div>
              <div className="text-3xl font-extrabold text-cream">
                от {formatPrice(sauna.priceFrom)}
              </div>
              <div className="text-xs text-cream/40 mt-1">
                Окончательная цена зависит от комплектации и региона доставки
              </div>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-3 mb-6">
              <Link href={`/kontakty?model=${sauna.name}`} className="btn-primary flex-1 justify-center py-3.5">
                Получить расчёт
              </Link>
              <a href={siteSettings.whatsapp} target="_blank" rel="noopener noreferrer"
                className="btn-secondary flex-1 justify-center py-3.5">
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </a>
            </div>

            <a href={`tel:${siteSettings.phone}`} className="flex items-center gap-2 text-sm text-cream/60 hover:text-cream transition-colors">
              <Phone className="w-4 h-4 text-gold-400" />
              {siteSettings.phoneDisplay} — консультация
            </a>
          </div>
        </div>

        {/* Description */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-cream mb-4">О модели</h2>
            <p className="text-cream/70 leading-relaxed text-base mb-6">{sauna.description}</p>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {sauna.features.map((f) => (
                <div key={f} className="flex items-center gap-3 glass rounded-xl px-4 py-3">
                  <Check className="w-4 h-4 text-gold-400 shrink-0" />
                  <span className="text-sm text-cream/80">{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Specs */}
          <div>
            <h2 className="text-2xl font-bold text-cream mb-4">Характеристики</h2>
            <div className="glass rounded-2xl overflow-hidden">
              {sauna.specs.map((spec, i) => (
                <div key={spec.label}
                  className={`flex items-center justify-between px-5 py-3.5 ${i !== sauna.specs.length - 1 ? 'border-b border-white/8' : ''}`}>
                  <span className="text-sm text-cream/55">{spec.label}</span>
                  <span className="text-sm font-semibold text-cream text-right max-w-[55%]">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Interior photos */}
        {(sauna as any).interiorImages?.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-cream mb-6">Интерьеры</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {(sauna as any).interiorImages.map((img: string, i: number) => (
                <div key={i} className="relative aspect-[4/3] rounded-2xl overflow-hidden glass-card border-0">
                  <Image src={img} alt={`${sauna.name} — интерьер ${i + 1}`} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Floor plan */}
        {(sauna as any).floorPlan && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-cream mb-6">Планировка</h2>
            <div className="glass rounded-3xl overflow-hidden">
              <Image src={(sauna as any).floorPlan} alt={`${sauna.name} — план`} width={800} height={600} className="w-full h-auto object-contain" unoptimized />
            </div>
          </div>
        )}

        {/* Additional images */}
        {sauna.images.length > 1 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-cream mb-6">Галерея</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {sauna.images.map((img, i) => (
                <div key={i} className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                  <Image src={img} alt={`${sauna.name} - фото ${i + 1}`} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
                </div>
              ))}
            </div>
          </div>
        )}

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
