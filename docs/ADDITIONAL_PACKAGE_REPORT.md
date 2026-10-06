# Дополнительный пакет — итоговая проверка

Проверено 2026-10-07. Итог **PASS**. Работа от опубликованной базы `5d3dabf583478dc2f51d5d5d15f8508ab2fdb7fc`. Изменения локальные, push не выполнялся.

## Выполнено

- Hero: компактная постоянная glass-панель, четыре QR без раскрытия. Порядок MAX → VK → Telegram → Instagram. Открытие меню не сдвигает заголовок и CTA.
- «О компании»: тот же централизованный social/QR-блок после вступления; footer и фото выставки сохранены.
- Меню: fade/slide 180 мс, Escape, закрытие по фону и ссылке; фиксированная высота шапки, блокировка фоновой прокрутки mobile.
- Интерьеры: 20 собственных фотографий, WebP/AVIF с сохранением пропорций; без людей/детей, одинаковых кадров и интернет-изображений. Карусель, стрелки, drag, native horizontal scroll; lightbox с плавным открытием/закрытием, стрелками, счётчиком, Escape, swipe, focus trap и восстановлением фокуса/прокрутки.
- Комплектация: одна адаптивная таблица без базовых accordion.
- Допы: один внешний блок, девять раскрывающихся разделов, 19 опций; цены и исходный алгоритм не изменены.
- Модели: 31/31 получили компактную базовую комплектацию рядом с описанием/характеристиками, также в печатной карточке. Пол и потолок — 100 мм.
- Motion: лёгкие section reveals, переходы без blur, accordion, lightbox и carousel; учтён prefers-reduced-motion. Новая виньетка не добавлялась.

Подтверждённый каркас: БГ-01–17, БГ-29–30. Брус: БГ-31. Тип БГ-18–28 по решению владельца **согласуется при заказе**. БГ-25–27 без выдуманных планировок и оборудования. Исторические 50 мм и комбинированный каркас/брус заменены только в пользовательском отображении актуальной спецификации; исходные записи каталога сохраняются для сверки происхождения.

При smoke-проверке исправлена подпись счётчика фильтра: «1 модель», «2 модели», «25 моделей». Данные моделей, фильтры и маршруты не менялись.

## Проверки

| Проверка | Результат |
| --- | --- |
| Production build | PASS |
| check:static | PASS — 136 HTML, 323 URL, 31 модель, 28 планировок, 0 ошибок |
| Реальные локальные HTTP HEAD | PASS — 333 адреса/ресурса HTTP 200; неизвестный маршрут HTTP 404 |
| Карточки/комплектация | PASS — 124 responsive DOM-проверки: 31 × 390/1440 × DAY/NIGHT |
| Печатные карточки | PASS — 31/31, актуальные 100 мм |
| Источники PPTX | PASS — 59/59 изображений, 31/31 модель, 28/28 планов |
| Цены моделей | PASS — 52/52 |
| Дополнительные опции | PASS — 19/19 во всех четырёх 390/1440 DAY/NIGHT сценариях |
| Интерьерная галерея | PASS — 20/20 загрузились и открываются; стрелки, wrap, drag, swipe, focus, Escape, overlay, scroll lock |
| Hero | PASS — 390/1440/1920/2560, DAY/NIGHT; без horizontal scroll, CTA доступен |
| About/комплектация | PASS — 8 адаптивных проверок, 390/1440 DAY/NIGHT |
| Меню | PASS — desktop dropdown и mobile; Escape, фон, переход по ссылке |
| Видео | PASS — открытие, переключение двух роликов, Escape; видео отсутствует в DOM до открытия |
| Статьи Word | PASS — 20/20: текст, H1/title, description, canonical и sitemap |
| Утверждённые article covers | PASS — 21/21; исходники не изменены |
| Backend regression | PASS — 7/7 тестов, без реальной отправки новых сообщений |
| Формы | PASS — mock success/error/receipt/timeout; код и endpoint сохранены |
| DAY/NIGHT initialization | PASS — 12/12 |
| Browser console | PASS — 0 errors/warnings |
| Защищённые данные/медиа | PASS — каталог, цены, планы, Hero, статьи, формы, MAX, видео и архитектура темы не изменены |

Машинный итог: `additional-package-qa.json`. Происхождение фото: `home-interior-sources.json`. Источники базовой комплектации: `model-base-configuration-sources.json`. Повторяемая проверка: `node scripts/verify-base-specification.mjs`. Скриншоты: `C:/Users/maxto/.codex/tmp/banger-additional-qa/`.

## Изменённые файлы

- `docs/CATALOG_SOURCE_OF_TRUTH.md`
- `docs/additional-package-qa.json`
- `docs/home-interior-sources.json`
- `docs/model-base-configuration-sources.json`
- `scripts/verify-base-specification.mjs`
- `src/app/banya/[slug]/page.tsx`
- `src/app/dom/[slug]/page.tsx`
- `src/app/globals.css`
- `src/app/katalog/bani/page.tsx`
- `src/app/katalog/doma/page.tsx`
- `src/app/komplektaciya/page.tsx`
- `src/app/model-sheet/[id]/page.tsx`
- `src/app/o-kompanii/page.tsx`
- `src/app/page.tsx`
- `src/components/catalog/Equipment.tsx`
- `src/components/catalog/ExtraOptions.tsx`
- `src/components/catalog/ModelBaseConfiguration.tsx`
- `src/components/layout/Header.tsx`
- `src/components/sections/InteriorPhotosSection.tsx`
- `src/components/ui/InteriorLightbox.tsx`
- `src/components/ui/PageTransition.tsx`
- `src/components/ui/ScrollReveal.tsx`
- `src/components/ui/SocialBlock.tsx`
- `src/data/equipment.ts`
- `src/data/home-interiors.ts`
- `src/data/model-configuration.ts`
- `src/lib/catalog-labels.ts`
- `public/images/interiors/home/interior-01..20.webp/.avif` — 40 оптимизированных web-копий.
- `docs/ADDITIONAL_PACKAGE_REPORT.md` — итог и список изменений.
