import { Factory, Truck, Shield, Leaf, Clock, Users, Wrench, Star } from 'lucide-react'

const reasons = [
  {
    icon: Factory,
    title: 'Собственное производство',
    desc: 'Контроль качества на каждом этапе. Без посредников — напрямую от производителя к клиенту.',
  },
  {
    icon: Truck,
    title: 'Доставка и установка',
    desc: 'Привезём и установим по всей России. Работаем с труднодоступными участками.',
  },
  {
    icon: Shield,
    title: 'Гарантия на все бани',
    desc: 'Официальная гарантия на конструкцию и отделку. Сервисное обслуживание после покупки.',
  },
  {
    icon: Leaf,
    title: 'Экологичные материалы',
    desc: 'Только натуральная древесина: липа, осина, кедр. Базальтовая теплоизоляция без вредных смол.',
  },
  {
    icon: Clock,
    title: 'Быстрые сроки',
    desc: 'Стандартная баня — от 2 недель. Популярные модели — в наличии и готовы к отгрузке.',
  },
  {
    icon: Users,
    title: 'Индивидуальные решения',
    desc: 'Изменим планировку, цвет фасада, комплектацию и размер под ваши задачи.',
  },
  {
    icon: Wrench,
    title: 'Полная комплектация',
    desc: 'Печь, электрика, освещение, вентиляция и отделка — всё в одном пакете, готово к использованию.',
  },
  {
    icon: Star,
    title: 'Тысячи довольных клиентов',
    desc: 'Работаем с 2015 года. Реальные отзывы и видеообзоры от владельцев наших бань.',
  },
]

export function WhyUsSection() {
  return (
    <section className="py-20">
      <div className="site-container">
        <div className="text-center mb-14">
          <div className="section-tag mb-4">Почему выбирают нас</div>
          <h2 className="text-4xl font-bold text-cream mb-3">8 причин работать с нами</h2>
          <p className="text-cream/60 max-w-lg mx-auto">
            Мы производим бани сами — и несём полную ответственность за качество от первого гвоздя до установки
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {reasons.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="glass-card p-6 hover:border-gold-400/30 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-gold-400/15 flex items-center justify-center mb-5 group-hover:bg-gold-400/25 transition-colors">
                <Icon className="w-6 h-6 text-gold-400" />
              </div>
              <h3 className="text-base font-bold text-cream mb-2">{title}</h3>
              <p className="text-sm text-cream/60 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
