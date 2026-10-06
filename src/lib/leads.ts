export type Lead = {
  requestId: string
  name: string
  phone: string
  model: string
  page: string
  comment: string
  createdAt: string
  consent: boolean
  website: string
  startedAt: number
}
export const leadEndpoint = process.env.NEXT_PUBLIC_LEADS_ENDPOINT || ''
export async function sendLead(lead: Lead) {
  if (!/^https:\/\//.test(leadEndpoint)) throw new Error('Онлайн-отправка пока не настроена. Позвоните или напишите нам напрямую.')
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 75000)
  try {
    const response = await fetch(leadEndpoint, { method: 'POST', credentials: 'omit', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(lead), signal: controller.signal })
    const result = await response.json()
    if (!response.ok || result.ok !== true || result.requestId !== lead.requestId) throw new Error('Не удалось отправить заявку. Попробуйте позже или свяжитесь напрямую.')
  } catch (error) {
    if (error && typeof error === 'object' && 'name' in error && error.name === 'AbortError') throw new Error('Время ожидания истекло. Статус отправки не подтверждён — свяжитесь с нами напрямую.')
    throw new Error('Не удалось отправить заявку. Попробуйте позже или свяжитесь напрямую.')
  } finally { clearTimeout(timer) }
}
