'use client'
import { DeliveryFields } from './DeliveryFields'
import { isLogisticsOption, resolveOptionPrice, type DeliveryDistrict } from '@/lib/logistics'
import { useRef, useState } from 'react'
import Image from 'next/image'
import { optionGuidance } from '@/data/option-guidance'
import { baseEquipmentRows } from '@/data/equipment'
import { optionCategories } from '@/data/options'
import { enabledEquipmentOptions, equipmentSelection, optionCountLabel, optionQuantityLimit, normalizeOptionQuantity, optionQuantityLabel, optionSelectionGroup, toggleEquipmentOption } from '@/lib/equipment-selection'
import { CTAFormInline } from '@/components/forms/CTAFormInline'
import { InteriorExecutionGallery } from './InteriorExecutionGallery'
import { trackGoal } from '@/lib/analytics'
import { withBasePath } from '@/lib/site-path'
import styles from './EquipmentConfigurator.module.css'
import { ConfigurationCategoryTitle, ConfigurationOption } from './ConfigurationOption'

const popular = ['lamination', 'ermak', 'shower', 'boiler', 'led'].map(id => enabledEquipmentOptions.find(option => option.id === id)!)
const categories = optionCategories.filter(category => enabledEquipmentOptions.some(option => option.category === category))
function price(option: typeof enabledEquipmentOptions[number]) { return option.salePrice === null ? 'Стоимость по согласованию' : `+${option.salePrice.toLocaleString('ru-RU')} ₽ / ${option.priceUnit}` }

