'use client'
import { useRef, useState } from 'react'
import { baseEquipmentRows } from '@/data/equipment'
import { optionCategories } from '@/data/options'
import { enabledEquipmentOptions, equipmentSelection, optionCountLabel } from '@/lib/equipment-selection'
import { CTAFormInline } from '@/components/forms/CTAFormInline'
import styles from './EquipmentConfigurator.module.css'

const popular = ['lamination', 'ermak', 'shower', 'boiler', 'led'].map(id => enabledEquipmentOptions.find(option => option.id === id)!)
const categories = optionCategories.filter(category => enabledEquipmentOptions.some(option => option.category === category))
function price(option: typeof enabledEquipmentOptions[number]) { return option.salePrice === null ? 'Стоимость по согласованию' : `+${option.salePrice.toLocaleString('ru-RU')} ₽ / ${option.priceUnit}` }

export function EquipmentConfigurator() {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [opened, setOpened] = useState<string[]>(['Моечная'])
  const formRef = useRef<HTMLDivElement>(null)
  const { selected, knownTotal, unpricedCount, comment } = equipmentSelection(selectedIds)
  const toggle = (id: string) => setSelectedIds(previous => previous.includes(id) ? previous.filter(value => value !== id) : [...previous, id])
  function calculate() {
    formRef.current?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' })
    formRef.current?.querySelector<HTMLInputElement>('input[aria-label="Ваше имя"]')?.focus({ preventScroll: true })
  }
  return <div className={styles.page}>
    <div className={styles.shell}>
      <section className={styles.intro}><p className={styles.eyebrow}>Комплектация / База и ваши дополнения</p><h1>Хорошая база.<br />Ваши возможности.</h1><p className={styles.lead}>Комплектация определяется выбранной моделью и исполнением. Дополнительные опции — под ваши пожелания.</p><a className={styles.jump} href="#equipment-options">Посмотреть дополнительные опции <span aria-hidden="true">↓</span></a></section>
      <section className={styles.base} aria-labelledby="equipment-base-title"><p className={styles.eyebrow}>01 / База</p><h2 id="equipment-base-title">Что уже входит в базовую комплектацию</h2><p className={styles.included}>Входит в стоимость выбранной модели в её утверждённом исполнении.</p><p className={styles.note}>Состав зависит от выбранной модели и её планировки. Подтверждённые особенности указаны в карточке модели; остальные параметры согласуются при заказе.</p><table className={styles.baseTable}><caption className="sr-only">Базовая комплектация</caption><tbody>{baseEquipmentRows.map(row => <tr key={row.label}><th scope="row">{row.label}</th><td>{row.value}</td></tr>)}</tbody></table></section>
      <section className={styles.popular} aria-labelledby="equipment-popular-title"><p className={styles.eyebrow}>02 / Можно добавить</p><h2 id="equipment-popular-title">Популярные дополнения</h2><p className={styles.lead}>Несколько возможностей для индивидуального исполнения.</p><div className={styles.popularGrid}>{popular.map(option => <article key={option.id}><p className={styles.eyebrow}>{option.category}</p><h3>{option.name}</h3><p className={styles.description}>{option.description}</p><span className={styles.price}>{price(option)}</span><button className={styles.add} type="button" aria-pressed={selectedIds.includes(option.id)} onClick={() => toggle(option.id)} aria-label={`${selectedIds.includes(option.id) ? 'Убрать' : 'Добавить'}: ${option.name}`}>{selectedIds.includes(option.id) ? 'Добавлено' : 'Добавить'} <span aria-hidden="true">{selectedIds.includes(option.id) ? '✓' : '+'}</span></button></article>)}</div></section>
    </div>
    <section className={styles.extras} id="equipment-options" aria-labelledby="equipment-options-title"><div className={styles.inner}><p className={styles.eyebrow}>03 / Все дополнительные опции</p><h2 id="equipment-options-title">Сделайте баню под себя</h2><p className={styles.lead}>Добавьте только то, что действительно нужно — от окон и отделки до печи, душевой и инженерии.</p><p className={styles.note}>Текущие продажные цены. Окончательная совместимость и состав работ согласуются при заказе. Откройте категорию и отметьте нужные дополнения.</p>
      <div className={styles.config}><div className={styles.accordion}>{categories.map((category, index) => {
        const group = enabledEquipmentOptions.filter(option => option.category === category), expanded = opened.includes(category), id = `equipment-category-${index}`
        return <section key={category} className={styles.category}><h3><button type="button" className={styles.categoryButton} aria-expanded={expanded} aria-controls={id} onClick={() => setOpened(previous => expanded ? previous.filter(value => value !== category) : [...previous, category])}><span>{category}</span><span className={styles.count}>{optionCountLabel(group.length)}</span><span className={styles.plus} aria-hidden="true">{expanded ? '×' : '+'}</span></button></h3><div id={id} hidden={!expanded} className={styles.categoryBody}>{group.map(option => <label key={option.id} className={styles.optionRow}><input type="checkbox" checked={selectedIds.includes(option.id)} onChange={() => toggle(option.id)} aria-label={`Добавить: ${option.name}`} /><span className={styles.optionContent}><span className={styles.optionLine}><strong>{option.name}</strong><span className={styles.price}>{price(option)}</span></span><span className={styles.description}>{option.description}</span>{option.priceUnit === 'шт.' && <span className={styles.unitNote}>В расчёте выбран один элемент: 1 шт.</span>}</span></label>)}</div></section>
      })}</div>
      <aside className={styles.summary} aria-label="Выбранные дополнительные опции"><p className={styles.eyebrow}>Ваши пожелания</p><div aria-live="polite" aria-atomic="true"><h3>Выбрано: {optionCountLabel(selected.length)}</h3><p className={styles.sumLabel}>Дополнительные опции:</p><p className={styles.sum}>+{knownTotal.toLocaleString('ru-RU')} ₽</p>{unpricedCount > 0 && <p className={styles.note}>Ещё {optionCountLabel(unpricedCount)} без подтверждённой цены — уточняются отдельно.</p>}</div><p className={styles.note}>Сумма только выбранных дополнительных опций. Основная цена модели не меняется.</p><p className={styles.note}>Финальная стоимость зависит от выбранной модели и совместимости опций.</p><button type="button" className={styles.calculate} onClick={calculate}>Получить расчёт с выбранными опциями</button><button className={styles.clear} type="button" onClick={() => setSelectedIds([])}>Сбросить выбор</button></aside></div>
    </div></section>
    <div className={styles.shell}><section className={styles.cta}><div><p className={styles.eyebrow}>Следующий шаг</p><h2>Нужна комплектация<br />под ваши задачи?</h2><p className={styles.note}>Поможем подобрать опции и рассчитать итоговую стоимость.</p></div><button type="button" className={styles.calculate} onClick={calculate}>Получить расчёт с выбранными опциями</button></section><div ref={formRef} id="equipment-request" className={styles.form}><CTAFormInline configurationNote={comment} /></div></div>
  </div>
}
