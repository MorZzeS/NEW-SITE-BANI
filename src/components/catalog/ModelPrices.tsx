import { formatPrice } from '@/data'
import type { Home, Sauna } from '@/types'

export function ModelPrices({ model }: { model: Sauna | Home }) {
  const construction = model.specs.find((spec) => spec.label === 'Исполнение')?.value
  return (
    <section aria-label="Стоимость и варианты исполнения" className="glass rounded-2xl p-5 mb-6">
      <h2 className="text-sm text-cream/70 mb-1">Стоимость</h2>
      <p className="text-sm text-cream/70 mb-2">{construction}</p>
      <p className="text-3xl font-extrabold text-cream">
        {model.id !== 'bg-28' && 'от '}{formatPrice(model.priceFrom)}
      </p>
      {!!model.priceVariants?.length && <div className="mt-4 pt-4 border-t border-cream/15">
        <h3 className="text-sm font-semibold text-cream mb-2">Другие исполнения</h3>
        <ul className="space-y-2 text-sm text-cream/80">
          {model.priceVariants.map((variant) => <li key={variant}>{variant}</li>)}
        </ul>
      </div>}
      <p className="text-xs text-cream/60 mt-3">Окончательная цена зависит от комплектации и региона доставки</p>
    </section>
  )
}
