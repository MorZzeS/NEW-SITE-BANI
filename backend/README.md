# Lead endpoint for static BANGER.SU

This server is separate from GitHub Pages. Never place secrets in frontend data,
`NEXT_PUBLIC_*`, the static export, or Git. `.env.example` contains placeholders.

## Setup required from owner

1. Choose HTTPS backend hosting / reverse proxy. Run one Node 20+ instance with
   `node --env-file=backend/.env backend/leads-server.mjs` behind HTTPS.
2. Configure `MAX_BOT_TOKEN` and **one** of `MAX_CHAT_ID`, `MAX_USER_ID` in the
   backend environment. Set allowed frontend origins in `ALLOWED_ORIGINS`.
   With a trusted local reverse proxy, set `TRUST_PROXY=1` and overwrite
   `X-Forwarded-For` with the real client IP (for nginx, `$remote_addr`).
3. Set frontend `NEXT_PUBLIC_LEADS_ENDPOINT=https://<backend-host>/leads`, rebuild
   the static site, and test delivery to the real manager. No secrets in this URL.

No backend hosting, HTTPS URL, token or recipient ID has been invented or deployed.
Current frontend shows a clear unavailable state; no fake success receipt.

MAX API follows [official send-message documentation](https://dev.max.ru/docs-api/methods/POST/messages):
`POST https://platform-api2.max.ru/messages?chat_id=...` (or `user_id`), authorization
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
button, in-flight ref prevents duplicate clicks, 15-second timeout and inline errors.
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
Real end-to-end delivery is pending owner credentials and HTTPS hosting.
