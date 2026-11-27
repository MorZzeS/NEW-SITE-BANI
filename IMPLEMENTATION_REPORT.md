
## Addendum — missing BG-09—BG-12 color render package received (2026-11-27)

The owner-supplied archive added 24 variants (six colors each for BG-09, BG-10, BG-11, BG-12) to the 60 existing owner-approved variants. Only the 24 matching high-resolution PNG originals were used; duplicate JPEG exports for other models were not imported. No prior image was replaced. Catalog registry and render manifest now contain 84 assets for all 14 published sauna models; production, SpaceWeb, GitHub, DNS, PHP/MySQL, and database state are unchanged.

All 24 source files were hash-verified against the preserved incoming source manifest. Contact sheets were visually reviewed; each model's six colors retains a consistent silhouette, roof, doors/windows, and openings. This is a visual set-consistency check, not an engineering drawing or legal-rights audit.

Converted to WebP quality 88/effort 6 at original 2752×1536 dimensions without crop, resize, or color adjustment: 177,554,151 source bytes → 22,045,162 WebP bytes (87.6% reduction). Evidence and originals: Work/2026-11-27/Implementation-articles-catalog/qa-final-audit/incoming-renders-2026-11-27/.

Verification: npm test PASS; npx tsc --noEmit PASS; npm run build PASS (163 HTML, 125 resource references, no missing files); npm run check:static PASS (163 pages, 474 local URLs, 549 production-path files); isolated Chromium PASS (14 cards, 84/84 swatch changes, 1440 desktop and 390 mobile in DAY/NIGHT, zero JS exceptions and mobile overflow). Screenshot/result evidence is in chromium-smoke-renders-exact-results.json and screenshots-renders-exact-20261127/. Independent read-only review PASS: source/render hashes and dimensions matched; the exact swatch-to-image URL assertion was added after review feedback and the 84-click Chromium run passed.

Overall release remains NOT READY due to the previously recorded PHP/MySQL staging, WebKit, exterior-finish image, access-log, and mandatory review/approval items. No commit, push, deploy, or live-site test was performed.