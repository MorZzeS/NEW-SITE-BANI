'use client'

import Link from 'next/link'

import { Phone } from 'lucide-react'
import { siteSettings } from '@/data'

export function CTASection() {
  return (
    <section className="py-20">
      <div className="site-container">
        <div className="relative overflow-hidden rounded-4xl">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-wood-900/60 via-graphite-900/80 to-graphite-950/90" />
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(ellipse at 30% 50%, rgba(196,118,46,0.15) 0%, transparent 60%)',
          }} />
          {/* Border */}
          <div className="absolute inset-0 rounded-4xl border border-white/10" />

          <div className="relative z-10 p-10 md:p-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left */}
              <div>
                <div className="section-tag mb-5">Получить консультацию</div>
                <h2 className="text-4xl font-bold text-cream mb-4">
                  Готовы обсудить<br />вашу баню?
                </h2>
                <p className="text-cream/65 leading-relaxed mb-8">
                  Свяжитесь с нами удобным способом — ответим на все вопросы,
                  подберём подходящую модель и рассчитаем стоимость с доставкой.
                </p>
                <div className="space-y-4">
                  <a
                    href={`tel:${siteSettings.phone}`}
                    className="flex items-center gap-3 text-cream hover:text-[#d4a843] transition-colors group"
                    aria-label={`Позвонить: ${siteSettings.phoneDisplay}`}
                  >
                    <div className="w-11 h-11 glass rounded-2xl flex items-center justify-center group-hover:bg-[#d4a843]/15 transition-colors">
                      <Phone className="w-5 h-5 text-[#d4a843]" />
                    </div>
                    <div>
                      <div className="text-xs text-cream/50">Позвонить</div>
                      <div className="font-semibold">{siteSettings.phoneDisplay}</div>
                    </div>
                  </a>
                </div>
              </div>

              {/* Right: contacts block — no fake form */}
              <div className="glass-strong rounded-3xl p-8">
                <h3 className="text-xl font-bold text-cream mb-2">Связаться с нами</h3>
                <p className="text-sm text-cream/60 mb-6">
                  Онлайн-отправка заявки пока недоступна — напишите или позвоните напрямую.
                </p>
                <div className="space-y-3">
                  <a
                    href={`tel:${siteSettings.phone}`}
                    className="btn-primary w-full justify-center py-3.5"
                    aria-label={`Позвонить ${siteSettings.phoneDisplay}`}
                  >
                    <Phone className="w-4 h-4" />
                    {siteSettings.phoneDisplay}
                  </a>
                  <a
                    href={siteSettings.telegram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary w-full justify-center py-3.5"
                    aria-label="Написать в Telegram"
                  >
                    Telegram
                  </a>
                  <a
                    href="https://max.ru/u/f9LHodD0cOIxMWBIqevncnKjjJjmhro04Avs206ALKtkVorTXnbzx5mVTVs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary w-full justify-center py-3.5"
                    aria-label="Написать в MAX"
                  >
                    MAX
                  </a>
                  <p className="text-[10px] text-cream/30 text-center leading-relaxed pt-1">
                    Нажимая, вы соглашаетесь с{' '}
                    <Link href="/privacy" className="underline hover:text-cream/50">политикой конфиденциальности</Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
