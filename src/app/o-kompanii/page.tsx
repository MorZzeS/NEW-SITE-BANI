import type { Metadata } from 'next'
import Image from 'next/image'
import { Factory, Award, Users, Truck } from 'lucide-react'

export const metadata: Metadata = {
  title: 'О нас — Бани Герасимов',
  description: 'Производитель мобильных бань с 2026 года. Собственное производство в Московской области, доставка и установка по Москве и Московской области.',
  alternates: { canonical: 'https://banger.su/o-kompanii' },
  openGraph: {
    url: 'https://banger.su/o-kompanii',
    title: 'О нас — Бани Герасимов',
    description: 'Производитель мобильных бань с 2026 года. Собственное производство в Московской области, доставка и установка по Москве и Московской области.',
  },
}

// Факты о компании — вынесены в единый объект.
// Цифры (модели, сотрудники, год основания) подтверждены владельцем.
// Не генерировать и не менять без согласия владельца.
const companyFacts = {
  founded: '2026',
  saunas: 24,
  homes: 7,
  team: 8,
  region: 'Москва и Московская область',
  city: 'Раменское',
}

const stats = [
  { value: '24', label: 'Модели бань' },
  { value: '7', label: 'Модели домов' },
  { value: '8', label: 'Человек в команде' },
  { value: '2026', label: 'Основание' },
]

const values = [
  { icon: Factory, title: 'Производство', desc: 'Собственный цех. Полный цикл: от распиловки леса до финальной сборки.' },
  { icon: Award, title: 'Качество', desc: 'Все материалы проходят контроль. Натуральная древесина, сертифицированный утеплитель.' },
  { icon: Users, title: 'Команда', desc: '8 специалистов с профильным образованием. Каждый отвечает за свой участок.' },
  { icon: Truck, title: 'Доставка', desc: 'Работаем по Москве и Московской области. Установка под ключ в срок от 3 дней.' },
]

export default function OKompaniiPage() {
  return (
    <div className="pt-28 pb-20">
      <div className="site-container">
        <div className="text-center mb-16">
          <div className="section-tag mb-4">О нас</div>
          <h1 className="text-5xl font-extrabold text-cream mb-4">Бани Герасимов</h1>
          <p className="text-xl text-cream/60 max-w-2xl mx-auto leading-relaxed">
            Производитель мобильных бань с {companyFacts.founded} года. Делаем бани, которые греют, радуют и служат десятилетиями.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {stats.map((stat) => (
            <div key={stat.label} className="glass-card p-6 text-center">
              <div className="text-4xl font-black text-gradient mb-2">{stat.value}</div>
              <div className="text-sm text-cream/60">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Hero image */}
        <div className="relative aspect-video rounded-3xl overflow-hidden mb-16">
          <Image src="/NEW-SITE-BANI/images/renders/istok-semeynyy-7.webp" alt="Производство бань" fill className="object-cover" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-t from-graphite-950/60 to-transparent" />
        </div>

        {/* Values */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-16">
          {values.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="glass-card p-7">
              <div className="flex items-start gap-5">
                <div className="w-14 h-14 rounded-2xl bg-gold-400/15 flex items-center justify-center shrink-0">
                  <Icon className="w-7 h-7 text-gold-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-cream mb-2">{title}</h2>
                  <p className="text-cream/65 leading-relaxed">{desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Story */}
        <div className="prose-column">
          <div className="glass rounded-3xl p-8 md:p-12">
            <h2 className="text-3xl font-bold text-cream mb-6">Наша история</h2>
            <div className="space-y-5 text-cream/70 leading-relaxed">
              <p>
                Компания «Бани Герасимов» основана в 2026 году. Начали с небольшой мастерской в Раменском и одной модели — Исток 4. Сегодня в нашем каталоге 24 модели мобильных бань и 7 моделей домов серии Усадьба, собственное производство и команда из 8 специалистов.
              </p>
              <p>
                Мы работаем только с натуральной древесиной, сертифицированными утеплителями и проверенной фурнитурой. Каждая баня собирается вручную с контролем качества на каждом этапе — от распиловки до финальной отделки.
              </p>
              <p>
                География работы на текущий момент: Москва и Московская область. Мы доставляем и устанавливаем бани на участках любой сложности — от ровных площадок до склонов и ограниченных подъездов.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
