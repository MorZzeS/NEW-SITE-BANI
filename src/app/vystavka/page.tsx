import { siteSettings } from '@/data'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Phone, MessageCircle, Send, CheckCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Выставка — Бани Герасимов',
  description: 'Посетите выставочный образец мобильной бани вживую. Запишитесь на просмотр.',
  alternates: { canonical: 'https://banger.su/vystavka' },
  openGraph: {
    url: 'https://banger.su/vystavka',
    title: 'Выставка — Бани Герасимов',
    description: 'Посетите выставочный образец мобильной бани вживую. Запишитесь на просмотр.',
  },
}

export default function VystavkaPage() {
  return (
    <div className="pt-28 pb-20">
      <div className="site-container">
        <div className="mb-12">
          <div className="section-tag mb-4">Выставка</div>
          <h1 className="text-5xl font-extrabold text-cream mb-3">Посетите нашу выставку</h1>
          <p className="text-cream/60 max-w-xl">
            Вживую — настоящая баня, собранная под контролем мастера.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
          <div>
            <h2 className="text-2xl font-bold text-cream mb-4">Что можно посмотреть вживую</h2>
            <ul className="space-y-3 text-sm text-cream/70">
              <li className="flex items-start gap-3"><CheckCircle className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" /><span>Полностью собранная мобильная баня с комплектацией (печь, душ, отделка)</span></li>
              <li className="flex items-start gap-3"><CheckCircle className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" /><span>Интерьер парной — липа, осина, базальтовое утепление, вентиляция</span></li>
              <li className="flex items-start gap-3"><CheckCircle className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" /><span>Печь Каменка-2 и ЭТНА 18 — демонстрация работы и нагрева</span></li>
              <li className="flex items-start gap-3"><CheckCircle className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" /><span>Душевая кабина + бойлер 50 л — пример установки в реальном модуле</span></li>
              <li className="flex items-start gap-3"><CheckCircle className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" /><span>Отделка: варианты цветов фасада и внутренних поверхностей</span></li>
            </ul>
          </div>
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden glass-card">
            <Image src="/NEW-SITE-BANI/images/interiors/vizual-gostinnaya-5.jpg" alt="Выставочный образец — интерьер" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
            <div className="absolute bottom-4 left-4 right-4">
              <div className="glass-dark rounded-2xl px-4 py-3 text-sm text-cream/80">
                <strong>Выставочный образец</strong> — модель в сборе под контролем мастера
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
          <div className="glass rounded-3xl overflow-hidden relative aspect-[4/3]">
            <Image src="/NEW-SITE-BANI/images/interiors/parnaya-2-.jpg" alt="Парная выставка" fill className="object-cover" sizes="33vw" />
          </div>
          <div className="glass rounded-3xl overflow-hidden relative aspect-[4/3]">
            <Image src="/NEW-SITE-BANI/images/interiors/pech-2.jpg" alt="Печь выставка" fill className="object-cover" sizes="33vw" />
          </div>
          <div className="glass rounded-3xl overflow-hidden relative aspect-[4/3]">
            <Image src="/NEW-SITE-BANI/images/interiors/dushevoy-plus-.jpg" alt="Душ выставка" fill className="object-cover" sizes="33vw" />
          </div>
        </div>

        <section className="glass-strong rounded-3xl p-8 md:p-10 text-center mb-12">
          <h2 className="text-2xl font-extrabold text-cream mb-3">Записаться на просмотр</h2>
          <p className="text-sm text-cream/60 mb-6 max-w-md mx-auto">Выберите удобное время. Мы покажем образец вживую, ответим на вопросы и рассчитаем стоимость с доставкой.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href="https://max.ru/u/f9LHodD0cOIxMWBIqevncnKjjJjmhro04Avs206ALKtkVorTXnbzx5mVTVs" target="_blank" rel="noopener noreferrer" className="btn-secondary px-6 py-3 rounded-xl text-sm font-medium">
              <Send className="w-4 h-4" /> Написать в MAX
            </a>
            <a href="https://t.me/banigerasimov" target="_blank" rel="noopener noreferrer" className="btn-secondary px-6 py-3 rounded-xl text-sm font-medium">
              <MessageCircle className="w-4 h-4" /> Telegram
            </a>
            <a href={`tel:${siteSettings.phone}`} className="btn-primary px-6 py-3 rounded-xl text-sm font-medium">
              <Phone className="w-4 h-4" /> Позвонить
            </a>
            <a href={`tel:${siteSettings.phone2}`} className="btn-secondary px-6 py-3 text-sm">{siteSettings.phoneDisplay2}</a>
          </div>
          <div className="mt-6 pt-6 border-t border-white/10 text-xs text-cream/40">
            <p>Адрес выставочного зала и режим работы будут опубликованы после подтверждения владельцем. Для записи на просмотр используйте кнопки связи выше.</p>
          </div>
        </section>
      </div>
    </div>
  )
}
