import { CheckCircle, Truck, Home, Settings, Check } from 'lucide-react'

export const metadata = {
  title: 'Доставка и установка мобильной бани',
  description: 'Как происходит доставка, разгрузка манипулятором и установка бани на участке. Пошаговая визуализация.',
}

const steps = [
  { icon: Settings, title: 'Подготовка', desc: 'Согласовываем планировку и комплектацию. Подготавливаем основание: свайный фундамент или бетонная подушка.' },
  { icon: Truck, title: 'Доставка', desc: 'Транспортируем модуль в специальной упаковке или открыто — в зависимости от расстояния и условий.' },
  { icon: Home, title: 'Разгрузка', desc: 'Манипулятор или кран устанавливает модуль на подготовленное основание. Обычно занимает 1–2 часа.' },
  { icon: CheckCircle, title: 'Монтаж', desc: 'Подключаем электрику, слив воды, вентиляцию. Устанавливаем печь и оборудование.' },
  { icon: Check, title: 'Передача', desc: 'Показываем работу печи, освещения и вентиляции. Передаём документы, гарантийный талон и инструкцию.' },
]

export default function DostavkaPage() {
  return (
    <div className="pt-28 pb-20">
      <div className="site-container">
        <div className="mb-12">
          <div className="section-tag mb-4">Доставка</div>
          <h1 className="text-5xl font-extrabold text-cream mb-3">Доставка и установка</h1>
          <p className="text-cream/60 max-w-xl">От заявки до первой топки — прозрачный процесс с контролем на каждом этапе.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 mb-16">
          {steps.map(({ icon: Icon, title, desc }, i) => (
            <div key={title} className="glass-card p-6 relative">
              <div className="absolute top-4 right-4 text-5xl font-black text-white/5 select-none">{i + 1}</div>
              <Icon className="w-10 h-10 text-gold-400 mb-4" />
              <h3 className="text-lg font-bold text-cream mb-2">{title}</h3>
              <p className="text-sm text-cream/60 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        <section className="glass-strong rounded-3xl p-8 md:p-12">
          <h2 className="text-2xl font-bold text-cream mb-4">Что нужно подготовить на участке</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-cream/70">
            <div className="glass rounded-xl px-5 py-3">Площадка 4×4 м с подступом для манипулятора</div>
            <div className="glass rounded-xl px-5 py-3">Подъездная дорога без препятствий в 1 м шириной</div>
            <div className="glass rounded-xl px-5 py-3">Электропитание 220 В (если требуется подключение)</div>
            <div className="glass rounded-xl px-5 py-3">Вывод воды или дренаж для слива</div>
          </div>
        </section>
      </div>
    </div>
  )
}
