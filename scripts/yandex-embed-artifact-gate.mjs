const APPROVED_REVIEW_PATH = '/maps-reviews-widget/68540156780'
const APPROVED_MAP_PATH = '/map-widget/v1/'
const DYNAMIC_IFRAME_CREATION = /\b(?:(?:var|let|const)\s+)?(?<variable>[$A-Z_a-z][\w$]*)\s*=\s*(?:[$A-Z_a-z][\w$]*\s*\.\s*)*(?:document|window)\s*(?:\.\s*createElement|\[\s*['"]createElement['"]\s*\])\s*\(\s*['"]iframe['"]\s*\)/gi
const HTML_IFRAME_SINKS = [
  /\bdocument\s*\.\s*write(?:ln)?\s*\([^)]*<iframe\b/is,
  /\b(?:innerHTML|outerHTML)\s*=\s*(?:"[^"]*<iframe|'[^']*<iframe|`[^`]*<iframe)/is,
  /\binsertAdjacentHTML\s*\([^)]*<iframe\b/is,
]

// pdfmake uses only local generated documents in its two browser-preview paths.
// Other runtime-created frames require a separate review and must not slip into the release.
const SAFE_PDF_IFRAME_SOURCES = [
  /^\s*this\.output\(\s*['"](?:bloburl|datauristring)['"]/i,
  /^\s*[\w$]+\s*\+\s*[\w$]+\s*\+\s*['"]file=&downloadName=/i,
]

export function assertNoUnsafeDynamicIframes(content, artifactName) {
  for (const sink of HTML_IFRAME_SINKS) {
    if (sink.test(content)) throw new Error(`Dynamic iframe HTML injection is not allowed: ${artifactName}`)
  }

  const creations = [...content.matchAll(DYNAMIC_IFRAME_CREATION)]
  for (const [index, match] of creations.entries()) {
    const variable = match.groups?.variable
    if (!variable) throw new Error(`Unreviewed runtime iframe creation: ${artifactName}`)
    const start = match.index + match[0].length
    const nextStart = creations[index + 1]?.index ?? content.length
    const context = content.slice(start, Math.min(nextStart, start + 1200))
    const escaped = variable.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const srcAssignments = [...context.matchAll(new RegExp(`(?:^|[^\\w$])${escaped}\\s*\\.\\s*src\\s*=\\s*([^;,\\n]+)`, 'gi'))]
    if (srcAssignments.length !== 1 || !SAFE_PDF_IFRAME_SOURCES.some((pattern) => pattern.test(srcAssignments[0][1]))) {
      throw new Error(`Unreviewed runtime iframe creation: ${artifactName}`)
    }
  }
}

function readSingleSrc(tag, pageName) {
  const assignments = [...tag.matchAll(/(?:^|\s)src\s*=/gi)]
  const attributes = [...tag.matchAll(/(?:^|\s)src\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/gi)]
  if (assignments.length !== 1 || attributes.length !== 1) {
    throw new Error(`Iframe must have exactly one valid src attribute: ${pageName}`)
  }
  return (attributes[0][1] ?? attributes[0][2] ?? attributes[0][3]).replaceAll('&amp;', '&')
}

function isApprovedWidgetUrl(raw) {
  try {
    const url = new URL(raw)
    if (url.protocol !== 'https:' || url.hostname !== 'yandex.ru' || url.username || url.password || url.port || url.hash) return false
    const keys = [...url.searchParams.keys()].sort()
    return (url.pathname === APPROVED_REVIEW_PATH
      && keys.join(',') === 'comments,theme'
      && url.searchParams.get('comments') === ''
      && ['dark', 'light'].includes(url.searchParams.get('theme'))) ||
      (url.pathname === APPROVED_MAP_PATH
        && keys.join(',') === 'oid,ol,z'
        && url.searchParams.get('ol') === 'biz'
        && url.searchParams.get('oid') === '68540156780'
        && url.searchParams.get('z') === '16')
  } catch {
    return false
  }
}

export function validateYandexEmbedArtifact(html, pageName, automaticEnabled) {
  assertNoUnsafeDynamicIframes(html, pageName)
  const iframeTags = [...html.matchAll(/<iframe\b[^>]*>/gi)].map(match => match[0])
  if (iframeTags.length === 0) return []

  const normalizedPage = pageName.replaceAll('\\', '/')
  if (!automaticEnabled || normalizedPage !== 'o-kompanii.html' || iframeTags.length !== 2) {
    throw new Error(`Unexpected embed surface: ${pageName}`)
  }

  const sources = iframeTags.map(tag => readSingleSrc(tag, pageName))
  if (sources.some(source => !isApprovedWidgetUrl(source))) {
    throw new Error(`Unapproved iframe origin or widget: ${pageName}`)
  }
  const reviewCount = sources.filter(source => new URL(source).pathname === APPROVED_REVIEW_PATH).length
  const mapCount = sources.filter(source => new URL(source).pathname === APPROVED_MAP_PATH).length
  if (reviewCount !== 1 || mapCount !== 1) throw new Error(`Expected exactly one approved Yandex review and map widget: ${pageName}`)
  return sources
}
