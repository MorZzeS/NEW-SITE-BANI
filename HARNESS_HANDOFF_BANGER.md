# HARNESS_HANDOFF_BANGER.md — BANGER.SU
Repo: C:\Users\maxto\Desktop\НОВЫЙ САЙТ\banger-site\NEW SITE BANI (.gitactive)
GitHub Pages: /NEW-SITE-BANI (basePath)
Stack: Next.js 14 + Tailwind + TypeScript + Framer Motion + lucide-react

## GIT STATE
Branch: main | HEAD: 62b329a | Msg: gate-3: fix slugs bg-16/17, remove whatsapp, add InteriorPhotosSection on homepage, fix duplicate bg-28 in homes, max in SiteSettings type | Clean working tree | PUSH DONE | GitHub Actions: SUCCESS ✅

## DONE
Header: Catalog / Komplektaciya / Dostavka / Poleznoe / O-kompaniya; MAX + Telegram + phone links; NO WhatsApp anywhere
Footer: /politika + /privacy + MAX link; no WhatsApp
Mobile: responsive grids; no hard overflow; overflow-x: hidden on html/body; tested 390/393/430 concept
Hero: info badges (not buttons); LCP priority + quality=90; anti-flash theme script in layout.tsx
InteriorGallery: REMOVED from home (page.tsx)
Model cards (banya/[slug]): interiorImages section + ImageLightbox (X/Esc/arrows/swipe); floorPlan for bg-29/30/31
CTA: CTASection — honest fallback (no fake submit); MAX/Telegram/Phone buttons; CTAFormInline same; no false "sent"
Contacts / CTAFormInline: MAX button; model pre-selected; no backend (BLOCKED)
Legal: /politika full; /rekvizity /soglasie-pd /soglasie-reklama /usloviya-zakaza with real ИП data; no bank details public
Company data: founded 2026, team 8, Moscow/MO only
Prices (31 models): verified vs Catalog v4 (bg-01..bg-31 corrected per user list)
Images: 33 safe renders (no +/Cyrillic in src); 19 interiors + 18 v2 extracted; mapping.txt present
Data: src/data/index.ts (31 saunas + articles + homes); src/types/index.ts (Sauna/Home + interiorImages?: string[])
Build: PASS (67 static pages; output: dist; basePath /NEW-SITE-BANI; assetPrefix /NEW-SITE-BANI)
Slugs: bg-16 skandinaviya-komfort-plus-6 FIXED; bg-17 skandinaviya-komfort-plus-7 FIXED (were -6-plus/-7-plus)
Data: duplicate bg-28 in homes[] REMOVED; SiteSettings.whatsapp removed, SiteSettings.max added
InteriorPhotosSection: ADDED to homepage (6 real interior photos with captions)
Build: PASS (65 static pages; output: dist; basePath /NEW-SITE-BANI; assetPrefix /NEW-SITE-BANI)
SEO v4: sitemap.xml (56 URLs) + robots.txt generated via App Router; canonical on all key pages; OG absolute URLs; metadata on all pages incl. client-pages via layout.tsx wrappers; H1 verified across all pages
Performance v4: Google Fonts @import REMOVED from globals.css (Inter loaded via next/font only); lazy loading on below-fold images; overflow-x: hidden on html+body; Favorites href="#" fixed to button; Cyrillic filenames removed from src
Light/Dark v4: anti-flash inline script in layout.tsx (runs before paint); full opacity-variant overrides (text-cream/30..90); btn-primary/secondary corrected for light theme; glass-dark/glass-dark-strong corrected

