# Lead endpoint for static BANGER.SU

This server is separate from GitHub Pages. Never place secrets in frontend data,
`NEXT_PUBLIC_*`, the static export, or Git. `.env.example` contains placeholders.

## Setup required from owner

1. Choose HTTPS backend hosting / reverse proxy. Run one Node 20+ instance with
   `node --env-file=backend/.env backend/leads-server.mjs` behind HTTPS.
2. Configure server-only `MAX_BOT_TOKEN` and `MAX_USER_ID=2758798` in the
   backend environment. Set allowed frontend origins in `ALLOWED_ORIGINS`.
   With a trusted local reverse proxy, set `TRUST_PROXY=1` and overwrite
   `X-Forwarded-For` with the real client IP (for nginx, `$remote_addr`).
3. Set frontend `NEXT_PUBLIC_LEADS_ENDPOINT=https://<backend-host>/leads`, rebuild
   the static site, and test delivery to the real manager. No secrets in this URL.

The owner confirmed recipient user_id 2758798. MAX_CHAT_ID is ignored; delivery uses user_id exclusively. HTTPS hosting is configured separately.
Current frontend shows a clear unavailable state; no fake success receipt.

MAX API follows [official send-message documentation](https://dev.max.ru/docs-api/methods/POST/messages):
`POST https://platform-api2.max.ru/messages?user_id=2758798`, authorization
token in the server header, plain text body. Use the platform's officially required
trusted certificate configuration if your host needs it; never disable TLS checks.

## Contract

`POST /leads`, JSON body:
`requestId`, `name`, `phone`, `model`, `page`, `comment`, `createdAt`, `consent`,
`website` (honeypot, empty), `startedAt` (form-open timestamp).
Server-generated UTC time is used in the manager message; client time is not trusted.

Success only after confirmed MAX response:
`200 { "ok": true, "requestId": "<same UUID>" }`.
Errors return `ok:false`: 400 invalid data, 403 origin, 409 pending/uncertain duplicate,
413 size, 415 content type, 429 rate limit, 502 MAX error/timeout, 503 missing config.

Frontend: required name/phone/consent, bounded fields, loading/disabled pending
button, in-flight ref prevents duplicate clicks, 75-second timeout and inline errors.
Unchanged retries retain their request ID, so a lost response does not create a
new delivery. Backend: CORS allowlist, origin/page matching, honeypot, minimum fill time, 8KB body,
bounded values, Russian phone validation, 5 attempts per IP per 10 minutes,
request ID cache and 10-second upstream timeout. No personal data or tokens logged.

Rate limits and idempotency are in memory in this single-instance reference server.
For multiple instances / restart durability, move them to shared persistent storage.
Behind a proxy, enforce client-IP rate limiting at the trusted proxy as well; this
server ignores `X-Forwarded-For` unless explicitly enabled for a loopback proxy.
A timed-out MAX delivery can be uncertain; no automatic retry is performed.

## Tests

`node --test backend/leads-server.test.mjs`
and `node scripts/verify-leads.mjs` use mocked delivery; they never message a manager.
For an explicitly authorized real delivery test, use the private backend environment. Never print or commit its token. See docs/MAX_DELIVERY_REVIEW.md for the latest result.

## Cloudflare Workers legacy alternative (not active)

Configuration: ../wrangler.jsonc; runtime: worker.mjs; shared validation: lead-validation.mjs.
Run `npx wrangler login --device` if localhost callback is inaccessible, then `npx wrangler deploy`.
Add the private token ONLY with `npx wrangler secret put MAX_BOT_TOKEN` (stdin, never command arguments or config).
Persistent admission/receipts use a SQLite Durable Object supported by Workers Free.
Receipts and hashed-IP counters expire; no lead text, phone or token is persisted in that storage.
No automatic retries after uncertain delivery; repeats within 24h return 409 until confirmed.

See ../docs/CLOUDFLARE_WORKER_DEPLOYMENT.md: current deployment is blocked by MAX upstream TLS 526. Do not activate frontend forms until a real delivery succeeds.

## Render (active hosting)
Use npm start in backend; render-start.mjs resolves the official additional CA and launches Node with NODE_EXTRA_CA_CERTS. See ../docs/RENDER_BACKEND_DEPLOYMENT.md. Rotated MAX token remains in Render private environment. No push.
