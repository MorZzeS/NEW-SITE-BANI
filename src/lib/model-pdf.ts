import { deliveryDistrictLabel } from '@/lib/logistics'
import { jsPDF } from 'jspdf'
import type { Sauna, Home } from '@/types'
import { modelBaseConfiguration, modelFeatures } from '@/data/model-configuration'
import { additionalOptions } from '@/data/options'
import { optionGuidance } from '@/data/option-guidance'
import { siteSettings } from '@/data'
import type { ModelConfigurationCalculation } from '@/lib/model-configuration-selection'
import { withBasePath } from '@/lib/site-path'

type PdfImage = { data: string; width: number; height: number }
export type ModelPdfAssets = { font: string; images: Record<string, PdfImage> }
const money = (value: number) => `${value.toLocaleString('ru-RU')} ₽`
const clean = (value: string) => value.replace(/[\u00a0\u202f]/g, ' ').replace(/[\u2011-\u2014]/g, '-')

// Assets stay local to the site, including its preview base path.
export async function loadModelPdfAssets(model: Sauna | Home, configuration: ModelConfigurationCalculation): Promise<ModelPdfAssets> {
  const response = await fetch(withBasePath('/fonts/NotoSans-Regular.ttf'))
  if (!response.ok) throw new Error('Font unavailable')
  const bytes = new Uint8Array(await response.arrayBuffer())
  let font = ''
  for (let offset = 0; offset < bytes.length; offset += 8192) font += String.fromCharCode(...bytes.subarray(offset, offset + 8192))
  const images: Record<string, PdfImage> = {}
  const paths = [model.image, model.floorPlan, ...configuration.options.map(option => optionGuidance[option.id]?.image)].filter((path): path is string => !!path)
  await Promise.all([...new Set(paths)].map(async path => {
    const img = new Image()
    img.src = withBasePath(path)
    await img.decode()
    const scale = Math.min(1, 1600 / Math.max(img.naturalWidth, img.naturalHeight))
    const canvas = document.createElement('canvas')
    canvas.width = Math.max(1, Math.round(img.naturalWidth * scale))
    canvas.height = Math.max(1, Math.round(img.naturalHeight * scale))
    const context = canvas.getContext('2d')
    if (!context) throw new Error('Canvas unavailable')
    context.fillStyle = '#ffffff'; context.fillRect(0, 0, canvas.width, canvas.height)
    context.drawImage(img, 0, 0, canvas.width, canvas.height)
    images[path] = { data: canvas.toDataURL('image/jpeg', 0.9), width: canvas.width, height: canvas.height }
  }))
  return { font: btoa(font), images }
}

