'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import { Check } from 'lucide-react'
import { DownloadModelPdfButton } from './DownloadModelPdfButton'
import { formatPrice } from '@/data'
import { modelBaseConfiguration } from '@/data/model-configuration'
import { optionGuidance } from '@/data/option-guidance'
import { optionCategories } from '@/data/options'
import type { Home, Sauna } from '@/types'
import { CTAFormInline } from '@/components/forms/CTAFormInline'
import { equipmentSelection, optionCountLabel } from '@/lib/equipment-selection'
import { modelOptionAvailability } from '@/lib/model-option-availability'
import { useModelConfiguration } from './ModelConfigurationContext'
import { ConfigurationCategoryTitle, ConfigurationOption } from './ConfigurationOption'
import styles from './ModelBaseConfiguration.module.css'

type Option = ReturnType<typeof modelOptionAvailability>[number]['option']

function optionPrice(option: Option) {
  return option.salePrice === null ? 'Стоимость по согласованию' : `+${formatPrice(option.salePrice)}${option.priceUnit === 'шт.' ? ' / 1 шт.' : option.id === 'ceiling-height' ? ' / 10 см' : ''}`
}

export function ModelBaseConfiguration({ model }: { model: Sauna | Home }) {
  const { configuration, selectedIds, toggleOption, setOptionQuantity, resetSelection, promotionalDiscount } = useModelConfiguration()
  const [pageUrl, setPageUrl] = useState('')
  const formRef = useRef<HTMLDivElement>(null)
  const availability = useMemo(() => modelOptionAvailability(model), [model])
  const available = useMemo(() => availability.filter(row => row.status === 'available'), [availability])
  const included = useMemo(() => availability.filter(row => row.status === 'included'), [availability])
  const unknown = useMemo(() => availability.filter(row => row.status === 'unknown'), [availability])
  const unavailable = useMemo(() => availability.filter(row => row.status === 'unavailable'), [availability])
  const selection = equipmentSelection(selectedIds)
  const { selected } = selection
  const knownTotal = configuration.optionsSubtotal
  const unpricedCount = configuration.unpricedCount
  const selectedIdsSet = new Set(selected.map(option => option.id))
  const { discount, discountLabel, total } = configuration
  const baseRows = modelBaseConfiguration(model)
  const basePriceText = formatPrice(model.priceFrom)
  const totalText = formatPrice(total)
  const configurationNote = useMemo(() => {
    const lines = [
      `Модель: ${model.name}${model.article ? ` (${model.article})` : ''}`,
      `Базовая комплектация: ${basePriceText}`,
      selected.length ? 'Выбранные дополнения:' : 'Дополнительные опции не выбраны.',
      ...selected.map(option => {
        const quantity = configuration.options.find(item => item.id === option.id)?.quantity ?? 1
        return `• ${option.name}${option.id === 'ceiling-height' ? ` (+${quantity * 10} см)` : ''} — ${option.salePrice === null ? 'стоимость по согласованию' : `+${formatPrice(option.salePrice * quantity)}`}`
      }),
      `Стоимость дополнений: +${formatPrice(knownTotal)}`,
      ...(discount ? [`${discountLabel} (акция): −${formatPrice(discount)}`] : []),
      `Стоимость выбранной комплектации: ${totalText}${unpricedCount ? `; не включена стоимость ${optionCountLabel(unpricedCount)}` : ''}`,
      pageUrl ? `Страница модели: ${pageUrl}` : '',
      'Совместимость и итоговый состав работ подтверждаются перед оформлением.',
    ]
    return lines.filter(Boolean).join('\n')
  }, [basePriceText, discount, discountLabel, knownTotal, model.article, model.name, pageUrl, selected, totalText, unpricedCount, configuration.options])

  useEffect(() => {
    setPageUrl(`${window.location.origin}${window.location.pathname}`)
  }, [model.id])

  function goToContacts() {
    formRef.current?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' })
    formRef.current?.querySelector<HTMLElement>('input, [data-release-profile]')?.focus({ preventScroll: true })
  }

  function renderAvailableCategories() {
    const firstAvailableCategory = optionCategories.find(category => available.some(row => row.option.category === category))
    return optionCategories.map(category => {
      const items = available.filter(row => row.option.category === category)
      if (!items.length) return null
      return <details className={styles.optionCategory} key={category} open={category === firstAvailableCategory}>
        <summary><ConfigurationCategoryTitle name={category} count={optionCountLabel(items.length)} /></summary>
        <div className={styles.optionList}>
          {items.map(({ option, reason, status }) => <ConfigurationOption key={option.id} option={option} checked={selectedIdsSet.has(option.id)} onToggle={() => toggleOption(option.id)} inputId={`model-option-${model.id}-${option.id}`} price={optionPrice(option)} reason={reason} status={status}>
            {option.id === 'ceiling-height' && selectedIdsSet.has(option.id) && <label className="mt-3 flex flex-wrap items-center gap-3 text-sm text-cream/85" htmlFor={`ceiling-steps-${model.id}`}>
              <span>Увеличение высоты, шагов по 10 см:</span>
              <input id={`ceiling-steps-${model.id}`} type="number" min={1} max={20} step={1} className="input-glass w-20 rounded-lg px-2 py-2" value={configuration.options.find(item => item.id === 'ceiling-height')?.quantity ?? 1} onChange={event => setOptionQuantity('ceiling-height', Number(event.target.value))} />
              <strong>+{formatPrice(22000 * (configuration.options.find(item => item.id === 'ceiling-height')?.quantity ?? 1))}</strong>
            </label>}
          </ConfigurationOption>)}
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
            <summary><ConfigurationCategoryTitle name="Уже входит в базовую комплектацию" count={optionCountLabel(included.length)} /></summary>
            <p className={styles.statusNote}>Эти позиции уже предусмотрены моделью: повторно они не оплачиваются и в калькулятор не добавляются.</p>
            <ul className={styles.statusList}>{renderStatusRows(included, 'included')}</ul>
          </details>}

          {unknown.length > 0 && <details className={styles.statusSection} data-option-group="unknown">
            <summary><ConfigurationCategoryTitle name="Совместимость требует подтверждения" count={optionCountLabel(unknown.length)} /></summary>
            <p className={styles.statusNote}>Эти позиции не включаются в расчёт и не считаются гарантированно доступными: возможность и стоимость подтвердит менеджер при заказе.</p>
            <ul className={styles.statusList}>{renderStatusRows(unknown, 'unknown')}</ul>
          </details>}

          {unavailable.length > 0 && <details className={styles.statusSection} data-option-group="unavailable">
            <summary><ConfigurationCategoryTitle name="Недоступно для этой модели" count={optionCountLabel(unavailable.length)} /></summary>
            <ul className={styles.statusList}>{renderStatusRows(unavailable, 'unavailable')}</ul>
          </details>}
        </div>

        <aside className={styles.summary} aria-label={`Итог расчёта для модели ${model.name}`}>
          <p className={styles.eyebrow}>Предварительный расчёт</p>
          <h3>Ваша комплектация</h3>
          <p className={styles.modelName}>{model.name}</p>
          <dl className={styles.summaryRows}>
            <div><dt>Базовая комплектация</dt><dd>{basePriceText}</dd></div>
            <div><dt>Выбранные дополнения ({selected.length})</dt><dd>+{formatPrice(knownTotal)}</dd></div>
            <div data-discount-row={discount ? 'applied' : 'none'}><dt>{discount ? discountLabel : 'Скидка'}</dt><dd>{discount ? `−${formatPrice(discount)}` : 'не применена'}</dd></div>
          </dl>
          {selected.length > 0 && <ul className={styles.selectedList} aria-label="Выбранные опции">
            {selected.map(option => { const quantity = configuration.options.find(item => item.id === option.id)?.quantity ?? 1; return <li key={option.id}><span>{option.name}{option.id === 'ceiling-height' ? ` (+${quantity * 10} см)` : ''}</span><strong>{option.salePrice === null ? 'цена уточняется' : `+${formatPrice(option.salePrice * quantity)}`}</strong></li> })}
          </ul>}
          <div className={styles.total} role="status" aria-live="polite" aria-atomic="true" data-selected-count={selected.length} data-known-options-total={knownTotal} data-estimated-total={total} data-discount={discount} data-selected-option-ids={selected.map(option => option.id).join(',')}>
            <span>Стоимость выбранной комплектации{unpricedCount ? ' (без опций по согласованию)' : ''}</span>
            <strong>{totalText}</strong>
          </div>
          {unpricedCount > 0 && <p className={styles.unavailable}>Стоимость {optionCountLabel(unpricedCount)} уточняется и в сумму не включена.</p>}
          {discount > 0 && <p className={styles.availabilityNote}>Скидка 15 000 ₽ применена по действующей акции для бань; окончательные условия подтверждаются при оформлении.</p>}
          <p className={styles.summaryFine}>Базовая цена указана без стоимости доставки. Совместимость и окончательная цена подтверждаются при заказе.</p>
          <button type="button" className={styles.requestButton} data-calculator-request onClick={goToContacts}>Оставить заявку на эту комплектацию</button>
          <button type="button" className={styles.resetButton} data-calculator-reset onClick={resetSelection}>Сбросить выбор</button>
          <div className="mt-4"><DownloadModelPdfButton model={model} /></div>
        </aside>
      </div>
    </section>

    <div ref={formRef} id={`model-contacts-${model.id}`} className={styles.contacts}>
      <CTAFormInline modelName={model.name} configurationNote={configurationNote} configurationDetails={configuration} />
    </div>
  </section>
}
