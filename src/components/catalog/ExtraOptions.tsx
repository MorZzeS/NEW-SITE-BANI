'use client'
import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { additionalOptions, optionCategories } from '@/data/options'

export function ExtraOptions() {
  const [open, setOpen] = useState<string | null>(null)
  const reducedMotion = useReducedMotion()
  return <div className="extra-options">
    {optionCategories.map((category, index) => {
      const options = additionalOptions.filter(option => option.enabled && option.category === category)
      if (!options.length) return null
      const expanded = open === category, id = `extra-options-${index}`
      return <div key={category} className="extra-options-group">
        <h3><button type="button" aria-expanded={expanded} aria-controls={id} onClick={() => setOpen(expanded ? null : category)}>{category}<ChevronDown size={18} className={expanded ? 'rotate-180' : ''} /></button></h3>
        <AnimatePresence initial={false}>{expanded && <motion.div id={id} initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: reducedMotion ? 0 : .2 }} className="overflow-hidden">
          <div className="extra-options-content">{options.map(option => <div key={option.id} className="extra-option-row">
            <div className="flex flex-wrap items-baseline justify-between gap-x-5 gap-y-1"><h4 className="font-semibold">{option.name}</h4><p className="text-sm text-gold-400 font-semibold">{option.salePrice === null ? 'Стоимость по согласованию' : `+${option.salePrice.toLocaleString('ru-RU')} ₽ / ${option.priceUnit}`}</p></div>
            <p className="text-sm text-cream/65 mt-2">{option.description}</p>
            {option.image && <figure className="mt-3"><img src={option.image} alt="Бойлер 50 литров на нашей фотографии" width={960} height={675} loading="lazy" className="w-48 max-w-full rounded-lg" /><figcaption className="text-xs text-cream/60 mt-2">Пример оборудования. Исполнение согласуется при заказе.</figcaption></figure>}
          </div>)}</div>
        </motion.div>}</AnimatePresence>
      </div>
    })}
  </div>
}
