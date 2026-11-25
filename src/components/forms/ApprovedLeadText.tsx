import type { LeadDocument } from '@/data/lead-documents'
import { withBasePath } from '@/lib/site-path'

type DocumentKind = 'checkbox' | 'consent' | 'policy'

export function ApprovedLeadText({ kind, document }: { kind: DocumentKind; document: LeadDocument }) {
  // Escape all text markup before encoding CR, which the HTML parser otherwise converts to LF.
  const html = document.text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('\r', '&#13;')
  return <>
    {kind === 'policy' && document.version === 'leads-policy-2026-11-11-v1' && <span className="mb-3 block rounded-lg border border-gold-400/30 bg-gold-400/5 p-3 text-sm leading-relaxed">
      Ниже показана зафиксированная редакция политики, привязанная только к согласию на обработку заявки от 11.11.2026. В ней указано, что аналитический счётчик на тот момент не использовался. Текущая необязательная аналитика описана в <a className="text-gold-400 underline" href={withBasePath('/privacy')}>актуальной политике</a> и <a className="text-gold-400 underline" href={withBasePath('/cookie')}>разделе Cookie</a>; выбор Метрики отдельный и не входит в согласие на ответ по заявке.
    </span>}
    <span data-lead-document={kind} className="whitespace-pre-wrap break-words" dangerouslySetInnerHTML={{ __html: html }} />
  </>
}
