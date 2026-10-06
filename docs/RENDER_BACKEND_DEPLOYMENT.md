# Render backend verification — 2026-10-06

Backend: https://banger-leads.onrender.com; /leads; /health. Service srv-db2k8kei0phs738sprng. Free, Node 24.21.0, bind 0.0.0.0, PORT from Render. Auto-deploy off.

## TLS and secrets

Official Russian Trusted Root CA downloaded from https://gu-st.ru/content/Other/doc/russian_trusted_root_ca.cer, linked by https://www.gosuslugi.ru/crt. Server-only PEM: backend/certs/mincifry-ca.pem. Provenance/fingerprint: backend/certs/source.json. Conversion changes encoding only.

render-start.mjs resolves an absolute CA path and starts Node with NODE_EXTRA_CA_CERTS before initialization. Actual path: /opt/render/project/src/.render-backend/certs/mincifry-ca.pem. Standard CA roots and TLS verification remain enabled. No bypass. start-server.mjs verifies authenticated MAX /me before listening. Render log: MAX /me PASS 200.

MAX_USER_ID=2758798; MAX_CHAT_ID ignored. Owner rotated the previously exposed token directly in Render. Replacement token not read or printed; consumed only from private server environment.

## Deployment without Git push

Local server snapshot supplied in Render Build Command by scripts/create-render-backend-bundle.mjs. SHA256 checked before writing six whitelisted files. No secret in package. Snapshot SHA256: e4f5d40d3b34ab3307648e552d40a48b55e7994e064585152feefb97eddc83ce. Start: node .render-backend/render-start.mjs.

Remote checkout remains 73abea7d4e811a956b1f580c65cffd1835ea316e. Future backend changes require updating the snapshot until publication is authorized. render.yaml supports ordinary later repository deployment.

## Verification

- /health: HTTP 200, ok=true.
- Real technical /leads: HTTP 200, ok=true, matching requestId after MAX message receipt. Duplicate succeeds without resend.
- Real desktop and mobile 390 browser submissions: success UI after MAX receipt.
- Owner confirmation of receipt inside MAX app: pending; API acknowledgement alone is not owner confirmation.
- Invalid consent 400; unauthorized origin 403; production/staging preflight 204.
- Final CORS: https://banger.su,https://morzzes.github.io. Temporary localhost QA origin removed after browser tests.
- 38 form routes: desktop/mobile fields, enabled state, no overflow; DAY/NIGHT visual and invalid-phone error UI verified.
- Backend tests 7/7, including legacy Worker contract. Production build PASS; check:static PASS, 136 HTML pages, 286 URLs, 31 models, 28 plans.

## Frontend

Ignored .env.production.local: NEXT_PUBLIC_LEADS_ENDPOINT=https://banger-leads.onrender.com/leads. Matching public GitHub repository variable configured; local workflow reads it. Timeout 75 seconds for Render Free cold starts; no automatic retry. No MAX token or TLS bypass in source/frontend bundle; private env files ignored.

Local production export is integrated with real Render. Published frontend not updated: NO PUSH. Production domain/DNS unchanged. Old Cloudflare Worker untouched/unconnected.

Rate limits and receipts remain in memory on one instance. Restart durability and per-client rate limiting behind Render proxy remain existing limitations.

Final deployment: dep-db2ks1nlk1mc73cjq31g, Live, MAX /me PASS 200. Post-deploy health 200; both allowed preflights 204; localhost/untrusted 403. Final real lead HTTP 200 with requestId b1ab6690-8253-4d63-af7c-d016123da25c; invalid consent 400. verify-leads mocked frontend contract PASS. Token/bypass identifiers absent from src and built JS; only env templates tracked. git diff --check PASS. Owner MAX app receipt confirmation remains pending.
