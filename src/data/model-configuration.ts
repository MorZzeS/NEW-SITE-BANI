import type { Sauna, Home } from '@/types'
export type ModelConfigurationRow = { label: string; value: string }
export function modelConstruction(id: string): string {
  const number = Number(id.replace('bg-', ''))
  return number === 31 ? 'Брус 90×140 мм' : number <= 17 || number === 29 || number === 30 ? 'Каркас 100 мм' : 'Согласуется при заказе'
}
// Display the owner's current base specification without altering approved catalogue prices, plans or source records.
export function modelFeatures(model: Sauna | Home): string[] {
  return model.features.map(feature => feature.includes('Пол и потолок: утепление 50 мм') ? 'Пол и потолок: утепление 100 мм' : feature.includes('Каркас 100 мм или брус') ? modelConstruction(model.id) : feature)
}
export function modelBaseConfiguration(model: Sauna | Home): ModelConfigurationRow[] {
  const number = Number(model.id.replace('bg-', ''))
  const rows: ModelConfigurationRow[] = [
    { label: 'Конструкция', value: modelConstruction(model.id) },
    { label: 'Пол', value: 'Утепление 100 мм' },
    { label: 'Потолок', value: 'Утепление 100 мм' },
  ]
  if (!model.floorPlan) return [...rows,
    { label: 'Помещения и оборудование', value: 'Согласуются при заказе: нет подтверждённой планировки и комплектации.' },
    { label: 'Освещение', value: 'Согласуется при заказе' },
    { label: 'Окна и двери', value: 'По проекту; исполнение согласуется при заказе' },
  ]
  const combined = [1, 2, 3, 22].includes(number)
  const noSeparateWash = [9, 10, 18].includes(number)
  const zones = combined ? 'Парная с моечной зоной и комната отдыха' : noSeparateWash ? 'Парная и комната отдыха' : 'Парная, моечная / душевая и комната отдыха'
  const bathroom = ('hasBathroom' in model && model.hasBathroom) || number >= 29
  const terrace = ('hasTerrace' in model && model.hasTerrace) || number === 31
  rows.push({ label: 'Помещения', value: `${zones}${bathroom ? ', санузел' : ''}${[10, 18].includes(number) ? ', тамбур' : ''}${terrace ? '; терраса / входное крыльцо' : ''}; согласно планировке модели` })
  rows.push({ label: 'Парная', value: 'Осиновая вагонка и осиновые полки' })
  const stove = number <= 8 ? 'Печь «Каменка-2», бак и камни' : number <= 17 ? 'Печь Ермак 12, бак 55 л и камни' : number === 24 ? 'Печь Ермак 12, камни' : number === 28 ? 'Чугунная печь ЭТНА 18, бак 30 л и камни' : 'Печь-каменка согласно спецификации модели, камни; исполнение согласуется при заказе'
  rows.push({ label: 'Печное решение', value: `${stove}. Огнезащита` })
  rows.push({ label: 'Освещение', value: 'Базовое освещение' })
  if (number <= 8) rows.push({ label: 'Комната отдыха', value: 'Стол и две лавки' })
  if (number === 28) rows.push({ label: 'Оборудование', value: 'Душевая кабина и бойлер 50 л — представленное исполнение Barn Premium' })
  rows.push({ label: 'Окна и двери', value: 'По проекту выбранной модели' })
  return rows
}
