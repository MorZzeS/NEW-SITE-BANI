import { Check } from 'lucide-react'
import { CTAFormInline } from '@/components/forms/CTAFormInline'

export const metadata = {
  title: 'Комплектация мобильных бань',
  description: 'Базовая и дополнительная комплектация мобильных бань. Что входит в стоимость и что можно добавить.',
}

const base = [
  'Деревянный каркас из бруса 150×150 мм',
  'Утепление базальтовой ватой 100 мм',
  'Отделка парной вагонкой из липы/осины',
  'Металлическая печь-каменка',
  'Двойные оконные стеклопакеты',
  'Входная дверь с теплоизоляцией',
  'Дверь в парную из стекла',
  'Полки в парной (2 яруса)',
  'Электропроводка 220V',
  'Освещение во всех помещениях',
  'Вентиляция парной',
  'Слив воды',
]

const extras = [
  { label: 'Тройной стеклопакет', desc: 'Для регионов с морозами до -40°C' },
  { label: 'Утепление 150 мм', desc: 'Улучшенная теплоизоляция для круглогодичного использования' },
  { label: 'Электрокаменка', desc: 'Удобство использования, быстрый прогрев' },
  { label: 'Душевая кабина', desc: 'Компактный душ в помывочной' },
  { label: 'Веранда/терраса', desc: 'Открытая или закрытая, различные размеры' },
  { label: 'Кедровый обшив парной', desc: 'Премиальный аромат, долговечность' },
  { label: 'Тёмный фасад', desc: 'Покраска фасада в графитовые тона' },
  { label: 'Скамейка на террасе', desc: 'Деревянная скамейка для отдыха снаружи' },
  { label: 'Подключение к электросети', desc: 'Помощь с подключением на участке' },
]

export default function KomplektaciyaPage() {
  return (
    <div className="pt-28 pb-20">
      <div className="site-container">
        <div className="mb-12">
          <div className="section-tag mb-4">Комплектация</div>
          <h1 className="text-5xl font-extrabold text-cream mb-3">Комплектация бань</h1>
          <p className="text-cream/60 max-w-lg">
            Базовая комплектация включает всё необходимое для немедленного использования.
            Дополнительные опции — под ваши пожелания.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Base */}
          <div>
            <h2 className="text-2xl font-bold text-cream mb-5">Базовая комплектация</h2>
            <div className="glass rounded-3xl p-6 space-y-3">
              {base.map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-gold-400/20 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-gold-400" />
                  </div>
                  <span className="text-sm text-cream/85">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Extra */}
          <div>
            <h2 className="text-2xl font-bold text-cream mb-5">Дополнительные опции</h2>
            <div className="space-y-3">
              {extras.map((item) => (
                <div key={item.label} className="glass rounded-2xl p-4">
                  <div className="text-sm font-semibold text-cream mb-1">{item.label}</div>
                  <div className="text-xs text-cream/55">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <CTAFormInline />
      </div>
    </div>
  )
}
