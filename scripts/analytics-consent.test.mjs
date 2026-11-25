import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import ts from 'typescript'

function loadTsModule(file, requireMock = () => { throw new Error('Unexpected import') }) {
  const source = readFileSync(new URL(file, import.meta.url), 'utf8')
  const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText
  const loaded = { exports: {} }
  new Function('exports', 'require', 'module', output)(loaded.exports, requireMock, loaded)
  return loaded.exports
}

const consentModule = loadTsModule('../src/lib/analytics-consent.ts')
const storage = new Map()
let blockWrites = false
let blockRemoval = false
let sessionDenied = false
let blockSessionWrites = false
let cookieDenied = false
let blockCookieWrites = false
const events = []
const broadcastMessages = []
globalThis.BroadcastChannel = class {
  constructor(name) { assert.equal(name, 'banger-analytics-consent') }
  postMessage(message) { broadcastMessages.push(message) }
  addEventListener() {}
  removeEventListener() {}
  close() {}
}
globalThis.window = {
  localStorage: {
    getItem: key => storage.get(key) ?? null,
    setItem: (key, value) => { if (blockWrites) throw new Error('Storage blocked'); storage.set(key, value) },
    removeItem: key => { if (blockRemoval) throw new Error('Storage blocked'); storage.delete(key) },
  },
  sessionStorage: {
    getItem: () => sessionDenied ? '1' : null,
    setItem: () => { if (blockSessionWrites) throw new Error('Session storage blocked'); sessionDenied = true },
    removeItem: () => { if (blockSessionWrites) throw new Error('Session storage blocked'); sessionDenied = false },
  },
  document: Object.defineProperty({}, 'cookie', {
    get: () => cookieDenied ? 'banger-analytics-denied=1' : '',
    set: value => {
      if (blockCookieWrites) throw new Error('Cookies blocked')
      cookieDenied = String(value).startsWith('banger-analytics-denied=1;')
    },
  }),
  location: { protocol: 'https:' },
  dispatchEvent: event => { events.push(event); return true },
}
globalThis.CustomEvent = class CustomEvent { constructor(type, options) { this.type = type; this.detail = options?.detail } }

