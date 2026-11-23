import type { Sauna } from '@/types'
import { formatPrice } from '@/data'

export function PresentedExecution({ model }: { model: Sauna }) {
  if (model.id !== 'bg-20') return null

  return <section className="glass rounded-2xl p-5 sm:p-6 mb-8" aria-labelledby="presented-execution-title" data-presented-execution={model.id}>
    <p className="text-xs font-semibold text-gold-400 mb-2">Индивидуальное исполнение · {model.article}</p>
    <h2 id="presented-execution-title" className="text-xl sm:text-2xl font-bold text-cream mb-3">Особенности представленного исполнения</h2>
    <ul className="grid gap-2 sm:grid-cols-2 text-sm text-cream/80 list-disc pl-5">
      <li>Санузел</li>
      <li>Декоративные наружные рейки; точное расположение не подтверждено</li>
    </ul>
    <p className="mt-3 text-sm leading-relaxed text-cream/65">Цена представленного исполнения: {formatPrice(model.priceFrom)}. Точный состав заказа фиксируется в спецификации.</p>
  </section>
}
