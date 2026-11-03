# Calculator visual implementation — verification status

Status: OWNER-AUTHORIZED TEST PUBLICATION; final browser QA BLOCKED.

Shared ConfigurationOption and ConfigurationCategoryTitle are used by model calculators and /komplektaciya. Cards expose selected state, image/schema label, price, description and notes. Summary moves below options on narrow screens. Existing prices, compatibility and request contracts are unchanged by this visual work.

## Evidence

- Existing qa-results.json completed 2026-11-02 16:09:54 UTC after all six UI files were saved at 16:04–16:05 UTC: 31 models, 186 viewport/theme variants (1440/768/390 × light/dark), zero recorded failures, three downloaded PDFs, 22 screenshot references. All referenced files exist.
- Existing script checks select-all/remove/reset totals, unique option IDs, compatibility counts, promo totals and form fields. PDFs represent zero, one and five selected options; download evidence does not prove rendered PDF content.
- 2026-11-03: removed two obsolete open-summary pseudo-element rules responsible for duplicate minus beside the shared chevron. Earlier screenshots precede this correction.
- After correction: git diff --check PASS; npx tsc --noEmit --incremental false PASS; node --check scripts/calculator-visual-qa/supplement.mjs PASS.
- supplement.mjs prepared for model/equipment page at all three widths and both themes, screenshots, duplicate marker/overflow, selection/reset and form comment handoff. It does not submit forms. It has NOT been executed against a browser.

## Remaining checks / limitations

CDP 127.0.0.1:9333 and site 127.0.0.1:4318 refused connections on 2026-11-03. No new Chrome was started. Final browser screenshots after the CSS correction, /komplektaciya interactions, actual keyboard navigation, final request handoff and PDF content inspection remain unverified. Independent review found no blocking logic issues. On 2026-11-03 the owner explicitly authorized publication of this candidate to the test Pages site despite the browser limitation and accepted manual browser verification. This authorization does not turn Browser QA into PASS. tmp/ and tsconfig.tsbuildinfo are preserved and excluded from the commit.

## Test publication scope and rollback (2026-11-03)

Only branch work/github-pages-test-20261030 is authorized for commit and normal push. Before push, GitHub Pages API returned cname: null, html_url: https://morzzes.github.io/NEW-SITE-BANI/, build_type: workflow. No Pages settings are changed. Production BANGER.SU, SpaceWeb, DNS, Render and MAX are outside this publication. No real forms are submitted.

Previous branch HEAD 72501283a3feb5d2bbb003b7d1fbe8bb73088e24 is the rollback reference. If rollback is needed, revert the candidate commit on the test branch and let its existing Pages workflow redeploy; no history rewrite is required. Deployment and public release SHA must be verified after push.

## Final local checks (2026-11-03)
Build using pages-test.yml environment PASS (build-final.log). check:static PASS: 140 pages, 431 local URLs, 31 models, 28 plans, no errors; production path audit 465 files PASS. check-model-option-calculator.mjs PASS: 31 models × 19 options, base prices unchanged, duplicate selection counted once, unpriced excluded/disclosed, promotional conditions retained. check-visual-release.mjs PASS: 140 HTML files, enabled online lead form. Independent reviewer confirmed removal of duplicate marker and unchanged logic; final browser acceptance remains BLOCKED. These static checks do not replace browser acceptance.
