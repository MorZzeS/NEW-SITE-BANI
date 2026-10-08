# Hero/Header/interiors — targeted UI changes, 08.10.2026

## Changes
- Upper Hero feature row removed completely. Description mb-6 now separates description from CTA with no removed-row spacer. H1/description/media/video/QR preserved. CTA reveal delay adjusted to follow description.
- Header uses four desktop grid tracks: logo, navigation, flexible contacts, actions. Contacts are centered within free track, not positioned by arbitrary margin. Nav 16.8px/600 (+20% from 14px); phone 15px/600 (+25% from 12px). Logo/phone targets/callback wording/theme/glass unchanged.
- Desktop starts at 1280px, below that mobile menu remains available; resize closing threshold and visibility rules agree. Desktop grid container remains capped at existing 1280px. 1920/1440/1280/390 actual browser geometry still requires verification.
- Photo20 caption changed Водоснабжение → Электрооборудование, descriptive alt updated in runtime data and source manifest. Original source public/images/interiors/barn-premium-15.jpg. File/src/avif/order/count unchanged.

## Photo visual review
20/20 local originals inspected in four contact sheets. 1–5/15: sauna/benches/lights; 6–7: furnace entry/fire protection; 8–9 shower/washing; 10–14 rest room (including boiler/firebox details); 16 stove; 17 protected furnace area; 18 shower; 19 rest zone; 20 electrical distribution/control/wiring/battery equipment. Captions 1–19 remain unchanged; their broad descriptions match visible contents.
Search found old label also in docs/home-interior-sources.json; corrected. Other Водоснабжение text belongs to a separate water/boiler article, not this image, and is preserved.
Contact sheets: C:/Users/maxto/Desktop/НОВЫЙ САЙТ/qa-home-ui/interiors-1.jpg through interiors-4.jpg.

## Checks
Build PASS. check:static PASS — 136 HTML, 353 URL, 31 models, 28 plans, no errors; production path audit PASS. Source integrity checks PASS for logo/PhoneLinks, exact lower trust block, 20 image paths/order, unchanged captions 1–19. Selection/form regression tests PASS after these changes.

## Uncompleted browser checks
cua_repl fails to start: Windows sandbox setup refresh error. Actual 1920/1440/1280/390 DAY/NIGHT, overlap/overflow/console/click tests and new before/after screenshots are BLOCKED, not PASS. Historical earlier before screenshots exist outside repository but no fabricated after screenshots were generated. Need browser recovery and local review before publication.
Source review/build do not establish visual geometry or live summary fix. Summary fix commit ae658d5c7316b0f7420131c98aabc7a421b2e9cd is separate; exact reported LIVE root cause remains unconfirmed. Post-deploy verification requires separately authorized push; no push in this task.

Production/DNS/backend/prices/catalog/articles/media unchanged. This UI commit contains Hero/Header scoped styles and the confirmed caption correction, not a redesign.
