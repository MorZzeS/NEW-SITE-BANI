import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

function isContained(parent, child) {
  const relative = path.relative(parent, child)
  return relative !== '' && !relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative)
}

export function resolvePublicTarget(root, target) {
  const normalized = target.replaceAll('\\', '/')
  const segments = normalized.split('/')
  assert(normalized.startsWith('public/') && !normalized.includes('//') && segments.every(segment => segment && segment !== '.' && segment !== '..'), `Expected a canonical asset path under public/: ${target}`)

  const publicRoot = path.resolve(root, 'public')
  const resolved = path.resolve(root, ...segments)
  assert(isContained(publicRoot, resolved), `Asset target escapes public/: ${target}`)
  assert(fs.existsSync(publicRoot) && fs.existsSync(resolved), `Asset target does not exist: ${target}`)

  const realPublicRoot = fs.realpathSync.native(publicRoot)
  const realResolved = fs.realpathSync.native(resolved)
  assert(isContained(realPublicRoot, realResolved), `Asset target resolves outside public/: ${target}`)
  return realResolved
}

export function publicAssetUrl(root, target) {
  const resolved = resolvePublicTarget(root, target)
  const publicRoot = fs.realpathSync.native(path.resolve(root, 'public'))
  const relative = path.relative(publicRoot, resolved).split(path.sep).join('/')
  assert(relative && !relative.includes('//'), `Asset URL is not canonical: ${target}`)
  return `/` + relative
}

export function resolveArticleAssetUrl(root, url) {
  assert(url.startsWith('/images/articles/2026-11-26/') && !url.includes('//') && !/[?#%\\]/.test(url), `Unexpected public URL: ${url}`)
  return resolvePublicTarget(root, `public${url}`)
}
