import type { Sauna, Home } from '@/types'
export type ModelConfigurationRow = { label: string; value: string }
export function modelConstruction(id: string): string {
  const number = Number(id.replace('bg-', ''))
  return number === 31 ? 'Брус 90×140 мм' : number <= 17 || number === 29 || number === 30 ? 'Каркас 100 мм' : 'Исполнение по утверждённому проекту модели'
}
// Keep published model-specific characteristics visible while using the owner's current insulation specification.
export function modelFeatures(model: Sauna | Home): string[] {
  return model.features.map(feature => feature.includes('Пол и потолок: утепление 50 мм') ? 'Пол и потолок: утепление 100 мм' : feature.includes('Каменка-2') ? 'Печь-каменка «Ермак» с дымоходом; бак и камни в подарок' : feature.includes('Каркас 100 мм или брус') ? modelConstruction(model.id) : feature)
}
export function modelBaseConfiguration(model: Sauna | Home): ModelConfigurationRow[] {
  const number = Number(model.id.replace('bg-', ''))
  const hasPlan = Boolean(model.floorPlan)
  const combined = [1, 2, 3, 22].includes(number)
  const noSeparateWash = [9, 10, 18].includes(number)
  const rooms = !hasPlan
    ? 'Состав помещений и планировка согласуются при заказе'
    : combined ? 'Парная с моечной зоной и комната отдыха; по планировке модели'
    : noSeparateWash ? 'Парная и комната отдыха; по планировке модели'
    : 'Парная, моечная / душевая и комната отдыха; по планировке модели'
  const bathroom = ('hasBathroom' in model && model.hasBathroom) || number >= 29
  const terrace = ('hasTerrace' in model && model.hasTerrace) || number === 31
  const knownStove = model.features.find(feature => /печь|печное/i.test(feature))
  const stove = number === 28
    ? 'Чугунная печь ЭТНА 18 с дымоходом — представленное исполнение Barn Premium'
    : number <= 8 ? 'Печь-каменка «Ермак» с дымоходом — актуальная базовая комплектация' : knownStove
      ? `${knownStove.replace(/,?\s*(бак[^,]*,?\s*)?и?\s*камни\b/gi, '').replace(/,\s*$/, '')}; дымоход и защита узлов по проекту`
      : 'Печь-каменка «Ермак» с дымоходом; точная модель уточняется по спецификации'
  return [
    { label: 'Конструкция', value: modelConstruction(model.id) },
    { label: 'Основание', value: 'Обвязочный брус, лаги, черновой и чистовой пол' },
    { label: 'Пароизоляция и ветровлагозащита', value: 'Защитные мембраны согласно технологии строительства' },
    { label: 'Утепление', value: 'Стены, пол и потолок — минеральная вата 100 мм (ISOVER, URSA или аналог)' },
    { label: 'Пол', value: 'Черновой и чистовой деревянный пол; проливное исполнение — дополнительная опция, если не предусмотрено проектом' },
    { label: 'Наружная отделка', value: number === 28 ? 'По утверждённому исполнению Barn Premium' : 'Имитация бруса из натуральной древесины; индивидуальные варианты согласуются отдельно' },
    { label: 'Кровля', value: 'Односкатная крыша, профлист; индивидуальное исполнение — по проекту модели' },
    { label: 'Помещения', value: `${rooms}${hasPlan && bathroom ? '; санузел по планировке' : ''}${hasPlan && terrace ? '; терраса / крыльцо' : ''}` },
    { label: 'Внутренняя отделка', value: 'Комната отдыха и моечная — хвойная вагонка; парная — осина класса А (при наличии соответствующих помещений)' },
    { label: 'Парная', value: 'Осиновая вагонка класса А и осиновые полки; форма и размер по планировке' },
    { label: 'Печное решение', value: stove },
    { label: 'Подарки к печи', value: 'Бак для воды и камни для печи — в подарок; исполнение по модели' },
    { label: 'Окна и двери', value: hasPlan ? 'Стандартные белые, согласно планировке выбранной модели' : 'Стандартные белые; размеры и расположение согласуются в планировке' },
    { label: 'Электрика', value: 'Открытая проводка, стандартные выключатели и розетка; скрытая проводка — дополнительная опция' },
    { label: 'Освещение', value: 'Светильники в комнате отдыха и моечной (при наличии); в парной — два специальных банных светильника по краям, без абажуров' },
    { label: 'Мебель', value: 'Стол и две лавки — в подарок' },
    { label: 'Входные ступени', value: 'В подарок' },
  ]
}
