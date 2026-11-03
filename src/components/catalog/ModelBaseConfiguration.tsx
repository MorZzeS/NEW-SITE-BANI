'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import { Building2, Check, CircleHelp, DoorOpen, Flame, Gift, House, Layers, Lightbulb, PlugZap, Ruler, ShieldCheck, Sofa } from 'lucide-react'
import { DownloadModelPdfButton } from './DownloadModelPdfButton'
import { formatPrice } from '@/data'
import { modelBaseConfiguration } from '@/data/model-configuration'
import { optionCategories } from '@/data/options'
import type { Home, Sauna } from '@/types'
import { CTAFormInline } from '@/components/forms/CTAFormInline'
import { configurationManagerText } from '@/lib/model-configuration-selection'
import { isLogisticsOption, resolveOptionPrice } from '@/lib/logistics'
import { DeliveryFields } from './DeliveryFields'
import { equipmentSelection, optionCountLabel } from '@/lib/equipment-selection'
import { modelOptionAvailability } from '@/lib/model-option-availability'
import { useModelConfiguration } from './ModelConfigurationContext'
import { ConfigurationCategoryTitle, ConfigurationOption } from './ConfigurationOption'
import styles from './ModelBaseConfiguration.module.css'
import { withBasePath } from '@/lib/site-path'

type Option = ReturnType<typeof modelOptionAvailability>[number]['option']

const baseRowGroups = [
  { id: 'structure', title: 'Основание и конструкция', Icon: Building2 },
  { id: 'protection', title: 'Защита и утепление', Icon: ShieldCheck },
  { id: 'appearance', title: 'Наружная отделка и кровля', Icon: House },
  { id: 'windows', title: 'Окна и двери', Icon: DoorOpen },
  { id: 'layout', title: 'Помещения и планировка', Icon: Ruler },
  { id: 'interior', title: 'Внутренняя отделка', Icon: Layers },
  { id: 'engineering', title: 'Электрика и инженерные решения', Icon: PlugZap },
  { id: 'lighting', title: 'Освещение', Icon: Lightbulb },
  { id: 'stove', title: 'Печь', Icon: Flame },
  { id: 'furniture', title: 'Мебель', Icon: Sofa },
  { id: 'gifts', title: 'Подарки к комплектации', Icon: Gift },
  { id: 'other', title: 'Дополнительные сведения', Icon: Check },
] as const

const baseRowGroupByLabel: Record<string, string> = {
  'Конструкция': 'structure',
  'Основание': 'structure',
  'Пароизоляция и ветровлагозащита': 'protection',
  'Утепление': 'protection',
  'Пол': 'protection',
  'Наружная отделка': 'appearance',
  'Кровля': 'appearance',
  'Окна и двери': 'windows',
  'Помещения': 'layout',
  'Планировка и комплектация': 'layout',
  'Внутренняя отделка': 'interior',
  'Парная': 'interior',
  'Печное решение': 'stove',
  'Электрика': 'engineering',
  'Инженерные системы': 'engineering',
  'Освещение': 'lighting',
  'Подарки к печи': 'gifts',
  'Мебель': 'furniture',
  'Входные ступени': 'gifts',
}

const needsConfirmation = (value: string) => /согласу(?:ется|ются) при заказе|состав подтверждается при заказе|нет подтверждённой/i.test(value)
const isIncludedGift = (value: string) => /(?:^|[\s—])в подарок(?:$|[\s.,;—])/i.test(value)

function optionPrice(option: Option) {
  return option.salePrice === null ? 'Стоимость по согласованию' : `+${formatPrice(option.salePrice)}${option.priceUnit === 'шт.' ? ' / 1 шт.' : option.id === 'ceiling-height' ? ' / 10 см' : ''}`
}

