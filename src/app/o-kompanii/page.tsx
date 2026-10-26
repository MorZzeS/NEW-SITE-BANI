import type { Metadata } from 'next'
import Image from 'next/image'
import { saunas, homes } from '@/data'
import { Factory, Award, Users, Truck } from 'lucide-react'
import { YandexReviewsWidget } from '@/components/integrations/YandexReviewsWidget'
import { YandexMapEmbed } from '@/components/integrations/YandexMapEmbed'

export const metadata: Metadata = {
  title: 'О нас — Бани Герасимов',
  description: 'Производитель мобильных бань с 2026 года. Собственное производство в Московской области, доставка и установка по Москве и регионам Центральной России.',
  alternates: { canonical: 'https://banger.su/o-kompanii' },
  openGraph: {
    url: 'https://banger.su/o-kompanii',
    title: 'О нас — Бани Герасимов',
    description: 'Производитель мобильных бань с 2026 года. Собственное производство в Московской области, доставка и установка по Москве и регионам Центральной России.',
  },
}

// Факты о компании — вынесены в единый объект.
// Цифры (модели, сотрудники, год основания) подтверждены владельцем.
// Не генерировать и не менять без согласия владельца.
const companyFacts = {
  founded: '2026',
  saunas: saunas.length,
  homes: homes.length,
  team: 8,
  region: 'Москва и Центральный регион',
  city: 'Раменское',
}

const stats = [
  { value: String(companyFacts.saunas), label: 'Модели бань' },
  { value: String(companyFacts.homes), label: 'Модели домов' },
  { value: '8', label: 'Человек в команде' },
  { value: '2026', label: 'Основание' },
]

const values = [
  { icon: Factory, title: 'Производство', desc: 'Собственный цех. Полный цикл: от распиловки леса до финальной сборки.' },
  { icon: Award, title: 'Качество', desc: 'Все материалы проходят контроль. Натуральная древесина, сертифицированный утеплитель.' },
  { icon: Users, title: 'Команда', desc: '8 специалистов с профильным образованием. Каждый отвечает за свой участок.' },
  { icon: Truck, title: 'Доставка', desc: 'Работаем по Москве и регионам Центральной России. Установка под ключ в срок от 3 дней.' },
]

export default function OKompaniiPage() {
  return (
    <div className="about-page pt-28 pb-12">
      <div className="site-container">
        <div className="text-center mb-8">
          <div className="section-tag mb-4">О нас</div>
          <h1 className="text-5xl font-extrabold text-cream mb-4">Бани Герасимов</h1>
          <p className="text-xl text-cream/60 max-w-2xl mx-auto leading-relaxed">
            Производитель мобильных бань с {companyFacts.founded} года. Делаем бани, которые греют, радуют и служат десятилетиями.
          </p>
        </div>

        {/* Hero image */}
        <div className="about-photo relative aspect-video rounded-3xl overflow-hidden mb-5">
          <Image src="/images/showroom/exhibition.webp" alt="Наша выставка бань в Раменском" fill className="object-cover object-center" sizes="(max-width: 768px) 100vw, 80vw" />
          <div className="absolute inset-0 bg-gradient-to-t from-graphite-950/60 to-transparent" />
        </div>

        {/* Story */}
        <div className="about-story glass rounded-3xl p-6 md:p-8 mb-5">
            <h2 className="text-3xl font-bold text-cream mb-4">Наша история</h2>
            <div className="space-y-4 text-cream/70 leading-relaxed">
              <p>
                Компания «Бани Герасимов» основана в 2026 году. Начали с небольшой мастерской в Раменском и одной модели — Исток 4. Сегодня в нашем каталоге {companyFacts.saunas} моделей мобильных бань и {companyFacts.homes} моделей домов серии Усадьба, собственное производство и команда из 8 специалистов.
              </p>
              <p>
                Мы работаем только с натуральной древесиной, сертифицированными утеплителями и проверенной фурнитурой. Каждая баня собирается вручную с контролем качества на каждом этапе — от распиловки до финальной отделки.
              </p>
              <p>
                География работы на текущий момент: Москва и Центральный регион. Адрес участка, подготовку площадки и условия подъезда обсуждаем до доставки.
              </p>
            </div>
        </div>

        <div className="about-values grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[values[0], values[2], values[1], values[3]].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="glass-card p-5">
              <Icon aria-hidden="true" className="w-6 h-6 text-gold-400 mb-3" />
              <h2 className="text-lg font-bold text-cream mb-2">{title}</h2>
              <p className="text-sm text-cream/65 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          {stats.map((stat) => (
            <div key={stat.label} className="glass-card p-5 text-center">
              <div className="text-3xl font-black text-gradient mb-2">{stat.value}</div>
              <div className="text-sm text-cream/60">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
          <YandexReviewsWidget
            embedUrl="https://yandex.ru/maps-reviews-widget/68540156780?comments"
            businessUrl="https://yandex.ru/maps/-/CXRRzYpj"
            description="Откройте карточку компании на Яндекс Картах и ознакомьтесь с отзывами клиентов."
          />
          <YandexMapEmbed
            embedUrl="https://yandex.ru/map-widget/v1/?ol=biz&oid=68540156780&z=16"
            routeUrl="https://yandex.ru/maps/?rtext=~55.555417%2C38.273997&rtt=auto"
            mapUrl="https://yandex.ru/maps/-/CXRRzYpj"
            title="Выставка и производство на карте"
          />
        </div>
      </div>
    </div>
  )
}
