import { formatPrice } from '@/data'
import type { Home, Sauna } from '@/types'

export function ModelPrices({ model }: { model: Sauna | Home }) {
  const construction = model.specs.find((spec) => spec.label === 'Исполнение')?.value
  return (
    <section aria-label="Стоимость и варианты исполнения" className="model-price-summary">
      <div className="model-price-primary">
        <div>
          <h2 className="text-sm text-cream/70 mb-1">Стоимость базового исполнения</h2>
          {construction && <p className="text-xs font-semibold text-cream/75">{construction}</p>}
        </div>
        <p className="text-2xl sm:text-3xl font-extrabold text-cream tabular-nums whitespace-nowrap">{formatPrice(model.priceFrom)}</p>
      </div>
      {!!model.priceVariants?.length && <div className="model-price-variants">
        <h3 className="text-xs font-semibold text-cream/80">Другие исполнения</h3>
        <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-cream/80">
          {model.priceVariants.map((variant) => <li key={variant}>{variant}</li>)}
        </ul>
      </div>}
      <p className="text-xs text-cream/60 mt-2">Цена без доставки и дополнительных опций.</p>
    </section>
  )
}
