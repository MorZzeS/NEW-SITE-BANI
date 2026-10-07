# Hero — liquid glass

Проверено 2026-10-07. База: `42fe19eb8eeb7445c59452b4a160e7b1cd86e379`. Итог **PASS**. Push не выполнялся.

## Изменения

- Единый header на всю доступную ширину: прозрачный тон, мягкий blur, тонкая граница, скругление 14 px. MAX удалён из верхней панели; оба телефона, логотип, навигация, CTA и DAY/NIGHT сохранены.
- Правый social-блок и нижний trust-strip используют одну glass-поверхность с мягкими бликами; непрозрачные светлые подложки убраны. QR видны сразу, ссылки и порядок MAX → VK → Telegram → Instagram сохранены. SVG-матрицы и quiet zones не изменены; мягкий тёплый оттенок применяется только CSS к Hero.
- Trust-strip приподнят на 8 px через transform, без изменения потока Hero.
- Лёгкое равномерное тонирование фона: DAY 9%, NIGHT 12%; направленные градиенты сохранены, новая виньетка не добавлялась.
- По текущему ТЗ DAY использует старый рендер без семьи `hero-bg.webp`, NIGHT — существующий семейный `hero-night.webp`. Первая загрузка и прогрев противоположной темы используют те же файлы. Исходники и web-файлы не изменялись.

## Проверки

| Режим | Результат |
| --- | --- |
| 1440 px DAY | PASS |
| 1440 px NIGHT | PASS |
| 390 px DAY | PASS |
| 390 px NIGHT | PASS |

Header: x=0, правый край совпадает с clientWidth во всех режимах. Заголовок и CTA сохраняют одинаковые координаты в обеих темах: desktop H1 y=327,5 / CTA y=644,5; mobile H1 y=162 / CTA y=431,375. Высота Hero сохранена: desktop 1000 px при viewport 1440×1000; mobile 1029 px при viewport 390×844. Горизонтального скролла и наложений нет.

Production build — PASS. `check:static` — PASS: 136 HTML, 323 внутренних URL, 31 модель, 28 планировок, 0 ошибок. Проверка темы — 12/12 PASS. Проверка базовой комплектации/цен — 31 модель и 52 цены PASS. Скомпилированный preload проверен для обеих тем.

Smoke: mobile-меню и оба телефона, desktop dropdown/Escape, видеопросмотр через click/Enter, два видео/переключение/muted/закрытие, CTA «Заказать звонок» → `/kontakty#zayavka` и форма — PASS. Console errors/warnings — 0. Реальные заявки не отправлялись.

Данные каталога, статьи, формы/backend, видео/галереи, QR/Social source, архитектура темы и все изображения/ролики сохранены без изменений.

## Файлы

- `src/app/globals.css`
- `src/app/layout.tsx` — preload нужного DAY-рендера
- `src/components/layout/Header.tsx`
- `src/components/sections/HeroSection.tsx`
- `docs/HERO_LIQUID_GLASS_REPORT.md`

Скриншоты и browser-results.json: `C:/Users/maxto/Desktop/НОВЫЙ САЙТ/qa-hero-liquid-glass/`.

## SHA256 изображений

- `hero-bg.webp`: `b31d4e037573014da0d0f8348719495e3b05e287f5c7ad668e2a0e23ef8efe37`
- `hero-night.webp`: `87ecda0ae6cdee35369bcbd5c876487a48f4cff3faa308413de9ba010280d7d3`
