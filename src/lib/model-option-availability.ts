import type { Home, Sauna } from '@/types'
import { modelBaseConfiguration, requiresBaseConfigurationConfirmation } from '@/data/model-configuration'
import { enabledEquipmentOptions } from '@/lib/equipment-selection'

export type ModelOptionStatus = 'available' | 'included' | 'unavailable' | 'unknown'
export type ModelOptionEvidence = { status: ModelOptionStatus; reason: string; source: string }

type ConfirmedFeature = { pattern: RegExp; feature: string }

/**
 * Confirmed catalogue features that already include a paid option in the model.
 * Only the published model feature list (extracted from the owner's catalogue slides into
 * `src/data/index.ts`) is used. A price is never treated as compatibility evidence.
 */
export const includedOptionFeatures: Readonly<Record<string, ConfirmedFeature>> = {
  boiler: { pattern: /бойлер\s*50\s*л/i, feature: 'Бойлер 50 л' },
  shower: { pattern: /тропический душ/i, feature: 'Тропический душ' },
  bucket: { pattern: /обливное устройство/i, feature: 'Обливное устройство' },
  floor: { pattern: /проливной пол/i, feature: 'Проливной пол' },
  wc: { pattern: /санузел/i, feature: 'Санузел' },
  guard: { pattern: /ограждение печи/i, feature: 'Ограждение печи' },
  ermak: { pattern: /печь ермак 12/i, feature: 'Печь Ермак 12' },
  shade: { pattern: /абажур/i, feature: 'Абажур в парную' },
  'window-grid': { pattern: /шпросы/i, feature: 'Шпросы' },
  decor: { pattern: /декоративн[а-яё]*\s+ре[йш]/i, feature: 'Декоративные рейки' },
  lamination: { pattern: /ламинация/i, feature: 'Ламинация окон и двери' },
  roof: { pattern: /профлист в цвете/i, feature: 'Профлист в цвете' },
  'external-light': { pattern: /скрытая электрика/i, feature: 'Скрытая электрика' },
}

type Zone = 'steam' | 'wash' | 'bathroom' | 'lounge' | 'stove' | 'windows' | 'electrics' | 'building'
type Requirement = { zone: Zone; label: string }

/**
 * Installable options require a structural zone that is confirmed by the published base
 * configuration of the model. Compatibility of a specific execution is still confirmed at order.
 */
const optionRequirements: Readonly<Record<string, Requirement>> = {
  tray: { zone: 'wash', label: 'подтверждённая моечная / душевая зона' },
  boiler: { zone: 'wash', label: 'подтверждённая моечная / душевая зона' },
  shower: { zone: 'wash', label: 'подтверждённая моечная / душевая зона' },
  bucket: { zone: 'wash', label: 'подтверждённая моечная / душевая зона' },
  floor: { zone: 'wash', label: 'подтверждённая моечная / душевая зона' },
  drain: { zone: 'wash', label: 'подтверждённая моечная / душевая зона' },
  wc: { zone: 'bathroom', label: 'санузел в подтверждённой планировке' },
  shade: { zone: 'steam', label: 'парная' },
  'bench-light': { zone: 'steam', label: 'парная с полками' },
  guard: { zone: 'stove', label: 'печь в базовой комплектации' },
  furniture: { zone: 'lounge', label: 'комната отдыха' },
  led: { zone: 'electrics', label: 'базовое освещение' },
  'external-light': { zone: 'electrics', label: 'базовая электрика' },
  'wall-point': { zone: 'electrics', label: 'базовая электрика' },
  'outdoor-lighting': { zone: 'electrics', label: 'базовая электрика' },
  'facade-ral': { zone: 'building', label: 'подтверждённая внешняя отделка модели' },
  'ceiling-height': { zone: 'building', label: 'конструкция модели' },
  'larch-wash': { zone: 'wash', label: 'моечная зона' },
  'window-grid': { zone: 'windows', label: 'окна и двери по проекту модели' },
  lamination: { zone: 'windows', label: 'окна и двери по проекту модели' },
  decor: { zone: 'building', label: 'подтверждённая внешняя отделка модели' },
  roof: { zone: 'building', label: 'подтверждённая кровля модели' },
}

/** Options whose compatibility is a replacement or an unconfirmed engineering decision. */
const replacementOptions: Readonly<Record<string, string>> = {
  ermak: 'Замена базовой печи на Ермак 12 ПС не подтверждена каталогом: совместимость, состав замены и цена требуют согласования.',
  'wooden-window-600': 'Установка деревянного окна 600 × 600 мм не подтверждена планировкой: размер проёма и возможность замены требуют согласования.',
  'wooden-window-400': 'Установка деревянного окна 400 × 400 мм не подтверждена планировкой: размер проёма и возможность замены требуют согласования.',
}

