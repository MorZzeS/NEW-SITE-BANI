import type { Home, Sauna } from '@/types'

export type ModelConfigurationRow = { label: string; value: string }

const pending = 'Согласуется при заказе'

export function requiresBaseConfigurationConfirmation(value: string): boolean {
  return /согласу(?:ется|ются)|уточня(?:ется|ются)|не подтвержд|не указано|не указана|по запросу/i.test(value)
}

export function modelConstruction(id: string): string {
  const number = Number(id.replace('bg-', ''))
  if (number === 31) return 'Брус 90×140 мм'
  if (number <= 17 || number === 29 || number === 30) return 'Каркас 100 мм'
  return 'Тип конструкции согласуется при заказе'
}

// Apply the owner's updated insulation specification only to mobile saunas; houses retain their own source data.
export function modelFeatures(model: Sauna | Home): string[] {
  return model.features.map(feature => {
    if ('series' in model && feature.includes('Пол и потолок: утепление 50 мм')) return 'Пол и потолок: утепление 100 мм'
    if ('series' in model && feature.includes('Каменка-2')) return 'Печь-каменка «Ермак» с дымоходом; бак и камни в подарок'
    if ('series' in model && feature.includes('Каркас 100 мм или брус')) return modelConstruction(model.id)
    return feature
  })
}

function homeConfiguration(model: Home): ModelConfigurationRow[] {
  const number = Number(model.id.replace('bg-', ''))
  const houseFeatures = model.features.filter(feature => !/планировка и комплектация согласуются при заказе/i.test(feature))
  const layoutFeatures = houseFeatures.filter(feature => /парная|моечная|душевая|санузел|комната отдыха|терраса|веранда/i.test(feature))
  const extraModelFeature = /террас|веранд/i.test(model.subtitle) && !layoutFeatures.some(feature => /террас|веранд/i.test(feature))
    ? model.subtitle
    : ''
  const confirmedLayout = [...layoutFeatures, ...(extraModelFeature ? [extraModelFeature] : [])].join('; ')
  const format = houseFeatures.find(feature => /двухмодульный формат/i.test(feature))

  return [
    { label: 'Конструкция', value: number >= 25 && number <= 27 ? pending : modelConstruction(model.id) },
    ...(format ? [{ label: 'Формат', value: format }] : []),
    { label: 'Помещения', value: confirmedLayout || (model.floorPlan ? 'Состав помещений — по планировке модели' : pending) },
    { label: 'Утепление', value: 'Утепление уточняется по спецификации конкретной модели дома' },
    ...[
      'Основание',
      'Пароизоляция и ветровлагозащита',
      'Наружная отделка',
      'Кровля',
      'Внутренняя отделка',
      'Печное решение',
      'Окна и двери',
      'Электрика',
      'Освещение',
      'Мебель',
      'Входные ступени',
    ].map(label => ({ label, value: `${pending}. Проверяется по спецификации этой модели.` })),
  ]
}

function barnPremiumConfiguration(model: Sauna): ModelConfigurationRow[] {
  const feature = (pattern: RegExp, fallback: string) => model.features.find(item => pattern.test(item)) ?? fallback
  return [
    { label: 'Конструкция', value: modelConstruction(model.id) },
    { label: 'Печное решение', value: feature(/печь/i, pending) },
    { label: 'Душевая и бойлер', value: feature(/душев|бойлер/i, pending) },
    { label: 'Электрика и сантехника', value: feature(/электрик|сантехник/i, pending) },
    { label: 'Утепление', value: feature(/утеплен/i, 'Пол и потолок — минеральная вата 100 мм; подтверждено владельцем для моделей каталога') },
    { label: 'Обработка парной', value: feature(/масло/i, pending) },
  ]
}

export function modelBaseConfiguration(model: Sauna | Home): ModelConfigurationRow[] {
  if (!('series' in model)) return homeConfiguration(model)

  const number = Number(model.id.replace('bg-', ''))
  if (number === 28) return barnPremiumConfiguration(model)

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
  const stove = number <= 8
    ? 'Печь-каменка «Ермак» с дымоходом — актуальная базовая комплектация'
    : knownStove
      ? `${knownStove.replace(/,?\s*(бак[^,]*,?\s*)?и?\s*камни\b/gi, '').replace(/,\s*$/, '')}; точное исполнение — по спецификации модели`
      : 'Печное решение согласуется при заказе'

  return [
    { label: 'Конструкция', value: modelConstruction(model.id) },
    { label: 'Основание', value: 'Обвязочный брус, лаги, черновой и чистовой пол' },
    { label: 'Пароизоляция и ветровлагозащита', value: 'Защитные мембраны согласно технологии строительства' },
    { label: 'Утепление', value: 'Стены, пол и потолок — минеральная вата 100 мм (ISOVER, URSA или аналог), согласно утверждённой базовой комплектации мобильных бань' },
    { label: 'Пол', value: 'Черновой и чистовой деревянный пол; проливное исполнение — дополнительная опция, если не предусмотрено проектом' },
    { label: 'Наружная отделка', value: 'Имитация бруса из натуральной древесины; индивидуальные варианты согласуются отдельно' },
    { label: 'Кровля', value: 'Односкатная крыша, профлист; индивидуальное исполнение — по проекту модели' },
    { label: 'Помещения', value: `${rooms}${hasPlan && bathroom ? '; санузел по планировке' : ''}${hasPlan && terrace ? '; терраса / крыльцо' : ''}` },
    { label: 'Внутренняя отделка', value: 'Комната отдыха и моечная — хвойная вагонка; парная — осина класса А (при наличии соответствующих помещений)' },
    { label: 'Парная', value: 'Осиновая вагонка класса А и осиновые полки; форма и размер по планировке' },
    { label: 'Печное решение', value: stove },
    { label: 'Подарки к печи', value: 'Бак для воды и камни для печи — в подарок; исполнение по модели' },
    { label: 'Окна и двери', value: hasPlan ? 'Стандартные белые, согласно планировке выбранной модели' : 'Стандартные белые; размеры и расположение согласуются в планировке' },
    { label: 'Электрика', value: 'Открытая проводка, стандартные выключатели и розетка; скрытая проводка — дополнительная опция' },
    { label: 'Освещение', value: 'Светильники в комнате отдыха и моечной (при наличии); в парной — два специальных банных светильника по краям, без абажуров' },
    { label: 'Мебель', value: number <= 8 ? 'Стол и две лавки — в подарок' : 'Состав мебели согласуется при заказе' },
    { label: 'Входные ступени', value: 'В подарок' },
  ]
}
