import assert from 'node:assert/strict'

export function escapeHtml(value) {
  return value.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character])
}

function inlineMarkdown(value) {
  const escaped = escapeHtml(value)
  return escaped
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_match, label, href) => {
      const url = new URL(href)
      assert(url.protocol === 'https:' && url.hostname === 'jamanetwork.com' && url.pathname === '/journals/jamainternalmedicine/fullarticle/2130724/' && !url.username && !url.password && !url.search && !url.hash, 'article links must use the approved JAMA Network HTTPS source')
      return `<a href="${escapeHtml(url.toString())}" target="_blank" rel="noopener noreferrer">${label}</a>`
    })
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
}

export function toArticleHtml(markdown, slug) {
  assert(!/<\s*\/?[a-z][^>]*>/i.test(markdown), `${slug}: raw HTML is not allowed in supplied article content`)
  const elements = []
  const toc = []
  let textLines = []
  const flushParagraph = () => {
    if (!textLines.length) return
    elements.push(`<p>${inlineMarkdown(textLines.join(' ').trim())}</p>`)
    textLines = []
  }
  let section = 0
  for (const line of markdown.replaceAll('\r\n', '\n').trim().split('\n')) {
    const value = line.trim()
    if (!value || value === '---') { flushParagraph(); continue }
    const heading = value.match(/^##\s+(.+)$/)
    if (heading) {
      flushParagraph()
      section += 1
      const id = `section-${section * 2 - 1}`
      const title = heading[1].trim()
      toc.push({ id, title, level: 2 })
      elements.push(`<h2 id="${id}">${escapeHtml(title)}</h2>`)
      continue
    }
    assert(!/^#\s/.test(value), `${slug}: article body must not introduce an extra H1`)
    textLines.push(value)
  }
  flushParagraph()
  assert(toc.length >= 2, `${slug}: expected editorial section headings`)
  return { content: elements.join('\n'), toc }
}
