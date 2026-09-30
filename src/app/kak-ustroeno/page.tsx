import { Layers, Shield, Wind, Droplets, Zap, Flame, Thermometer, ChevronRight } from 'lucide-react'

export const metadata = {
  title: 'Как устроена мобильная баня',
  description: 'Конструкция стены, слои, утепление, пароизоляция, вентиляция, печь и пол бани Герасимов.',
}

const layers = [
  { icon: Shield, title: 'Внешний фасад', desc: 'Деревянный брус или каркас, окрашенный или в натуральном виде. Защита от влаги и УФ.', color: 'wood' },
  { icon: Layers, title: 'Ветрозащита', desc: 'Пароизоляционная мембрана — предотвращает проникновение влаги снаружи.', color: 'graphite' },
  { icon: Thermometer, title: 'Утепление', desc: 'Каменная вата 100 мм (или 150 мм для зимы). Базальтовое волокно — не горит, не гниёт.', color: 'gold' },
  { icon: Shield, title: 'Пароизоляция', desc: 'Плёнка под внутренней отделкой — удерживает пар в парной, не пропускает в стену.', color: 'wood' },
  { icon: Flame, title: 'Отделка парной', desc: 'Вагонка из липы или осины — лёгкий аромат, не выделяет смолу при нагреве.', color: 'gold' },
]

const engineering = [
  { icon: Flame, title: 'Печь', desc: 'Металлическая Каменка-2 или чугунная ЭТНА 18 (для Премиум). Бак или бойлер по проекту.' },
  { icon: Droplets, title: 'Слив и пол', desc: 'Проливной или классический пол в мойке и парной. Слив в канализацию или дренаж.' },
  { icon: Wind, title: 'Вентиляция', desc: 'Приточная и вытяжная — для свежего воздуха и удаления конденсата.' },
  { icon: Zap, title: 'Электрика', desc: 'Проводка 220 В, освещение, розетки, выключатели. Возможна скрытая прокладка.' },
]

export default function KakUstroenoPage() {
  return (
    <div className="pt-28 pb-20">
      <div className="site-container">
        <div className="mb-12">
          <div className="section-tag mb-4">Конструкция</div>
          <h1 className="text-5xl font-extrabold text-cream mb-3">Как устроена баня</h1>
          <p className="text-cream/60 max-w-xl">
            Слои стены, инженерия и комплектация — всё, что важно знать о конструкции мобильной бани.
          </p>
        </div>

        {/* Wall layers */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-cream mb-8">Слои стены</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {layers.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="glass-card p-6 group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-400/20 to-wood-600/20 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-gold-400" />
                  </div>
                  <h3 className="text-base font-bold text-cream leading-tight">{title}</h3>
                </div>
                <p className="text-sm text-cream/60 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Engineering */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-cream mb-8">Инженерия</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {engineering.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="glass-card p-6 hover:border-gold-400/30 transition-all">
                <Icon className="w-8 h-8 text-gold-400 mb-4" />
                <h3 className="text-lg font-bold text-cream mb-2">{title}</h3>
                <p className="text-sm text-cream/65 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section>
          <div className="glass-strong rounded-3xl p-8 md:p-12 text-center">
            <h2 className="text-3xl font-extrabold text-cream mb-3">Хотите узнать больше?</h2>
            <p className="text-cream/60 mb-6 max-w-md mx-auto">
              Мы покажем конструкцию вживую на выставке или пришлём подробные схемы.
            </p>
            <a href="/kontakty#zayavka" className="btn-primary px-8 py-3.5 inline-flex">
              Получить схемы и расчёт
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