export const availabilitySources = Object.freeze({
  feature: 'Каталог BANGER.SU — опубликованные особенности модели',
  base: 'Базовая комплектация модели — src/data/model-configuration.ts (планировки каталога)',
  options: 'Каталог BANGER.SU, слайд «Дополнительные возможности»',
  noPlan: 'Каталог BANGER.SU: «Планировка и комплектация согласуются при заказе»',
  unconfirmed: 'Опубликованный перечень опций: цена и совместимость не подтверждены',
})

function confirmedZones(model: Sauna | Home) {
  const rows = modelBaseConfiguration(model)
  const value = (label: string) => rows.find(row => row.label === label)?.value ?? ''
  const confirmed = (label: string) => {
    const result = value(label)
    return result && !requiresBaseConfigurationConfirmation(result) ? result : ''
  }
  const rooms = confirmed('Помещения')
  const plan = Boolean(model.floorPlan)
  return {
    plan,
    steam: plan && /парная/i.test(rooms),
    wash: plan && /моечн|душев/i.test(rooms),
    bathroom: plan && /санузел/i.test(rooms),
    lounge: plan && /комната отдыха/i.test(rooms),
    stove: plan && /печь/i.test(confirmed('Печное решение')),
    windows: plan && Boolean(confirmed('Окна и двери')),
    electrics: plan && Boolean(confirmed('Электрика')) && Boolean(confirmed('Освещение')),
    building: plan,
  } satisfies Record<Zone | 'plan', boolean>
}

function includedEvidence(model: Sauna | Home) {
  const features = model.features.join(' | ')
  return (optionId: string) => {
    const confirmed = includedOptionFeatures[optionId]
    return confirmed && confirmed.pattern.test(features) ? confirmed : undefined
  }
}

export type ModelOptionRow = {
  option: typeof enabledEquipmentOptions[number]
  status: ModelOptionStatus
  reason: string
  source: string
  /** Kept for the existing calculator/checker contract: defined for every non-available row. */
  blockedReason: string | undefined
}

/**
 * Honest per-model compatibility matrix:
 * - `included`  — the paid option is already part of the model per published catalogue features;
 * - `available` — the option is installable because its structural zone is confirmed in the base configuration;
 * - `unknown`   — no confirmed planning/compatibility (never offered as guaranteed);
 * - `unavailable` — reserved for confirmed incompatibility; no such row exists in the current sources.
 */
export function modelOptionAvailability(model: Sauna | Home): ModelOptionRow[] {
  const zones = confirmedZones(model)
  const included = includedEvidence(model)
  return enabledEquipmentOptions.map(option => {
    const row = (status: ModelOptionStatus, reason: string, source: string): ModelOptionRow => ({
      option, status, reason, source, blockedReason: status === 'available' ? undefined : reason,
    })
    if (option.id === 'delivery' || option.id === 'crane-unload') return row('available', 'Самостоятельная логистическая услуга. Тариф зависит от района, выбранного вручную; адрес и условия работ согласуются при заказе.', availabilitySources.options)
    if (option.id === 'replanning') return 'hasShower' in model
      ? row('available', 'Изменение стандартной планировки бани. Дополнительные материалы и сложные конструктивные изменения рассчитываются отдельно.', 'Решение владельца от 09.11.2026')
      : row('unknown', 'Услуга утверждена для стандартной планировки бани; применимость к дому «Усадьба» не подтверждена.', availabilitySources.unconfirmed)
    const inBase = included(option.id)
    if (inBase) {
      return row('included', `Уже входит в базовую комплектацию модели: «${inBase.feature}». Повторно не оплачивается.`, availabilitySources.feature)
    }
    if (!zones.plan) {
      return row('unknown', 'Планировка и комплектация модели не подтверждены: совместимость опции требует согласования.', availabilitySources.noPlan)
    }
    const replacement = replacementOptions[option.id]
    if (replacement) return row('unknown', replacement, availabilitySources.unconfirmed)
    const requirement = optionRequirements[option.id]
    if (!requirement) return row('unknown', 'Совместимость с этой моделью не подтверждена: уточните у менеджера.', availabilitySources.unconfirmed)
    if (!zones[requirement.zone]) {
      return row('unknown', `Требует согласования: в подтверждённой комплектации модели не указана ${requirement.label}.`, availabilitySources.base)
    }
    return row('available', `Доступно для модели: ${requirement.label} подтверждена базовой комплектацией. Точное исполнение и состав работ согласуются при заказе.`, availabilitySources.base)
  })
}

export function modelOptionStatusCounts(model: Sauna | Home) {
  const rows = modelOptionAvailability(model)
  return {
    available: rows.filter(row => row.status === 'available').length,
    included: rows.filter(row => row.status === 'included').length,
    unavailable: rows.filter(row => row.status === 'unavailable').length,
    unknown: rows.filter(row => row.status === 'unknown').length,
  }
}
