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

Live service on 2026-11-02: `https://banger-leads.onrender.com` returns `/health` 200, browser preflight 204 for `https://morzzes.github.io`, rejects invalid payloads with 400, and keeps the MAX token only in the Render environment. It still runs the legacy single-file contract from the 2026-10-06 snapshot: in-memory request-ID dedupe and rate limits, no persistent lead store.

The test Pages build (`.github/workflows/pages-test.yml`) mounts the real online form only when `NEXT_PUBLIC_LEADS_ENDPOINT=https://banger-leads.onrender.com/leads` is supplied at build time. The form submits the legacy contract (1) and puts the configuration summary into the bounded `comment` field, so the manager receives the selected options and total in the MAX message. The durable contract (3) is not active because approved consent documents are not published yet.

## Durable backend status (implemented, not deployed)

`durable-server.mjs` + `durable-store.mjs` implement SQLite/WAL persistent storage, atomic lead+consent+outbox admission, durable request-ID dedupe, HMAC-pseudonymised rate limits, a delivery journal without raw errors, bounded MAX 429 retry and explicit unknown-outcome handling, plus online backup/restore (`durable-backup.mjs`). The local HTTP drill in `docs/calculator-pdf-forms-2026-11-02/durable-drill.json` covers admission, restart dedupe, 409 conflict, origin/consent rejection, rate limit, backup and restore.

It is deliberately not started on Render free: that plan has no persistent disk, and the backend refuses to start without an absolute persistent path and operator attestations. To activate it, the owner must provide:

1. A persistent disk or a Russian-hosted private volume mounted at an absolute path, with ACLs that exclude other users and encrypted backups.
2. `LEADS_DB_PATH` (absolute, on that volume) and `LEAD_DOCUMENT_BUNDLE` (approved documents JSON with exact SHA-256 texts/versions).
3. `ALLOWED_ORIGINS`, `MAX_BOT_TOKEN` (server-only) and numeric `MAX_USER_ID`, plus `RATE_HMAC_KEY` of at least 32 random characters stored only in server secrets.
4. `RU_STORAGE_ATTESTED=1`, `LEGAL_APPROVAL_ATTESTED=1`, `BACKUP_RESTORE_ATTESTED=1` after the actual storage/legal/restore facts are verified by the owner (flags are not evidence by themselves).
5. A scheduled encrypted backup/retention policy and one real restore drill on the hosting volume.
6. A separately confirmed test MAX recipient for `TEST_MODE=1` (production recipient is never a fallback).

The CLI/Git deployment of `durable-server.mjs` on Render also requires the Render service to be updated (auto-deploy is off; this session has no Render dashboard/API credentials and must not use the leaked historical token). Until those conditions are met, the live form keeps using the legacy endpoint and MAX delivery is real, while long-term lead storage is not yet durable.