assert.equal(consentModule.readAnalyticsConsent(), null, 'missing choice fails closed')
assert.equal(consentModule.writeAnalyticsConsent(true), true)
assert.equal(broadcastMessages.at(-1).kind, 'changed', 'a saved opt-in synchronizes with other open tabs')
const accepted = consentModule.readAnalyticsConsent()
assert.equal(accepted.analytics, true)
assert.equal(accepted.behaviorReplay, false, 'statistics permission does not grant replay permission')
assert.equal(accepted.version, 3)
assert.ok(Number.isFinite(Date.parse(accepted.updatedAt)), 'choice timestamp is valid')
storage.set('banger-consent-v3', JSON.stringify({ analytics: true, version: 2, updatedAt: accepted.updatedAt }))
assert.equal(consentModule.readAnalyticsConsent(), null, 'old statistics consent cannot enable the new release')
storage.set('banger-consent-v3', JSON.stringify({ analytics: true, behaviorReplay: false, version: 3, updatedAt: new Date(Date.now() - 366 * 24 * 60 * 60 * 1000).toISOString() }))
assert.equal(consentModule.readAnalyticsConsent(), null, 'expired analytics permission requires a fresh choice')
assert.equal(consentModule.writeAnalyticsConsent(true, true), true)
const replayOptIn = consentModule.readAnalyticsConsent()
assert.equal(replayOptIn.behaviorReplay, true, 'replay requires a separate explicit choice')
assert.equal(consentModule.writeAnalyticsConsent(false), true)
assert.equal(broadcastMessages.at(-1).kind, 'revoked', 'a refusal is broadcast so active sessions stop in other tabs')
assert.equal(consentModule.readAnalyticsConsent(), null, 'the saved refusal marker prevents any old opt-in from being read')
assert.equal(consentModule.analyticsAllowedFromConsentEvent({ analytics: true }), true)
assert.equal(consentModule.analyticsAllowedFromConsentEvent({ analytics: false }), false)
assert.equal(consentModule.analyticsAllowedFromConsentEvent(null), false, 'missing consent event detail is a refusal')
consentModule.writeAnalyticsConsent(true)
const persistedOptIn = consentModule.readAnalyticsConsent()
assert.equal(consentModule.analyticsConsentEventAllowsLoading(persistedOptIn, persistedOptIn), true)
assert.equal(consentModule.canResumeAnalyticsForTab(false, persistedOptIn), true)
assert.equal(consentModule.canResumeAnalyticsForTab(true, persistedOptIn), false, 'a stale stored opt-in cannot resume analytics after this tab observed a refusal')
assert.equal(consentModule.analyticsConsentEventAllowsLoading({ ...persistedOptIn, behaviorReplay: true }, persistedOptIn), false, 'an event cannot expand the stored replay choice')
assert.equal(consentModule.analyticsConsentEventAllowsLoading({ ...persistedOptIn, updatedAt: '2026-01-01T00:00:00.000Z' }, persistedOptIn), false, 'an event must match the current stored choice')
assert.equal(consentModule.analyticsConsentEventAllowsLoading({ analytics: true }, null), false, 'an event cannot start tracking without a saved choice')
assert.equal(consentModule.analyticsConsentEventAllowsLoading({ analytics: false }, persistedOptIn), false)
const analyticsPath = loadTsModule('../src/lib/analytics-path.ts')
assert.equal(analyticsPath.safeAnalyticsPath('/privacy?phone=%2B79000000000#form'), '/privacy')
assert.equal(analyticsPath.safeAnalyticsPath('/banya/scandinavia-6?email=private@example.com'), '/banya/model')
assert.equal(analyticsPath.safeAnalyticsPath('/nashi-raboty/customer-alex-ivanov'), '/nashi-raboty/project')
assert.equal(analyticsPath.safeAnalyticsPath('/poleznoe/kak-vybrat-pech'), '/poleznoe/article')
assert.equal(analyticsPath.safeAnalyticsPath('/private@example.com/secret'), '/other')
assert.equal(analyticsPath.analyticsRouteGoal('/banya/istok-4'), 'model_view')
assert.equal(analyticsPath.analyticsRouteGoal('/dom/usadba-praktik'), 'model_view')
assert.equal(analyticsPath.analyticsRouteGoal('/nashi-raboty/project-a'), 'project_view')
assert.equal(analyticsPath.analyticsRouteGoal('/nashi-raboty/banya-6x26-proekt-klienta'), null, 'legacy redirect route is not double-counted as a project view')
assert.equal(analyticsPath.analyticsRouteGoal('/unknown'), null)
assert.equal(analyticsPath.safeAnalyticsReferer('https://banger.su/banya/model?phone=123', 'https://banger.su'), 'https://banger.su/banya/model')
assert.equal(analyticsPath.safeAnalyticsReferer('https://search.example/search?q=private', 'https://banger.su'), 'https://search.example/')
assert.equal(analyticsPath.safeAnalyticsReferer('javascript:alert(1)', 'https://banger.su'), '')
consentModule.writeAnalyticsConsent(true)
blockWrites = true
assert.equal(consentModule.writeAnalyticsConsent(false), true, 'cookie/session denial fallback persists a refusal when localStorage writes fail')
assert.equal(consentModule.readAnalyticsConsent(), null, 'fallback refusal blocks any previous opt-in')
assert.equal(consentModule.analyticsAllowedFromConsentEvent(events.at(-1).detail), false, 'the current tab stops even when refusal cannot be persisted')
blockWrites = false
consentModule.writeAnalyticsConsent(true)
blockWrites = true
blockRemoval = true
assert.equal(consentModule.writeAnalyticsConsent(false), true, 'fallback denial is persisted even when localStorage write and removal fail')
assert.equal(JSON.parse(storage.get('banger-consent-v3')).analytics, true, 'the test preserves the old localStorage opt-in')
assert.equal(consentModule.readAnalyticsConsent(), null, 'fallback denial overrides the old localStorage opt-in after reload')
assert.equal(consentModule.analyticsAllowedFromConsentEvent(events.at(-1).detail), false, 'the current tab stops despite an old persisted opt-in')
blockRemoval = false
blockWrites = false
consentModule.writeAnalyticsConsent(false)

