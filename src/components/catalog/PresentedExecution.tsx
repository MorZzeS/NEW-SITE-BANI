import type { Sauna } from '@/types'

/** Only existing model data is shown until the extended specification is reconciled. */
export function PresentedExecution({ model }: { model: Sauna }) {
  if (model.id !== 'bg-20') return null

  return <section className="glass rounded-2xl p-5 sm:p-6 mb-8" aria-labelledby="presented-execution-title" data-presented-execution={model.id}>
    <p className="text-xs font-semibold text-gold-400 mb-2">Индивидуальное исполнение · {model.article}</p>
    <h2 id="presented-execution-title" className="text-xl sm:text-2xl font-bold text-cream mb-3">Особенности представленного исполнения</h2>
    <ul className="grid gap-2 sm:grid-cols-2 text-sm text-cream/80 list-disc pl-5">
      {model.features.map(feature => <li key={feature}>{feature}</li>)}
    </ul>
    <p className="mt-4 text-sm leading-relaxed text-cream/65">Это отдельное исполнение модели со своей планировкой и стоимостью. Перечисленные особенности не прибавляются к указанной цене повторно. Полный состав исполнения фиксируется в спецификации при заказе.</p>
  </section>
}
