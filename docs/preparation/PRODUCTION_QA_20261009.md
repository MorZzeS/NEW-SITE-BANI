# Production QA — 2026-10-09

Result: PASS for production-like build, static export and offline functional tests. Candidate a27d728 plus intended CTAFormInline legacy consent fix. No deploy approval implied.

Evidence:
- Build: NEXT_PUBLIC_LEADS_ENDPOINT=https://banger-leads.onrender.com/leads; NEXT_PUBLIC_LEADS_CONTRACT unset (legacy1). npm run build exit0 after fix;119 static generation pages;21/21 article slash aliases.
- check:static including localhost HEAD audit:136 HTML,354 local URLs,31 models,28 plans, zero errors. Production path audit388 files, zero errors. Root media resources resolved; no staging basePath.
- Export scan: no PHP, docs, backend, .git/.github, .env or secret/credential named files. This is a path/filename check, not exhaustive secret-content detection.
- Compiled chunk contains exact approved Render endpoint. robots Allow:/ and production banger.su sitemap. Main home/catalogue/equipment/contact pages indexable.34 noindex pages are404,catalogue redirect,31 model sheets,privacy alias; blanket noindex assertion was inappropriate and replaced with scoped main-page checks.
- Legacy consent wording and privacy link rendered on38 pages; required consent checkbox initially unchecked in equipment page.
- verify-equipment-configurator:19/19 options, prices/deduplication/unpriced/reset/comment limits, multi-category selection/remove/reset, mocked payload validated by unchanged backend; no real requests.
- verify-lead-consent: legacy unchanged,v2 failclosed when pending,synthetic approved evidence,URL minimization,HTTP blocked before fetch,matching mocked receipt; no real network.
- Backend offline tests5/5 PASS; localhost server with mocked upstream. Initial sandbox EACCES resolved by authorized escalated rerun.

Problems: no confirmed functional defect in tested scope. Initial restricted build failed Google Fonts DNS and module resolution; authorized build rerun passed without source changes. Legal review remains a separate coordinator gate.

Not checked: live HTTPS real-form delivery,production MAX receipt,live backend environment,external navigation. Browser evidence below is reported by the coordinator, not independently repeated by this QA agent. Local HTTP correctly disables submission. No real lead sent; no SpaceWeb activation, push or deployment performed.

Read-only QA server:http://127.0.0.1:8766; extensionless/.html/article aliases; GET/HEAD only; coordinator owns final browser review and server shutdown.


Coordinator-attributed CUA evidence (reported 2026-10-09):
- 1440/390 px, DAY/NIGHT: hero, header and QR checked; no horizontal overflow.
- Video: initially zero video elements; click opened active muted banya01, next switched to banya02, Escape removed viewer.
- Mobile menu/catalogue: Barn filter returned one model; Barn gallery plan 2/3 and lightbox open/Escape worked; no visibly broken media.
- Configurator: Ermak 19,500 + furniture 6,500 + boiler 32,500 = 3 options / 58,500; all three names reached form. Resize to 1440 preserved selection; removing boiler yielded 2 / 26,000; reset yielded 0 / 0. Browser console errors: [].
- Screenshots supplied by coordinator outside source tree: C:\Users\maxto\Desktop\НОВЫЙ САЙТ\banger-release-review-20261009\{1440,390}-{day,night}.jpg.
- These checks used the final local HTTP export and did not send a real lead or prove live HTTPS delivery.
