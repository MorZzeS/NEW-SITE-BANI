export type LeadDocument = Readonly<{ version: string; text: string; sha256: string }>
export type LeadDocumentBundle = Readonly<{
  approved: boolean
  documents: Readonly<Record<'consent' | 'checkbox' | 'policy', LeadDocument>> | null
}>

// No legal texts have been approved for publication. Never import private drafts here.
// Activation requires a reviewed static release of all three exact UTF-8 snapshots.
// This client flag is not server approval: the backend independently pins its manifest.
export const leadDocumentBundle: LeadDocumentBundle = Object.freeze({ approved: false, documents: null })
