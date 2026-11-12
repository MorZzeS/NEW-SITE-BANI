import { formatPrice } from '@/data'
import type { Home, Sauna } from '@/types'

export function ModelPrices({ model }: { model: Sauna | Home }) {
  const construction = model.specs.find((spec) => spec.label === 'Исполнение')?.value
  return (
    <section aria-label="Стоимость и варианты исполнения" className="glass rounded-2xl p-5 mb-6">
      <h2 className="text-sm text-cream/70 mb-1">Стоимость базового исполнения</h2>
      <p className="text-3xl font-extrabold text-cream tabular-nums">{formatPrice(model.priceFrom)}</p>
      {construction && <p className="text-sm font-semibold text-cream/80 mt-2">{construction}</p>}
      {!!model.priceVariants?.length && <div className="mt-4 pt-4 border-t border-cream/15">
        <h3 className="text-sm font-semibold text-cream mb-2">Другие исполнения</h3>
        <ul className="space-y-2 text-sm text-cream/80">
          {model.priceVariants.map((variant) => <li key={variant}>{variant}</li>)}
        </ul>
      </div>}
      <p className="text-xs text-cream/60 mt-3">Цена базовой комплектации без доставки и дополнительных опций.</p>
    </section>
  )
}
