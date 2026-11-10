import type { Home, Sauna } from '@/types'

/** Show published measurements only; do not infer clear dimensions from outside size or plan pixels. */
export function ModelTechnicalDimensions({ model }: { model: Sauna | Home }) {
  const documented = model.specs.filter(spec => /высот|внутренн.*размер|размер.*помещен/i.test(spec.label))
  return <section className="glass rounded-2xl p-5 sm:p-7 mb-10" aria-labelledby={`dimensions-${model.id}`} data-model-dimensions={model.id}>
    <h2 id={`dimensions-${model.id}`} className="text-xl font-bold text-cream mb-4">Размеры и высота {'series' in model ? 'бани' : 'дома'}</h2>
    <dl className="grid sm:grid-cols-2 gap-x-8 text-sm">
      {[{ label: 'Наружные габариты', value: model.size }, ...documented].map(spec => <div key={spec.label} className="border-b border-cream/10 py-3"><dt className="font-semibold text-cream">{spec.label}</dt><dd className="mt-1 text-cream/70">{spec.value}</dd></div>)}
    </dl>
    <p className="text-sm leading-relaxed text-cream/65 mt-4">Наружные габариты отличаются от чистых внутренних размеров. Высоты стен и конька, расстояние от готового пола до потолка и размеры помещений уточняются по рабочим чертежам выбранной модели и планировки.</p>
  </section>
}
