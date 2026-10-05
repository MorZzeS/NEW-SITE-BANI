# Этап 1 — DAY/NIGHT, 2026-10-05

## Точка отката №1

Исходная опубликованная версия: c314539e9547dac926a8d670157a8450364675e2. Локальный annotated tag: checkpoint-no1. Резервная копия полного Git: C:/Users/maxto/Desktop/НОВЫЙ САЙТ/banger-version-no1.bundle, git bundle verify — PASS.

Для проверки прежней версии в отдельной ветке: `git switch -c restore-no1 checkpoint-no1`. Tag и резервная копия не отправлялись в GitHub.

## Основание и область изменений

Прочитаны раздел 8 TZ_Harness_BANGER_SU_2026-09-30.docx и раздел 3.2 archive/BANGER_TZ_v4.docx. Сохраняется существующее уважение системной темы на первом входе (п. 3.2 свежего ТЗ), явный выбор имеет приоритет.

Исправлены semantic color tokens для текста, secondary labels, gold accents, glass surfaces, Header, CTA, полей, Footer и focus. Текст поверх фотографий имеет самостоятельный контекст светлого текста на тёмной подложке. Убраны цветовые !important; оставшиеся два относятся только к prefers-reduced-motion. В секциях добавлены лишь CSS hooks контекста темы — без изменений композиции, размеров, радиусов, контента, маршрутов и анимаций.

Переключатель: два неподвижных значка, текущая тема выделена, role=switch/aria-checked, label, title, keyboard focus, минимальная высота 44 px. Переход цветов 220 ms, без анимации blur/filter. Выбор темы применяется inline-скриптом в head до paint, валидируется, сохраняется после ручного переключения. Ошибка доступа к storage не ломает переключатель. Provider синхронизируется с ранним атрибутом темы, системной темой и storage-событиями; атрибут html не создаёт hydration warning.

Hero, карточки, текст, изображения, видео, каталог, цены, планы и статьи не перерабатывались. Семантические цвета общих компонентов влияют на темы всех страниц, поэтому проверены регрессии. Этапы 2–5 не начаты. Production/DNS не менялись. Push не выполнялся.

## Проверки

- npm run build — PASS, 88 маршрутов Next.js, 21/21 slash aliases.
- npm run check:static с локальным HTTP — PASS: 105 HTML, 249 URL, 31 модель / 28 планов, errors [].
- verify-theme-init.mjs — 12/12: system dark/light, saved dark/light, invalid/empty value, blocked storage; настоящий bootstrap в экспортированном head, accessible switch.
- Главная DAY/NIGHT × 1440/390 — 4/4 PASS. Actual viewport проверен; overflow отсутствует. Все секции просмотрены в четырёх вариантах; сохранены 32 снимка секций и baseline.
- Контраст обычного текста: вычисленные цвета с alpha compositing, 804 проверки главной без провалов относительно 4.5:1 (3:1 для крупного текста). Это проверка CSS цветов; фото/градиенты проверены отдельно визуально, не заявляется автоматическая сертификация всех пикселей фотографий.
- Dropdown и mobile menu — 4/4 PASS; Footer просмотрен во всех вариантах.
- Общие темы: каталог бань, Barn Premium, дом, контакты, privacy, исследовательская статья, комплектация × 4 — 28/28 PASS; контраст и overflow.
- Enter, Space, focus-visible, ручной выбор после reload — PASS; React/browser console errors — 0.
- Word статьи — 20/20 PASS, содержание/H1/SEO/URL не изменены. Обложки — 21/21 PASS. Данные и asset-файлы каталога не менялись.
- git diff --check — PASS.

Свидетельства: docs/day-night-stage1-qa.json и C:/Users/maxto/.codex/tmp/banger-day-night-stage1/. Снимки hero-1440-light/dark.jpg и hero-390-light/dark.jpg сделаны после окончания исходных анимаций; day-night-result.jpg — объединённый preview четырёх состояний.

## Изменённые файлы

- src/app/globals.css
- src/app/layout.tsx
- src/components/layout/Header.tsx
- src/components/sections/CTASection.tsx
- src/components/sections/CategoriesSection.tsx
- src/components/sections/HeroSection.tsx
- src/components/sections/ProjectsSection.tsx
- src/components/ui/ThemeProvider.tsx
- src/components/ui/ThemeToggle.tsx
- tailwind.config.ts
- src/lib/theme.ts
- scripts/verify-theme-init.mjs
- docs/DAY_NIGHT_STAGE1_REPORT.md
- docs/day-night-stage1-qa.json
