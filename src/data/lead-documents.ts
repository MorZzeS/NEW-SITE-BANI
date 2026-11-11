export type LeadDocument = Readonly<{ version: string; text: string; sha256: string }>
export type LeadDocumentBundle = Readonly<{
  approved: boolean
  documents: Readonly<Record<'consent' | 'checkbox' | 'policy', LeadDocument>> | null
}>

// Next embeds only the public snapshots validated against the build-time archive pin.
// The PHP handler checks its own private archive and pin on every admission.
export const leadDocumentBundle: LeadDocumentBundle = process.env.BANGER_COMPILED_LEAD_DOCUMENTS
  ? JSON.parse(process.env.BANGER_COMPILED_LEAD_DOCUMENTS)
  : { approved: false, documents: null }
