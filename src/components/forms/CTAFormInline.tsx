'use client'

import Link from 'next/link'

import { useState } from 'react'
import { Send, CheckCircle } from 'lucide-react'

interface Props {
  modelName?: string
}

export function CTAFormInline({ modelName }: Props) {
  const [submitted, setSubmitted] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [comment, setComment] = useState(modelName ? `Интересует модель: ${modelName}` : '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', { name, phone, comment, modelName })
    setSubmitted(true)
  }

  return (
    <div className="relative overflow-hidden rounded-3xl">
      <div className="absolute inset-0 bg-gradient-to-br from-wood-900/40 via-graphite-900/70 to-graphite-950/80" />
      <div className="absolute inset-0 border border-white/10 rounded-3xl" />
      <div className="relative z-10 p-8 md:p-10">
        {submitted ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CheckCircle className="w-14 h-14 text-emerald-400 mb-4" />
            <h3 className="text-2xl font-bold text-cream mb-2">Онлайн-отправка заявки пока недоступна</h3>
            <p className="text-cream/60">Свяжитесь с нами удобным способом ниже.</p>
            <div className="flex flex-wrap justify-center gap-3 mt-4">
            <a href="https://max.ru/u/f9LHodD0cOIxMWBIqevncnKjjJjmhro04Avs206ALKtkVorTXnbzx5mVTVs" target="_blank" rel="noopener noreferrer" className="btn-secondary px-6 py-3 rounded-xl text-sm font-medium"><span>Написать в MAX</span></a>
            <a href="https://t.me/banigerasimov" target="_blank" rel="noopener noreferrer" className="btn-secondary px-6 py-3 rounded-xl text-sm font-medium"><span>Telegram</span></a>
            <a href="tel:+79362000050" className="btn-primary px-6 py-3 rounded-xl text-sm font-medium"><span>Позвонить</span></a>
          </div>
        </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="section-tag mb-4">Получить расчёт</div>
              <h2 className="text-2xl font-bold text-cream mb-2">
                {modelName ? `Узнать цену на ${modelName}` : 'Заказать звонок'}
              </h2>
              <p className="text-cream/60 text-sm leading-relaxed">
                Оставьте контакт — менеджер свяжется с вами, уточнит детали
                и рассчитает итоговую стоимость с доставкой в ваш регион.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ваше имя"
                required
                className="w-full glass rounded-xl px-4 py-3 text-sm text-cream placeholder-cream/30 outline-none border border-transparent focus:border-gold-400/50 transition-colors"
              />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+7 900 000-00-00"
                required
                className="w-full glass rounded-xl px-4 py-3 text-sm text-cream placeholder-cream/30 outline-none border border-transparent focus:border-gold-400/50 transition-colors"
              />
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={2}
                placeholder="Комментарий (необязательно)"
                className="w-full glass rounded-xl px-4 py-3 text-sm text-cream placeholder-cream/30 outline-none border border-transparent focus:border-gold-400/50 transition-colors resize-none"
              />
              <button type="submit" className="btn-primary w-full justify-center py-3.5">
                <Send className="w-4 h-4" />
                Получить расчёт
              </button>
              <a href="https://max.ru/u/f9LHodD0cOIxMWBIqevncnKjjJjmhro04Avs206ALKtkVorTXnbzx5mVTVs" target="_blank" rel="noopener noreferrer" className="btn-secondary w-full justify-center py-3.5"><span>Написать в MAX</span></a>
              <p className="text-[10px] text-cream/30 text-center">
                Нажимая кнопку, вы соглашаетесь с{' '}
                <Link href="/privacy" className="underline">политикой конфиденциальности</Link>
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
