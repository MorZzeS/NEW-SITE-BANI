import Link from 'next/link'
import { saunas } from '@/data'

export const metadata = {
  title: 'Планировки мобильных бань',
  description: 'Готовые варианты планировок мобильных бань. Двухкомнатные, трёхкомнатные, с террасой.',
}

const layouts = [
  { rooms: 2, label: '2 помещения', desc: 'Парная + предбанник', models: saunas.filter(s => s.rooms === 2) },
  { rooms: 3, label: '3 помещения', desc: 'Парная + мойка + комната отдыха', models: saunas.filter(s => s.rooms === 3) },
  { rooms: 4, label: '4 помещения', desc: 'Парная + мойка + предбанник + комната отдыха', models: saunas.filter(s => s.rooms >= 4) },
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

        <div className="space-y-8">
          {layouts.map((layout) => (
            <div key={layout.rooms} className="glass rounded-3xl p-7">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-12 h-12 rounded-2xl bg-gold-400/15 flex items-center justify-center">
                  <span className="text-xl font-black text-gold-400">{layout.rooms}</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-cream">{layout.label}</h2>
                  <p className="text-sm text-cream/60">{layout.desc}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {layout.models.slice(0, 8).map((s) => (
                  <Link href={`/banya/${s.slug}`} key={s.id}
                    className="glass rounded-2xl p-4 hover:bg-white/10 transition-all group text-sm">
                    <div className="font-semibold text-cream group-hover:text-gold-300 transition-colors mb-1">{s.name}</div>
                    <div className="text-xs text-cream/50">{s.size}</div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
