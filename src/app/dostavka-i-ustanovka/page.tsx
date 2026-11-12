import { defaultOpenGraph } from '@/lib/site-metadata'
import { CheckCircle, Truck, Home, Settings, Check } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Доставка и установка мобильной бани',
  description: 'Как происходит доставка, разгрузка манипулятором и установка бани на участке. Пошаговая визуализация.',
  alternates: { canonical: 'https://banger.su/dostavka-i-ustanovka' },

  openGraph: { ...defaultOpenGraph, url: 'https://banger.su/dostavka-i-ustanovka', title: 'Доставка и установка мобильной бани', description: 'Как происходит доставка, разгрузка манипулятором и установка бани на участке. Пошаговая визуализация.' },
}

const steps = [
  { icon: Settings, title: 'Подготовка', desc: 'Согласовываем планировку и комплектацию. Подготавливаем основание: свайный фундамент или бетонная подушка.' },
  { icon: Truck, title: 'Доставка', desc: 'Транспортируем модуль в специальной упаковке или открыто — в зависимости от расстояния и условий.' },
  { icon: Home, title: 'Разгрузка', desc: 'Манипулятор или кран устанавливает модуль на подготовленное основание. Технику и условия подъезда согласуем заранее.' },
  { icon: CheckCircle, title: 'Монтаж', desc: 'После установки баня подготовлена к подключению коммуникаций и дальнейшему использованию.' },
  { icon: Check, title: 'Передача', desc: 'Показываем работу печи, освещения и вентиляции. Передаём документы, гарантийный талон и инструкцию.' },
]

export default function DostavkaPage() {
  return (
    <div className="pt-28 pb-20">
      <div className="site-container">
        <div className="mb-12">
          <div className="section-tag mb-4">Доставка</div>
          <h1 className="text-5xl font-extrabold text-cream mb-3">Доставка и установка</h1>
          <p className="text-cream/60 max-w-xl">Доставка по Москве и регионам Центральной России. Подготовка участка и условия установки согласуются заранее.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 mb-16">
          {steps.map(({ icon: Icon, title, desc }, i) => (
            <div key={title} id={title === 'Доставка' ? 'delivery' : title === 'Монтаж' ? 'installation' : undefined} className="glass-card p-6 relative site-anchor">
              <div className="absolute top-4 right-4 text-5xl font-black text-white/5 select-none">{i + 1}</div>
              <Icon className="w-10 h-10 text-gold-400 mb-4" />
              <h2 className="text-lg font-bold text-cream mb-2">{title}</h2>
              <p className="text-sm text-cream/60 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        <section className="mb-8 border-y border-gold-400/30 py-6 md:py-8" aria-labelledby="assembly-title">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <h2 id="assembly-title" className="max-w-3xl text-xl font-bold leading-snug text-cream sm:text-2xl">Сборка, разгрузка и установка на участке</h2>
            <p className="shrink-0 rounded-full border border-gold-400/40 bg-gold-400/10 px-4 py-2 font-bold text-gold-300">Ориентир 300 000 ₽</p>
          </div>
          <p className="mt-4 max-w-4xl text-sm leading-relaxed text-cream/75">Если готовую баню невозможно доставить и установить целиком, может быть рассчитана сборка на участке. Ориентир стоимости работ — 300 000 ₽. Состав работ, сроки, условия размещения бригады и требования к подготовке площадки согласуются индивидуально и фиксируются в предложении до заказа.</p>
          <p className="mt-3 max-w-4xl text-sm leading-relaxed text-cream/65">Доставка и сторонние затраты рассчитываются согласно конкретному согласованному предложению. Если разгрузка краном уже включена в выбранные условия работ, её стоимость не начисляется повторно.</p>
        </section>

        <section className="glass-strong rounded-3xl p-8 md:p-12">
          <h2 className="text-2xl font-bold text-cream mb-4">Что нужно подготовить на участке</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-cream/70">
            <div className="glass rounded-xl px-5 py-3">Подготовленная площадка под выбранную модель и место для работы техники</div>
            <div className="glass rounded-xl px-5 py-3">Свободный подъезд без препятствий; необходимую ширину проезда согласуем для выбранной модели и техники</div>
            <div className="glass rounded-xl px-5 py-3">Электропитание 220 В (если требуется подключение)</div>
            <div className="glass rounded-xl px-5 py-3">Вывод воды или дренаж для слива</div>
          </div>
          <details className="mt-7 border-t border-cream/15 pt-5">
            <summary className="min-h-11 cursor-pointer font-semibold text-cream marker:text-gold-400 focus-visible:outline-2 focus-visible:outline-gold-400 focus-visible:outline-offset-4">
              Оплата и документы
            </summary>
            <div className="mt-3 max-w-3xl space-y-4 text-sm leading-relaxed text-cream/75">
              <p>Доступные способы, сроки и этапы оплаты согласуются для конкретного заказа и фиксируются в договоре и счёте. До оплаты менеджер сообщит, какие документы будут оформлены для выбранного способа расчёта.</p>
              <Link href="/oplata-i-cheki" className="inline-flex min-h-11 items-center font-semibold text-gold-300 underline underline-offset-4">Подробнее: оплата и документы →</Link>
            </div>
          </details>
        </section>
      </div>
    </div>
  )
}
