# Browser evidence — coordinator, 08.10.2026

Environment: built dist, local Apache2.4.69 on 127.0.0.1:18779. Only generated dist .htaccess allows localhost for local QA; source staging template remains host-restricted. NEXT_PUBLIC_LEADS_ENDPOINT empty. No production visit or submission.

CUA real browser (not source-only):
- DAY/NIGHT: widths 390,767,768,769,1024,1279,1280,1281,1440. documentElement.scrollWidth <= innerWidth for all observed combinations. NIGHT390 separately verified on configurator and main.
- QR rendered dimensions:390=72px,767–1279=80px,1280+=96px, all four unchanged. Panel1440=272px,390=353px within local container. Order MAX/VK/Telegram/Instagram.
- Header rectangles:768 logo right296.5, phone308.5–454.5, controls620–738;1280 logo33–279.6,nav298.8–700.3,phones808.2–930.1,controls1038.1–1242. No overlap. Primary phone visible768–1279, absent390 and1280+. tel:+79362000050 verified. Mobile menu retains both numbers.
- Screenshots inspected:1440 NIGHT (physical capture cropped to app window; full viewport geometry separately measured),390 DAY,390 NIGHT video modal,768 NIGHT. Visual readability/QR fit confirmed in captured views; full-width desktop screenshot archival unavailable here, not fabricated.
- Video CTA opens real Barn video /videos/baths/banya-01.mp4 muted; body overflow hidden; Next -> Skandinavia2/2; Esc closes and dialog count0. Existing video mechanics untouched. Swipe/focus-trap exhaustive regression not separately retested.
- Configurator actual browser: Popular Ермак + checkbox Проливной пол + Декоративные решётки -> summary3,42900; form contains exact3 full list noduplicates.390NIGHT summary retains3/42900, reset0/0. Consent unchecked and submit disabled on HTTP/empty endpoint.
- Interior first photo opens lightbox Парная1/20.
- Browser error logs queried after theme/width/menu/video/configurator interactions: empty.

Remaining independent QA: final staging-artifact Apache routes/resources, full readonly review and PHP/MySQL activation tests. Live SpaceWeb, MAX delivery, hosting SSL and actual geography not tested or approved.
