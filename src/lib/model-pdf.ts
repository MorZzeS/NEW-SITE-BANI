import { deliveryDistrictLabel } from '@/lib/logistics'
import { jsPDF } from 'jspdf'
import type { Sauna, Home } from '@/types'
import { modelBaseConfiguration, modelFeatures, requiresBaseConfigurationConfirmation } from '@/data/model-configuration'
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
  doc.setProperties({ title: `${model.name} - комплектация`, author: 'Бани Герасимов' })
  const pageWidth = 210, margin = 12, contentWidth = pageWidth - margin * 2, right = pageWidth - margin, bottom = 281
  const colors = { ink: [38, 37, 32] as const, muted: [89, 84, 75] as const, soft: [118, 109, 95] as const, gold: [145, 100, 31] as const, line: [221, 213, 197] as const, pale: [248, 245, 238] as const, header: [35, 37, 45] as const }
  let y = 30
  const lineHeight = (size: number) => size * 0.43
  const linesFor = (value: string, size: number, width: number) => doc.splitTextToSize(clean(value), width) as string[]
  const runningHeader = (continued = false) => {
    doc.setFillColor(...colors.header); doc.rect(0, 0, pageWidth, 22, 'F')
    doc.setFont('NotoSans', 'normal'); doc.setFontSize(9); doc.setTextColor(250, 248, 242)
    doc.text('БАНИ ГЕРАСИМОВ · BANGER.SU', margin, 9)
    doc.setFontSize(7); doc.setTextColor(221, 190, 124)
    doc.text(continued ? 'РАСЧЁТ · ПРОДОЛЖЕНИЕ' : 'ИНДИВИДУАЛЬНЫЙ РАСЧЁТ', right, 9, { align: 'right' })
    doc.setDrawColor(...colors.gold); doc.setLineWidth(0.35); doc.line(margin, 22, right, 22)
    y = 29
  }
  const nextPage = () => { doc.addPage(); runningHeader(true) }
  const ensure = (height: number) => { if (y + height > bottom) nextPage() }
  const write = (value: string, size = 8, color: readonly [number, number, number] = colors.ink, gap = 1.5, width = contentWidth, x = margin) => {
    if (!value) return 0
    const lines = linesFor(value, size, width), height = lines.length * lineHeight(size)
    for (const line of lines) {
      ensure(lineHeight(size))
      doc.setFont('NotoSans', 'normal'); doc.setFontSize(size); doc.setTextColor(...color)
      doc.text(line, x, y); y += lineHeight(size)
    }
    y += gap
    return height + gap
  }
  const heading = (value: string) => {
    ensure(9); y += 1; doc.setDrawColor(...colors.gold); doc.setLineWidth(0.6); doc.line(margin, y, margin + 8, y)
    y += 4; write(value, 10.5, colors.gold, 2)
  }
  const addContainedImage = (path: string | undefined, x: number, top: number, maxWidth: number, maxHeight: number, caption: string) => {
    const img = path ? assets.images[path] : undefined
    doc.setFillColor(...colors.pale); doc.setDrawColor(...colors.line); doc.setLineWidth(0.2)
    doc.roundedRect(x, top, maxWidth, maxHeight, 2, 2, 'FD')
    if (img) {
      const scale = Math.min((maxWidth - 3) / img.width, (maxHeight - 3) / img.height)
      const width = img.width * scale, height = img.height * scale
      doc.addImage(img.data, 'JPEG', x + (maxWidth - width) / 2, top + (maxHeight - height) / 2, width, height)
    } else {
      doc.setFont('NotoSans', 'normal'); doc.setFontSize(7); doc.setTextColor(...colors.soft)
      const lines = linesFor(caption, 7, maxWidth - 8)
      doc.text(lines, x + 4, top + maxHeight / 2)
    }
  }
  const drawInfoPair = (label: string, value: string, x: number, top: number, width: number) => {
    const labelWidth = Math.min(29, width * 0.36), valueWidth = width - labelWidth - 3
    const labelLines = linesFor(label, 6.5, labelWidth), valueLines = linesFor(value, 7.2, valueWidth)
    const height = Math.max(labelLines.length * lineHeight(6.5), valueLines.length * lineHeight(7.2)) + 2
    doc.setFont('NotoSans', 'normal'); doc.setFontSize(6.5); doc.setTextColor(...colors.soft)
    labelLines.forEach((line, index) => doc.text(line, x, top + lineHeight(6.5) * (index + 1)))
    doc.setFontSize(7.2); doc.setTextColor(...colors.ink)
    valueLines.forEach((line, index) => doc.text(line, x + labelWidth + 3, top + lineHeight(7.2) * (index + 1)))
    doc.setDrawColor(...colors.line); doc.setLineWidth(0.13); doc.line(x, top + height, x + width, top + height)
    return height
  }
  const drawTwoColumnRows = (rows: { label: string; value: string }[], pending = false) => {
    const gap = 7, columnWidth = (contentWidth - gap) / 2, labelWidth = 27, valueWidth = columnWidth - labelWidth - 3
    for (let index = 0; index < rows.length; index += 2) {
      const pair = [rows[index], rows[index + 1]].filter((row): row is { label: string; value: string } => !!row)
      const heights = pair.map(row => Math.max(linesFor(row.label, 6.5, labelWidth).length * lineHeight(6.5), linesFor(row.value, 6.8, valueWidth).length * lineHeight(6.8)) + 2.4)
      const rowHeight = Math.max(...heights)
      ensure(rowHeight)
      pair.forEach((row, cellIndex) => {
        const x = margin + cellIndex * (columnWidth + gap), labelLines = linesFor(row.label, 6.5, labelWidth), valueLines = linesFor(row.value, 6.8, valueWidth)
        const labelColor = pending ? colors.muted : colors.soft
        doc.setFont('NotoSans', 'normal'); doc.setFontSize(6.5); doc.setTextColor(labelColor[0], labelColor[1], labelColor[2])
        labelLines.forEach((line, lineIndex) => doc.text(line, x, y + lineHeight(6.5) * (lineIndex + 1)))
        doc.setFontSize(6.8); doc.setTextColor(...colors.ink)
        valueLines.forEach((line, lineIndex) => doc.text(line, x + labelWidth + 3, y + lineHeight(6.8) * (lineIndex + 1)))
        doc.setDrawColor(...colors.line); doc.setLineWidth(0.12); doc.line(x, y + rowHeight, x + columnWidth, y + rowHeight)
      })
      y += rowHeight
    }
    y += 1
  }

  runningHeader()
  write(model.name, 19, colors.ink, 1)
  write(`${model.article || model.id} · ${model.size}${model.area ? ` · ${model.area} м²` : ''} · ${date.toLocaleDateString('ru-RU')}`, 8, colors.muted, 3)

  const imageY = y, imageHeight = 38, imageGap = 5, imageWidth = (contentWidth - imageGap) / 2
  addContainedImage(model.image, margin, imageY, imageWidth, imageHeight, 'Фото модели')
  addContainedImage(model.floorPlan, margin + imageWidth + imageGap, imageY, imageWidth, imageHeight, 'Планировка согласуется при заказе')
  y += imageHeight + 3
  write(model.description, 8, colors.muted, 3)

  heading('Характеристики модели')
  const specGap = 7, specColumnWidth = (contentWidth - specGap) / 2
  for (let index = 0; index < model.specs.length; index += 2) {
    const pair = [model.specs[index], model.specs[index + 1]].filter(Boolean)
    const heights = pair.map(spec => Math.max(linesFor(spec.label, 6.5, 27).length * lineHeight(6.5), linesFor(spec.value, 7.2, specColumnWidth - 30).length * lineHeight(7.2)) + 2)
    const rowHeight = Math.max(...heights); ensure(rowHeight)
    pair.forEach((spec, cellIndex) => drawInfoPair(spec.label, spec.value, margin + cellIndex * (specColumnWidth + specGap), y, specColumnWidth))
    y += rowHeight
  }

  const sourceRows = modelBaseConfiguration(model)
  const confirmedRows = sourceRows.filter(row => !requiresBaseConfigurationConfirmation(row.value)).map(row => ({ label: row.label, value: row.value }))
  const pendingRows = sourceRows.filter(row => requiresBaseConfigurationConfirmation(row.value)).map(row => ({ label: row.label, value: row.value }))
  heading('Базовая комплектация')
  write('Позиции ниже отражают состав модели; подарочные элементы помечены отдельно.', 7, colors.muted, 1.5)
  drawTwoColumnRows(confirmedRows)
  if (pendingRows.length) {
    ensure(9)
    y += 3
    write('Параметры для согласования', 8, colors.gold, 1)
    drawTwoColumnRows(pendingRows, true)
  }
  const features = modelFeatures(model)
  if (features.length) {
    heading('Особенности модели')
    for (const feature of features) write(`• ${feature}`, 7, colors.muted, 0.6)
  }

  nextPage()
  write('Расчёт комплектации', 17, colors.ink, 1)
  write(`${model.name} · ${date.toLocaleDateString('ru-RU')}`, 8, colors.muted, 4)
  heading('Выбранные дополнительные опции')
  if (!configuration.options.length) write('Дополнительные опции не выбраны. Расчёт включает только базовую стоимость модели.', 8, colors.muted, 3)
  const sortedOptions = [...configuration.options].sort((a, b) => Number(a.kind === 'logistics') - Number(b.kind === 'logistics'))
  let logisticsHeadingShown = false
  for (const option of sortedOptions) {
    if (option.kind === 'logistics' && !logisticsHeadingShown) { heading('Логистика'); logisticsHeadingShown = true }
    const guidance = optionGuidance[option.id], source = additionalOptions.find(item => item.id === option.id)
    const image = guidance?.image ? assets.images[guidance.image] : undefined
    const thumbnailWidth = image ? 18 : 0, textX = margin + (image ? 23 : 4), priceWidth = 38, textWidth = contentWidth - (image ? 23 : 4) - priceWidth - 4
    const name = `${option.name}${option.id === 'ceiling-height' ? ` — +${option.quantity * 10} см` : option.quantity > 1 ? ` — ${option.quantity} шт.` : ''}`
    const price = option.price === null ? 'Цена по согласованию' : option.quantity > 1 ? `${money(option.price)} × ${option.quantity} = ${money(option.price * option.quantity)}` : money(option.price)
    const descriptions = [guidance?.explanation || source?.description || 'Исполнение согласуется при заказе.', ...(guidance?.notes ? [guidance.notes] : [])].join(' ')
    const nameLines = linesFor(name, 8.2, textWidth), descLines = linesFor(descriptions, 6.8, textWidth), priceLines = linesFor(price, 7, priceWidth)
    const rowHeight = Math.max(image ? 17 : 0, nameLines.length * lineHeight(8.2) + descLines.length * lineHeight(6.8) + 5, priceLines.length * lineHeight(7) + 5)
    ensure(rowHeight + 1)
    const rowTop = y
    doc.setFillColor(...colors.pale); doc.setDrawColor(...colors.line); doc.setLineWidth(0.14); doc.roundedRect(margin, rowTop, contentWidth, rowHeight, 1.7, 1.7, 'FD')
    if (image) {
      const scale = Math.min((thumbnailWidth - 2) / image.width, 13 / image.height), width = image.width * scale, height = image.height * scale
      doc.addImage(image.data, 'JPEG', margin + 2 + (thumbnailWidth - 2 - width) / 2, rowTop + (rowHeight - height) / 2, width, height)
    }
    doc.setFont('NotoSans', 'normal'); doc.setFontSize(8.2); doc.setTextColor(...colors.ink)
    nameLines.forEach((line, index) => doc.text(line, textX, rowTop + 4 + lineHeight(8.2) * index))
    doc.setFontSize(6.8); doc.setTextColor(...colors.muted)
    descLines.forEach((line, index) => doc.text(line, textX, rowTop + 4 + lineHeight(8.2) * nameLines.length + lineHeight(6.8) * index))
    doc.setFontSize(7); doc.setTextColor(...colors.gold)
    linesFor(price, 7, priceWidth).forEach((line, index) => doc.text(line, right - 3, rowTop + 4 + lineHeight(7) * (index + 1), { align: 'right' }))
    y = rowTop + rowHeight + 1.4
  }

  heading('Доставка и адрес')
  const districtLabel = deliveryDistrictLabel(configuration.deliveryDistrict)
  write(districtLabel === 'Район не указан' ? 'Район доставки не указан.' : `Район доставки: ${districtLabel}`, 8, colors.ink, 1)
  if (configuration.deliveryAddress) {
    write('Адрес доставки:', 7, colors.soft, 0)
    write(configuration.deliveryAddress, 8, colors.ink, 2, contentWidth * 0.82)
  } else write('Адрес доставки не указан.', 7, colors.muted, 2)

  heading('Стоимость комплектации')
  const priceRows: [string, string][] = [
    ['Базовая стоимость модели', money(configuration.basePrice)],
    ['Дополнительное оборудование', money(configuration.equipmentSubtotal)],
    ['Доставка и разгрузка', money(configuration.logisticsSubtotal)],
  ]
  if (configuration.discount) priceRows.push([`${configuration.discountLabel} (акция)`, `−${money(configuration.discount)}`])
  for (const [label, value] of priceRows) {
    ensure(7); doc.setFont('NotoSans', 'normal'); doc.setFontSize(8); doc.setTextColor(...colors.muted); doc.text(clean(label), margin, y)
    doc.setTextColor(...colors.ink); doc.text(clean(value), right, y, { align: 'right' }); doc.setDrawColor(...colors.line); doc.setLineWidth(0.12); doc.line(margin, y + 2, right, y + 2); y += 6
  }
  if (!configuration.discount) write('Скидка не применена.', 7, colors.soft, 1)
  ensure(13); doc.setFillColor(239, 227, 202); doc.roundedRect(margin, y, contentWidth, 11, 2, 2, 'F')
  doc.setFont('NotoSans', 'normal'); doc.setFontSize(9); doc.setTextColor(...colors.ink); doc.text(`ИТОГО${configuration.unpricedCount ? ' · без позиций по согласованию' : ''}`, margin + 4, y + 7)
  doc.setFontSize(12); doc.setTextColor(...colors.gold); doc.text(money(configuration.total), right - 4, y + 7, { align: 'right' }); y += 14
  if (configuration.unpricedCount) write(`Не включены в итог: ${configuration.unpricedCount} позиции индивидуального расчёта. Окончательную цену и доставку подтвердит менеджер.`, 7, colors.muted, 2)
  write('Предварительный расчёт. Применимость опций, окончательная комплектация, стоимость и условия доставки подтверждаются при заказе.', 7, colors.muted, 2)
  heading('Контакты')
  write(`Телефоны: ${siteSettings.phoneDisplay}, ${siteSettings.phoneDisplay2} · Email: ${siteSettings.email}`, 7.5, colors.ink, 1)
  write(`Сайт: https://banger.su · Офис: ${siteSettings.address}${siteSettings.addressShowroom ? ` · Выставка: ${siteSettings.addressShowroom}` : ''}`, 7, colors.muted, 1)
  write('Бани Герасимов · собственное производство, город Раменское.', 7, colors.muted, 1)

  const pageCount = doc.getNumberOfPages()
  for (let page = 1; page <= pageCount; page++) {
    doc.setPage(page); doc.setDrawColor(...colors.line); doc.setLineWidth(0.15); doc.line(margin, 285, right, 285)
    doc.setFont('NotoSans', 'normal'); doc.setFontSize(6.5); doc.setTextColor(...colors.soft)
    doc.text(`BANGER.SU · ${page} / ${pageCount}`, right, 289, { align: 'right' })
  }
  return doc
}

export async function downloadModelPdf(model: Sauna | Home, configuration: ModelConfigurationCalculation) {
  const assets = await loadModelPdfAssets(model, configuration)
  const doc = createModelPdf(model, configuration, assets)
  doc.save(`banger-${model.id}-configuration.pdf`)
}
