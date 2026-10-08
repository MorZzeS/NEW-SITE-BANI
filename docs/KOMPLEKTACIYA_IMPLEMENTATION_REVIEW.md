# Комплектация C + B — внедрение в локальный production-код

07.10.2026. Утверждённый источник: `docs/ux/komplektaciya-final.html`. Published BANGER.SU не изменён, push не выполнялся.

## Что изменено

- `/komplektaciya`: открытая единая база из 11 исходных параметров, пять утверждённых дополнений, девять accordion-категорий с 19 существующими опциями. Дизайн перенесён из финального прототипа, без переосмысления и сторонних ресурсов.
- Popular и checkbox используют одно состояние IDs; add/remove/reset синхронизированы, повтор одной опции не создаёт дубликат.
- Summary sticky справа на desktop; в потоке перед категориями на mobile. Отображается сумма **допов**, отдельно неизвестная цена поддона; цена модели не меняется. Штучные элементы явно выбираются в количестве 1.
- CTA прокручивает к настоящей форме и фокусирует имя. Передаваемый список опций отображается в форме и добавляется к `comment` при submit. Пользовательский комментарий сохраняется отдельно и не затирается изменением выбора/сбросом. Динамическое состояние выбора не сохраняется в cookies/storage.
- Backend contract прежний. Optional `configurationNote` в CTAFormInline используется только новой страницей; без него обычная форма отправляет прежний comment. При общем размере больше 1500 символов показана ошибка, отправки/молчаливого обрезания нет. RequestId пересоздаётся, если реально отправляемые данные изменились.

## Файлы этого commit

1. `src/app/komplektaciya/page.tsx` — новый компонент, прежние SEO metadata.
2. `src/components/catalog/EquipmentConfigurator.tsx` — утверждённая компоновка и выбор.
3. `src/components/catalog/EquipmentConfigurator.module.css` — scoped DAY/NIGHT/responsive/focus/reduced motion стили.
4. `src/lib/equipment-selection.ts` — выбор/сумма из единого options source, comment merge с лимитом.
5. `src/components/forms/CTAFormInline.tsx` — optional перенос списка в существующее поле comment.
6. `scripts/verify-equipment-configurator.mjs` — contract/regression тесты без сети.
7. `docs/KOMPLEKTACIYA_IMPLEMENTATION_REVIEW.md` — этот отчёт.

Исходные `src/data/options.ts` и `equipment.ts` не изменены. Исторические price-source метки не используются для вычисления: UI берёт текущий salePrice напрямую. Backend, Hero, каталог/модели/цены, статьи, изображения, QR, юридические страницы, DNS и hosting не изменены. Более ранние untracked документы/UX-макеты сохраняются отдельно, не включаются в этот UI commit автоматически.

## Проверки

| Проверка | Результат |
|---|---|
| 19/19 опций и все реальные категории | PASS — прочитаны из единого массива, 19 checkbox |
| Prices | PASS — текущие значения без коэффициентов; все known values вместе 222 400 ₽ |
| Selection | PASS — dedup, popular ↔ accordion, remove/reset; null не выдаётся за подтверждённую нулевую цену |
| Form transfer | PASS — реальные submit handler + mocked sendLead; 19 выбранных имён и пользовательский текст, 512/1500 символов, проходят неизменённый backend validateLead |
| Обычные формы | PASS — optional note отсутствует, исходный comment сохраняется; overflow не отправляется |
| 1440 LIGHT/DARK | PASS — проверены реальные 1440 px; sticky summary, без overflow |
| 390 LIGHT/DARK | PASS — реальные 390 px; summary static в потоке, category targets около 63 px |
| Keyboard / touch layout / a11y | PASS — Enter accordion, Space checkbox, associated labels, aria-expanded/controls, focus outline, минимум 44 px у controls |
| Invalid form | PASS — некорректный телефон даёт ошибку до network request |
| Console | PASS — 0 error/warn в QA-вкладке |
| Layout | PASS визуально — стабильные H1/section координаты между DAY/NIGHT: h1 178,59 px desktop, 148,59 px mobile; intentional accordion/selection reflow ожидаем. Числовой CLS не измерялся |
| Build | PASS — `npm run build`, 21/21 article slash aliases |
| Static | PASS — 136 HTML, 353 URL, 31 модель, 28 планов, errors=[]; production path audit PASS |
| Leads contract regression | PASS — `node scripts/verify-leads.mjs`, success/error/receipt/timeout без реальной отправки |

Команды: `npm run build`, `npm run check:static`, `node scripts/verify-equipment-configurator.mjs`, `node scripts/verify-leads.mjs`.

Реальные сообщения в MAX и production формы в этом UI этапе не отправлялись: backend не менялся. Проверка передачи использует настоящий обработчик компонента и mock network, а не новую production-инфраструктуру.

## Визуальные доказательства

Локальная QA-папка вне Git: `C:/Users/maxto/Desktop/НОВЫЙ САЙТ/qa-equipment-implementation/`.

- `equipment-1440-light-full.png`, `equipment-1440-dark-full.png`;
- `equipment-390-light-full.png`, `equipment-390-dark-full.png`;
- `equipment-comparison-1440.jpg`, `equipment-comparison-390.jpg`;
- `form-transfer.png`, `checks.json`.

Снимки full-page сохранены после загрузки страницы; focused crops получены из полного снимка. Измерения первоначально на default 1280 не засчитывались и были повторены в активной preview-вкладке на точных размерах 1440/390. No horizontal overflow во всех итоговых четырёх режимах.

После создания отдельного локального commit остановиться. Push/deploy не выполнять без следующего разрешения.
