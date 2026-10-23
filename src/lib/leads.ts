import { consentEvidenceReady, consentEvidence, verifyLeadDocumentBundle, leadContract } from './lead-consent'
import { beginLeadAttempt, settleLeadAttempt } from './lead-attempt'
import { releasePolicy } from './release-policy'
export type Lead = {
  contractVersion?: number
  consentVersion?: string
  policyVersion?: string
  checkboxVersion?: string
  purposeCode?: 'inquiry_response'
  action?: 'unchecked_checkbox_then_submit'
  consentTextSha256?: string
  checkboxTextSha256?: string
  policyTextSha256?: string
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
export class LeadSubmissionError extends Error {
  constructor(message: string, public readonly state: string, public readonly requestId: string, public readonly retryable = false) { super(message); this.name = 'LeadSubmissionError' }
}
const exactKeys = (value: unknown, keys: string[]): value is Record<string, unknown> => Boolean(value && typeof value === 'object' && !Array.isArray(value) && Object.keys(value).sort().join(',') === [...keys].sort().join(','))
function matchingReceipt(result: Record<string, unknown>, lead: Lead) {
  const receipt = result.receipt as Record<string, unknown> | undefined
  if (!exactKeys(receipt, ['contractVersion', 'receiptId', 'requestId', 'receivedAt', 'purposeCode', 'consent', 'action', 'page', 'consentVersion', 'policyVersion', 'consentTextSha256', 'checkboxTextSha256', 'policyTextSha256']) || typeof receipt.receiptId !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(receipt.receiptId) || typeof receipt.receivedAt !== 'string' || receipt.receivedAt.length !== 24 || !Number.isFinite(Date.parse(receipt.receivedAt)) || new Date(receipt.receivedAt).toISOString() !== receipt.receivedAt) return false
  return ['contractVersion', 'requestId', 'purposeCode', 'action', 'consent', 'page', 'consentVersion', 'policyVersion', 'consentTextSha256', 'checkboxTextSha256', 'policyTextSha256'].every(key => receipt[key] === lead[key as keyof Lead])
}
export async function sendLead(lead: Lead) {
  if (!releasePolicy.onlineLeads) throw new Error('Онлайн-форма временно недоступна. Свяжитесь с нами напрямую.')
  if (typeof location !== 'undefined' && location.protocol !== 'https:') throw new Error('На HTTP-тестовом сайте отправка заявок отключена. Свяжитесь напрямую.')
  if (!consentEvidenceReady) throw new Error('Документы для новой системы заявок ещё не утверждены.')
  if (!/^https:\/\//.test(leadEndpoint)) throw new Error('Онлайн-отправка пока не настроена. Позвоните или напишите нам напрямую.')
  const v3 = lead.contractVersion === 3
  if ((leadContract === 3) !== v3) throw new Error('Версия заявки не соответствует настройке формы.')
  if (v3) {
    const documents = await verifyLeadDocumentBundle()
    if (!/^[A-Za-z0-9_-]{16,80}$/.test(lead.requestId) || lead.consent !== true || Object.entries(consentEvidence(documents)).some(([key, value]) => lead[key as keyof Lead] !== value)) throw new Error('Согласие и версии документов для заявки не подтверждены.')
    lead = beginLeadAttempt(lead)
  }
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 75000)
  try {
    const response = await fetch(leadEndpoint, { method: 'POST', credentials: 'omit', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(lead), signal: controller.signal })
    const result = await response.json()
    if (v3) {
      if (!exactKeys(result, ['ok', 'contractVersion', 'requestId', 'status', 'admitted', 'retryable', ...(result?.receipt ? ['receipt'] : [])]) || result.contractVersion !== 3 || result.requestId !== lead.requestId) throw new Error('Invalid acknowledgement')
      if (response.status===200 && response.ok && result.ok === true && result.status === 'sent' && result.admitted===true && result.retryable===false && matchingReceipt(result, lead)) { settleLeadAttempt('sent'); return }
      const definitiveRejection = (result.status==='storage_unavailable' && response.status===503 && result.retryable===true) || (result.status==='rejected' && ((response.status===400 && result.retryable===false) || (response.status===429 && result.retryable===true)))
      if (!response.ok && result.ok === false && result.admitted === false && definitiveRejection && !result.receipt) {
        settleLeadAttempt('rejected')
        throw new LeadSubmissionError(result.retryable ? 'Заявка не принята сервером. Можно повторить исходную заявку с тем же номером попытки.' : 'Заявка отклонена до приёма. Проверьте данные или свяжитесь с нами напрямую.', 'rejected', lead.requestId, result.retryable===true)
      }
      const stateReceiptOK = result.status==='conflict' || result.admitted===null ? !('receipt' in result) : matchingReceipt(result, lead)
      const state = !response.ok && result.ok === false && result.retryable===false && stateReceiptOK && (result.admitted===true || (result.status==='unknown' && result.admitted===null)) && ['claimed', 'unknown', 'conflict'].includes(result.status as string) ? result.status as 'claimed' | 'unknown' | 'conflict' : 'unknown'
      settleLeadAttempt(state)
      throw new LeadSubmissionError('Доставка заявки не подтверждена. Повторная отправка отключена. Свяжитесь с нами и назовите номер попытки.', state, lead.requestId)
    }
    if (!response.ok || result.ok !== true || result.requestId !== lead.requestId) throw new Error('Не удалось отправить заявку. Попробуйте позже или свяжитесь напрямую.')
  } catch (error) {
    if (v3) {
      if (error instanceof LeadSubmissionError) throw error
      settleLeadAttempt('unknown')
      throw new LeadSubmissionError('Статус заявки не подтверждён. Повторная отправка отключена. Свяжитесь с нами и назовите номер попытки.', 'unknown', lead.requestId)
    }
    if (error && typeof error === 'object' && 'name' in error && error.name === 'AbortError') throw new Error('Время ожидания истекло. Статус отправки не подтверждён — свяжитесь с нами напрямую.')
    throw new Error('Не удалось отправить заявку. Попробуйте позже или свяжитесь напрямую.')
  } finally { clearTimeout(timer) }
}
