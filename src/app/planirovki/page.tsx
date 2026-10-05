import type { Metadata } from 'next'
import Link from 'next/link'
import { saunas, homes } from '@/data'

export const metadata: Metadata = {
  title: 'Планировки мобильных бань',
  description: 'Готовые варианты планировок мобильных бань. Двухкомнатные, трёхкомнатные, с террасой.',
  alternates: { canonical: 'https://banger.su/planirovki' },
  openGraph: { url: 'https://banger.su/planirovki' },
}

const layouts = [
  { label: 'Планы бань', route: '/banya', models: saunas.filter((s) => s.floorPlan) },
  { label: 'Планы домов', route: '/dom', models: homes.filter((h) => h.floorPlan) },
]

export default function PlanirovkiPage() {
  return (
    <div className="pt-28 pb-20">
      <div className="site-container">
        <div className="mb-12">
          <div className="section-tag mb-4">Планировки</div>
          <h1 className="text-5xl font-extrabold text-cream mb-3">Планировки бань</h1>
          <p className="text-cream/60 max-w-lg">
            Выберите оптимальную планировку под ваши задачи и количество человек
          </p>
        </div>

        <div className="space-y-12">
          {layouts.map((layout) => (
            <section key={layout.route}>
              <h2 className="text-3xl font-bold text-cream mb-6">{layout.label}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {layout.models.map((model) => (
                  <Link href={`${layout.route}/${model.slug}`} key={model.id} className="glass rounded-3xl p-5 hover:bg-white/10 transition-all group">
                    <div className="relative h-48 rounded-2xl mb-4 overflow-hidden bg-graphite-900">
                      <img src={model.floorPlan} alt={`${model.name} — планировка`} className="w-full h-full object-contain" />
                    </div>
                    <div className="font-bold text-cream mb-1 group-hover:text-gold-300 transition-colors">{model.name}</div>
                    <div className="text-xs text-cream/60">{model.article} · {model.size}</div>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
