import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { refreshWeather } from './refresh-weather.mjs'

test('fixed-city build collector respects cache, conditional refresh, and failure without stale success', async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'banger-weather-'))
  const output = path.join(root, 'out'), cache = path.join(root, 'cache')
  const now = Date.parse('2026-10-26T06:00:00Z')
  const calls = []
  const forecast = { properties: { meta: { updated_at: new Date(now).toISOString() }, timeseries: [{ time: new Date(now).toISOString(), data: {} }] } }
  try {
    const first = await refreshWeather({ output, cache, now, fetchImpl: async (url, options) => {
      calls.push({ url, headers: options.headers })
      return new Response(JSON.stringify(forecast), { status: 200, headers: { expires: new Date(now + 60 * 60_000).toUTCString(), 'last-modified': new Date(now).toUTCString() } })
    } })
    assert.equal(calls.length, 2)
    assert(first.every(city => city.available))
    assert(calls.every(call => call.headers['User-Agent'].includes('https://banger.su/') && !('Cookie' in call.headers) && !('X-Forwarded-For' in call.headers)))
    assert(calls[0].url.endsWith('lat=55.5675&lon=38.225'))
    assert(calls[1].url.endsWith('lat=55.7558&lon=37.6173'))
    await refreshWeather({ output, cache, now: now + 30 * 60_000, fetchImpl: async () => { throw new Error('Must not poll before Expires') } })
    assert.equal(JSON.parse(await fs.readFile(path.join(output, 'moscow.json'))).checkedAt, new Date(now).toISOString())
    const conditional = await refreshWeather({ output, cache, now: now + 61 * 60_000, fetchImpl: async (_url, options) => {
      assert(options.headers['If-Modified-Since'])
      return new Response(null, { status: 304, headers: { expires: new Date(now + 121 * 60_000).toUTCString() } })
    } })
    assert(conditional.every(city => city.available))
    const failed = await refreshWeather({ output, cache, now: now + 3 * 60 * 60_000, fetchImpl: async () => new Response(null, { status: 503 }) })
    assert(failed.every(city => !city.available))
    assert.equal(JSON.parse(await fs.readFile(path.join(output, 'moscow.json'))).forecast, undefined)
    const oldModel = await refreshWeather({ output, cache, now: now + 14 * 60 * 60_000, fetchImpl: async () => new Response(JSON.stringify(forecast), { status: 200 }) })
    assert(oldModel.every(city => !city.available))
  } finally {
    // Only the known mkdtemp-created directory inside the OS temp directory.
    assert(path.dirname(root) === os.tmpdir() && path.basename(root).startsWith('banger-weather-'))
    await fs.rm(root, { recursive: true, force: true })
  }
})

test('a snapshot can expire for visitors before provider Expires without early upstream polling', async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'banger-weather-'))
  const output = path.join(root, 'out'), cache = path.join(root, 'cache')
  const now = Date.parse('2026-10-26T06:00:00Z')
  const forecast = { properties: { meta: { updated_at: new Date(now).toISOString() }, timeseries: [{ time: new Date(now).toISOString(), data: {} }] } }
  try {
    await refreshWeather({ output, cache, now, fetchImpl: async () => new Response(JSON.stringify(forecast), { status: 200, headers: { expires: new Date(now + 4 * 60 * 60_000).toUTCString() } }) })
    let calls = 0
    const expired = await refreshWeather({ output, cache, now: now + 121 * 60_000, fetchImpl: async () => { calls++; throw new Error('Provider Expires has not elapsed') } })
    assert.equal(calls, 0)
    assert(expired.every(city => !city.available))
  } finally {
    assert(path.dirname(root) === os.tmpdir() && path.basename(root).startsWith('banger-weather-'))
    await fs.rm(root, { recursive: true, force: true })
  }
})
