import type { LeadDocument } from '@/data/lead-documents'

type DocumentKind = 'checkbox' | 'consent' | 'policy'

export function ApprovedLeadText({ kind, document }: { kind: DocumentKind; document: LeadDocument }) {
  // Escape all text markup before encoding CR, which the HTML parser otherwise converts to LF.
  const html = document.text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('\r', '&#13;')
  return <span data-lead-document={kind} className="whitespace-pre-wrap break-words" dangerouslySetInnerHTML={{ __html: html }} />
}
