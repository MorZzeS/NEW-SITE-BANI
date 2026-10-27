import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { cities, refreshWeather as collect } from './refresh-weather.mjs'
const refreshWeather = options => collect({ ...options, pause: async () => {} })

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
    assert.equal(calls.length, cities.length)
    assert(first.every(city => city.available))
    assert(calls.every(call => call.headers['User-Agent'].includes('banger.ram@bk.ru') && !('Cookie' in call.headers) && !('X-Forwarded-For' in call.headers)))
    assert.equal(new Set(calls.map(call => call.url)).size, cities.length)
    for (const [index, city] of cities.entries()) {
      const url = new URL(calls[index].url)
      assert.equal(Number(url.searchParams.get('lat')), Math.trunc(city.latitude * 10_000) / 10_000)
      assert.equal(Number(url.searchParams.get('lon')), Math.trunc(city.longitude * 10_000) / 10_000)
    }
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

test('rate limit stops remaining upstream requests and caches the retry window', async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'banger-weather-'))
  const output = path.join(root, 'out'), cache = path.join(root, 'cache')
  const now = Date.parse('2026-10-26T06:00:00Z')
  let requests = 0
  try {
    const results = await refreshWeather({ output, cache, now, fetchImpl: async () => { requests++; return new Response(null, { status: 429, headers: { 'retry-after': '7200' } }) } })
    assert.equal(requests, 1)
    assert(results.every(city => !city.available))
    await refreshWeather({ output, cache, now: now + 61 * 60_000, fetchImpl: async () => { requests++; throw new Error('Must respect Retry-After') } })
    assert.equal(requests, 1)
    const snapshot = JSON.parse(await fs.readFile(path.join(cache, 'moscow.json')))
    assert.equal(snapshot.expiresAt, new Date(now + 2 * 60 * 60_000).toISOString())
  } finally {
    assert(path.dirname(root) === os.tmpdir() && path.basename(root).startsWith('banger-weather-'))
    await fs.rm(root, { recursive: true, force: true })
  }
})

test('collector waits between serial upstream requests', async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'banger-weather-'))
  const now = Date.parse('2026-10-26T06:00:00Z')
  const events = []
  try {
    await collect({ output: path.join(root, 'out'), cache: path.join(root, 'cache'), now, pause: async milliseconds => { events.push(`pause:${milliseconds}`) }, fetchImpl: async () => {
      events.push('fetch')
      return new Response(null, { status: 503 })
    } })
    assert.equal(events.filter(item => item === 'fetch').length, cities.length)
    assert.equal(events.filter(item => item === 'pause:100').length, cities.length - 1)
    assert.equal(events[0], 'fetch')
    assert.equal(events[1], 'pause:100')
  } finally {
    assert(path.dirname(root) === os.tmpdir() && path.basename(root).startsWith('banger-weather-'))
    await fs.rm(root, { recursive: true, force: true })
  }
})

test('missing Last-Modified is never replaced by an invented conditional timestamp', async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'banger-weather-'))
  const output = path.join(root, 'out'), cache = path.join(root, 'cache')
  const now = Date.parse('2026-10-26T06:00:00Z')
  const forecast = { properties: { meta: { updated_at: new Date(now).toISOString() }, timeseries: [{ time: new Date(now).toISOString(), data: {} }] } }
  try {
    await refreshWeather({ output, cache, now, fetchImpl: async () => new Response(JSON.stringify(forecast), { status: 200, headers: { expires: new Date(now + 60 * 60_000).toUTCString() } }) })
    await refreshWeather({ output, cache, now: now + 61 * 60_000, fetchImpl: async (_url, options) => {
      assert.equal(options.headers['If-Modified-Since'], undefined)
      return new Response(JSON.stringify(forecast), { status: 200 })
    } })
  } finally {
    assert(path.dirname(root) === os.tmpdir() && path.basename(root).startsWith('banger-weather-'))
    await fs.rm(root, { recursive: true, force: true })
  }
})
