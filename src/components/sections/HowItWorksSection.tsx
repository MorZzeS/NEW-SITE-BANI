import { FileText, Settings, Hammer, Truck, Home, CheckCircle } from 'lucide-react'

const steps = [
  {
    icon: FileText,
    step: '01',
    title: 'Заявка',
    desc: 'Оставляете заявку на сайте или звоните. Мы перезваниваем в течение 15 минут и отвечаем на все вопросы.',
  },
  {
    icon: Settings,
    step: '02',
    title: 'Согласование',
    desc: 'Выбираем модель, планировку и комплектацию. Согласовываем проект, подписываем договор.',
  },
  {
    icon: Hammer,
    step: '03',
    title: 'Производство',
    desc: 'Ваша баня собирается в нашем производственном цехе из отборного пиломатериала под контролем мастера.',
  },
  {
    icon: Truck,
    step: '04',
    title: 'Доставка',
    desc: 'Доставляем транспортом компании по Москве и Московской области. Предупреждаем о дате прибытия заранее.',
  },
  {
    icon: Home,
    step: '05',
    title: 'Установка',
    desc: 'Устанавливаем баню за 1 день. Подключаем коммуникации, показываем как пользоваться.',
  },
  {
    icon: CheckCircle,
    step: '06',
    title: 'Готово!',
    desc: 'Принимаете баню, получаете документы и гарантию. Первая топка — уже в день установки.',
  },
]

export function HowItWorksSection() {
  return (
    <section className="py-20">
      {/* Background gradient strip */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-wood-900/20 via-transparent to-wood-900/10 pointer-events-none" />
        <div className="site-container">
          <div className="text-center mb-14">
            <div className="section-tag mb-4">Процесс заказа</div>
            <h2 className="text-4xl font-bold text-cream mb-3">Как это работает</h2>
            <p className="text-cream/60 max-w-md mx-auto">
              От первого звонка до первой топки — прозрачно и без неожиданностей
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {steps.map(({ icon: Icon, step, title, desc }) => (
              <div key={step} className="glass-card p-6 group relative overflow-hidden">
                {/* Step number watermark */}
                <div className="absolute top-4 right-4 text-5xl font-black text-white/5 select-none">
                  {step}
                </div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-gold-400/15 flex items-center justify-center shrink-0 group-hover:bg-gold-400/25 transition-colors">
                    <Icon className="w-6 h-6 text-gold-400" />
                  </div>
                  <div>
                    <div className="text-xs text-gold-400/70 font-semibold tracking-widest mb-0.5">ШАГ {step}</div>
                    <h3 className="text-base font-bold text-cream">{title}</h3>
                  </div>
                </div>
                <p className="text-sm text-cream/60 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
