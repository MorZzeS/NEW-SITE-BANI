import Image from 'next/image'
import { Factory, Award, Users, Truck } from 'lucide-react'

export const metadata = {
  title: 'О компании — Бани Герасимов',
  description: 'Производитель мобильных бань с 2015 года. Собственное производство, гарантия качества, доставка по всей России.',
}

const stats = [
  { value: '500+', label: 'Установленных бань' },
  { value: '10', label: 'Лет на рынке' },
  { value: '50+', label: 'Регионов России' },
  { value: '100%', label: 'Собственное производство' },
]

const values = [
  { icon: Factory, title: 'Производство', desc: 'Собственный цех площадью 2000 м². Полный цикл: от распиловки леса до финальной сборки.' },
  { icon: Award, title: 'Качество', desc: 'Все материалы проходят контроль. Используем только сертифицированный пиломатериал и утеплитель.' },
  { icon: Users, title: 'Команда', desc: 'Опытные мастера с профильным образованием. Средний стаж в компании — 5 лет.' },
  { icon: Truck, title: 'Доставка', desc: 'Собственный автопарк. Доставляем бережно и в срок. Работаем с труднодоступными участками.' },
]

export default function OKompaniiPage() {
  return (
    <div className="pt-28 pb-20">
      <div className="site-container">
        <div className="text-center mb-16">
          <div className="section-tag mb-4">О компании</div>
          <h1 className="text-5xl font-extrabold text-cream mb-4">Бани Герасимов</h1>
          <p className="text-xl text-cream/60 max-w-2xl mx-auto leading-relaxed">
            Производитель мобильных бань с 2015 года. Делаем бани, которые греют,
            радуют и служат десятилетиями.
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
          <Image
            src="/images/renders/Исток Семейный 7.png"
            alt="Производство бань Герасимов"
            fill
            className="object-cover"
            sizes="100vw"
          />
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
                Компания «Бани Герасимов» была основана в 2015 году. Начинали с небольшой мастерской
                и одной модели. Сейчас в нашем каталоге более 20 моделей мобильных бань и домов,
                собственное производство и автопарк для доставки.
              </p>
              <p>
                Мы никогда не гнались за массовостью — нам важнее, чтобы каждая баня служила
                десятилетиями и её владелец был доволен. Поэтому мы не снижаем стандарты качества
                ради удешевления: используем только натуральную древесину, базальтовую вату и
                надёжную фурнитуру.
              </p>
              <p>
                Сегодня в нашей команде 45 человек. Мы установили более 500 бань и домов в 50+
                регионах России — от Калининграда до Владивостока. И продолжаем расти.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
