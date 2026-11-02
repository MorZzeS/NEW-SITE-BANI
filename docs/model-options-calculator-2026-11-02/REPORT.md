# Model option calculator and release-readiness notes — 2026-11-02

## Local calculator result

Added one shared preliminary-completion calculator to all 31 model detail pages (25 baths and 6 homes). It reads base prices from the existing model records and options/prices from the existing options catalog; no model or option prices were changed. Available published option entries are grouped and shown with project images or clearly labeled illustrative diagrams, description, price, add/remove checkbox, and a reset action. Duplicate IDs are de-duplicated. Options already included in known base configurations are blocked for the matching models; an option with no published price is not included in the numeric sum and is disclosed separately.

There is no confirmed model-by-model option compatibility matrix in the project. Accordingly, the interface calls the result preliminary, marks availability as subject to confirmation, and does not promise that each selected option is compatible. The static checker found 19 published option entries per model, not 19 guaranteed compatible options.

The contact handoff includes model name, base price, selected option names and prices, subtotal of priced options, preliminary total, and current model URL in the existing contact-only context. The production online lead flag remains off. The page does not collect a phone number or claim that an online request was sent.

## Verification

- `npm run build` (root export): PASS; Next.js 15.5.28 generated 122 static routes. An existing Node module-format warning from `tailwind.config.ts` remains non-fatal.
- `npm run check:static`: PASS; 139 HTML pages, 459 local URLs, 31 models, 28 plans, and 442 production-path resources; zero reported errors.
- `node scripts/check-model-option-calculator.mjs`: PASS; all 31 model pages, 19 option rows per page, base-price sources unchanged, image/diagram files present, duplicate/unpriced handling and known base-overlap guards.
- `npx tsc --noEmit --incremental false`: PASS.
- `npm test`: PASS, 5/5 existing backend tests (synthetic only).
- `node --test backend/durable.test.mjs`: PASS, 11/11 synthetic storage/consent/dedup/outbox/backup-restore tests. This is not an operational restore or live-MAX test.
- `node --test scripts/refresh-weather.test.mjs scripts/weather-ui.test.mjs`: PASS, 9/9 synthetic collector/UI logic tests; no weather network requests were made.
- Headless Chrome on the root static export: PASS at 1440 and 390 px in LIGHT and DARK. Verified 19 options, no horizontal overflow, no observed broken loaded images, no browser console/network/404 issues; add across categories, remove, reset, no duplicate sum, unpriced option exclusion/disclosure, keyboard Space toggle, model isolation, base-overlap guard, and contact handoff. No form submission was made.
- Read-only independent code review: no confirmed code defects in the changed calculator files. Reviewer did not run tests; browser and automated evidence above was gathered separately.
- `git diff --check`: PASS.

Screenshots: `screenshots/model-istok4-1440-light.png`, `screenshots/model-istok4-1440-dark.png`, `screenshots/model-istok4-390-light.png`, `screenshots/model-istok4-390-dark.png`.

## External integrations and transfer boundary

- Online leads remain disabled (`onlineLeads: false`). A read-only Render service inventory showed `banger-leads` on the free Oregon service, with no persistent disk attached and auto-deploy disabled. No secrets or environment values were read. The durable SQLite backend supports a separate `TEST_MAX_USER_ID` with no production-recipient fallback, but a separate test recipient/channel was not confirmed. Render environment values were intentionally not inspected. No real MAX message was sent. Historical test evidence elsewhere in the repository is not evidence of a current separate test-channel setup.
- Weather remains disabled under the existing owner decision and `releasePolicy`. No provider/API or geolocation requests were made and no weather code was enabled.
- No SpaceWeb control-panel integration/session was available for live inspection. Actual document root, current contents, free quota, certificate/HTTPS behavior, Apache modules/overrides and hosting-side backup/restore therefore remain unverified. The `httpd.exe` executable needed to run the local Apache fixture was also unavailable in this environment. Existing deployment documents contain offline Apache/transfer evidence only; it is not host proof.
- A local review ZIP was prepared from the root static export plus the reviewed Apache 2.2 `.htaccess` draft: `C:\Users\maxto\Desktop\BANGER_SPACEWEB_REVIEW_20261102.zip`. It contains 800 entries, with `index.html`, `.htaccess` and `_next/` at ZIP root; all 800 entries were read for integrity, and the archive scan found no `.env`, backend, node_modules, Git data, key/certificate, database or log files. SHA-256: `14DE24860F446ED9C30C9A4A42F1A8E3AB716347842C94A4A062F76C705572C6`. Uncompressed export: 284,154,304 bytes; ZIP: 268,764,108 bytes. This is a review candidate only; do not upload until the whole-site review and live SpaceWeb checks/backup are approved.

## Pending owner/external conditions

1. Confirm a dedicated numeric MAX test recipient and arrange its secret only in the server's private environment; never send a test request to the production manager recipient.
2. Select/confirm a persistent personal-data store physically in Russia, and verify access controls, encrypted backups, retention/removal, and a real restore drill. The current Oregon free service is not approved for this purpose.
3. Approve the exact consent/policy versions, operator/recipient facts and retention rules with the responsible legal reviewer before enabling collection.
4. Provide authenticated read-only SpaceWeb panel access or current evidence for docroot, Apache version/modules/AllowOverride, free space, HTTPS certificate and hosting backup/restore. Do not replace current site files before an approved backup and independent whole-site review.

No push, production deploy, DNS edit, SpaceWeb upload, backend activation, weather activation or real lead submission was performed.

## Git

Source branch at start: `work/github-pages-test-20261030`, base commit `84c52d7f17e67b317909bab08e93ea8af4d1ce46`. The complete report and code are included in the local task commit on this branch. No push was performed.





