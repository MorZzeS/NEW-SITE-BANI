# Hero — stage 5

Base: `b9fc6ce41c9fe085e9bc2d3a5ac5692e612da125`.

## Changes

Only Hero presentation changed. Heading: 40px mobile / 64px desktop, weight
700, leading 1.08. Smaller mobile eyebrow; description 16px mobile / 18px desktop.
Spacing between heading, description, supporting benefits and actions tightened.
Three supporting benefits retain their text, but no longer have separate glass
capsules or large gold icon backgrounds. Small neutral icons and white text
with a local text shadow preserve readability over the photograph.
CTA row keeps catalog primary and video secondary. Right info cards now 208px
wide, 96px high, with 16px gaps; architectural shape, gold accents and animations
retained. Main content gets explicit breathing room above the existing trust strip.

No text, photo, route, video logic, theme architecture, catalog or article changed.
Trust-strip content and styling are unchanged. No new UI entities or assets.

## Validation

- 1440 DAY/NIGHT and 390 DAY/NIGHT screenshots reviewed.
- Desktop Hero height: 900px before and after (900px viewport height).
- Mobile Hero height: 985.3px before, 900px after.
- Both CTAs are fully visible without scrolling: desktop bottom <=643px,
  mobile bottom <=595px. No horizontal overflow.
- Existing video viewer still opens and closes with Esc. No browser warnings/errors.
- `npm run build`: PASS, 88 routes, 21 article aliases.
- `npm run check:static -- --base-url http://127.0.0.1:56756`: PASS,
  105 HTML pages / 249 local URLs / 31 models / 28 plans / errors [].
- Original priority Hero image, URL and sizes remain unchanged; no new downloads.
- Local cached LCP sampling through a temporary instrumented static server,
  three reloads per width, same browser, 1800ms observation window:
  desktop before 92/92/88ms, after 120/88/84ms (median 92 -> 88);
  mobile before 76/80/84ms, after 72/80/80ms (median 80 -> 80).
  This measured the layout adjustment before the final white supporting-text /
  text-shadow refinement, which adds no assets and does not change geometry.
  The sample is local and warm-cache, not a production network or field benchmark.

Before screenshots were taken from a rebuilt exact base Hero. Final source was
restored and built again. Temporary instrumentation and screenshots are outside
the repository: `C:\Users\maxto\.codex\tmp\banger-hero-stage5\`.

Changed files: `src/components/sections/HeroSection.tsx`, this report.
Stop after stage 5. No push or deploy.
