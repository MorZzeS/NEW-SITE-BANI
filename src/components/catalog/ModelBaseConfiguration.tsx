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
import { equipmentSelection, optionCountLabel } from '@/lib/equipment-selection'
import { modelOptionAvailability } from '@/lib/model-option-availability'
import { useModelConfiguration } from './ModelConfigurationContext'
import { withBasePath } from '@/lib/site-path'
import styles from './ModelBaseConfiguration.module.css'

type Option = ReturnType<typeof modelOptionAvailability>[number]['option']

function optionPrice(option: Option) {
  return option.salePrice === null ? 'Стоимость по согласованию' : `+${formatPrice(option.salePrice)}${option.priceUnit === 'шт.' ? ' / 1 шт.' : ''}`
}

export function ModelBaseConfiguration({ model }: { model: Sauna | Home }) {
  const { configuration, selectedIds, toggleOption, resetSelection, promotionalDiscount } = useModelConfiguration()
  const [pageUrl, setPageUrl] = useState('')
  const formRef = useRef<HTMLDivElement>(null)
  const availability = useMemo(() => modelOptionAvailability(model), [model])
  const available = useMemo(() => availability.filter(row => row.status === 'available'), [availability])
  const included = useMemo(() => availability.filter(row => row.status === 'included'), [availability])
  const unknown = useMemo(() => availability.filter(row => row.status === 'unknown'), [availability])
  const unavailable = useMemo(() => availability.filter(row => row.status === 'unavailable'), [availability])
  const selection = equipmentSelection(selectedIds)
  const { selected, knownTotal, unpricedCount } = selection
  const selectedIdsSet = new Set(selected.map(option => option.id))
  const { discount, discountLabel, total } = configuration
  const baseRows = modelBaseConfiguration(model)
  const basePriceText = model.id === 'bg-28' ? formatPrice(model.priceFrom) : `от ${formatPrice(model.priceFrom)}`
  const totalText = `${model.id === 'bg-28' ? '' : 'от '}${formatPrice(total)}`
  const configurationNote = useMemo(() => {
    const lines = [
      `Модель: ${model.name}${model.article ? ` (${model.article})` : ''}`,
      `Базовая стоимость: ${basePriceText}`,
      selected.length ? 'Выбранные дополнения:' : 'Дополнительные опции не выбраны.',
      ...selected.map(option => `• ${option.name} — ${option.salePrice === null ? 'стоимость по согласованию' : `+${formatPrice(option.salePrice)}${option.priceUnit === 'шт.' ? ' / 1 шт.' : ''}`}`),
      `Стоимость дополнений: +${formatPrice(knownTotal)}`,
      ...(discount ? [`${discountLabel} (акция): −${formatPrice(discount)}`] : []),
      `Предварительный итог: ${totalText}${unpricedCount ? `; не включена стоимость ${optionCountLabel(unpricedCount)}` : ''}`,
      pageUrl ? `Страница модели: ${pageUrl}` : '',
      'Совместимость и итоговый состав работ подтверждаются перед оформлением.',
    ]
    return lines.filter(Boolean).join('\n')
  }, [basePriceText, discount, discountLabel, knownTotal, model.article, model.name, pageUrl, selected, totalText, unpricedCount])

  useEffect(() => {
    setPageUrl(`${window.location.origin}${window.location.pathname}`)
  }, [model.id])

  function goToContacts() {
    formRef.current?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' })
    formRef.current?.querySelector<HTMLElement>('input, [data-release-profile]')?.focus({ preventScroll: true })
  }

  function renderAvailableCategories() {
    return optionCategories.map((category, index) => {
      const items = available.filter(row => row.option.category === category)
      if (!items.length) return null
      return <details className={styles.optionCategory} key={category} open={index === 0}>
        <summary><span>{category}</span><span className={styles.categoryCount}>{optionCountLabel(items.length)}</span></summary>
        <div className={styles.optionList}>
          {items.map(({ option, reason, status }) => {
            const guidance = optionGuidance[option.id]
            const selectedOption = selectedIdsSet.has(option.id)
            const statusId = `model-option-status-${model.id}-${option.id}`
            const nameId = `model-option-name-${model.id}-${option.id}`
            return <article className={styles.optionItem} data-option-id={option.id} data-option-price={option.salePrice ?? ''} data-option-selectable="true" data-option-status={status} key={option.id}>
              <div className={styles.optionMain}>
                <label className={styles.optionToggle} htmlFor={`model-option-${model.id}-${option.id}`}>
                  <input id={`model-option-${model.id}-${option.id}`} type="checkbox" checked={selectedOption} onChange={() => toggleOption(option.id)} aria-labelledby={nameId} aria-describedby={statusId} />
                  <span className={styles.checkVisual} aria-hidden="true">{selectedOption ? '✓' : '+'}</span>
                </label>
                {guidance && <figure className={styles.optionImage}>
                  <Image src={withBasePath(guidance.image)} alt={option.id === 'boiler' ? 'Бойлер 50 л — фотография из материалов каталога' : `Иллюстративная схема: ${option.name}`} width={360} height={270} sizes="(max-width: 760px) 78px, 104px" loading="lazy" />
                  <figcaption>{option.id === 'boiler' ? 'Фото' : 'Схема'}</figcaption>
                </figure>}
                <div className={styles.optionInfo}>
                  <h3 id={nameId}><label htmlFor={`model-option-${model.id}-${option.id}`}>{option.name}</label></h3>
                  <p className={styles.optionPrice}>{optionPrice(option)}</p>
                  <p>{guidance?.explanation ?? option.description}</p>
                  {guidance?.notes && <p className={styles.optionNote}>{guidance.notes}</p>}
                  <p id={statusId} className={styles.availabilityNote}>{reason}</p>
                </div>
              </div>
            </article>
          })}
        </div>
      </details>
    })
  }

  function renderStatusRows(rows: typeof availability, kind: 'included' | 'unknown' | 'unavailable') {
    return rows.map(({ option, reason, source, status }) => <li className={styles.statusRow} data-option-id={option.id} data-option-price={option.salePrice ?? ''} data-option-status={status} data-option-selectable="false" key={option.id}>
      <span className={styles.statusIcon} aria-hidden="true">{kind === 'included' ? '✓' : kind === 'unavailable' ? '×' : '!'}</span>
      <div className={styles.statusBody}>
        <p className={styles.statusName}>{option.name}{kind === 'included' ? ' — в базовой стоимости' : option.salePrice === null ? ' — цена по запросу' : ` — опубликованная цена ${formatPrice(option.salePrice)}${option.priceUnit === 'шт.' ? ' / 1 шт.' : ''}`}</p>
        <p className={styles.statusReason}>{reason}</p>
        <p className={styles.statusSource}>{source}</p>
      </div>
    </li>)
  }

  return <section className={`${styles.configuration} mb-16`} data-model-config={model.id} aria-label="Базовая комплектация и калькулятор опций">
    <h2 className="text-2xl font-bold text-cream mb-3">Базовая комплектация</h2>
    <p className="text-sm text-cream/60 mb-5">Для {model.article ?? model.id}. Дополнительные опции рассчитываются отдельно. Неподтверждённые параметры согласуются при заказе.</p>
    <dl className={styles.rows}>{baseRows.map(row => <div className={styles.row} key={row.label}>
      <dt><span className={styles.tick} aria-hidden="true"><Check size={15} strokeWidth={2.5} /></span>{row.label}</dt>
      <dd>{row.value}</dd>
    </div>)}</dl>

    <section className={styles.calculator} data-model-option-calculator={model.id} data-base-price={model.priceFrom} data-discount={discount} data-promotion={promotionalDiscount ? 'exit-intent' : ''} data-available-count={available.length} data-included-count={included.length} data-unknown-count={unknown.length} aria-labelledby={`model-options-title-${model.id}`}>
      <div className={styles.calculatorGrid}>
        <div className={styles.optionGroups}>
          <header className={styles.calculatorIntro}>
            <p className={styles.eyebrow}>Расчёт для {model.article ?? model.id}</p>
            <h2 id={`model-options-title-${model.id}`}>{'series' in model ? 'Дополните свою баню' : 'Дополните свой дом'}</h2>
            <p>Отметьте доступные дополнения для модели «{model.name}». Калькулятор использует опубликованные цены каталога и не меняет базовую стоимость.</p>
            <p className={styles.compatibility} id={`model-options-matrix-${model.id}`}>Совместимость проверена по данным каталога: доступно {available.length}, уже входит в комплектацию {included.length}, требует согласования {unknown.length}{unavailable.length ? `, недоступно ${unavailable.length}` : ''}. Позиции с неподтверждённой совместимостью в расчёт не добавляются.</p>
          </header>

          <div role="group" aria-label={`Доступные дополнительные опции для модели ${model.name}`} className={styles.availableGroup}>
            {renderAvailableCategories()}
          </div>

          {included.length > 0 && <details className={styles.statusSection} data-option-group="included">
            <summary><span className={styles.statusTitle}>Уже входит в базовую комплектацию</span><span className={styles.categoryCount}>{optionCountLabel(included.length)}</span></summary>
            <p className={styles.statusNote}>Эти позиции уже предусмотрены моделью: повторно они не оплачиваются и в калькулятор не добавляются.</p>
            <ul className={styles.statusList}>{renderStatusRows(included, 'included')}</ul>
          </details>}

          {unknown.length > 0 && <details className={styles.statusSection} data-option-group="unknown">
            <summary><span className={styles.statusTitle}>Совместимость требует подтверждения</span><span className={styles.categoryCount}>{optionCountLabel(unknown.length)}</span></summary>
            <p className={styles.statusNote}>Эти позиции не включаются в расчёт и не считаются гарантированно доступными: возможность и стоимость подтвердит менеджер при заказе.</p>
            <ul className={styles.statusList}>{renderStatusRows(unknown, 'unknown')}</ul>
          </details>}

          {unavailable.length > 0 && <details className={styles.statusSection} data-option-group="unavailable">
            <summary><span className={styles.statusTitle}>Недоступно для этой модели</span><span className={styles.categoryCount}>{optionCountLabel(unavailable.length)}</span></summary>
            <ul className={styles.statusList}>{renderStatusRows(unavailable, 'unavailable')}</ul>
          </details>}
        </div>

        <aside className={styles.summary} aria-label={`Итог расчёта для модели ${model.name}`}>
          <p className={styles.eyebrow}>Предварительный расчёт</p>
          <h3>Ваша комплектация</h3>
          <p className={styles.modelName}>{model.name}</p>
          <dl className={styles.summaryRows}>
            <div><dt>Базовая стоимость модели</dt><dd>{basePriceText}</dd></div>
            <div><dt>Выбранные дополнения ({selected.length})</dt><dd>+{formatPrice(knownTotal)}</dd></div>
            <div data-discount-row={discount ? 'applied' : 'none'}><dt>{discount ? discountLabel : 'Скидка'}</dt><dd>{discount ? `−${formatPrice(discount)}` : 'не применена'}</dd></div>
          </dl>
          {selected.length > 0 && <ul className={styles.selectedList} aria-label="Выбранные опции">
            {selected.map(option => <li key={option.id}><span>{option.name}</span><strong>{option.salePrice === null ? 'цена уточняется' : `+${formatPrice(option.salePrice)}`}</strong></li>)}
          </ul>}
          <div className={styles.total} role="status" aria-live="polite" aria-atomic="true" data-selected-count={selected.length} data-known-options-total={knownTotal} data-estimated-total={total} data-discount={discount} data-selected-option-ids={selected.map(option => option.id).join(',')}>
            <span>Итого{unpricedCount ? ' без опций по согласованию' : ''}</span>
            <strong>{totalText}</strong>
          </div>
          {unpricedCount > 0 && <p className={styles.unavailable}>Стоимость {optionCountLabel(unpricedCount)} уточняется и в сумму не включена.</p>}
          {discount > 0 && <p className={styles.availabilityNote}>Скидка 15 000 ₽ применена по действующей акции для бань; окончательные условия подтверждаются при оформлении.</p>}
          <p className={styles.summaryFine}>Базовая цена указана без стоимости доставки. Совместимость и окончательная цена подтверждаются при заказе.</p>
          <button type="button" className={styles.requestButton} data-calculator-request onClick={goToContacts}>Оставить заявку на эту комплектацию</button>
          <button type="button" className={styles.resetButton} data-calculator-reset onClick={resetSelection}>Сбросить выбор</button>
        </aside>
      </div>
    </section>

    <div ref={formRef} id={`model-contacts-${model.id}`} className={styles.contacts}>
      <CTAFormInline modelName={model.name} configurationNote={configurationNote} configurationDetails={configuration} />
    </div>
  </section>
}
