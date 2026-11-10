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

/** Compact human-readable labels keep every selected service identifiable within the legacy comment limit. */
export function managerOptionName(option: { id: string; name: string }, compact = false) {
  if (!compact) return option.name
  const labels: Record<string, string> = {
    delivery: 'Доставка', 'crane-unload': 'Разгрузка краном',
    'external-light': 'Скрытая электрика / подсветка крыши',
    'wall-point': 'Доп. розетка',
    'facade-ral': 'Окраска фасада RAL', 'ceiling-height': 'Высота потолка',
    'wooden-window-600': 'Дерев. окно 60×60', 'wooden-window-400': 'Дерев. окно 40×40',
    boiler: 'Бойлер 50 л', shower: 'Тропич. душ', bucket: 'Обливное устр.', floor: 'Проливной пол', wc: 'Санузел', guard: 'Огражд. печи', ermak: 'Ермак 12 ПС',
    shade: 'Абажур', led: 'Лента за спинкой', 'bench-light': '2 плафона', furniture: 'Доп. мебель',
    'window-grid': 'Шпросы', decor: 'Декор. решётки', lamination: 'Ламинация', drain: 'Доп. слив', roof: 'Кровля', tray: 'Поддон+шторка',
    'outdoor-lighting': 'Уличный свет', 'larch-wash': 'Пол листв./мойка', replanning: 'Перепланировка',
    'outdoor-lamp': 'Наружный свет.', 'roof-overhang-light': 'Свет в свесе', 'hidden-wiring': 'Скрыт. электрика',
    'floating-bench': 'Парящий полок', 'aspen-bench': 'Скамья осина 1м', 'stove-fireproof-boards': 'Защита плитами', 'wash-tap': 'Кран в мойку',
    'panoramic-window-600-1800': 'Окно 60×180', 'ermak-base': 'Ермак 12 (база)', 'ermak-16-ps': 'Ермак 16 ПС',
    'ermak-16-premium-steel': 'Ермак16Пр сталь', 'ermak-16-premium-cast-iron': 'Ермак16Пр чугун',
    'steam-floor-oil': 'Масло пол/парн.', 'steam-bench-oil': 'Масло полки', 'steam-lining-oil': 'Масло вагонка', 'lounge-floor-varnish': 'Лак пол/КО',
  }
  return labels[option.id] || option.name
}
