/** District is chosen manually; neither IP nor the free-text address assigns a tariff. */
export type DeliveryDistrict = 'unknown' | 'ramenskoe' | 'outside'
export function normalizeDeliveryDistrict(value: unknown): DeliveryDistrict {
  return value === 'ramenskoe' || value === 'outside' ? value : 'unknown'
}
export function isLogisticsOption(id: string) { return id === 'delivery' || id === 'crane-unload' }
export function resolveOptionPrice(option: { id: string; salePrice: number | null }, district: DeliveryDistrict = 'unknown') {
  return isLogisticsOption(option.id) && district !== 'ramenskoe' ? null : option.salePrice
}
export function deliveryDistrictLabel(district: DeliveryDistrict) {
  return district === 'ramenskoe' ? 'Раменский район' : district === 'outside' ? 'За пределами Раменского района' : 'Район не указан'
}
export function normalizeDeliveryAddress(value: string | undefined) {
  return (value || '').replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, 300)
}

/** Compact human-readable labels for the bounded legacy manager comment; each ID remains explicit. */
export function managerOptionName(option: { id: string; name: string }, compact = false) {
  if (!compact) return option.name
  const labels: Record<string, string> = {
    delivery: 'Доставка', 'crane-unload': 'Разгрузка краном',
    'external-light': 'Скрытая электрика / подсветка крыши',
    tray: 'Поддон, шторка и вывод воды', furniture: 'Доп. заводская мебель',
    'wall-point': 'Доп. точка / элемент в стене',
    'facade-ral': 'Окраска фасада RAL', 'ceiling-height': 'Высота потолка',
    'wooden-window-600': 'Деревянное окно 600×600 мм', 'wooden-window-400': 'Деревянное окно 400×400 мм',
  }
  return labels[option.id] || option.name
}
