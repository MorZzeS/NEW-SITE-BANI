# MAX local delivery review — 2026-10-06 (historical test)

- Recipient: MAX_USER_ID=2758798, exclusively user_id. MAX_CHAT_ID is ignored.
- Local test used private environment. The old token was later exposed during Render UI inspection and rotated by the owner. Current results: RENDER_BACKEND_DEPLOYMENT.md. No token committed or copied into frontend.
- Authorized real test through POST /leads: HTTP 200, ok=true, matching requestId after MAX confirmed a message. One technical test message delivered.
- Initial attempt returned 502 before delivery because Node lacked the local certificate issuer (UNABLE_TO_GET_ISSUER_CERT_LOCALLY).
- Successful test used Node 24 --use-system-ca (Windows trusted certificate store). TLS verification remained enabled. Use this flag on this Windows runtime; other hosts need their correct trusted CA configuration.
- Mock tests cover success, ignored chat_id, missing user_id, MAX non-2xx, missing receipt, timeout, validation, CORS, idempotency and rate limit.
- Production build and check:static PASS: 136 HTML pages, 286 local URLs, 31 models, 28 plans, no errors.
- No push. This local delivery test does not deploy HTTPS backend hosting or connect the published frontend endpoint.
