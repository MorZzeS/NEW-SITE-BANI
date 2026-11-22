'use client'
import { PhoneLinks } from '@/components/ui/PhoneLinks'



import { CTAFormInline } from '@/components/forms/CTAFormInline'




export function CTASection() {
  return (
    <section className="home-consultation py-20">
      <div className="site-container">
        <div className="theme-cta relative overflow-hidden rounded-4xl">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-wood-900/60 via-graphite-900/80 to-graphite-950/90" />
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(ellipse at 30% 50%, rgba(196,118,46,0.15) 0%, transparent 60%)',
          }} />
          {/* Border */}
          <div className="absolute inset-0 rounded-4xl border border-white/10" />

          <div className="relative z-10 p-5 sm:p-8 lg:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)] gap-7 lg:gap-10 lg:items-center">
              {/* Left */}
              <div>
                <div className="section-tag mb-4">Получить консультацию</div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-cream mb-4">
                  Готовы обсудить<br />вашу баню?
                </h2>
                <p className="text-cream/65 text-base lg:text-lg leading-relaxed mb-5 max-w-lg">
                  Свяжитесь с нами удобным способом — ответим на все вопросы,
                  подберём подходящую модель и рассчитаем стоимость с доставкой.
                </p>
                <div className="space-y-4">
                  <PhoneLinks />
                </div>
              </div>

              {/* Right: the existing "Свяжитесь с нами" form / contacts fallback. */}
              <div id="zayavka" data-home-lead-form tabIndex={-1} className="scroll-mt-28">
                <CTAFormInline />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