function optionHelp(option: typeof enabledEquipmentOptions[number]) {
  const guidance = optionGuidance[option.id]
  if (!guidance) return null
  return <details className={styles.help}>
    <summary aria-label={`Как это устроено: ${option.name}`}>Как это устроено <span aria-hidden="true">↗</span></summary>
    <div className={styles.helpBody}>
      <figure><Image src={withBasePath(guidance.image)} alt={option.id === 'boiler' ? 'Бойлер 50 л в интерьере бани — фото из каталога' : `Условная схема: ${option.name}`} width={450} height={option.id === 'boiler' ? 316 : 220} sizes="(max-width: 760px) 100vw, 380px" /><figcaption>{guidance.caption}</figcaption></figure>
      <div><h4>{option.name}</h4><p>{guidance.explanation}</p><p className={styles.price}>{price(option)}</p><p className={styles.helpNote}>{guidance.notes}</p></div>
    </div>
  </details>
}
export function EquipmentConfigurator() {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [quantities, setQuantities] = useState<Record<string, number>>({})
  const [deliveryDistrict, setDeliveryDistrict] = useState<DeliveryDistrict>('unknown')
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [opened, setOpened] = useState<string[]>([])
  const formRef = useRef<HTMLDivElement>(null)
  const selection = equipmentSelection(selectedIds, quantities, { deliveryDistrict, deliveryAddress })
  const { selected, knownTotal, unpricedCount, comment } = selection
  const selectedOptionIds = new Set(selected.map(option => option.id))
  const toggle = (id: string) => {
    setSelectedIds(previous => toggleEquipmentOption(previous, id))
    trackGoal('configure_option')
  }
  function setQuantity(id: string, value: number) {
    const option = enabledEquipmentOptions.find(item => item.id === id)
    if (!option) return
    const quantity = normalizeOptionQuantity(option, value)
    if (quantity === 0) setSelectedIds(previous => previous.filter(item => item !== id))
    setQuantities(previous => ({ ...previous, [id]: quantity || 1 }))
  }
  function resetSelection() {
    setSelectedIds([])
    setQuantities({})
    setDeliveryDistrict('unknown')
    setDeliveryAddress('')
    trackGoal('configure_reset')
  }
  function calculate() {
    trackGoal('configure_request')
    formRef.current?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' })
    formRef.current?.querySelector<HTMLElement>('[data-release-profile="visual-contacts"]')?.focus({ preventScroll: true })
  }
  return <div className={styles.page}>
    <div className={styles.shell}>
      <section className={styles.intro}><p className={styles.eyebrow}>Комплектация / База и ваши дополнения</p><h1>Базовая комплектация</h1><p className={styles.lead}>Комплектация определяется выбранной моделью и исполнением. Дополнительные опции — под ваши пожелания.</p><nav className={styles.sectionNav} aria-label="Разделы комплектации"><a className={styles.jump} href="#equipment-base-title">Что входит</a><a className={styles.jump} href="#equipment-options">Все опции <span aria-hidden="true">↓</span></a><a className={styles.jump} href="#equipment-popular-title">Популярные дополнения</a></nav></section>
      <section className={styles.base} aria-labelledby="equipment-base-title"><p className={styles.eyebrow}>01 / База</p><h2 id="equipment-base-title">Что уже входит в базовую комплектацию</h2><p className={styles.included}>Входит в стоимость выбранной модели в её утверждённом исполнении.</p><p className={styles.note}>Состав зависит от выбранной модели и её планировки. Подтверждённые особенности указаны в карточке модели; остальные параметры согласуются при заказе.</p><table className={styles.baseTable}><caption className="sr-only">Базовая комплектация</caption><tbody>{baseEquipmentRows.map(row => <tr key={row.label}><th scope="row">{row.label}</th><td>{row.value}</td></tr>)}</tbody></table></section>
      <InteriorExecutionGallery />
    </div>
    <section className={styles.extras} id="equipment-options" aria-labelledby="equipment-options-title"><div className={styles.inner}><p className={styles.eyebrow}>02 / Все дополнительные опции</p><h2 id="equipment-options-title">Сделайте баню под себя</h2><p className={styles.lead}>Добавьте только то, что действительно нужно — от окон и отделки до печи, душевой и инженерии.</p><p className={styles.note}>Текущие продажные цены. Окончательная совместимость и состав работ согласуются при заказе. Откройте категорию и отметьте нужные дополнения.</p>
      <div className={styles.config}><div className={styles.accordion}>{categories.map((category, index) => {
        const group = enabledEquipmentOptions.filter(option => option.category === category), expanded = opened.includes(category), id = `equipment-category-${index}`
        return <section key={category} className={styles.category}><h3><button type="button" className={styles.categoryButton} aria-expanded={expanded} aria-controls={id} onClick={() => setOpened(previous => expanded ? previous.filter(value => value !== category) : [...previous, category])}><ConfigurationCategoryTitle name={category} count={optionCountLabel(group.length)} /></button></h3><div id={id} hidden={!expanded} className={styles.categoryBody}>{category === 'Логистика' && <DeliveryFields id="equipment" district={deliveryDistrict} address={deliveryAddress} onDistrict={setDeliveryDistrict} onAddress={setDeliveryAddress} />}{group.map(option => <ConfigurationOption key={option.id} option={isLogisticsOption(option.id) ? { ...option, salePrice: resolveOptionPrice(option, deliveryDistrict) } : option} checked={selectedOptionIds.has(option.id)} onToggle={() => toggle(option.id)} inputId={`equipment-option-${option.id}`} groupName={optionSelectionGroup(option.id) ? "equipment-stove" : undefined} price={isLogisticsOption(option.id) && resolveOptionPrice(option, deliveryDistrict) === null ? 'Индивидуальный расчёт' : price(option)}>
            {optionQuantityLimit(option) > 1 && selectedOptionIds.has(option.id) && <label className="mt-3 flex flex-wrap items-center gap-2 text-sm" htmlFor={option.id === 'ceiling-height' ? 'equipment-ceiling-steps' : `equipment-quantity-${option.id}`}>
              <span>{option.id === 'ceiling-height' ? 'Шаги увеличения по 10 см:' : 'Количество, шт.:'}</span>
              <input id={option.id === 'ceiling-height' ? 'equipment-ceiling-steps' : `equipment-quantity-${option.id}`} type="number" className="input-glass w-20 rounded-lg px-2 py-2" min={1} max={optionQuantityLimit(option)} step={1} value={quantities[option.id] || 1} onChange={e => setQuantity(option.id, Number(e.target.value))} />
            </label>}
          </ConfigurationOption>)}</div></section>
      })}</div>
      <aside className={styles.summary} aria-label="Выбранные дополнительные опции"><p className={styles.eyebrow}>Ваши пожелания</p><div key={selected.map(option => option.id).join("|") || "empty"} role="status" aria-live="polite" aria-atomic="true" translate="no" data-selected-count={selected.length} data-additional-total={knownTotal}><h3>{`Выбрано: ${optionCountLabel(selected.length)}`}</h3><p className={styles.sumLabel}>Оборудование: +{selection.equipmentSubtotal.toLocaleString('ru-RU')} ₽</p><p className={styles.sumLabel}>Логистика: +{selection.logisticsSubtotal.toLocaleString('ru-RU')} ₽</p><p className={styles.sumLabel}>Итого подтверждённых дополнений:</p><p className={styles.sum}>{`+${knownTotal.toLocaleString('ru-RU')} ₽`}</p>{unpricedCount > 0 && <p className={styles.note}>Предварительная сумма без {optionCountLabel(unpricedCount)} индивидуального расчёта, включая неподтверждённые логистические расходы.</p>}</div>{selected.length > 0 && <ul className={styles.selectedList} aria-label="Выбранные опции">{selected.map(option => <li key={option.id}><span>{option.name}{optionQuantityLabel(option)}</span><strong>{option.salePrice === null ? 'Индивидуальный расчёт' : `+${(option.salePrice * option.quantity).toLocaleString('ru-RU')} ₽`}</strong></li>)}</ul>}<p className={styles.note}>Сумма только выбранных дополнительных опций. Основная цена модели не меняется.</p><p className={styles.note}>Финальная стоимость зависит от выбранной модели и совместимости опций.</p><button type="button" className={styles.calculate} onClick={calculate}>Получить расчёт с выбранными опциями</button><button className={styles.clear} type="button" onClick={resetSelection}>Сбросить выбор</button></aside></div>
    </div></section>
    <section className={styles.popular} aria-labelledby="equipment-popular-title"><div className={styles.inner}><p className={styles.eyebrow}>03 / Можно добавить</p><h2 id="equipment-popular-title">Популярные дополнения</h2><p className={styles.lead}>Несколько возможностей для индивидуального исполнения.</p><div className={styles.popularGrid}>{popular.map(option => <article key={option.id}>{optionGuidance[option.id] && <figure className={styles.popularVisual}><Image src={withBasePath(optionGuidance[option.id].image)} alt={option.id === 'boiler' ? 'Бойлер 50 л — фото из каталога' : `Схема: ${option.name}`} width={450} height={option.id === 'boiler' ? 316 : 220} sizes="(max-width: 760px) 100vw, 220px" /><figcaption>{option.id === 'boiler' ? 'Фото из каталога' : 'Схема опции'}</figcaption></figure>}<p className={styles.eyebrow}>{option.category}</p><h3>{option.name}</h3><p className={styles.description}>{option.description}</p><span className={styles.price}>{price(option)}</span><button className={styles.add} type="button" aria-pressed={selectedOptionIds.has(option.id)} onClick={() => toggle(option.id)} aria-label={`${selectedOptionIds.has(option.id) ? 'Убрать' : 'Добавить'}: ${option.name}`}>{selectedOptionIds.has(option.id) ? 'Добавлено' : 'Добавить'} <span aria-hidden="true">{selectedOptionIds.has(option.id) ? '✓' : '+'}</span></button>{optionHelp(option)}</article>)}</div></div></section>
    <div className={styles.shell}><section className={styles.cta}><div><p className={styles.eyebrow}>Следующий шаг</p><h2>Нужна комплектация<br />под ваши задачи?</h2><p className={styles.note}>Поможем подобрать опции и рассчитать итоговую стоимость.</p></div><button type="button" className={styles.calculate} onClick={calculate}>Получить расчёт с выбранными опциями</button></section><div ref={formRef} id="equipment-request" className={styles.form}><CTAFormInline configurationNote={comment} equipmentSelection={{ selectedIds: selection.selected.map(option => option.id), quantities, deliveryDistrict, deliveryAddress }} /></div></div>
  </div>
}
