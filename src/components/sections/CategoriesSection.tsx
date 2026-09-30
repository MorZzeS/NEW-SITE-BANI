import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function CategoriesSection() {
  return (
    <section className="py-20">
      <div className="site-container">
        <div className="text-center mb-12">
          <div className="section-tag mb-4">РќР°РїСЂР°РІР»РµРЅРёСЏ</div>
          <h2 className="text-4xl font-bold text-cream mb-3">Р§С‚Рѕ РјС‹ РїСЂРѕРёР·РІРѕРґРёРј</h2>
          <p className="text-cream/60 max-w-lg mx-auto">
            Р”РІР° РЅРµР·Р°РІРёСЃРёРјС‹С… РЅР°РїСЂР°РІР»РµРЅРёСЏ вЂ” РєР°Р¶РґРѕРµ СЃРѕ СЃРІРѕРµР№ Р»РёРЅРµР№РєРѕР№ РјРѕРґРµР»РµР№, РїР»Р°РЅРёСЂРѕРІРѕРє Рё РєРѕРјРїР»РµРєС‚Р°С†РёР№
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Saunas */}
          <Link href="/katalog/bani" className="group block">
            <div className="relative overflow-hidden rounded-3xl h-80 glass-card border-0">
              <Image
                src="/NEW-SITE-BANI/images/renders/РСЃС‚РѕРє 8.png"
                alt="РњРѕР±РёР»СЊРЅС‹Рµ Р±Р°РЅРё"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-graphite-950/90 via-graphite-950/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-7">
                <div className="section-tag mb-3 text-[10px]">17 РјРѕРґРµР»РµР№</div>
                <h3 className="text-2xl font-bold text-cream mb-2">РњРѕР±РёР»СЊРЅС‹Рµ Р±Р°РЅРё</h3>
                <p className="text-cream/70 text-sm mb-5">
                  РЎРµСЂРёРё РСЃС‚РѕРє, РЎРµРІРµСЂ, РЎРєР°РЅРґРёРЅР°РІРёСЏ. РћС‚ 4 РґРѕ 8 РјРµС‚СЂРѕРІ. Р СѓСЃСЃРєР°СЏ РїР°СЂРЅР°СЏ, РјРѕР№РєР°, РєРѕРјРЅР°С‚Р° РѕС‚РґС‹С…Р°.
                </p>
                <div className="flex items-center gap-2 text-gold-400 font-semibold text-sm group-hover:gap-3 transition-all">
                  РЎРјРѕС‚СЂРµС‚СЊ РєР°С‚Р°Р»РѕРі Р±Р°РЅСЊ <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </Link>

          {/* Homes */}
          <Link href="/katalog/doma" className="group block">
            <div className="relative overflow-hidden rounded-3xl h-80 glass-card border-0">
              <Image
                src="/NEW-SITE-BANI/images/renders/РЈСЃР°РґСЊР±Р° РўРµСЂСЂР° 7.png"
                alt="РњРѕР±РёР»СЊРЅС‹Рµ РґРѕРјР°"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-graphite-950/90 via-graphite-950/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-7">
                <div className="section-tag mb-3 text-[10px]">6 РјРѕРґРµР»РµР№</div>
                <h3 className="text-2xl font-bold text-cream mb-2">РњРѕР±РёР»СЊРЅС‹Рµ РґРѕРјР°</h3>
                <p className="text-cream/70 text-sm mb-5">
                  РЎРµСЂРёСЏ РЈСЃР°РґСЊР±Р°. Р“РѕСЃС‚РµРІС‹Рµ РґРѕРјР°, РґРѕРјРёРєРё РґР»СЏ РѕС‚РґС‹С…Р° Рё РїРѕСЃС‚РѕСЏРЅРЅРѕРіРѕ РїСЂРѕР¶РёРІР°РЅРёСЏ.
                </p>
                <div className="flex items-center gap-2 text-gold-400 font-semibold text-sm group-hover:gap-3 transition-all">
                  РЎРјРѕС‚СЂРµС‚СЊ РєР°С‚Р°Р»РѕРі РґРѕРјРѕРІ <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  )
}
