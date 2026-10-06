# Cloudflare Worker deployment — 2026-10-06

## Result: BLOCKED on upstream TLS, not ready for form activation

Worker: https://banger-leads.banger-site.workers.dev
Endpoint: https://banger-leads.banger-site.workers.dev/leads
Latest deployed version: 1dbbd408-a1b9-44e3-8a1e-19dc068bf276

Wrangler OAuth device login succeeded. Workers Free deployment and SQLite Durable Object creation succeeded. MAX_BOT_TOKEN was uploaded exclusively using wrangler secret put MAX_BOT_TOKEN from the private local environment via stdin. MAX_USER_ID=2758798 is a non-secret Worker variable. MAX_CHAT_ID is ignored.

Real POST: HTTP 502, ok=false. Live Worker tail identified MAX upstream HTTP status 526. No MAX delivery receipt was received; delivery is NOT confirmed. Initial workers.dev handshake failure resolved after certificate provisioning; this is a separate upstream MAX certificate issue.

Cloudflare external fetch validates origin TLS. Its documented Custom Origin Trust Store solution requires Advanced Certificate Manager on a zone and cots_on_external_fetch. This is not the selected Free workers.dev setup. No TLS checks disabled, no third-party relay used, no production/DNS changes.

References:
- https://developers.cloudflare.com/support/troubleshooting/http-status-codes/cloudflare-5xx-errors/error-526/
- https://developers.cloudflare.com/ssl/origin-configuration/custom-origin-trust-store/
- https://developers.cloudflare.com/workers/runtime-apis/nodejs/https/

Security scan: 516 tracked files, git diff, src, backend and existing static export checked against the actual private token: no unexpected matches. The sole match was ignored backend/.env; its MAX_BOT_TOKEN entry was removed after successful Cloudflare secret upload. No backup of the token was created. Cloudflare secret list confirms MAX_BOT_TOKEN. Root .env*, backend/.env, .dev.vars* and .wrangler/ excluded from Git. No secrets in wrangler.jsonc.

Backend mock tests: 6/6 PASS. Frontend sendLead contract tests PASS. Live validation rejects no-consent with 400 and untrusted Origin with 403. Real delivery FAIL (526 upstream -> 502 frontend). No frontend endpoint configured because delivery has not succeeded. Existing forms remain honestly disabled with direct contact options. No push.

Required decision: approve a TLS-compatible Node backend host with the official MAX CA installed, or a Cloudflare zone with Advanced Certificate Manager/custom trust store. Either changes the currently selected hosting scope. Frontend endpoint activation, successful real form submission and final all-form end-to-end QA remain pending that decision.
