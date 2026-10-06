'use client'
import { PhoneLinks } from '@/components/ui/PhoneLinks'


import Link from 'next/link'
import { CTAFormInline } from '@/components/forms/CTAFormInline'

import { Phone } from 'lucide-react'
import { siteSettings } from '@/data'

export function CTASection() {
  return (
    <section className="py-20">
      <div className="site-container">
        <div className="theme-cta relative overflow-hidden rounded-4xl">
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
                  <PhoneLinks />
                </div>
              </div>

              {/* Right: contacts block — no fake form */}
              <CTAFormInline />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
