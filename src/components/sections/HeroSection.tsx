'use client'

import Image from 'next/image'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useState } from 'react'
import { bathVideoAction } from '@/data/videos'
import { ArrowRight, Play, Shield, Truck, Factory, Wrench } from 'lucide-react'

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

const trustItems = [
  { icon: Factory, title: 'Производство', caption: 'Собственное производство' },
  { icon: Truck, title: 'Доставка', caption: 'Москва и Московская область' },
  { icon: Wrench, title: 'Установка', caption: 'Подготовка и монтаж' },
  { icon: Shield, title: 'Гарантия', caption: 'По договору' },
]

const BathVideoViewer = dynamic(() => import('@/components/ui/BathVideoViewer'), { ssr: false })

export function HeroSection() {
  const [videoOpen, setVideoOpen] = useState(false)
  return (
    <section className="theme-hero relative min-h-screen flex flex-col overflow-hidden">
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
        <div className="flex-1 flex items-center pt-28 pb-8 md:pb-10">
          <div className="site-container w-full">
            <div className="flex items-start justify-between gap-8">
              {/* Left: Text content */}
              <div className="max-w-xl xl:max-w-2xl">
                {/* Tag */}
                <div className="section-tag mb-5 text-[10px] sm:text-xs animate-fade-up" style={{ animationDelay: '0.1s' }}>
                  Готовые решения для отдыха и жизни
                </div>

                {/* Headline */}
                <h1
                  className="text-[40px] sm:text-5xl xl:text-[64px] font-bold leading-[1.08] tracking-tight mb-5 animate-fade-up"
                  style={{ animationDelay: '0.2s' }}
                >
                  <span className="text-cream">Мобильные бани</span>
                  <br />
                  <span className="text-gold-400">и дома под ключ</span>
                </h1>

                {/* Subheading */}
                <p
                  className="text-base sm:text-lg text-cream/75 leading-relaxed mb-6 max-w-md animate-fade-up"
                  style={{ animationDelay: '0.3s' }}
                >
                  Современные, тёплые, надёжные.<br />
                  Доставим и установим по Москве и Московской области.
                </p>

                {/* Feature badges */}
                <div className="flex flex-wrap gap-x-5 gap-y-3 mb-7 animate-fade-up" style={{ animationDelay: '0.4s', textShadow: '0 1px 3px rgba(0,0,0,.9), 0 0 8px rgba(0,0,0,.7)' }}>
                  {features.map(({ icon: Icon, label }) => (
                    <div key={label} className="flex items-center gap-2.5 cursor-default">
                      <div className="flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-cream/75" strokeWidth={1.5} />
                      </div>
                      <span className="text-xs text-cream font-medium whitespace-pre-line leading-snug">{label}</span>
                    </div>
                  ))}
                </div>

                {/* CTAs */}
                <div className="flex flex-wrap items-center gap-x-6 gap-y-4 animate-fade-up" style={{ animationDelay: '0.5s' }}>
                  <Link href="/katalog/bani" className="btn-primary text-sm px-7 py-3.5">
                    Смотреть каталог
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <button type="button" aria-haspopup="dialog" onClick={() => setVideoOpen(true)} className="flex items-center gap-3 text-sm text-cream/80 hover:text-cream transition-colors group min-h-11 text-left">
                    <div className="w-11 h-11 glass rounded-full flex items-center justify-center group-hover:bg-white/15 transition-colors">
                      <Play className="w-4 h-4 text-cream fill-current ml-0.5" />
                    </div>
                    <span><span className="block font-medium">{bathVideoAction.title}</span><span className="block text-xs text-cream/75 mt-0.5">{bathVideoAction.caption}</span></span>
                  </button>
                </div>
              </div>

              {/* Right: Info cards — NOT buttons */}
              <div className="hidden xl:flex flex-col gap-4 w-52 shrink-0 mt-8">
                {sideCards.map((card, i) => (
                  <div
                    key={card.label}
                    className="glass relative overflow-hidden rounded-xl cursor-default shadow-none animate-fade-up"
                    style={{ animationDelay: `${0.3 + i * 0.1}s` }}
                  >
                    <span aria-hidden="true" className="absolute top-4 left-4 w-6 h-px bg-gold-400/70" />
                    <div className={`h-24 bg-gradient-to-br ${card.bg} flex items-end p-4`}>
                      <p className="text-sm font-semibold text-cream leading-tight whitespace-pre-line">{card.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom: non-interactive trust strip */}
        <div className="relative z-10 pb-6">
          <div className="site-container">
            <ul className="hero-trust-strip grid auto-rows-fr grid-cols-2 md:grid-cols-4 cursor-default" aria-label="Производство, доставка, установка и гарантия">
              {trustItems.map(({ icon: Icon, title, caption }) => (
                <li key={title} className="flex items-start gap-2.5 px-3 py-4 sm:px-5">
                  <Icon aria-hidden="true" className="hero-trust-icon w-4 h-4 mt-0.5 shrink-0" strokeWidth={1.5} />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold leading-5">{title}</p>
                    <p className="hero-trust-caption text-xs leading-5 mt-1">{caption}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      {videoOpen && <BathVideoViewer onClose={() => setVideoOpen(false)} />}
    </section>
  )
}
