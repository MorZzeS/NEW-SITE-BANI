'use client'

import Image from 'next/image'
import { Armchair, Check, ChevronDown, Droplets, Flame, House, Layers, Palette, Puzzle, ShieldCheck, Truck, Waves, PanelsTopLeft, Zap } from 'lucide-react'
import type { ReactNode } from 'react'
import { optionGuidance } from '@/data/option-guidance'
import { additionalOptions } from '@/data/options'
import { withBasePath } from '@/lib/site-path'
import styles from './ConfigurationOption.module.css'

export function ConfigurationCategoryTitle({ name, count }: { name: string; count: string }) {
  const Icon = ({ 'Общее по бане': Layers, 'Внешний вид': Palette, 'Комната отдыха': Armchair, 'Моечная': Droplets, 'Парная': Waves, 'Печь и безопасность': Flame, 'Электрика и освещение': Zap, 'Окна и двери': PanelsTopLeft, 'Кровля': House, 'Логистика': Truck, 'Уже входит в базовую комплектацию': Puzzle } as Record<string, typeof Layers>)[name] ?? ShieldCheck
  return <><Icon className={styles.categoryIcon} size={22} aria-hidden="true" /><span className={styles.categoryName}>{name}</span><span className={styles.count}>{count}</span><ChevronDown className={styles.chevron} size={19} aria-hidden="true" /></>
}

export function ConfigurationOption({ option, checked, onToggle, inputId, price, reason, status = 'available', children }: {
  option: Omit<typeof additionalOptions[number], 'salePrice'> & { salePrice: number | null }; checked: boolean; onToggle: () => void; inputId: string; price: string; reason?: string; status?: string; children?: ReactNode
}) {
  const guidance = optionGuidance[option.id]
  return <article className={styles.option} data-selected={checked} data-option-id={option.id} data-option-price={option.salePrice ?? ''} data-option-selectable="true" data-option-status={status}>
    <label className={styles.main} htmlFor={inputId}>
      <span className={styles.toggle}><input id={inputId} type="checkbox" checked={checked} onChange={onToggle} aria-labelledby={`${inputId}-name`} aria-describedby={reason ? `${inputId}-reason` : undefined} /><span className={styles.check} aria-hidden="true">{checked && <Check size={16} strokeWidth={3} />}</span></span>
      <span className={styles.visual}>{guidance && <><Image src={withBasePath(guidance.image)} alt={option.id === 'boiler' ? 'Бойлер 50 л — фото из каталога' : `Иллюстративная схема: ${option.name}`} width={104} height={78} sizes="(max-width: 540px) 76px, 104px" /><small>{option.id === 'boiler' ? 'Фото' : 'Схема'}</small></>}</span>
      <strong className={styles.name} id={`${inputId}-name`}>{option.name}</strong>
      <span className={styles.price}>{price}</span>
      <span className={styles.description}>{guidance?.explanation ?? option.description}{option.priceUnit === 'шт.' && <span className={styles.unit}>В расчёте один элемент: 1 шт.</span>}</span>
    </label>
    {(reason || guidance?.notes) && <p className={styles.note} id={`${inputId}-reason`}>{guidance?.notes}{reason && <span>{reason}</span>}</p>}
    {children}
  </article>
}
