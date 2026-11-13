import assert from 'node:assert/strict'
import test from 'node:test'
import fs from 'node:fs'
import { assertNoUnsafeDynamicIframes, validateYandexEmbedArtifact } from './yandex-embed-artifact-gate.mjs'

const approved = '<iframe src="https://yandex.ru/maps-reviews-widget/68540156780?comments=&amp;theme=dark"></iframe>' +
  '<iframe src="https://yandex.ru/map-widget/v1/?ol=biz&amp;oid=68540156780&amp;z=16"></iframe>'

test('allows exactly the approved Yandex widgets on the canonical about page', () => {
  const result = validateYandexEmbedArtifact(approved, 'o-kompanii.html', true)
  assert.equal(result.length, 2)
  assert.ok(result.some(url => url.includes('/maps-reviews-widget/')))
  assert.ok(result.some(url => url.includes('/map-widget/v1/')))
})

test('rejects unapproved iframe URLs even when whitespace surrounds src assignment', () => {
  assert.throws(
    () => validateYandexEmbedArtifact('<iframe src = "https://example.com/widget"></iframe>' +
      '<iframe src="https://yandex.ru/map-widget/v1/?ol=biz&amp;oid=68540156780&amp;z=16"></iframe>', 'o-kompanii.html', true),
    /Unapproved iframe origin/
  )
})

test('rejects duplicate src attributes', () => {
  assert.throws(
    () => validateYandexEmbedArtifact('<iframe src="https://yandex.ru/map-widget/v1/?ol=biz&amp;oid=68540156780&amp;z=16" src = "https://example.com"></iframe><iframe src="https://yandex.ru/maps-reviews-widget/68540156780?comments=&amp;theme=dark"></iframe>', 'o-kompanii.html', true),
    /exactly one valid src/
  )
})

test('does not allow the widgets on a nested path with the same basename', () => {
  assert.throws(
    () => validateYandexEmbedArtifact(approved, 'archive/o-kompanii.html', true),
    /Unexpected embed surface/
  )
})

test('rejects wrong host, business ID, query parameters, and disabled embed mode', () => {
  const wrongHost = approved.replace('https://yandex.ru/map-widget', 'https://evil.example/map-widget')
  assert.throws(() => validateYandexEmbedArtifact(wrongHost, 'o-kompanii.html', true), /Unapproved iframe origin/)
  const wrongId = approved.replace('oid=68540156780', 'oid=1')
  assert.throws(() => validateYandexEmbedArtifact(wrongId, 'o-kompanii.html', true), /Unapproved iframe origin/)
  const extraParam = approved.replace('z=16', 'z=16&amp;extra=1')
  assert.throws(() => validateYandexEmbedArtifact(extraParam, 'o-kompanii.html', true), /Unapproved iframe origin/)
  assert.throws(() => validateYandexEmbedArtifact(approved, 'o-kompanii.html', false), /Unexpected embed surface/)
})

test('allows pages without iframe surfaces', () => {
  assert.deepEqual(validateYandexEmbedArtifact('<main>content</main>', 'index.html', false), [])
})

test('rejects dynamically created iframes pointing to an external origin', () => {
  assert.throws(
    () => assertNoUnsafeDynamicIframes('const frame=document.createElement("iframe"); frame.src="https://evil.example"; document.body.append(frame)', 'chunk.js'),
    /Unreviewed runtime iframe creation/
  )
})

test('rejects dynamic iframe URLs supplied by an unchecked variable', () => {
  assert.throws(
    () => assertNoUnsafeDynamicIframes('const frame=document.createElement("iframe"); frame.src=widgetUrl; document.body.append(frame)', 'chunk.js'),
    /Unreviewed runtime iframe creation/
  )
})

test('does not let a safe PDF source on a different iframe bless an external URL', () => {
  assert.throws(
    () => assertNoUnsafeDynamicIframes(
      'const frame=document.createElement("iframe");frame.src="https://evil.example";const other=document.createElement("iframe");other.src=this.output("bloburl",options)',
      'chunk.js'
    ),
    /Unreviewed runtime iframe creation/
  )
})

test('does not let a safe PDF source on a different iframe bless an unchecked variable URL', () => {
  assert.throws(
    () => assertNoUnsafeDynamicIframes(
      'const frame=document.createElement("iframe");frame.src=externalUrl;const other=document.createElement("iframe");other.src=this.output("bloburl",options)',
      'chunk.js'
    ),
    /Unreviewed runtime iframe creation/
  )
})

test('rejects HTML string sinks that can inject iframe markup', () => {
  assert.throws(
    () => assertNoUnsafeDynamicIframes('container.innerHTML = `<iframe src="https://evil.example"></iframe>`', 'chunk.js'),
    /Dynamic iframe HTML injection/
  )
})

test('permits the known PDF local blob/data preview iframe paths', () => {
  assert.doesNotThrow(() => assertNoUnsafeDynamicIframes(
    'const a=document.createElement("iframe");a.src=this.output("bloburl",options);const b=document.createElement("iframe");b.src=this.output("datauristring",options)',
    '_next/static/chunks/pdf.js'
  ))
})

test('allows the exact verified two-location map, rejects any changed coordinates', () => {
  const company = JSON.parse(fs.readFileSync(new URL('../src/data/company-locations.json', import.meta.url), 'utf8'))
  const html = approved.replace('https://yandex.ru/map-widget/v1/?ol=biz&amp;oid=68540156780&amp;z=16', company.mapEmbedUrl.replaceAll('&', '&amp;'))
  assert.equal(validateYandexEmbedArtifact(html, 'o-kompanii.html', true).length, 2)
  assert.throws(() => validateYandexEmbedArtifact(html.replace('55.555411', '55.000001'), 'o-kompanii.html', true), /Unapproved iframe/)
})

test('permits only the local contract PDF on its dedicated page in both build profiles', () => {
  for (const base of ['', '/NEW-SITE-BANI']) {
    const html = `<iframe src="${base}/documents/banger-contract-sample.pdf#view=FitH"></iframe>`
    assert.equal(validateYandexEmbedArtifact(html, 'obrazec-dogovora.html', false).length, 1)
    assert.throws(() => validateYandexEmbedArtifact(html, 'index.html', true), /Unexpected embed surface/)
  }
})

test('rejects external, arbitrary, duplicate and protocol-relative contract frames', () => {
  for (const source of ['https://evil.example/doc.pdf', '//evil.example/doc.pdf', '/documents/private.pdf', '/documents/banger-contract-sample.pdf?url=https://evil.example']) {
    assert.throws(() => validateYandexEmbedArtifact(`<iframe src="${source}"></iframe>`, 'obrazec-dogovora.html', true), /Unapproved contract/)
  }
  assert.throws(() => validateYandexEmbedArtifact('<iframe src="/documents/banger-contract-sample.pdf#view=FitH"></iframe>'.repeat(2), 'obrazec-dogovora.html', true), /Unapproved contract/)
})

test('rejects srcdoc and inline event handlers even with the approved PDF source', () => {
  for (const attribute of ['srcdoc="active-content"', 'srcDoc = "active-content"', 'onload="active-content"', 'ONERROR = active-content']) {
    assert.throws(() => validateYandexEmbedArtifact(`<iframe src="/documents/banger-contract-sample.pdf#view=FitH" ${attribute}></iframe>`, 'obrazec-dogovora.html', false), /Active iframe attributes/)
  }
})
