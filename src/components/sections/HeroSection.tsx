'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Play, Shield, Truck, Factory } from 'lucide-react'

const features = [
  { icon: Factory, label: 'Собственное\nпроизводство' },
  { icon: Truck, label: 'Доставка\nи установка' },
  { icon: Shield, label: 'Гарантия\nна все бани' },
]

const sideCards = [
  { label: 'Настоящая\nрусская парная', bg: 'from-wood-900/80 to-wood-800/60' },
  { label: 'Уютная\nкомната отдыха', bg: 'from-graphite-900/80 to-graphite-800/60' },
  { label: 'Надёжные\nпечные решения', bg: 'from-graphite-950/80 to-wood-900/60' },
]

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/NEW-SITE-BANI/images/hero/hero-bg.webp"
          alt="Мобильная баня Герасимов на природе"
          fill
          priority
          quality={90}
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-graphite-950/85 via-graphite-950/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-graphite-950/70 via-transparent to-graphite-950/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Main hero content — pushed down from nav */}
        <div className="flex-1 flex items-center pt-24">
          <div className="site-container w-full">
            <div className="flex items-start justify-between gap-8">
              {/* Left: Text content */}
              <div className="max-w-xl xl:max-w-2xl">
                {/* Tag */}
                <div className="section-tag mb-5 animate-fade-up" style={{ animationDelay: '0.1s' }}>
                  Готовые решения для отдыха и жизни
                </div>

                {/* Headline */}
                <h1
                  className="text-5xl xl:text-7xl font-extrabold leading-[1.05] tracking-tight mb-6 animate-fade-up"
                  style={{ animationDelay: '0.2s' }}
                >
                  <span className="text-cream">Мобильные бани</span>
                  <br />
                  <span className="text-gold-400">и дома под ключ</span>
                </h1>

                {/* Subheading */}
                <p
                  className="text-lg text-cream/75 leading-relaxed mb-8 max-w-md animate-fade-up"
                  style={{ animationDelay: '0.3s' }}
                >
                  Современные, тёплые, надёжные.<br />
                  Доставим и установим по Москве и Московской области.
                </p>

                {/* Feature badges */}
                <div className="flex flex-wrap gap-3 mb-10 animate-fade-up" style={{ animationDelay: '0.4s' }}>
                  {features.map(({ icon: Icon, label }) => (
                    <div key={label} className="glass flex items-center gap-3 px-4 py-3 rounded-2xl">
                      <div className="w-8 h-8 rounded-xl bg-gold-400/20 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-gold-400" />
                      </div>
                      <span className="text-xs text-cream/85 font-medium whitespace-pre-line leading-tight">{label}</span>
                    </div>
                  ))}
                </div>

                {/* CTAs */}
                <div className="flex flex-wrap items-center gap-4 animate-fade-up" style={{ animationDelay: '0.5s' }}>
                  <Link href="/katalog/bani" className="btn-primary text-sm px-7 py-3.5">
                    Смотреть каталог
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <button className="flex items-center gap-3 text-sm text-cream/80 hover:text-cream transition-colors group">
                    <div className="w-11 h-11 glass rounded-full flex items-center justify-center group-hover:bg-white/15 transition-colors">
                      <Play className="w-4 h-4 text-cream fill-current ml-0.5" />
                    </div>
                    Посмотреть видео<br className="hidden sm:block" />
                    <span className="hidden sm:inline">о наших банях</span>
                  </button>
                </div>
              </div>

              {/* Right: Info cards — NOT buttons */}
              <div className="hidden xl:flex flex-col gap-3 w-56 shrink-0 mt-8">
                {sideCards.map((card, i) => (
                  <div
                    key={card.label}
                    className="glass-card animate-fade-up"
                    style={{ animationDelay: `${0.3 + i * 0.1}s` }}
                  >
                    <div className={`h-28 bg-gradient-to-br ${card.bg} flex items-end p-4`}>
                      <p className="text-sm font-semibold text-cream leading-tight whitespace-pre-line">{card.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom: stat bar */}
        <div className="relative z-10 pb-6">
          <div className="site-container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'Экологичные\nматериалы' },
                { label: 'Комфорт круглый\nгод' },
                { label: 'Индивидуальные\nпланировки' },
                { label: 'Быстрые сроки\nизготовления' },
              ].map((item) => (
                <div key={item.label} className="glass flex items-center gap-3 px-4 py-3.5 rounded-2xl">
                  <span className="text-xl shrink-0">✓</span>
                  <span className="text-xs text-cream/80 font-medium leading-tight whitespace-pre-line">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
