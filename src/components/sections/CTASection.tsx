'use client'

import { useState } from 'react'
import { Phone, MessageCircle, Send, CheckCircle } from 'lucide-react'
import { siteSettings } from '@/data'

export function CTASection() {
  const [submitted, setSubmitted] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In production, send to API
    console.log('Form submitted:', { name, phone })
    setSubmitted(true)
  }

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
                  Оставьте заявку — перезвоним в течение 15 минут, ответим на все вопросы,
                  подберём подходящую модель и рассчитаем стоимость с доставкой.
                </p>
                <div className="space-y-4">
                  <a href={`tel:${siteSettings.phone}`}
                    className="flex items-center gap-3 text-cream hover:text-gold-300 transition-colors group">
                    <div className="w-11 h-11 glass rounded-2xl flex items-center justify-center group-hover:bg-gold-400/15 transition-colors">
                      <Phone className="w-5 h-5 text-gold-400" />
                    </div>
                    <div>
                      <div className="text-xs text-cream/50">Позвонить</div>
                      <div className="font-semibold">{siteSettings.phoneDisplay}</div>
                    </div>
                  </a>
                </div>
              </div>

              {/* Right: Form */}
              <div className="glass-strong rounded-3xl p-8">
                {submitted ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <CheckCircle className="w-14 h-14 text-emerald-400 mb-4" />
                    <h3 className="text-xl font-bold text-cream mb-2">Заявка отправлена!</h3>
                    <p className="text-cream/60 text-sm">
                      Мы перезвоним вам в течение 15 минут в рабочее время.
                    </p>
                  </div>
                ) : (
                  <>
                    <h3 className="text-xl font-bold text-cream mb-2">Заказать звонок</h3>
                    <p className="text-sm text-cream/60 mb-6">Перезвоним в течение 15 минут</p>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="block text-xs text-cream/60 mb-1.5">Ваше имя</label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Иван"
                          required
                          className="w-full glass rounded-xl px-4 py-3 text-sm text-cream placeholder-cream/30 outline-none focus:border-gold-400/50 border border-transparent transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-cream/60 mb-1.5">Телефон</label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+7 900 000-00-00"
                          required
                          className="w-full glass rounded-xl px-4 py-3 text-sm text-cream placeholder-cream/30 outline-none focus:border-gold-400/50 border border-transparent transition-colors"
                        />
                      </div>
                      <button type="submit" className="btn-primary w-full justify-center py-3.5">
                        <Send className="w-4 h-4" />
                        Отправить заявку
                      </button>
                      <p className="text-[10px] text-cream/30 text-center leading-relaxed">
                        Нажимая «Отправить», вы соглашаетесь с{' '}
                        <a href="/privacy" className="underline hover:text-cream/50">политикой конфиденциальности</a>
                      </p>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
