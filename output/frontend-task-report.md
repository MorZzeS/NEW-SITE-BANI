# Frontend task report

## Результат
- QR-панель: прозрачный фон, blur 4px / 3px на смартфонах вместо 14px / 6px; ширина 272px на desktop и максимум 480px ниже 1280px; уменьшены внутренние отступы, подписи увеличены с 12px до 14px.
- Итоговые размеры QR сохранены: 96px при >=1280px, 80px при 641–1279px, 72px при <=640px. Порядок MAX / VK / Telegram / Instagram сохранён через неизменённый socialLinks.
- На 768–1279px первичный телефон из settings (8 (936) 200-00-50 в текущих данных) расположен в центральной колонке, ссылка tel:. До 768px скрыт. >=1280px сохранены навигация и два телефона. Контакты мобильного меню не изменены.
- Новый HeroVideoAction с Play и текстом «Смотреть видео изнутри», hover/focus, reduced-motion.
- USE_INTERIOR_VIDEO_CTA = true в src/components/ui/HeroVideoAction.tsx включает новую кнопку. false возвращает прежнюю реализацию CTA.
- Hero-фон, доверительный блок и динамический BathVideoViewer не изменены; onClick продолжает вызывать setVideoOpen(true).

## Доказательства
Фактический diff прочитан для:
- src/app/globals.css
- src/components/layout/Header.tsx
- src/components/sections/HeroSection.tsx
- src/components/ui/SocialBlock.tsx
Новый файл src/components/ui/HeroVideoAction.tsx подтверждён git status и прочитан полностью.
git diff --check завершился с кодом 0; только предупреждения о преобразовании LF в CRLF.
Проверены CSS breakpoint-условия и сохранённые итоговые размеры QR по исходному и изменённому CSS. Для <=380px подписи расположены над QR, чтобы увеличенный текст не теснил изображения.

## Проблемы
Обычный sandbox exec не запускается: CreateProcess Rejected("Failed to create unified exec process: helper_unknown_error: setup refresh had errors").
Штатная per-command require_escalated через auto_review работает; защиты не ослаблялись.
Попытка проверки синтаксиса через локальный TypeScript остановилась: Cannot find module 'typescript'. Ничего не устанавливалось.

## Не проверено
Браузерные скриншоты, фактическая адаптация и клики/фокус/воспроизведение в браузере, полная типизация и сборка. Сборка, push и deploy не запускались по заданию. Успешные браузерные проверки не заявляются.

## Повторная проверка переводов строк
Сообщение о буквальных escape-переводах строк проверено по физическим байтам до изменений:
HeroVideoAction.tsx: 1267 bytes, 28 LF, 0 CR, 0 буквальных escape-последовательностей, Get-Content: 29 строк.
frontend-task-report.md: 3181 bytes, 27 LF, 1 CR, 0 буквальных escape-последовательностей, Get-Content: 27 строк.
Буквальные escape-последовательности в этих файлах не обнаружены. Возможное объяснение — JSON-экранирование вывода инструмента; это предположение.
Оба новых файла нормализованы на реальные Windows CRLF с завершающим переводом строки.
Компонент перечитан после записи. Посторонние файлы backend/spaceweb, docs/deployment, docs/preparation и scripts/spaceweb не читались и не изменялись в этом исправлении.
