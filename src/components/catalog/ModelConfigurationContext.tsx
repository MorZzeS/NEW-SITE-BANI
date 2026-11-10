'use client'
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { DeliveryDistrict } from '@/lib/logistics'
import type { Home, Sauna } from '@/types'
import { calculateModelConfiguration, type ModelConfigurationCalculation } from '@/lib/model-configuration-selection'
import { modelOptionAvailability } from '@/lib/model-option-availability'
import { enabledEquipmentOptions, normalizeOptionQuantity, optionQuantityLimit, toggleEquipmentOption } from '@/lib/equipment-selection'

type ConfigurationContext = {
  configuration: ModelConfigurationCalculation
  selectedIds: string[]
  promotionalDiscount: boolean
  toggleOption: (id: string) => void
  setOptionQuantity: (id: string, quantity: number) => void
  setDeliveryDistrict: (district: DeliveryDistrict) => void
  setDeliveryAddress: (address: string) => void
  resetSelection: () => void
}
const Context = createContext<ConfigurationContext | null>(null)

/** URL-driven state only: the owner-approved 15 000 ₽ offer is shown only for baths opened from the promo. */
function promotionFromLocation() {
  if (typeof window === 'undefined') return false
  try { return new URLSearchParams(window.location.search).get('source') === 'exit-intent' } catch { return false }
}

export function ModelConfigurationProvider({ model, children, optionsEnabled = true }: { model: Sauna | Home; children: ReactNode; optionsEnabled?: boolean }) {
  const [selection, setSelection] = useState<{ modelId: string; ids: string[]; quantities: Record<string, number> }>({ modelId: model.id, ids: [], quantities: {} })
  const [delivery, setDelivery] = useState<{ modelId: string; district: DeliveryDistrict; address: string }>({ modelId: model.id, district: 'unknown', address: '' })
  const [promotionalDiscount, setPromotionalDiscount] = useState(false)
  const [restoredModelId, setRestoredModelId] = useState<string | null>(null)
  const allowed = new Set(optionsEnabled ? modelOptionAvailability(model).filter(row => (row.status === 'available' || row.status === 'unknown')).map(row => row.option.id) : [])
  useEffect(() => { setPromotionalDiscount(promotionFromLocation()) }, [model.id])
  useEffect(() => {
    if (!optionsEnabled) return
    try {
      const saved = JSON.parse(window.localStorage.getItem(`banger:model-configuration:v1:${model.id}`) || 'null')
      if (saved && Array.isArray(saved.ids)) {
        const quantities = saved.quantities && typeof saved.quantities === 'object' ? saved.quantities : {}
        const restored = calculateModelConfiguration(model, saved.ids.filter((id: unknown): id is string => typeof id === 'string'), { quantities, deliveryDistrict: saved.district })
        setSelection({ modelId: model.id, ids: restored.selectedOptionIds, quantities: Object.fromEntries(restored.options.map(option => [option.id, option.quantity])) })
        setDelivery({ modelId: model.id, district: restored.deliveryDistrict, address: '' })
      }
    } catch { /* Storage may be unavailable or contain an obsolete value. */ }
    setRestoredModelId(model.id)
  }, [model, optionsEnabled])
  const configuration = calculateModelConfiguration(model, optionsEnabled && selection.modelId === model.id ? selection.ids : [], { promotionalDiscount, deliveryDistrict: optionsEnabled && delivery.modelId === model.id ? delivery.district : 'unknown', deliveryAddress: optionsEnabled && delivery.modelId === model.id ? delivery.address : '', quantities: optionsEnabled && selection.modelId === model.id ? selection.quantities : {} })
  useEffect(() => {
    if (!optionsEnabled || restoredModelId !== model.id) return
    try {
      window.localStorage.setItem(`banger:model-configuration:v1:${model.id}`, JSON.stringify({ ids: configuration.selectedOptionIds, quantities: Object.fromEntries(configuration.options.map(option => [option.id, option.quantity])), district: configuration.deliveryDistrict }))
    } catch { /* Selection remains usable when browser storage is blocked. */ }
  }, [model.id, optionsEnabled, restoredModelId, selection, delivery])
  function toggleOption(id: string) {
    if (!allowed.has(id)) return
    setSelection(current => {
      const ids = current.modelId === model.id ? current.ids : []
      const quantities = current.modelId === model.id ? current.quantities : {}
      const nextIds = toggleEquipmentOption(ids, id)
      const next = calculateModelConfiguration(model, nextIds, { promotionalDiscount, quantities, deliveryDistrict: delivery.district, deliveryAddress: delivery.address })
      return { modelId: model.id, ids: next.selectedOptionIds, quantities }
    })
  }
  function setOptionQuantity(id: string, quantity: number) {
    const option = enabledEquipmentOptions.find(item => item.id === id)
    if (!allowed.has(id) || !option || optionQuantityLimit(option) === 1) return
    const steps = normalizeOptionQuantity(option, quantity)
    setSelection(current => {
      const ids = current.modelId === model.id ? current.ids : []
      return { modelId: model.id, ids: steps === 0 ? ids.filter(value => value !== id) : ids, quantities: { ...(current.modelId === model.id ? current.quantities : {}), [id]: steps || 1 } }
    })
  }
  return <Context.Provider value={{ configuration, selectedIds: configuration.selectedOptionIds, promotionalDiscount, toggleOption, setOptionQuantity,
    setDeliveryDistrict: district => setDelivery(current => ({ modelId: model.id, address: current.modelId === model.id ? current.address : '', district })),
    setDeliveryAddress: address => setDelivery(current => ({ modelId: model.id, district: current.modelId === model.id ? current.district : 'unknown', address })),
    resetSelection: () => { setSelection({ modelId: model.id, ids: [], quantities: {} }); setDelivery({ modelId: model.id, district: 'unknown', address: '' }) } }}>{children}</Context.Provider>
}

export function useModelConfiguration() {
  const context = useContext(Context)
  if (!context) throw new Error('ModelConfigurationProvider is required')
  return context
}
