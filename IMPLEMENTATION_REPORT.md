
## Актуальное состояние кандидата — 27.11.2026

Этот блок отражает последние уточнения владельца и заменяет более ранние статусы ниже.

- Переключатель цвета убран с карточек каталога и находится внутри галереи страницы модели. На всех 14 опубликованных банях доступны шесть переданных владельцем вариантов — всего 84 рендера. Барн Премиум не получает калькулятор.
- Новые цены из таблицы владельца записаны в единый `priceFrom`, поэтому совпадают в карточках, страницах моделей, калькуляторе, заявке и PDF. Все 14 сумм сведены в `docs/catalog-card-prices-20261127.md`. Для БГ-18 пример с полом и двумя шпросами пересчитан на 657 400 ₽. По последнему уточнению владельца БГ-20 (Скандинавия 7 С-Д) за 825 000 ₽ теперь показана как базовая комплектация; ранее перечислявшиеся улучшения доступны отдельно и добавляются к цене.
- По замечанию о рекламе в карте: баннер отрисован внутри cross-origin iframe Яндекса, CSS сайта его не контролирует. Официальное отключение требует ключа JS API с тарифом без рекламы. Бесплатная карта на OpenStreetMap не показывает такие рекламные вставки, но меняет внешнего обработчика технических запросов и требует актуализации политики, а стандартный публичный tiles-сервис не даёт SLA. Замена карты пока не выполнена.
- PASS: `npm test`; `npx tsc --noEmit`; GitHub Pages production-profile build (163 HTML, 124 ссылки на ресурсы, missing 0); Pages-profile `check:static` (163 страниц, 474 локальных URL, 31 модель); полный калькуляторный gate (31/31 страниц; 31×48 комбинаций); baseline specification (31 моделей / 31 PDF-лист); 28/28 обложек и SEO-метаданных статей; PDF QA (14 сценариев и sweep 31 модели).
- Chromium локально: 14 страниц моделей, переключено 84/84 цвета, каталог — 0 цветовых групп и 0 селекторов; 0 ошибок JS. Проверены DAY/NIGHT на 1440 и 390 px, ширина мобильной страницы не превышает viewport. BG-28 варианты 04/06 показаны в оригинале 1376×768 в галерее и lightbox. Цены совпали на карточке/странице/калькуляторе для 14/14 моделей; PDF суммы проверены отдельным прогоном.
- WebKit не запускался: браузерный движок/Playwright недоступен в проектной среде. GitHub Pages пока содержит предыдущий commit `2acdc90`; локальные правки ещё не отправлены. Следующий шаг — проверить diff/секреты, commit и fast-forward push только в `work/github-pages-test-20261030`, дождаться Actions и перепроверить Pages. SpaceWeb, production, main, DNS, backend и база не изменялись.
- PDF страницы `09-scandinavia-four-photo-1/2.png` визуально просмотрены: выбранные опции и итог 657 400 ₽ отображаются без обрезаний; все четыре страницы результата (base/photo) находятся в локальном QA-каталоге.

## Addendum — missing BG-09—BG-12 color render package received (2026-11-27)

The owner-supplied archive added 24 variants (six colors each for BG-09, BG-10, BG-11, BG-12) to the 60 existing owner-approved variants. Only the 24 matching high-resolution PNG originals were used; duplicate JPEG exports for other models were not imported. No prior image was replaced. Catalog registry and render manifest now contain 84 assets for all 14 published sauna models; production, SpaceWeb, GitHub, DNS, PHP/MySQL, and database state are unchanged.

All 24 source files were hash-verified against the preserved incoming source manifest. Contact sheets were visually reviewed; each model's six colors retains a consistent silhouette, roof, doors/windows, and openings. This is a visual set-consistency check, not an engineering drawing or legal-rights audit.

Converted to WebP quality 88/effort 6 at original 2752×1536 dimensions without crop, resize, or color adjustment: 177,554,151 source bytes → 22,045,162 WebP bytes (87.6% reduction). Evidence and originals: Work/2026-11-27/Implementation-articles-catalog/qa-final-audit/incoming-renders-2026-11-27/.

Verification: npm test PASS; npx tsc --noEmit PASS; npm run build PASS (163 HTML, 125 resource references, no missing files); npm run check:static PASS (163 pages, 474 local URLs, 549 production-path files); isolated Chromium PASS (14 cards, 84/84 swatch changes, 1440 desktop and 390 mobile in DAY/NIGHT, zero JS exceptions and mobile overflow). Screenshot/result evidence is in chromium-smoke-renders-exact-results.json and screenshots-renders-exact-20261127/. Independent read-only review PASS: source/render hashes and dimensions matched; the exact swatch-to-image URL assertion was added after review feedback and the 84-click Chromium run passed.

Overall release remains NOT READY due to the previously recorded PHP/MySQL staging, WebKit, exterior-finish image, access-log, and mandatory review/approval items. No commit, push, deploy, or live-site test was performed.
