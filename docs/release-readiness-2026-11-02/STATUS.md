# BANGER.SU test release and SpaceWeb preparation — 2026-11-02

## Scope

Prepared on `work/github-pages-test-20261030` from `165adbddb75ce511dba0fbae75e28fedc1a99e8d`. Production `main`, banger.su, DNS, SpaceWeb files, Render, and MAX were not changed.

## Included changes

- Increased responsive homepage H1 hierarchy and retained the approved wording “Бани и дачные домики под ключ” / “Собственное производство — город Раменское”. Existing title, description and Open Graph metadata already matched.
- Renamed the four homepage catalog directions and matching catalog menu entries; preserved model names and routes.
- Fixed the static-export `/katalog` entry page: it now navigates client-side to `/katalog/bani` and provides a fallback link. The previous server redirect generated an empty Next error shell under static export.
- Updated cookie/settings disclosures to reflect that weather, geolocation, analytics, Webvisor and ad cookies are disabled in this version. Legacy saved city values are unused and can be removed by the visitor.
- Updated Wrangler to 4.156.1 to resolve the three npm audit findings in the previous lock state.
- Added an Apache 2.2 `.htaccess` draft for a future SpaceWeb package. It has not been uploaded or exercised on SpaceWeb; SSL, document root and quota remain to be confirmed.

## Checks

- `BANGER_GITHUB_PAGES=true npm run build`: PASS, static export generated 122 routes.
- `BANGER_GITHUB_PAGES=true npm run check:static`: PASS, 139 HTML pages, 458 local URLs, 31 models, 28 plans, 440 production-path resources, zero reported errors.
- `BANGER_GITHUB_PAGES=true node scripts/check-visual-release.mjs`: PASS, test export is marked noindex; contact-only release; weather UI disabled.
- `npx tsc --noEmit --incremental false`: PASS.
- `npm test`: PASS, 5/5 synthetic backend tests. This does not prove live form delivery.
- `npm audit` and `npm audit --omit=dev`: PASS, zero vulnerabilities.
- `git diff --check`: PASS.
- Headless Chrome screenshots from the generated static export: 1440 and 390 px, LIGHT and DARK. Recorded checks: H1 64 px desktop / 40 px mobile, no horizontal overflow, no broken images, no console/network errors. Catalog route test redirected `/katalog` to `/NEW-SITE-BANI/katalog/bani`; model counts by series were 11 Istok, 13 Scandinavia, 1 Barn and 6 houses.

Screenshots are in `%TEMP%\banger-owner-task-preview\home-{1440,390}-{light,dark}-static-export.png`.

## Not enabled / external blockers

- Online forms and MAX delivery remain disabled. No isolated test recipient/channel, approved persistent consent store, or real end-to-end acceptance is available; synthetic backend tests are not a substitute.
- Weather remains disabled per the owner's latest decision. It must stay off until its provider terms and disclosure are reviewed and accepted.
- The requested exact facade/render source images were not supplied in this work state; no substitute or generated render was introduced.
- The Apache 2.2 draft is not a deployment-ready confirmation: no live Apache test, free-space measurement, document-root confirmation or certificate verification was possible. Do not upload or switch domains on this evidence alone.
- The test Pages site is publicly accessible despite `noindex`; no privacy or access control is implied.

## Release boundary

The only authorized remote release target is the existing test branch `work/github-pages-test-20261030`. No merge to `main`, production deploy, SpaceWeb upload, DNS edit, or backend activation is authorized by this preparation.