export function ModelBaseConfiguration({ model }: { model: Sauna | Home }) {
  const { configuration, selectedIds, toggleOption, setOptionQuantity, resetSelection, promotionalDiscount, setDeliveryDistrict, setDeliveryAddress } = useModelConfiguration()
  const [pageUrl, setPageUrl] = useState('')
  const formRef = useRef<HTMLDivElement>(null)
  const availability = useMemo(() => modelOptionAvailability(model), [model])
  const available = useMemo(() => availability.filter(row => row.status === 'available' || row.status === 'unknown'), [availability])
  const included = useMemo(() => availability.filter(row => row.status === 'included'), [availability])
  const unknown = useMemo(() => availability.filter(row => row.status === 'unknown'), [availability])
  const unavailable = useMemo(() => availability.filter(row => row.status === 'unavailable'), [availability])
  const selection = equipmentSelection(selectedIds, Object.fromEntries(configuration.options.map(option => [option.id, option.quantity])), configuration)
  const { selected } = selection
  const knownTotal = configuration.optionsSubtotal
  const unpricedCount = configuration.unpricedCount
  const selectedIdsSet = new Set(selected.map(option => option.id))
  const { discount, discountLabel, total } = configuration
  const baseRows = modelBaseConfiguration(model)
  const includedBaseRows = baseRows.filter(row => !needsConfirmation(row.value))
  const pendingBaseRows = baseRows.filter(row => needsConfirmation(row.value))
  const basePriceText = formatPrice(model.priceFrom)
  const totalText = formatPrice(total)
  const configurationNote = [configurationManagerText(configuration), pageUrl ? `Страница модели: ${pageUrl}` : ''].filter(Boolean).join('\n')

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
        {category === 'Логистика' && <DeliveryFields id={`model-${model.id}`} district={configuration.deliveryDistrict} address={configuration.deliveryAddress} onDistrict={setDeliveryDistrict} onAddress={setDeliveryAddress} />}
        <div className={styles.optionList}>
          {items.map(({ option, reason, status }) => <ConfigurationOption key={option.id} option={isLogisticsOption(option.id) ? { ...option, salePrice: resolveOptionPrice(option, configuration.deliveryDistrict) } : option} checked={selectedIdsSet.has(option.id)} onToggle={() => toggleOption(option.id)} inputId={`model-option-${model.id}-${option.id}`} price={isLogisticsOption(option.id) && resolveOptionPrice(option, configuration.deliveryDistrict) === null ? 'Индивидуальный расчёт' : optionPrice(option)} reason={reason} status={status}>
            {option.id === 'ceiling-height' && selectedIdsSet.has(option.id) && <label className="mt-3 flex flex-wrap items-center gap-3 text-sm text-cream/85" htmlFor={`ceiling-steps-${model.id}`}>
              <span>Увеличение высоты, шагов по 10 см:</span>
              <input id={`ceiling-steps-${model.id}`} type="number" min={1} max={2} step={1} className="input-glass w-20 rounded-lg px-2 py-2" value={configuration.options.find(item => item.id === 'ceiling-height')?.quantity ?? 1} onChange={event => setOptionQuantity('ceiling-height', Number(event.target.value))} />
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
    <header className={styles.baseHeader}>
      <div>
        <p className={styles.eyebrow}>Комплектация модели {model.article ?? model.id}</p>
        <h2>Базовая комплектация</h2>
        <p className={styles.baseLead}>{pendingBaseRows.length ? 'Подтверждённые позиции входят в базовую стоимость. Параметры для согласования указаны отдельно ниже.' : 'Всё перечисленное входит в базовую стоимость модели.'}</p>
      </div>
      <span className={styles.includedBadge}><Check size={15} aria-hidden="true" /> {pendingBaseRows.length ? 'Подтверждённое — уже включено' : 'Уже включено в стоимость'}</span>
    </header>
    <div className={styles.baseGroups}>
      {baseRowGroups.map(({ id, title, Icon }) => {
        const rows = includedBaseRows.filter(row => (baseRowGroupByLabel[row.label] ?? 'other') === id)
        if (!rows.length) return null
        return <section className={styles.baseGroup} key={id} aria-label={title}>
          <h3><span aria-hidden="true"><Icon size={16} strokeWidth={1.8} /></span>{title}</h3>
          <dl className={styles.baseCards}>{rows.map(row => <div className={styles.baseCard} data-base-label={row.label} data-base-included="true" data-base-gift={isIncludedGift(row.value) ? 'true' : undefined} key={row.label}>
            <dt><span>{row.label}</span>{isIncludedGift(row.value) && <span className={styles.giftBadge}><Gift size={12} aria-hidden="true" /> В подарок</span>}</dt>
            <dd>{row.value}</dd>
          </div>)}</dl>
        </section>
      })}
      {pendingBaseRows.length > 0 && <section className={`${styles.baseGroup} ${styles.pendingGroup}`} aria-label="Параметры для согласования">
        <h3><span aria-hidden="true"><CircleHelp size={16} strokeWidth={1.8} /></span>Параметры для согласования</h3>
        <dl className={styles.baseCards}>{pendingBaseRows.map(row => <div className={styles.baseCard} data-base-label={row.label} data-base-included="false" key={row.label}>
          <dt><span>{row.label}</span><span className={styles.pendingBadge}>Уточнить</span></dt>
          <dd>{row.value}</dd>
        </div>)}</dl>
      </section>}
    </div>

    <section className={styles.calculator} data-model-option-calculator={model.id} data-base-price={model.priceFrom} data-discount={discount} data-promotion={promotionalDiscount ? 'exit-intent' : ''} data-available-count={available.length} data-included-count={included.length} data-unknown-count={unknown.length} aria-labelledby={`model-options-title-${model.id}`}>
      <div className={styles.calculatorGrid}>
        <aside className={styles.summary} aria-label={`Итог расчёта для модели ${model.name}`}>
          <div className={styles.modelVisual}>
            <Image src={withBasePath(model.image)} alt={model.name} fill sizes="(max-width: 900px) 100vw, 360px" priority />
            <span className={styles.visualLabel}>Выбранная модель</span>
          </div>
          <div className={styles.modelDetails}>
            <p className={styles.eyebrow}>{model.article ?? 'Ваша модель'}</p>
            <h3>{model.name}</h3>
            <p className={styles.modelSize}>{model.size}{model.area ? <> <span aria-hidden="true">·</span> {model.area} м²</> : null}</p>
            <p className={styles.modelDescription}>{model.description}</p>
          </div>
          <div className={styles.priceBreakdown}>
            <p className={styles.eyebrow}>Предварительный расчёт</p>
            <dl className={styles.summaryRows}>
              <div><dt>Базовая комплектация</dt><dd>{basePriceText}</dd></div>
              <div><dt>Дополнительное оборудование</dt><dd>+{formatPrice(configuration.equipmentSubtotal)}</dd></div>
              <div><dt>Логистические услуги</dt><dd>+{formatPrice(configuration.logisticsSubtotal)}</dd></div>
              <div data-discount-row={discount ? 'applied' : 'none'}><dt>{discount ? discountLabel : 'Скидка'}</dt><dd>{discount ? `−${formatPrice(discount)}` : 'не применена'}</dd></div>
            </dl>
            <details className={styles.selectedDetails} open>
              <summary>Выбранные дополнения <span>{optionCountLabel(selected.length)}</span></summary>
              {selected.length > 0 ? <ul className={styles.selectedList} aria-label="Выбранные опции">
                {selected.map(option => {
                  const quantity = configuration.options.find(item => item.id === option.id)?.quantity ?? 1
                  return <li key={option.id}>
                    <span>{option.name}{option.id === 'ceiling-height' ? ` (+${quantity * 10} см)` : quantity > 1 ? ` · ${quantity} шт.` : ''}</span>
                    <strong>{option.salePrice === null ? 'По согласованию' : `+${formatPrice(option.salePrice * quantity)}`}</strong>
                  </li>
                })}
              </ul> : <p className={styles.emptySelection}>Пока без дополнений. Выберите подходящие опции справа — они появятся здесь.</p>}
            </details>
            <div className={styles.total} role="status" aria-live="polite" aria-atomic="true" data-selected-count={selected.length} data-known-options-total={knownTotal} data-estimated-total={total} data-discount={discount} data-selected-option-ids={selected.map(option => option.id).join(',')}>
              <span>Итого подтверждённых позиций{unpricedCount ? ' (без опций по согласованию)' : ''}</span>
              <strong key={total}>{totalText}</strong>
            </div>
            {unpricedCount > 0 && <p className={styles.unavailable}>Предварительная сумма без {optionCountLabel(unpricedCount)} индивидуального расчёта, включая неподтверждённые логистические расходы.</p>}
            {discount > 0 && <p className={styles.availabilityNote}>Скидка 15 000 ₽ применена по действующей акции для бань; окончательные условия подтверждаются при оформлении.</p>}
            <p className={styles.summaryFine}>Базовая цена указана без стоимости доставки. Совместимость и окончательная цена подтверждаются при заказе.</p>
            <button type="button" className={styles.requestButton} data-calculator-request onClick={goToContacts}>Оставить заявку на эту комплектацию</button>
            <button type="button" className={styles.resetButton} data-calculator-reset onClick={resetSelection}>Сбросить выбор</button>
            <div className="mt-4"><DownloadModelPdfButton model={model} /></div>
          </div>
        </aside>

        <div className={styles.optionGroups}>
          <header className={styles.calculatorIntro}>
            <p className={styles.eyebrow}>Расчёт для {model.article ?? model.id}</p>
            <h2 id={`model-options-title-${model.id}`}>{'series' in model ? 'Дополните свою баню' : 'Дополните свой дом'}</h2>
            <p>Отметьте доступные дополнения для модели «{model.name}». Калькулятор использует опубликованные цены каталога и не меняет базовую стоимость.</p>
            <p className={styles.compatibility} id={`model-options-matrix-${model.id}`}>Расчёт предварительный. Применимость дополнений, размеры проёмов и состав работ подтверждает менеджер для выбранной модели. Уже включённые позиции повторно не оплачиваются.</p>
          </header>

          <div role="group" aria-label={`Доступные дополнительные опции для модели ${model.name}`} className={styles.availableGroup}>
            {renderAvailableCategories()}
          </div>

          {included.length > 0 && <details className={styles.statusSection} data-option-group="included">
            <summary><ConfigurationCategoryTitle name="Уже входит в базовую комплектацию" count={optionCountLabel(included.length)} /></summary>
            <p className={styles.statusNote}>Эти позиции уже предусмотрены моделью: повторно они не оплачиваются и в калькулятор не добавляются.</p>
            <ul className={styles.statusList}>{renderStatusRows(included, 'included')}</ul>
          </details>}

          {unavailable.length > 0 && <details className={styles.statusSection} data-option-group="unavailable">
            <summary><ConfigurationCategoryTitle name="Недоступно для этой модели" count={optionCountLabel(unavailable.length)} /></summary>
            <ul className={styles.statusList}>{renderStatusRows(unavailable, 'unavailable')}</ul>
          </details>}
        </div>

      </div>
      <div className={styles.mobileAction}>
        <span><small>Итого</small><strong>{totalText}</strong></span>
        <button type="button" onClick={goToContacts}>Оставить заявку</button>
      </div>
    </section>

    <div ref={formRef} id={`model-contacts-${model.id}`} className={styles.contacts}>
      <CTAFormInline modelName={model.name} configurationNote={configurationNote} configurationDetails={configuration} />
    </div>
  </section>
}