consentModule.writeAnalyticsConsent(true)
blockWrites = true
blockRemoval = true
blockCookieWrites = true
blockSessionWrites = false
assert.equal(consentModule.writeAnalyticsConsent(false), false, 'sessionStorage alone is not reported as a durable refusal')
assert.equal(consentModule.readAnalyticsConsent(), null, 'session-only refusal blocks the current tab despite a stale stored grant')
assert.equal(broadcastMessages.at(-1).kind, 'revoked', 'even a non-persistent refusal stops other currently open tabs')
storage.delete('banger-consent-v3')
assert.equal(consentModule.writeAnalyticsConsent(false), false, 'removing an absent stored choice is not counted as a saved refusal')
assert.equal(consentModule.readAnalyticsConsent(), null, 'the temporary refusal still blocks the current tab when no old choice existed')
blockWrites = false
blockRemoval = false
blockCookieWrites = false
blockSessionWrites = false
consentModule.writeAnalyticsConsent(false)

consentModule.writeAnalyticsConsent(true)
blockWrites = true
blockRemoval = true
blockSessionWrites = true
blockCookieWrites = true
assert.equal(consentModule.writeAnalyticsConsent(false), false, 'if every storage mechanism is unavailable the refusal is not reported as persisted')
assert.equal(consentModule.analyticsAllowedFromConsentEvent(events.at(-1).detail), false, 'the current tab still stops when no persistent refusal channel is available')
assert.equal(consentModule.readAnalyticsConsent(), null, 'non-writable localStorage cannot reactivate a stale grant on reload')
blockWrites = false
blockRemoval = false
blockSessionWrites = false
blockCookieWrites = false
consentModule.writeAnalyticsConsent(false)

let analyticsEnabled = true
const analytics = loadTsModule('../src/lib/analytics.ts', name => {
  if (name === '@/lib/analytics-consent') return { readAnalyticsConsent: () => consentModule.readAnalyticsConsent() }
  if (name === '@/lib/release-policy') return { releasePolicy: { get analytics() { return analyticsEnabled } } }
  throw new Error(`Unexpected import ${name}`)
})
const savedId = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID
process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID = '111684946'
globalThis.window.location = { hostname: 'banger.su', protocol: 'https:' }
const calls = []
globalThis.window.ym = (...args) => calls.push(args)

assert.equal(analytics.isProductionAnalyticsHost('banger.su', 'https:'), true)
assert.equal(analytics.isProductionAnalyticsHost('www.banger.su', 'https:'), true)
assert.equal(analytics.isProductionAnalyticsHost('banger.su', 'http:'), false)
assert.equal(analytics.isProductionAnalyticsHost('test.github.io', 'https:'), false)
assert.equal(analytics.isProductionAnalyticsHost('preview.banger.su', 'https:'), false)
assert.equal(analytics.approvedMetrikaId(), 111684946)

consentModule.writeAnalyticsConsent(false)
analytics.setAnalyticsInitialized(false)
analytics.trackGoal('lead_success')
assert.equal(calls.length, 0, 'refusal prevents goal transmission')

consentModule.writeAnalyticsConsent(true)
analytics.trackGoal('lead_success')
assert.equal(calls.length, 0, 'events wait in memory until the tag is initialized')
analytics.setAnalyticsInitialized(true)
assert.deepEqual(calls[0], [111684946, 'reachGoal', 'lead_success'], 'goals contain no user parameters')
analytics.trackGoal('phone_click')
assert.deepEqual(calls[1], [111684946, 'reachGoal', 'phone_click'])
globalThis.window.location.hostname = 'test.github.io'
analytics.trackGoal('telegram_click')
assert.equal(calls.length, 2, 'GitHub Pages host sends no goals even if the build flag is enabled')
globalThis.window.location.hostname = 'banger.su'

analyticsEnabled = false
analytics.trackGoal('max_click')
assert.equal(calls.length, 2, 'disabled build sends no goals')
analytics.setAnalyticsInitialized(false)
assert.equal(analytics.isProductionAnalyticsHost('banger.su', 'https:'), true)
if (savedId === undefined) delete process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID
else process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID = savedId
delete globalThis.window
delete globalThis.CustomEvent
delete globalThis.BroadcastChannel

console.log('Analytics/replay opt-in, refusal, migration, failed-storage handling, safe page paths, host allowlist and goal payload: PASS')
