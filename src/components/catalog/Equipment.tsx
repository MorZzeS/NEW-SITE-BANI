import { baseEquipment } from '@/data/equipment'
import { additionalOptions, optionCategories } from '@/data/options'
export function Equipment() {
  return <div className="grid lg:grid-cols-2 gap-8">
    <section><h2 className="text-2xl font-bold text-cream mb-4">Базовая комплектация</h2>
      <p className="text-sm text-cream/70 mb-5">Спецификация бани «Скандинавия 8×2,4». Для других моделей состав определяется их каталогом и выбранным исполнением. Конкретная печь согласуется по модели.</p>
      {baseEquipment.map(group => <details key={group.title} className="equipment-group"><summary>{group.title}</summary><ul>{group.items.map(item => <li key={item}>{item}</li>)}</ul></details>)}
    </section>
    <section><h2 className="text-2xl font-bold text-cream mb-4">Дополнительные опции</h2><p className="text-sm text-cream/70 mb-5">Продажные цены. Окончательная совместимость и состав работ согласуются при заказе.</p>
      {optionCategories.map(category => <details key={category} className="equipment-group"><summary>{category}</summary><div className="space-y-4">
        {additionalOptions.filter(option => option.enabled && option.category === category).map(option => <div key={option.id} className="border-t border-white/10 pt-3">
          <h3 className="font-semibold">{option.name}</h3><p className="text-xs text-cream/70 my-2">{option.description}</p>
          {option.image && <figure className="mb-3"><img src={option.image} alt="Бойлер 50 литров на нашей фотографии" width={960} height={675} loading="lazy" className="w-full max-w-sm rounded-lg" /><figcaption className="text-xs text-cream/60 mt-2">Пример оборудования. Исполнение согласуется при заказе.</figcaption></figure>}
          <p className="text-sm text-gold-400 font-semibold">{option.salePrice === null ? 'Стоимость по согласованию' : `+${option.salePrice.toLocaleString('ru-RU')} ₽ / ${option.priceUnit}`}</p>
        </div>)}
      </div></details>)}
    </section>
  </div>
}
