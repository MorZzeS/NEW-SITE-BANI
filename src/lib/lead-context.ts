import type { Lead } from './leads'

type Model = { name: string; article?: string; slug?: string }
export function resolveLeadContext(raw: string, modelName: string | undefined, baths: Model[], houses: Model[]): Pick<Lead, 'source'|'article'|'modelKind'|'promotion'|'model'|'page'> {
  const url = new URL(raw)
  const from = url.searchParams.get('from')
  const validFrom = from?.startsWith('/') && !from.startsWith('//') && !/[?#\\\u0000-\u001f]/.test(from) ? from : undefined
  const modelPath = url.searchParams.get('source') === 'exit-intent' && validFrom ? validFrom : url.pathname
  const match = /^\/(banya|dom)\/([^/]+)\/?$/.exec(modelPath)
  const inferred = match && (match[1] === 'banya' ? baths : houses).find(item => item.slug === match[2])
  const model = modelName || url.searchParams.get('model')?.slice(0,160) || inferred?.name || ''
  const bath = baths.find(item => item.name === model), house = houses.find(item => item.name === model)
  const promotion = url.searchParams.get('source') === 'exit-intent' && !house
  const source: Lead['source'] = promotion ? 'Exit-intent' : url.pathname.startsWith('/banya/') || url.pathname.startsWith('/dom/') ? 'Карточка модели' : url.pathname.startsWith('/komplektaciya') ? 'Конфигуратор' : url.pathname === '/' ? 'Получить консультацию' : 'Контакты'
  const sourcePath = url.searchParams.get('source') === 'exit-intent' && validFrom ? validFrom : url.pathname
  return { model, article: bath?.article || house?.article || '', modelKind: bath || promotion ? 'bath' : house ? 'house' : '', source, promotion: promotion ? 'Скидка 15 000 ₽' : '', page: url.origin + sourcePath }
}
