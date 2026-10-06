'use client'
import { CTAFormInline } from '@/components/forms/CTAFormInline'

import Link from 'next/link'

import { useState } from 'react'
import { Phone, Mail, MapPin, Clock, MessageCircle, Send, CheckCircle } from 'lucide-react'
import { siteSettings } from '@/data'

export default function KontaktyPage() {

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
              { icon: Phone, label: 'Второй телефон', value: siteSettings.phoneDisplay2!, href: `tel:${siteSettings.phone2}` },
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

          <div id="zayavka"><CTAFormInline /></div>
        </div>
      </div>
    </div>
  )
}
