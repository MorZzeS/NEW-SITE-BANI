# Production root paths — BANGER.SU

Production URL: https://banger.su/ . GitHub Pages project URL is historical staging only. DNS, SpaceWeb and Pages custom domain were not changed. No push.

## Configuration

Removed basePath and assetPrefix from next.config.js. output: export, distDir: dist and unoptimized images retained. No environment switch needed: the default build is explicitly the root-domain production build.

Root-relative paths now used for model images/plans/interiors, article content photos, project photos, Hero CSS/preload/warm-up, options, QR, videos/posters, category/showroom visuals. OG metadata no longer strips a hardcoded staging prefix. Existing model slugs, categories, prices, sources, texts, media bytes and theme architecture preserved.

site-path helper uses an empty production basePath. check:static resolves same-origin URLs against https://banger.su, also validates video src/poster. Additional check-production-paths scans source and exported HTML/JS/CSS/XML/text for staging references and validates CSS resources. It runs automatically as part of check:static, including CI.

## Former staging references

- `next.config.js`: 2 occurrences.
- `scripts/check-static.mjs`: 1 occurrences.
- `scripts/verify-base-specification.mjs`: 1 occurrences.
- `src/app/banya/[slug]/page.tsx`: 1 occurrences.
- `src/app/dom/[slug]/page.tsx`: 1 occurrences.
- `src/app/globals.css`: 2 occurrences.
- `src/app/layout.tsx`: 3 occurrences.
- `src/app/nashi-raboty/[slug]/page.tsx`: 1 occurrences.
- `src/app/o-kompanii/page.tsx`: 1 occurrences.
- `src/app/vystavka/page.tsx`: 4 occurrences.
- `src/components/sections/CategoriesSection.tsx`: 2 occurrences.
- `src/components/sections/HeroSection.tsx`: 1 occurrences.
- `src/components/sections/InteriorGallery.tsx`: 15 occurrences.
- `src/data/home-interiors.ts`: 40 occurrences.
- `src/data/index.ts`: 118 occurrences.
- `src/data/interior-examples.ts`: 40 occurrences.
- `src/data/options.ts`: 1 occurrences.
- `src/data/social.ts`: 4 occurrences.
- `src/data/videos.ts`: 4 occurrences.

Historical provenance/report/archive paths are retained; no active src or exported artifact uses the staging prefix. The audit itself contains the rejected staging pattern intentionally.

## Checks

- npm run build PASS.
- npm run check:static PASS:136 HTML,352 local URLs,31 models,28 plans,zero errors.
- HTTP HEAD for all352 exported URLs at local root PASS.
- Production path audit PASS:381 source/export text files; CSS assets/fonts resolve.
- Theme initialization12/12 PASS.31 model base specifications,52 prices,31 printable sheets PASS.
-21 article covers/provenance/OG PASS;20 Word article bodies/SEO/URLs PASS.
- Root homepage1440/390 DAY/NIGHT PASS; correct hero-day.webp/hero-night.webp,4QR loaded; H1/CTA positions unchanged.
-28 browser cases: catalog baths/homes, Istok4, Barn Premium, article listing, membrane article and contacts at both widths/themes; no legacy links or horizontal overflow. A lazily deferred owner-render thumbnail loaded successfully once selected; no missing file.
- Barn plan lightbox opens; both MP4 videos load only in opened modal, muted by default.
- Forms render; native required-field validation works. The central HTTPS lead endpoint is unchanged. No real test lead sent from localhost (production-only CORS retained).
- Console errors/warnings absent in local smoke.

## Live status before push

Current https://banger.su/ responds200 but still serves the previous commit. Its /NEW-SITE-BANI/images/hero/hero-day.webp responds404. The local correction cannot be live until separately authorized push and deploy. Post-deploy verification, including a live form submission if requested, remains pending. This report does not claim live production PASS.

Production CORS preflight to Render /leads: HTTP204, Access-Control-Allow-Origin https://banger.su — PASS.