## BLOCKED / NOT DONE
Floor plans bg-01..bg-28: NO own blueprints (do NOT copy third-party)
Vystavka (/vystavka): page exists (Hero + gallery + sign-up buttons + address TODO); needs owner photo + confirmed address
Articles (poleznoe): unique HTML content written; deeper unique rewrite + 2-4 real images per article not complete
"From what made" block on model pages: NOT ADDED (user said don't go deep)
Telegram + MAX backend: BLOCKED (needs backend + secrets; no tokens in Git)
Git: commit b24ea30; push NOT performed
Yandex Metrika: NOT connected — BLOCKED (need counter ID from owner; do NOT add without confirmation)
Image WebP conversion: PNG renders are 3+ MB each; conversion blocked by static export + unoptimized:true in next.config.js
  → To improve: either enable Next.js image optimization (requires server) or pre-convert PNGs to WebP manually

## LEGAL DATA (confirmed by owner — do NOT invent)
Seller / PD operator: ИП Лещенко Максим Витальевич
INN: 504810391201 | OGRNIP: 319507400024020
Address: 142300, Московская обл., г. Чехов, ул. Московская, д. 110, кв. 56
Phone: +7 (936) 200-00-50 | Email: info@banger.su
MAX: https://max.ru/u/f9LHodD0cOIxMWBIqevncnKjjJjmhro04Avs206ALKtkVorTXnbzx5mVTVs
Bank details: NOT PUBLIC (only for contracts/invoices/internal CRM)

## HEADER NAV (actual)
Catalog (dropdown: Bani / Doma) / Komplektaciya / Dostavka i ustanovka / Poleznoe / O kompanii

## KEY FILES / SOURCES
- src/data/index.ts (catalog, articles, homes, prices)
- src/app/banya/[slug]/page.tsx (model page with interior + lightbox; no WhatsApp; improved metadata)
- src/app/dom/[slug]/page.tsx (home model page; no WhatsApp; improved metadata)
- src/app/sitemap.ts (sitemap generator — 56 URLs)
- src/app/robots.ts (robots.txt generator)
- src/app/katalog/bani/layout.tsx (metadata for client catalog page)
- src/app/katalog/doma/layout.tsx (metadata for client catalog page)
- src/app/kontakty/layout.tsx (metadata for client contacts page)
- src/app/layout.tsx (root layout; anti-flash theme script; no Google Fonts @import)
- src/app/globals.css (light/dark theme; overflow-x hidden; no GFonts @import)
- src/components/layout/Header.tsx (nav: 5 items; no WhatsApp; hover/focus; backdrop pre-scroll)
- src/components/sections/CTASection.tsx (honest fallback; no fake form submit)
- src/app/vystavka/page.tsx (showroom stub — address TODO)
- public/images/interiors/v2/ (18 v2 photos from docx)
- public/images/interiors/ (19 originals)
- public/images/renders/ (33 safe filenames with mapping.txt)
- BANGER_TZ_v4.docx (TZ v4 — выполнено)
- .github/workflows/deploy.yml (GitHub Pages deploy config with basePath)
- next.config.js (static export, basePath /NEW-SITE-BANI, assetPrefix /NEW-SITE-BANI)

## RULES (do not violate)
- NEVER invent prices, sizes, materials, legal data
- NEVER copy third-party floor plans without rights
- NEVER put bot tokens / backend secrets in frontend / Git
- NEVER return WhatsApp links
- NEVER invent bank account / BIK / KS / bank address
- Interior photos: tag as "variants of interior execution" unless model-linked is confirmed
- Mobile must be checked on 390 / 393 / 430
- No push without explicit owner confirmation
- All legal stubs must have real data from owner (no placeholders)
- No Yandex Metrika counter without owner's counter ID

## FIRST STEPS FOR NEW SESSION
1. Read HARNESS_HANDOFF_BANGER.md (this file)
2. cd C:\Users\maxto\Desktop\НОВЫЙ САЙТ\banger-site\NEW SITE BANI
3. git status; git log --oneline -1
4. npm run build
5. Confirm last task from owner; do NOT restart exploration from scratch.

## ЯНДЕКС МЕТРИКА — рекомендуемые события (BLOCKED без счётчика)
Страница / событие → цель Метрики
- Клик tel:+79362000050 → goal: click_phone
- Клик Telegram → goal: click_telegram
- Клик MAX → goal: click_max
- Открытие lightbox (галерея) → goal: open_gallery
- Отправка формы (когда будет бэкенд) → goal: form_submit
- Просмотр карточки модели (pageview) → auto (стандартный просмотр)
- Клик "Заказать звонок" → goal: click_cta_callorder
Нужно от владельца: номер счётчика Метрики (ID); после получения — добавить script в layout.tsx

## v4 ROUND BASELINE → AFTER
| Метрика | До | После |
|---|---|---|
| Страниц в build | 63 | 65 (+sitemap+robots) |
| CSS bundle | 34.3 KB | 37.6 KB (+light-dark rules) |
| JS shared | 87.2 KB | 87.2 KB (без изменений) |
| Google Fonts @import | ДА (render-blocking) | НЕТ (убран) |
| WhatsApp | В 4 местах | 0 мест |
| «Полезное» в Header | НЕТ | ЕСТЬ |
| sitemap.xml | НЕТ | 56 URLs |
| robots.txt | НЕТ | ЕСТЬ |
| canonical | Только главная | Все ключевые страницы |
| OG image URL | relative | absolute |
| anti-flash | НЕТ | ЕСТЬ (inline script) |
| href="#" битые | 2 шт. | 0 (Favorites → button) |
| overflow-x global | НЕТ | ЕСТЬ |
