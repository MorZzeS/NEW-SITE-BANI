import type { Home, Sauna } from '@/types'
import { modelOptionAvailability } from '@/lib/model-option-availability'
import { normalizeOptionIds, normalizeOptionQuantity, optionQuantityLabel } from '@/lib/equipment-selection'
import { deliveryDistrictLabel, managerOptionName, isLogisticsOption, normalizeDeliveryAddress, normalizeDeliveryDistrict, resolveOptionPrice, type DeliveryDistrict } from '@/lib/logistics'

export const PROMOTIONAL_DISCOUNT_RUB = 15_000
export type ModelConfigurationCalculation = {
  modelId: string; modelName: string; modelType: 'sauna' | 'home'; basePrice: number
  selectedOptionIds: string[]
  options: { id: string; name: string; price: number | null; quantity: number; kind: 'equipment' | 'logistics' }[]
  deliveryDistrict: DeliveryDistrict; deliveryAddress: string
  equipmentSubtotal: number; logisticsSubtotal: number; individualItems: string[]
  optionsSubtotal: number; discount: number; discountLabel: string; total: number; unpricedCount: number; currency: 'RUB'
}
type CalculationInput = { promotionalDiscount?: boolean; quantities?: Record<string, number>; deliveryDistrict?: DeliveryDistrict; deliveryAddress?: string }
export function calculateModelConfiguration(model: Sauna | Home, ids: readonly string[], input: CalculationInput = {}): ModelConfigurationCalculation {
  const unique = new Set(normalizeOptionIds(ids)), deliveryDistrict = normalizeDeliveryDistrict(input.deliveryDistrict)
  const options = modelOptionAvailability(model).filter(item => (item.status === 'available' || item.status === 'unknown') && unique.has(item.option.id) && normalizeOptionQuantity(item.option, input.quantities?.[item.option.id]) > 0).map(({ option }) => ({
    id: option.id, name: option.name, price: resolveOptionPrice(option, deliveryDistrict), kind: isLogisticsOption(option.id) ? 'logistics' as const : 'equipment' as const,
    quantity: normalizeOptionQuantity(option, input.quantities?.[option.id]),
  }))
  const subtotal = (kind?: string) => options.filter(option => !kind || option.kind === kind).reduce((sum, option) => sum + (option.price ?? 0) * option.quantity, 0)
  const optionsSubtotal = subtotal(), isBath = 'series' in model
  const discount = input.promotionalDiscount && isBath ? Math.min(PROMOTIONAL_DISCOUNT_RUB, model.priceFrom + optionsSubtotal) : 0
  return { modelId: model.id, modelName: model.name, modelType: isBath ? 'sauna' : 'home', basePrice: model.priceFrom,
    selectedOptionIds: options.map(option => option.id), options, deliveryDistrict, deliveryAddress: normalizeDeliveryAddress(input.deliveryAddress),
    equipmentSubtotal: subtotal('equipment'), logisticsSubtotal: subtotal('logistics'), individualItems: options.filter(option => option.price === null).map(option => option.id),
    optionsSubtotal, discount, discountLabel: discount ? 'Скидка по акции' : '', total: model.priceFrom + optionsSubtotal - discount, unpricedCount: options.filter(option => option.price === null).length, currency: 'RUB' }
}
const money = (value: number) => value.toLocaleString('ru-RU') + ' ₽'
export const MANAGER_COMMENT_LIMIT = 1500
export function configurationManagerText(configuration: ModelConfigurationCalculation, compact = false) {
  return [
    'Комплектация: ' + configuration.modelName + ' [' + configuration.modelId + ']',
    'Базовая стоимость: ' + money(configuration.basePrice),
    ...(compact && configuration.options.length ? ['Дополнения, ₽:'] : []),
    ...(configuration.options.length ? configuration.options.map(option => (compact ? '' : '+ ') + managerOptionName(option, compact) + optionQuantityLabel(option, compact) + ' — ' + (option.price === null ? (compact ? 'согл.' : 'Стоимость по согласованию') : (compact ? (option.price * option.quantity).toLocaleString('ru-RU') : money(option.price * option.quantity)))) : ['Дополнительные опции не выбраны.']),
    'Оборудование: ' + money(configuration.equipmentSubtotal), 'Логистика: ' + money(configuration.logisticsSubtotal),
    ...(configuration.options.some(option => option.kind === 'logistics') || configuration.deliveryAddress || configuration.deliveryDistrict !== 'unknown' ? ['Район: ' + deliveryDistrictLabel(configuration.deliveryDistrict), ...(configuration.deliveryAddress ? ['Адрес: ' + configuration.deliveryAddress] : [])] : []),
    ...(configuration.discount ? [configuration.discountLabel + ': −' + money(configuration.discount)] : []),
    'Итого: ' + money(configuration.total),
    compact ? 'Предварительно; согласуемые позиции не включены.' : configuration.unpricedCount ? 'Предварительная сумма без позиций индивидуального расчёта, включая неподтверждённую логистику.' : 'Предварительный расчёт: совместимость и окончательная стоимость подтверждаются при заказе.',
  ].join('\n')
}
/** The bounded legacy comment must never silently lose a selected item, district or total. */
export function mergeManagerComment(userComment: string, configurationText: string, limit = MANAGER_COMMENT_LIMIT) {
  const result = [userComment, configurationText].filter(Boolean).join('\n\n')
  if (result.length > limit) throw new Error('Сводка комплектации и комментарий превышают 1500 символов. Сократите комментарий или передайте полную комплектацию менеджеру отдельным сообщением.')
  return result
}
