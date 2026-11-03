import fs from 'node:fs'
import path from 'node:path'

export class Cdp {
  constructor(wsUrl) { this.wsUrl = wsUrl; this.nextId = 1; this.pending = new Map(); this.events = new Map(); this.sessionId = undefined }
  async connect() {
    this.ws = new WebSocket(this.wsUrl)
    await new Promise((resolve, reject) => {
      this.ws.addEventListener('open', resolve, { once: true })
      this.ws.addEventListener('error', reject, { once: true })
    })
    this.ws.addEventListener('message', event => {
      const message = JSON.parse(event.data)
      if (message.id && this.pending.has(message.id)) {
        const { resolve, reject } = this.pending.get(message.id)
        this.pending.delete(message.id)
        if (message.error) reject(new Error(`${message.error.message} ${message.error.data || ''}`))
        else resolve(message.result)
        return
      }
      if (message.method) {
        for (const listener of this.events.get(message.method) || []) listener(message.params, message.sessionId)
      }
    })
  }
  on(method, listener) {
    if (!this.events.has(method)) this.events.set(method, [])
    this.events.get(method).push(listener)
  }
  send(method, params = {}, sessionId = this.sessionId) {
    const id = this.nextId++
    const payload = { id, method, params }
    if (sessionId) payload.sessionId = sessionId
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject })
      this.ws.send(JSON.stringify(payload))
    })
  }
  async attachPage(targetId) {
    const { sessionId } = await this.send('Target.attachToTarget', { targetId, flatten: true }, undefined)
    this.sessionId = sessionId
    this.on('Page.loadEventFired', () => this.loadResolvers.splice(0).forEach(resolve => resolve()))
    this.loadResolvers = []
    return sessionId
  }
  waitForLoad(timeout = 45000) {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('load timeout')), timeout)
      this.loadResolvers.push(() => { clearTimeout(timer); resolve() })
    })
  }
  close() { try { this.ws.close() } catch {} }
}

export async function browserWs(port) {
  const response = await fetch(`http://127.0.0.1:${port}/json/version`)
  return response.json()
}

export function writeBase64(file, base64) { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, Buffer.from(base64, 'base64')) }

export async function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)) }

export async function waitForFile(directory, timeout = 120000) {
  const start = Date.now()
  while (Date.now() - start < timeout) {
    const files = fs.existsSync(directory) ? fs.readdirSync(directory).filter(name => name.endsWith('.pdf')) : []
    if (files.length) return path.join(directory, files[0])
    await sleep(500)
  }
  throw new Error('PDF download timeout')
}
