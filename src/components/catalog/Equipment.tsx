import { baseEquipmentRows } from '@/data/equipment'
import { ExtraOptions } from './ExtraOptions'
export function Equipment() {
  return <div className="space-y-12">
    <section className="base-equipment-shell"><header className="base-equipment-header"><div><h2 className="text-2xl font-bold mb-2">Базовая комплектация мобильных бань</h2>
      <p className="text-sm mb-0">Перечень относится к стандартным мобильным баням. Комплектация домов «Усадьба» определяется отдельно в карточке каждой модели.</p></div><span className="base-equipment-badge">Включено в стоимость</span></header>
      <table className="base-equipment-table"><caption className="sr-only">Стандартная базовая комплектация мобильных бань</caption><tbody>{baseEquipmentRows.map(row => <tr key={row.label}><th scope="row">{row.label}</th><td><span>{row.value}</span>{row.gift && <small className="base-equipment-gift">В подарок</small>}</td></tr>)}</tbody></table>
    </section>
    <section><h2 className="text-2xl font-bold text-cream mb-4">Дополнительные опции</h2><p className="text-sm text-cream/70 mb-5">Продажные цены. Окончательная совместимость и состав работ согласуются при заказе.</p><ExtraOptions /></section>
  </div>
}
