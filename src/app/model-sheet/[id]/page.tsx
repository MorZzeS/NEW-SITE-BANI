import { modelFeatures, modelBaseConfiguration } from '@/data/model-configuration'
import { notFound } from 'next/navigation'
import { saunas, homes, siteSettings } from '@/data'
import { PrintModelButton } from '@/components/catalog/PrintModelButton'
const models = [...saunas, ...homes]
export function generateStaticParams() { return models.map(model => ({ id: model.id })) }
export function generateMetadata({ params }: { params: { id: string } }) {
  const model = models.find(m => m.id === params.id)
  return { title: `${model?.name ?? 'Модель'} — информация для клиента`, robots: { index: false, follow: false } }
}
export default function ModelSheet({ params }: { params: { id: string } }) {
  const model = models.find(m => m.id === params.id)
  if (!model) notFound()
  return <article className="model-sheet">
    <div className="print-model-action mb-6"><PrintModelButton /><p className="text-sm mt-3">В диалоге печати выберите «Сохранить в PDF». Изображения включены в документ.</p></div>
    <header className="sheet-heading"><span>БАНИ ГЕРАСИМОВ · BANGER.SU</span><p>Информация о модели</p></header>
    <h1>{model.name}</h1><p>{model.article} · {model.size} · {model.area} м²</p>
    <div className="sheet-images"><figure><img src={model.image} alt={model.name} /><figcaption>Визуализация модели</figcaption></figure>
      {model.floorPlan && <figure><img src={model.floorPlan} alt={`Планировка ${model.name}`} /><figcaption>Планировка модели</figcaption></figure>}</div>
    <p>{model.description}</p>
    <h2>Стоимость</h2><p>{model.specs.find(spec => spec.label === 'Исполнение')?.value}</p><p className="sheet-price">{model.id !== 'bg-28' && 'от '}{model.priceFrom.toLocaleString('ru-RU')} ₽</p>
    {model.priceVariants?.map(v => <p key={v}>{v}</p>)}
    <h2>Характеристики</h2><dl className="model-parameters">
      <div><dt>Размер</dt><dd>{model.size}</dd></div><div><dt>Площадь</dt><dd>{model.area} м²</dd></div><div><dt>Артикул</dt><dd>{model.article}</dd></div>
      {model.specs.filter(s => !['Размер','Площадь застройки'].includes(s.label)).map(s => <div key={s.label}><dt>{s.label}</dt><dd>{s.value}</dd></div>)}</dl>
    <h2>Комплектация и особенности по каталогу</h2><ul>{modelFeatures(model).map(f => <li key={f}>{f}</li>)}</ul>
    <h2>Базовая комплектация</h2><dl className="model-parameters">{modelBaseConfiguration(model).map(row => <div key={row.label}><dt>{row.label}</dt><dd>{row.value}</dd></div>)}</dl>
    <p className="sheet-note">Окончательное исполнение, доставка и монтаж согласуются при заказе. Дополнительные опции рассчитываются отдельно.</p>
    <footer className="sheet-footer">BANGER.SU · <a href={`tel:${siteSettings.phone}`}>{siteSettings.phoneDisplay}</a> · <a href={`tel:${siteSettings.phone2}`}>{siteSettings.phoneDisplay2}</a><br />{siteSettings.email} · {siteSettings.addressShowroom}</footer>
  </article>
}
