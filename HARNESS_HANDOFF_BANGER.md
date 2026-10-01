# HARNESS_HANDOFF_BANGER.md — BANGER.SU
Repo: C:\Users\maxto\Desktop\НОВЫЙ САЙТ\banger-site\NEW SITE BANI (.gitactive)
GitHub Pages: /NEW-SITE-BANI (basePath)
Stack: Next.js 14 + Tailwind + TypeScript + Framer Motion + lucide-react

## GIT STATE
Branch: main | HEAD: 3d3dfbd | Msg: v3 fixes... | Clean working tree | PUSH NOT DONE

## DONE
Header: Catalog / Komplektaciya / Dostavka / O-kompaniya (WhatsApp removed); MAX + Telegram + phone links
Footer: /politika + /privacy + MAX link; no WhatsApp
Mobile: responsive grids; no hard overflow; tested 390/393/430 concept
Hero: info badges (not buttons)
InteriorGallery: REMOVED from home (page.tsx)
Model cards (banya/[slug]): interiorImages section + ImageLightbox (X/Esc/arrows/swipe); floorPlan for bg-29/30/31
CTA: fallback message "Онлайн-отправка заявки пока недоступна" + MAX/Telegram/Phone buttons (no false "sent")
Contacts / CTAFormInline: MAX button; model pre-selected; no backend (BLOCKED)
Legal: /politika full; /rekvizity /soglasie-pd /soglasie-reklama /usloviya-zakaza with real IП data; no bank details public; no TODO strings visible
Company data: founded 2026, team 8, Moscow/MO only (removed "Russia-wide", 2015, 500+, 45 staff)
Prices (31 models): verified vs Catalog v4 (bg-01..bg-31 corrected per user list)
Images: 33 safe renders (no +/Cyrillic); 19 interiors + 18 v2 extracted; mapping.txt present
Data: src/data/index.ts (31 saunas + articles + homes); src/types/index.ts (Sauna/Home + interiorImages?: string[])
Build: PASS (63 static pages; output: dist; basePath /NEW-SITE-BANI; assetPrefix /NEW-SITE-BANI)

## BLOCKED / NOT DONE
Floor plans bg-01..bg-28: NO own blueprints (do NOT copy third-party)
Vystavka (/vystavka): page exists (Hero + gallery + sign-up buttons + address TODO); needs owner photo + confirmed address
Articles (poleznoe): unique HTML content written; deeper unique rewrite + 2-4 real images per article not complete
"From what made" block on model pages: NOT ADDED (user said don't go deep)
Telegram + MAX backend: BLOCKED (needs backend + secrets; no tokens in Git)
Git: commit 3d3dfbd; push NOT performed

## LEGAL DATA (confirmed by owner — do NOT invent)
Seller / PD operator: ИП Лещенко Максим Витальевич
INN: 504810391201 | OGRNIP: 319507400024020
Address: 142300, Московская обл., г. Чехов, ул. Московская, д. 110, кв. 56
Phone: +7 (936) 200-00-50 | Email: info@banger.su
MAX: https://max.ru/u/f9LHodD0cOIxMWBIqevncnKjjJjmhro04Avs206ALKtkVorTXnbzx5mVTVs
Bank details: NOT PUBLIC (only for contracts/invoices/internal CRM)

## HEADER NAV (actual)
Catalog (dropdown: Bani / Doma) / Komplektaciya / Dostavka i ustanovka / O kompanii

## KEY FILES / SOURCES
- src/data/index.ts (catalog, articles, homes, prices)
- src/app/banya/[slug]/page.tsx (model page with interior + lightbox)
- src/app/vystavka/page.tsx (showroom stub — address TODO)
- public/images/interiors/v2/ (18 v2 photos from docx)
- public/images/interiors/ (19 originals)
- public/images/renders/ (33 safe filenames with mapping.txt)
- TZ_Harness_BANGER_visual_mobile_cards_v3.docx (design spec — mobile cards / lightbox / header)
- C:\Users\maxto\Desktop\НОВЫЙ САЙТ\Фото бани изнутри\v2_extracted\word\media\ (v2 image source)
- .github/workflows/deploy.yml (GitHub Pages deploy config with basePath)
- next.config.js (static export, basePath /NEW-SITE-BANI, assetPrefix /NEW-SITE-BANI)

## RULES (do not violate)
- NEVER invent prices, sizes, materials, legal data
- NEVER copy third-party floor plans without rights
- NEVER put bot tokens / backend secrets in frontend / Git
- NEVER return WhatsApp links
- NEVER invent bank account / BIK / KS / bank address
- Interiord photos: tag as "variants of interior execution" unless model-linked is confirmed
- Mobile must be checked on 390 / 393 / 430
- No push without explicit owner confirmation
- All legal stubs must have real data from owner (no placeholders)

## FIRST STEPS FOR NEW SESSION
1. Read HARNESS_HANDOFF_BANGER.md (this file)
2. cd C:\Users\maxto\Desktop\НОВЫЙ САЙТ\banger-site\NEW SITE BANI
3. git status; git log --oneline -1
4. npm ci
5. npm run build
6. Confirm last task from owner; do NOT restart exploration from scratch.
