import { baseEquipmentRows } from '@/data/equipment'
import { ExtraOptions } from './ExtraOptions'
export function Equipment() {
  return <div className="space-y-12">
    <section><h2 className="text-2xl font-bold text-cream mb-4">Базовая комплектация</h2>
      <p className="text-sm text-cream/70 mb-5">Состав зависит от выбранной модели и её планировки. Подтверждённые особенности указаны в карточке модели; остальные параметры согласуются при заказе.</p>
      <table className="base-equipment-table"><caption className="sr-only">Состав базовой комплектации</caption><thead><tr><th scope="col">Параметр</th><th scope="col">Состав</th></tr></thead><tbody>{baseEquipmentRows.map(row => <tr key={row.label}><th scope="row">{row.label}</th><td>{row.value}</td></tr>)}</tbody></table>
    </section>
    <section><h2 className="text-2xl font-bold text-cream mb-4">Дополнительные опции</h2><p className="text-sm text-cream/70 mb-5">Продажные цены. Окончательная совместимость и состав работ согласуются при заказе.</p><ExtraOptions /></section>
  </div>
}
