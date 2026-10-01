'use client'

import { useState } from 'react'
import { Phone, Mail, MapPin, Clock, MessageCircle, Send, CheckCircle } from 'lucide-react'
import { siteSettings } from '@/data'

export default function KontaktyPage() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '', model: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Contact form:', form)
    setSubmitted(true)
  }

  return (
    <div className="pt-28 pb-20">
      <div className="site-container">
        <div className="mb-12">
          <div className="section-tag mb-4">Контакты</div>
          <h1 className="text-5xl font-extrabold text-cream mb-3">Свяжитесь с нами</h1>
          <p className="text-cream/60 max-w-lg">
            Звоните, пишите или оставьте заявку — ответим на все вопросы и рассчитаем стоимость
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact info */}
          <div className="space-y-5">
            {[
              { icon: Phone, label: 'Телефон', value: siteSettings.phoneDisplay, href: `tel:${siteSettings.phone}` },
              { icon: Mail, label: 'Email', value: siteSettings.email, href: `mailto:${siteSettings.email}` },
              { icon: Clock, label: 'Режим работы', value: siteSettings.workingHours, href: null },
              { icon: MapPin, label: 'Адрес', value: siteSettings.address, href: null },
            ].map(({ icon: Icon, label, value, href }) => (
              <div key={label} className="glass-card p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gold-400/15 flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6 text-gold-400" />
                </div>
                <div>
                  <div className="text-xs text-cream/50 mb-0.5">{label}</div>
                  {href ? (
                    <a href={href} className="text-base font-semibold text-cream hover:text-gold-300 transition-colors">{value}</a>
                  ) : (
                    <div className="text-base font-semibold text-cream">{value}</div>
                  )}
                </div>
              </div>
            ))}

            {/* Messengers */}
            <div className="glass-card p-5">
              <div className="text-sm font-semibold text-cream mb-4">Мессенджеры</div>
              <div className="flex gap-3">
                <a href={siteSettings.whatsapp} target="_blank" rel="noopener noreferrer"
                  className="btn-primary px-5 py-2.5 text-sm">
                  <MessageCircle className="w-4 h-4" /> WhatsApp
                </a>
                <a href={siteSettings.telegram} target="_blank" rel="noopener noreferrer"
                  className="btn-secondary px-5 py-2.5 text-sm">
                  Telegram
                </a>
                <a href="https://max.ru/u/f9LHodD0cOIxMWBIqevncnKjjJjmhro04Avs206ALKtkVorTXnbzx5mVTVs" target="_blank" rel="noopener noreferrer"
                  className="btn-secondary px-5 py-2.5 text-sm">
                  MAX
                </a>
              </div>
            </div>
          </div>

          {/* Form */}
          <div id="zayavka" className="glass-strong rounded-3xl p-8">
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <CheckCircle className="w-16 h-16 text-emerald-400 mb-5" />
                <h2 className="text-2xl font-bold text-cream mb-2">Заявка отправлена!</h2>
                <p className="text-cream/60">Мы свяжемся с вами в ближайшее рабочее время.</p>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-cream mb-2">Оставить заявку</h2>
                <p className="text-sm text-cream/55 mb-6">Ответим в течение 15 минут в рабочее время</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-cream/60 mb-1.5">Имя *</label>
                      <input type="text" required value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Иван"
                        className="w-full glass rounded-xl px-4 py-3 text-sm text-cream placeholder-cream/30 outline-none border border-transparent focus:border-gold-400/50 transition-colors" />
                    </div>
                    <div>
                      <label className="block text-xs text-cream/60 mb-1.5">Телефон *</label>
                      <input type="tel" required value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="+7 900 000-00-00"
                        className="w-full glass rounded-xl px-4 py-3 text-sm text-cream placeholder-cream/30 outline-none border border-transparent focus:border-gold-400/50 transition-colors" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-cream/60 mb-1.5">Email</label>
                    <input type="email" value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="ivan@example.com"
                      className="w-full glass rounded-xl px-4 py-3 text-sm text-cream placeholder-cream/30 outline-none border border-transparent focus:border-gold-400/50 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs text-cream/60 mb-1.5">Интересующая модель</label>
                    <input type="text" value={form.model}
                      onChange={(e) => setForm({ ...form, model: e.target.value })}
                      placeholder="Например: Исток 6 или любая"
                      className="w-full glass rounded-xl px-4 py-3 text-sm text-cream placeholder-cream/30 outline-none border border-transparent focus:border-gold-400/50 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs text-cream/60 mb-1.5">Сообщение</label>
                    <textarea rows={3} value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Расскажите о вашем участке, задачах и вопросах..."
                      className="w-full glass rounded-xl px-4 py-3 text-sm text-cream placeholder-cream/30 outline-none border border-transparent focus:border-gold-400/50 transition-colors resize-none" />
                  </div>
                  <button type="submit" className="btn-primary w-full justify-center py-3.5">
                    <Send className="w-4 h-4" />
                    Отправить заявку
                  </button>
                  <p className="text-[10px] text-cream/30 text-center">
                    Нажимая кнопку, вы соглашаетесь с{' '}
                    <a href="/privacy" className="underline">политикой конфиденциальности</a>
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
