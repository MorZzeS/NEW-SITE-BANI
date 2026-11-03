# UI fixes — base specification, model summary and logistics

**Branch:** `work/github-pages-test-20261030`
**Baseline HEAD:** `a2664c481d90e07a033c11017a7dbffe1d832e33`
**Status:** local changes only; not committed or pushed.

## Changes

- Replaced the base-equipment card grid with one compact two-column specification table on desktop and one column on mobile. The shared “Включено в стоимость” badge appears once; gift tags are separate and no longer duplicate gift wording. “Параметры для согласования” stays in its own compact disclosure. Model-specific values are unchanged.
- Removed sticky positioning and viewport-height/overflow limits from the selected-model summary and selected-options list. The card now grows with its content. Reduced image height and padding slightly; the responsive layout switches to one column at an effective 1000 CSS pixels.
- Replaced the nested logistics `fieldset`/`legend` with a normal-flow heading inside an unframed section. The existing logistics accordion remains the single outer frame; prices and selection behavior are unchanged.
- Updated the base specification/configurator checks, including an exact one-visible-gift-label assertion for each of the 31 model pages, and corrected the production-path guard to detect staging paths inside absolute URLs without flagging the local `NEW-SITE-BANI-test-*` checkout directory.

## Verification

- `npm run build` — PASS, GitHub Pages static export, 123 generated routes.
- `npm run check:static` — PASS, 140 HTML pages, 432 local URLs, 31 models, 28 plans; production path audit PASS.
- `verify-base-specification.mjs` — PASS, all 31 models, 52 price entries, 31 printable sheets, 19 interior photos.
- `verify-equipment-configurator.mjs`, `check-model-option-calculator.mjs`, `check-logistics-integration.mjs`, `verify-price-update.mjs` — PASS.
- `npx tsc --noEmit --incremental false`, `npm test` (5/5), `git diff --check` — PASS.
- Headless Chrome visual QA — PASS, 21 cases: 14 theme/viewport combinations (1440, 1309, 1152, 960, 823, 720, 390 CSS px), 4 logistics cases (empty and 300-character synthetic address, both delivery and crane unloading selected), and 3 cases with 12 selected options. No horizontal overflow or console/page errors. Summary/list heights follow content; `max-height` is absent and vertical overflow is visible. Logistics heading is static in flow, with no fieldset/legend; the calculated total remains 457,500 ₽ (412,500 ₽ base + 45,000 ₽ logistics).

The zoom widths model the CSS viewport available at 1440 physical pixels for browser zoom 100%, 110%, 125%, 150%, 175% and 200%. The browser-level Ctrl+wheel accelerator itself could not be triggered from Playwright; the responsive layout was tested at the equivalent CSS widths.

## Screenshots

- `base-table-1440-light.png`, `base-table-1440-dark.png`
- `base-table-390-light.png`, `base-table-390-dark.png`
- `model-summary-1440-light.png`, `model-summary-390-dark.png`
- `model-summary-many-options-1440-dark.png`, `model-summary-many-options-960-light.png`, `model-summary-many-options-390-dark.png`
- `logistics-panel-1440-light-empty.png`, `logistics-panel-1440-dark-long-address.png`
- `logistics-panel-390-light-empty.png`, `logistics-panel-390-dark-long-address.png`
- Full machine-readable results: `qa-results.json`

No production, `main`, SpaceWeb, DNS, Render, or MAX settings were changed; no lead was submitted.
