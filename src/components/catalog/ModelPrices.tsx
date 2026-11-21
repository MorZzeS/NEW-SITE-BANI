import { formatPrice } from '@/data'
import type { Home, Sauna } from '@/types'

export function ModelPrices({ model }: { model: Sauna | Home }) {
  const construction = model.specs.find((spec) => spec.label === 'Исполнение')?.value
  return (
    <section aria-label="Стоимость и варианты исполнения" className="model-price-summary">
      <div className="model-price-primary">
        <div>
          <h2 className="text-sm text-cream/70 mb-1">{model.id === 'bg-20' ? 'Стоимость представленного исполнения' : 'Стоимость базового исполнения'}</h2>
          {construction && <p className="text-xs font-semibold text-cream/75">{construction}</p>}
        </div>
        <p className="text-2xl sm:text-3xl font-extrabold text-cream tabular-nums whitespace-nowrap">{formatPrice(model.priceFrom)}</p>
      </div>
      {model.id === 'bg-18' && <div className="mt-3 rounded-xl border border-gold-400/30 bg-gold-400/10 p-3" data-photo-configuration-price="657600">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-cream">Пример цены: проливной пол и два шпроса</h3>
          <p className="text-xl font-extrabold text-gold-400 tabular-nums whitespace-nowrap">{formatPrice(657600)}</p>
        </div>
        <p className="mt-1 text-xs leading-relaxed text-cream/75">619 200 ₽ + пол 20 600 ₽ + два шпроса 17 800 ₽. В расчёт входят только перечисленные дополнения; другие опции оцениваются отдельно.</p>
      </div>}
      {!!model.priceVariants?.length && <div className="model-price-variants">
        <h3 className="text-xs font-semibold text-cream/80">Другие исполнения</h3>
        <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-cream/80">
          {model.priceVariants.map((variant) => <li key={variant}>{variant}</li>)}
        </ul>
      </div>}
      <p className="text-xs text-cream/60 mt-2">{model.id === 'bg-20' ? 'Цена указана без доставки. Дополнительные изменения комплектации рассчитываются отдельно.' : 'Базовая цена указана без доставки и дополнительных опций.'}</p>
    </section>
  )
}
