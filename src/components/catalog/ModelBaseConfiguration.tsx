'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import { Check } from 'lucide-react'
import { formatPrice } from '@/data'
import { modelBaseConfiguration } from '@/data/model-configuration'
import { optionGuidance } from '@/data/option-guidance'
import { optionCategories } from '@/data/options'
import type { Home, Sauna } from '@/types'
import { CTAFormInline } from '@/components/forms/CTAFormInline'
import { enabledEquipmentOptions, equipmentSelection, optionCountLabel } from '@/lib/equipment-selection'
import { modelOptionAvailability } from '@/lib/model-option-availability'
import { useModelConfiguration } from './ModelConfigurationContext'
import { withBasePath } from '@/lib/site-path'
import styles from './ModelBaseConfiguration.module.css'

function optionPrice(option: typeof enabledEquipmentOptions[number]) {
  return option.salePrice === null ? 'Стоимость по согласованию' : `+${formatPrice(option.salePrice)}${option.priceUnit === 'шт.' ? ' / 1 шт.' : ''}`
}

export function ModelBaseConfiguration({ model }: { model: Sauna | Home }) {
  const { configuration, selectedIds, toggleOption, resetSelection } = useModelConfiguration()
  const [pageUrl, setPageUrl] = useState('')
  const formRef = useRef<HTMLDivElement>(null)
  const availability = useMemo(() => modelOptionAvailability(model), [model])
  const allowedIds = useMemo(() => new Set(availability.filter(item => !item.blockedReason).map(item => item.option.id)), [availability])
  const selection = equipmentSelection(selectedIds.filter(id => allowedIds.has(id)))
  const { selected, knownTotal, unpricedCount } = selection
  const selectedIdsSet = new Set(selected.map(option => option.id))
  const total = configuration.total
  const baseRows = modelBaseConfiguration(model)
  const basePriceText = model.id === 'bg-28' ? formatPrice(model.priceFrom) : `от ${formatPrice(model.priceFrom)}`
  const configurationNote = useMemo(() => {
    const lines = [
      `Базовая стоимость модели: ${basePriceText}`,
      'Выбранные дополнения:',
      ...(selected.length ? selected.map(option => `• ${option.name} — ${option.salePrice === null ? 'стоимость по согласованию' : `+${formatPrice(option.salePrice)}${option.priceUnit === 'шт.' ? ' / 1 шт.' : ''}`}`) : ['• не выбраны']),
      `Сумма дополнений с подтверждённой ценой: +${formatPrice(knownTotal)}`,
      `${unpricedCount ? 'Предварительный итог без опций по согласованию' : 'Предварительный итог'}: ${model.id === 'bg-28' && !unpricedCount ? '' : 'от '}${formatPrice(total)}${unpricedCount ? `; не включена стоимость ${unpricedCount} опции` : ''}`,
      pageUrl ? `Страница модели: ${pageUrl}` : '',
      'Совместимость и итоговый состав работ подтверждаются перед оформлением.',
    ].filter(Boolean)
    return lines.join('\n')
  }, [basePriceText, knownTotal, model.id, pageUrl, selected, total, unpricedCount])

  useEffect(() => {
    setPageUrl(`${window.location.origin}${window.location.pathname}`)
  }, [model.id])

  function goToContacts() {
    formRef.current?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' })
    formRef.current?.querySelector<HTMLElement>('input, [data-release-profile="visual-contacts"]')?.focus({ preventScroll: true })
  }

  return <section className={`${styles.configuration} mb-16`} data-model-config={model.id} aria-label="Базовая комплектация и калькулятор опций">
    <h2 className="text-2xl font-bold text-cream mb-3">Базовая комплектация</h2>
    <p className="text-sm text-cream/60 mb-5">Для {model.article}. Дополнительные опции рассчитываются отдельно. Неподтверждённые параметры согласуются при заказе.</p>
    <dl className={styles.rows}>{baseRows.map(row => <div className={styles.row} key={row.label}>
      <dt><span className={styles.tick} aria-hidden="true"><Check size={15} strokeWidth={2.5} /></span>{row.label}</dt>
      <dd>{row.value}</dd>
    </div>)}</dl>

    <section className={styles.calculator} data-model-option-calculator={model.id} data-base-price={model.priceFrom} aria-labelledby={`model-options-title-${model.id}`}>
      <div className={styles.calculatorGrid}>
        <div className={styles.optionGroups}>
      <header className={styles.calculatorIntro}>
        <p className={styles.eyebrow}>Расчёт для {model.article}</p>
        <h2 id={`model-options-title-${model.id}`}>{'series' in model ? 'Дополните свою баню' : 'Дополните свой дом'}</h2>
        <p>Отметьте дополнения для модели «{model.name}». Калькулятор использует опубликованные цены каталога и не меняет базовую стоимость.</p>
        <p className={styles.compatibility}>Доступные опции можно включить в расчёт. Позиции «Требует согласования» пока не добавляются: уточните их у менеджера. Включённое в базу повторно не оплачивается.</p>
      </header>

        <div role="group" aria-label={`Дополнительные опции для модели ${model.name}`}>
          {optionCategories.map((category, index) => {
            const items = availability.filter(item => item.option.category === category)
            if (!items.length) return null
            return <details className={styles.optionCategory} key={category} open={index === 0}>
              <summary><span>{category}</span><span className={styles.categoryCount}>{optionCountLabel(items.length)}</span></summary>
              <div className={styles.optionList}>
                {items.map(({ option, blockedReason, status, reason }) => {
                  const guidance = optionGuidance[option.id]
                  const selectedOption = selectedIdsSet.has(option.id)
                  const statusId = `model-option-status-${model.id}-${option.id}`
                  const nameId = `model-option-name-${model.id}-${option.id}`
                  return <article className={styles.optionItem} data-option-id={option.id} data-option-selectable={status === 'available'} data-option-status={status} key={option.id}>
                    <div className={styles.optionMain}>
                      <label className={styles.optionToggle} htmlFor={`model-option-${model.id}-${option.id}`}>
                        <input id={`model-option-${model.id}-${option.id}`} type="checkbox" checked={selectedOption} disabled={!!blockedReason} onChange={() => toggleOption(option.id)} aria-labelledby={nameId} aria-describedby={statusId} />
                        <span className={styles.checkVisual} aria-hidden="true">{selectedOption || status === 'included' ? '✓' : status === 'available' ? '+' : '—'}</span>
                      </label>
                      {guidance && <figure className={styles.optionImage}>
                        <Image src={withBasePath(guidance.image)} alt={option.id === 'boiler' ? 'Бойлер 50 л — фотография из материалов каталога' : `Иллюстративная схема: ${option.name}`} width={360} height={270} sizes="(max-width: 760px) 78px, 104px" loading="lazy" />
                        <figcaption>{option.id === 'boiler' ? 'Фото' : 'Схема'}</figcaption>
                      </figure>}
                      <div className={styles.optionInfo}>
                        <h3 id={nameId}><label htmlFor={`model-option-${model.id}-${option.id}`}>{option.name}</label></h3>
                        <p className={styles.optionPrice}>{status === 'included' ? 'В базовой стоимости' : optionPrice(option)}</p>
                        <p>{guidance?.explanation ?? option.description}</p>
                        {guidance?.notes && <p className={styles.optionNote}>{guidance.notes}</p>}
                        {blockedReason && <p id={statusId} className={styles.unavailable}>{blockedReason}</p>}
                        {!blockedReason && <p id={statusId} className={styles.availabilityNote}>{reason}</p>}
                      </div>
                    </div>
                  </article>
                })}
              </div>
            </details>
          })}
        </div>

        </div>
        <aside className={styles.summary} aria-label={`Итог расчёта для модели ${model.name}`}>
          <p className={styles.eyebrow}>Предварительный расчёт</p>
          <h3>Ваша комплектация</h3>
          <p className={styles.modelName}>{model.name}</p>
          <dl className={styles.summaryRows}>
            <div><dt>Стоимость модели</dt><dd>{basePriceText}</dd></div>
            <div><dt>Выбранные дополнения</dt><dd>+{formatPrice(knownTotal)}</dd></div>
          </dl>
          {selected.length > 0 && <ul className={styles.selectedList} aria-label="Выбранные опции">
            {selected.map(option => <li key={option.id}><span>{option.name}</span><strong>{option.salePrice === null ? 'цена уточняется' : `+${formatPrice(option.salePrice)}`}</strong></li>)}
          </ul>}
          <div className={styles.total} role="status" aria-live="polite" aria-atomic="true" data-selected-count={selected.length} data-known-options-total={knownTotal} data-estimated-total={total} data-selected-option-ids={selected.map(option => option.id).join(',')}>
            <span>Итого{unpricedCount ? ' без опций по согласованию' : ''}</span>
            <strong>{`от ${formatPrice(total)}`}</strong>
          </div>
          {unpricedCount > 0 && <p className={styles.unavailable}>Стоимость {unpricedCount} выбранной опции уточняется и в сумму не включена.</p>}
          <p className={styles.summaryFine}>Базовая цена указана без стоимости доставки. Совместимость и окончательная цена подтверждаются при заказе.</p>
          <button type="button" className={styles.requestButton} onClick={goToContacts}>Оставить заявку на эту комплектацию</button>
          <button type="button" className={styles.resetButton} onClick={resetSelection}>Сбросить дополнения</button>
        </aside>
      </div>
    </section>

    <div ref={formRef} id={`model-contacts-${model.id}`} className={styles.contacts}>
      <CTAFormInline modelName={model.name} configurationNote={configurationNote} configurationDetails={configuration} />
    </div>
  </section>
}
