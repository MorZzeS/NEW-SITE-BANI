# GitHub Pages preview — 12 November 2026

## Scope and preservation

This preview starts from the working SpaceWeb source, including the verified lead implementation and the photo/replanning changes. The previous preview was `3b37e2c`; the source baseline is `72e77cb`. Uncommitted files in the original worktree are preserved. No SpaceWeb files, private credentials, databases, Cron settings, DNS or `main` are changed by this task.

Pages uses `/NEW-SITE-BANI/`, explicit empty lead endpoint, contacts instead of online collection, disabled weather/analytics and HTML `noindex`. It remains public: `noindex` is not access control. PHP/MySQL/MAX stay on SpaceWeb. No real or synthetic applications are sent by the preview QA.

## Corrections

- Common photo previews use a uniform aspect ratio (interiors 16:9, other project galleries 4:3). Removed the per-image inline ratio that made the portrait preview 463 px high beside 146 px landscape previews at 1440 px. All ten original interior photos, ordering, focal points, captions and full-size viewer remain.
- Integrated PR #1's slogan removal. Retained the approved headline, Ramenskoye and manufacturer-since-2024 statement. Moved the three hero actions just above the trust strip, horizontal at desktop and stacked below 1024 px; contact disclosure opens within the screen.
- Used the owner's exact warranty/support copy and a contact link without extra service promises. Removed the unsubstantiated decades-of-service phrase from the company page.
- Removed blanket 4×4 m platform / 1 m access-road instructions; exact requirements are confirmed for the chosen model and equipment. Delivery step headings now use H2.
- Unique descriptions for 31 printable model sheets and four project visualizations. Static page Open Graph URLs match canonical destinations and preserve shared image/site fields; model sheets use their own model image.
- Catalog home breadcrumbs use normal prefixed anchors, preventing the out-of-project root RSC request `/NEW-SITE-BANI.txt` on static hosting.
- Compact manager summaries use the identifiable short label “Перепланировка”, keeping all options and the full 300-character address within the existing 1500-character contract. Full customer-facing option name, price, structured payload and formulas are unchanged.

## Verification evidence

- Existing tests, TypeScript and static export checks pass. Price guard: 25 baths + 6 houses, 21 alternative price strings and 38 priced options unchanged relative to the agreed baseline. Replanning remains 10,000 RUB.
- Option calculation tests cover all 31 models, quantities/reset/persistence, stove replacement exclusions and the bath-only 15,000 RUB offer. Barn Premium's intentionally disabled calculator stays disabled.
- Browser sweep: 100 HTML routes including 31 models and 28 plans; 360/390/430/768/1024/1440 px × DAY/NIGHT = 1200 layout checks. No horizontal overflow, broken loaded images, missing image alt, unnamed visible buttons, runtime exceptions or JS/CSS 404. The observed catalog root RSC 404 was fixed and requires the targeted final-build/live check.
- Interactive gallery: four equal previews, all ten unique full-size images, counter, arrows, Escape and focus restoration. Hero actions, contact disclosure, mobile menu and native video dialog/Escape checked.
- PDF: five scenarios and all 31 model generators passed arithmetic/content/page-bound checks. Eleven pages rendered; representative base, twelve-option continuation and long-address pages visually inspected. Browser PDF generation produced an application/pdf Blob and loaded Noto Sans from the prefixed URL; operating-system save dialog was not tested.
- QA artifacts are outside the repository under `D:\Максим\Memory\Projects\BANGER.SU\Work\2026-11-12\Pages-QA`: before/after screenshots, browser sweep JSON, PDF fixtures and rendered pages. No private config or customer data is included.

Legal RU and Security Auditor found no blocking issue in their reviewed scope. Independent review prompted explicit shared OG image preservation. Final artifact checks, targeted retest and published SHA/Actions evidence are recorded in the coordinator's final report and project Memory after deployment.
