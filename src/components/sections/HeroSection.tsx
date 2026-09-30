'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Play, Shield, Truck, Factory } from 'lucide-react'

const features = [
  { icon: Factory, label: 'РЎРѕР±СЃС‚РІРµРЅРЅРѕРµ\nРїСЂРѕРёР·РІРѕРґСЃС‚РІРѕ' },
  { icon: Truck, label: 'Р”РѕСЃС‚Р°РІРєР°\nРё СѓСЃС‚Р°РЅРѕРІРєР°' },
  { icon: Shield, label: 'Р“Р°СЂР°РЅС‚РёСЏ\nРЅР° РІСЃРµ Р±Р°РЅРё' },
]

const sideCards = [
  { label: 'РќР°СЃС‚РѕСЏС‰Р°СЏ\nСЂСѓСЃСЃРєР°СЏ РїР°СЂРЅР°СЏ', bg: 'from-wood-900/80 to-wood-800/60' },
  { label: 'РЈСЋС‚РЅР°СЏ\nРєРѕРјРЅР°С‚Р° РѕС‚РґС‹С…Р°', bg: 'from-graphite-900/80 to-graphite-800/60' },
  { label: 'РќР°РґС‘Р¶РЅС‹Рµ\nРїРµС‡РЅС‹Рµ СЂРµС€РµРЅРёСЏ', bg: 'from-graphite-950/80 to-wood-900/60' },
]

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/NEW-SITE-BANI/images/hero/hero-bg.png"
          alt="РњРѕР±РёР»СЊРЅР°СЏ Р±Р°РЅСЏ Р“РµСЂР°СЃРёРјРѕРІ РЅР° РїСЂРёСЂРѕРґРµ"
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
        {/* Main hero content вЂ” pushed down from nav */}
        <div className="flex-1 flex items-center pt-24">
          <div className="site-container w-full">
            <div className="flex items-start justify-between gap-8">
              {/* Left: Text content */}
              <div className="max-w-xl xl:max-w-2xl">
                {/* Tag */}
                <div className="section-tag mb-5 animate-fade-up" style={{ animationDelay: '0.1s' }}>
                  Р“РѕС‚РѕРІС‹Рµ СЂРµС€РµРЅРёСЏ РґР»СЏ РѕС‚РґС‹С…Р° Рё Р¶РёР·РЅРё
                </div>

                {/* Headline */}
                <h1
                  className="text-5xl xl:text-7xl font-extrabold leading-[1.05] tracking-tight mb-6 animate-fade-up"
                  style={{ animationDelay: '0.2s' }}
                >
                  <span className="text-cream">РњРѕР±РёР»СЊРЅС‹Рµ Р±Р°РЅРё</span>
                  <br />
                  <span className="text-gradient">Рё РґРѕРјР° РїРѕРґ РєР»СЋС‡</span>
                </h1>

                {/* Subheading */}
                <p
                  className="text-lg text-cream/75 leading-relaxed mb-8 max-w-md animate-fade-up"
                  style={{ animationDelay: '0.3s' }}
                >
                  РЎРѕРІСЂРµРјРµРЅРЅС‹Рµ, С‚С‘РїР»С‹Рµ, РЅР°РґС‘Р¶РЅС‹Рµ.<br />
                  Р”РѕСЃС‚Р°РІРёРј Рё СѓСЃС‚Р°РЅРѕРІРёРј РїРѕ РІСЃРµР№ Р РѕСЃСЃРёРё.
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
                    РЎРјРѕС‚СЂРµС‚СЊ РєР°С‚Р°Р»РѕРі
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <button className="flex items-center gap-3 text-sm text-cream/80 hover:text-cream transition-colors group">
                    <div className="w-11 h-11 glass rounded-full flex items-center justify-center group-hover:bg-white/15 transition-colors">
                      <Play className="w-4 h-4 text-cream fill-current ml-0.5" />
                    </div>
                    РџРѕСЃРјРѕС‚СЂРµС‚СЊ РІРёРґРµРѕ<br className="hidden sm:block" />
                    <span className="hidden sm:inline">Рѕ РЅР°С€РёС… Р±Р°РЅСЏС…</span>
                  </button>
                </div>
              </div>

              {/* Right: Mini cards */}
              <div className="hidden xl:flex flex-col gap-3 w-56 shrink-0 mt-8">
                {sideCards.map((card, i) => (
                  <div
                    key={card.label}
                    className="glass-card group cursor-pointer animate-fade-up"
                    style={{ animationDelay: `${0.3 + i * 0.1}s` }}
                  >
                    <div className={`h-28 bg-gradient-to-br ${card.bg} flex items-end p-4`}>
                      <div className="flex items-center justify-between w-full">
                        <p className="text-sm font-semibold text-cream leading-tight whitespace-pre-line">{card.label}</p>
                        <div className="w-7 h-7 glass rounded-full flex items-center justify-center shrink-0">
                          <ArrowRight className="w-3.5 h-3.5 text-cream" />
                        </div>
                      </div>
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
                { icon: 'рџЊї', label: 'Р­РєРѕР»РѕРіРёС‡РЅС‹Рµ\nРјР°С‚РµСЂРёР°Р»С‹' },
                { icon: 'рџЊЎпёЏ', label: 'РљРѕРјС„РѕСЂС‚ РєСЂСѓРіР»С‹Р№\nРіРѕРґ' },
                { icon: 'вљ™пёЏ', label: 'РРЅРґРёРІРёРґСѓР°Р»СЊРЅС‹Рµ\nРїР»Р°РЅРёСЂРѕРІРєРё' },
                { icon: 'рџљљ', label: 'Р‘С‹СЃС‚СЂС‹Рµ СЃСЂРѕРєРё\nРёР·РіРѕС‚РѕРІР»РµРЅРёСЏ' },
              ].map((item) => (
                <div key={item.label} className="glass flex items-center gap-3 px-4 py-3.5 rounded-2xl">
                  <span className="text-xl shrink-0">{item.icon}</span>
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