/** Pure layout entry point also used to verify zero / one / many option documents. */
export function createModelPdf(model: Sauna | Home, configuration: ModelConfigurationCalculation, assets: ModelPdfAssets, date = new Date()) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4', compress: true })
  doc.addFileToVFS('NotoSans-Regular.ttf', assets.font)
  doc.addFont('NotoSans-Regular.ttf', 'NotoSans', 'normal')
  doc.setFont('NotoSans')
  doc.setProperties({ title: `${model.name} - комплектация`, author: 'Бани Герасимов' })
  let y = 20
  const ensure = (height: number) => { if (y + height > 276) { doc.addPage(); y = 20 } }
  const text = (value: string, size = 10, gap = 3) => {
    doc.setFontSize(size)
    const lines = doc.splitTextToSize(clean(value), 174) as string[]
    const lineHeight = size * 0.48
    for (const line of lines) { ensure(lineHeight); doc.text(line, 18, y); y += lineHeight }
    y += gap
  }
  const heading = (value: string) => { ensure(24); y += 4; doc.setTextColor(119, 80, 24); text(value, 14, 4); doc.setTextColor(35, 35, 35) }
  const picture = (path: string | undefined, caption: string, maxHeight = 75) => {
    const img = path ? assets.images[path] : undefined
    if (!img) return
    const ratio = Math.min(174 / img.width, maxHeight / img.height)
    const width = img.width * ratio, height = img.height * ratio
    ensure(height + 16)
    doc.addImage(img.data, 'JPEG', 18, y, width, height)
    y += height + 5; text(caption, 8)
  }
  text('БАНИ ГЕРАСИМОВ · BANGER.SU', 10)
  text(model.name, 23, 5)
  text(`Дата расчёта: ${date.toLocaleDateString('ru-RU')}`, 9)
  text(`${model.article || model.id} · ${model.size} · ${model.area} м²`)
  picture(model.image, 'Визуализация модели')
  text(model.description)
  heading('Характеристики')
  for (const spec of model.specs) text(`${spec.label}: ${spec.value}`)
  picture(model.floorPlan, 'Планировка модели', 75)
  heading('Базовая комплектация')
  for (const row of modelBaseConfiguration(model)) text(`${row.label}: ${row.value}`)
  heading('Особенности модели')
  for (const feature of modelFeatures(model)) text(`• ${feature}`)
  heading(configuration.options.length ? 'Выбранные дополнительные опции' : 'Дополнительные опции')
  if (!configuration.options.length) text('Дополнительные опции не выбраны. Представлена базовая комплектация модели.')
  for (const option of [...configuration.options].sort((a, b) => Number(a.kind === 'logistics') - Number(b.kind === 'logistics'))) {
    if (option.id === configuration.options.find(item => item.kind === 'logistics')?.id) heading('Логистические услуги')
    ensure(35)
    text(`${option.name}${option.id === 'ceiling-height' ? ` (+${option.quantity * 10} см)` : ''} · ${option.price === null ? 'Индивидуальный расчёт' : money(option.price * option.quantity)}`, 12)
    const guidance = optionGuidance[option.id]
    const source = additionalOptions.find(item => item.id === option.id)
    text(guidance?.explanation || source?.description || 'Исполнение согласуется при заказе.')
    if (guidance) { picture(guidance.image, guidance.caption, 48); text(guidance.notes, 9) }
  }
  ensure(68)
  heading('Стоимость комплектации')
  text(`Базовая комплектация: ${money(configuration.basePrice)}`)
  text(`Дополнительное оборудование: ${money(configuration.equipmentSubtotal)}`)
  text(`Логистические услуги: ${money(configuration.logisticsSubtotal)}`)
  if (configuration.options.some(option => option.kind === 'logistics') || configuration.deliveryAddress || configuration.deliveryDistrict !== 'unknown') text(`Район: ${deliveryDistrictLabel(configuration.deliveryDistrict)}`)
  if (configuration.deliveryAddress) text(`Адрес доставки: ${configuration.deliveryAddress}`)
  text(configuration.discount ? `${configuration.discountLabel} (акция): -${money(configuration.discount)}` : 'Скидка: 0 ₽ (не применена)')
  text(`Итого подтверждённых позиций${configuration.discount ? ' с учётом скидки' : ''}${configuration.unpricedCount ? ' (без опций по согласованию)' : ''}: ${money(configuration.total)}`, 14)
  if (configuration.unpricedCount) text(`Индивидуальный расчёт: ${configuration.unpricedCount}. Предварительная сумма без этих позиций и неподтверждённых логистических расходов.`, 9)
  text('Предварительный расчёт. Совместимость опций, окончательная стоимость, доставка и монтаж согласуются при заказе.', 9)
  ensure(40)
  heading('Связаться с нами')
  text(`Телефоны: ${siteSettings.phoneDisplay}, ${siteSettings.phoneDisplay2}`)
  text(`Email: ${siteSettings.email}`)
  text(`Сайт: https://banger.su`)
  text(`Офис: ${siteSettings.address}`)
  if (siteSettings.addressShowroom) text(`Выставка: ${siteSettings.addressShowroom}`)
  text('Бани Герасимов · собственное производство, город Раменское.')
  for (let page = 1; page <= doc.getNumberOfPages(); page++) {
    doc.setPage(page); doc.setFontSize(8); doc.setTextColor(100)
    doc.text(`BANGER.SU · ${page} / ${doc.getNumberOfPages()}`, 18, 287)
  }
  return doc
}

export async function downloadModelPdf(model: Sauna | Home, configuration: ModelConfigurationCalculation) {
  const assets = await loadModelPdfAssets(model, configuration)
  const doc = createModelPdf(model, configuration, assets)
  doc.save(`banger-${model.id}-configuration.pdf`)
}
