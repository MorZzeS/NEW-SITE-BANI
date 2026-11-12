# Точка продолжения — 12.11.2026

## Выполнено локально

- Изучено ТЗ `BANGER_SU_TZ_Codex_SpaceWeb_12-11-2026.docx`; создана отдельная ветка `work/spaceweb-refresh-20261112` от `27948c7ff58157d6da36cbf1a04854dff051c337`.
- Обновлены главная, сведения о моделях, базовая спецификация, логистика, опции, бюджетные фильтры, страницы доставки/гарантии/оплаты, SEO и PDF-контракт. Состав моделей/цены домов не расширять предположениями.
- Добавлен контроль согласованных опций/цен; `verify-price-update` проверяет 31 модель и 39 платных опций; текущая опция монтажа — отдельный расчёт 300 000 ₽, без двойного учёта разгрузки краном.
- `npm run build` пройден после последних изменений: 142 статические страницы, включая 31 модель и 31 лист модели. Профиль — `visual-contacts`; погода выключена. This profile cannot replace active production online forms.
- Ранее на этой точке проходили `npm test`, `check:static`, TypeScript и адресные калькуляторные/логистические тесты; после исправления визуального QA их нужно повторить до финального результата.
- Созданы эти файлы постоянного контекста; существующие правила об утверждённых визуалах в `AGENTS.md` сохранены.
- Финальный browser QA завершён: 28 реальных скриншотов главной и моделей BG-01/BG-24/BG-31, 1440/390 px, DAY/NIGHT; `visual-qa.json` PASS, горизонтального переполнения, сломанных изображений и browser errors нет. Повторные снимки BG-24 подтверждают, что модельное фото отображается.
- PDF QA PASS: 5 сценариев (база — 2 стр.; 1 опция — 2; 5 опций — 2; 12 опций — 3; логистика и длинный адрес — 2), все страницы отрендерены в PNG и визуально просмотрены. Sweep 31 модели (25 бань/6 домов) подтвердил характеристики, опции и цены. 12-я опция добавляет третью страницу без обрезки; исходная версия уже помещалась в 2 страницы.

## Сейчас в работе

- Скриншоты: `D:\Максим\Memory\Projects\BANGER.SU\Work\2026-11-12\SpaceWeb-TZ\screenshots-final`; PDF/рендеры: `...\pdf-qa\pdf` и `...\pdf-rendered`.
- Legal RU и Security Auditor завершили review; найдены блокеры production, перечисленные ниже. QA reviewer независимо подтвердил, что текущая сборка отключит формы.

## Осталось

1. Исправить или убрать неподтверждённые публичные коммерческие claims для production: 12-месячную гарантию, монтаж 300 000 ₽/его объём, фактические способы оплаты/KKT.
2. Сохранить активные production-формы/MAX: текущий `dist/release.json` — `visual-contacts`, `onlineLeads:false`; публикация выключит подтверждённые формы. Интегрировать действующий production профиль/контракт и повторить release gate.
3. Повторно выполнить проверки из `PROJECT_CONTEXT.md` (build, `npm test`, `check:static`, TypeScript, цены и `git diff --check`) после исправлений.
4. Просмотреть `git status` и diff; убрать только собственный тестовый мусор, не затрагивая чужую работу. `tsconfig.tsbuildinfo` не коммитить.
5. После PASS gates сохранить commit, выполнить имеющийся deploy process, проверить live и обновить Memory.

## Замечания и границы

- Legal RU не подтвердил production-готовность 12-месячной гарантии, цены/объёма монтажа и KKT/способов оплаты; не считать их подтверждёнными фактами. Review указал файлы `WarrantySection.tsx:8`, `garantiya/page.tsx:42,56–57`, `homepage.ts:33`; `dostavka-i-ustanovka/page.tsx:45,47,64`; `oplata-i-cheki/page.tsx:35`.
- Владелец 12.11.2026 разрешил автоматический commit/deploy после успешной приёмки через уже настроенный процесс, но запрещено без отдельного согласования менять сервер, домен, платежи и инфраструктуру.
- Текущий `dist/release.json` подтверждает `visual-contacts` / `onlineLeads:false`; QA reviewer установил, что его публикация выключит формы, активные в production. Поэтому production-deploy разрешён только после интеграции/сохранения действующего онлайн-потока и повторного release gate.
- В дереве есть `tsconfig.tsbuildinfo` и изменённые QR SVG после сборки; проверить их происхождение и не включать в будущий коммит без необходимости.

## Следующий конкретный шаг

Повторно выполнить полный автоматический набор; затем выбрать безопасный release, сохранив активные production-формы/MAX и убрав непроверенные коммерческие утверждения. Deploy выполнять только после PASS gates.

## Обновление продолжения — 12.11.2026

- Проверены `AGENTS.md`, `PROJECT_CONTEXT.md` и `TASK_PROGRESS.md`; постоянный контекст и правило «проверки → commit → публикация → live-проверка» сохранены. Новое уточнение: production-формы/MAX уже работают и должны остаться включёнными.
- Ветка остаётся `work/spaceweb-refresh-20261112`, HEAD `27948c7ff58157d6da36cbf1a04854dff051c337`; текущий `dist/release.json` всё ещё `visual-contacts`, `onlineLeads:false` — публиковать его нельзя.
- Архив документов 11.11.2026 имеет совпадающие локальные SHA256 текстов и указывает 90-дневный срок хранения, но поле `approved` пока `false`; прежде чем строить online-leads профиль, нужно подтвердить условное одобрение по актуальным реквизитам/условиям и сверить с backend archive. Секреты не открывать.
- Релизные workflow в репозитории: production GitHub Pages запускается от `main`, тестовая Pages — от `work/github-pages-test-20261030`. Настроенного SpaceWeb deployment workflow в этих двух файлах нет; автоматический production upload нельзя считать подтверждённым, пока не найден конкретный существующий процесс.
- Обязательные перед публикацией ревью Legal RU, Security Auditor и QA Tester уже проводились; найдены риски по гарантийным, оплатным/KKT и монтажным утверждениям. Требуется устранить/обосновать их и повторить reviews.

### Следующий конкретный шаг

Сверить документный архив с текущими утверждёнными реквизитами/сроком хранения и backend pin, затем скорректировать неподтверждённые коммерческие формулировки. После этого пересобрать online-leads artifact, выполнить весь набор тестов и три обязательных release reviews. Не публиковать сборку с `onlineLeads:false` поверх активных форм.
## Этап — память, юридические формулировки и live state (12.11.2026)

- В `PROJECT_CONTEXT.md` убрано противоречивое указание «не активировать формы»: зафиксировано сохранять уже работающие production-формы/MAX. В `AGENTS.md` записано правило владельца: после успешных проверок commit/deploy автоматически; не трогать серверные настройки, домен, платежи и инфраструктуру без отдельного согласования.
- Найден owner-approved архив от 11.11.2026 (`approved:true`) с 90-дневным retention. Его три SHA256 текстов совпадают с рабочим архивом (`approved:false`); исходные тексты не изменялись. Проверку условия о текущих реквизитах и соответствие серверному pin запросили у Legal RU; флаг в исходнике пока не менялся.
- Убраны из публичного текста неподтверждённые 12-месячный срок гарантии и конкретные обещания способов оплаты/кассового чека. Сборка на участке 300 000 ₽ остаётся предварительным ориентиром, бизнес-цена не менялась; точный объём работ предлагается фиксировать в предложении. Сообщения калькулятора обновлены, арифметика не затронута.
- Прямая текущая проверка `https://banger.su/release.json` вернула HTTP 200, profile `online-leads`, SHA `a60c20e1bda6acce33f1ef8458fc3c3cd7549309`, `onlineLeads:true`; главная тоже HTTP 200 и помечена `online-leads`. В HTML обнаружена строка контактного fallback, поэтому реальное состояние формы нужно подтвердить прямым DOM/browser-проверением до релиза.
- `git diff --check` не показал ошибок whitespace (только предупреждения о переведении LF→CRLF в четырёх QR SVG, эти файлы не трогать без обоснования). Полный повтор тестов после редакторских изменений ещё не выполнен.

### Следующий шаг

Получить вывод Legal RU; подтвердить текущий текст формы на реальном DOM и возможный устаревший fallback; настроить production-сборку с owner-approved archive без секретов, затем повторить тесты, PDF/browser QA и required security/legal/QA reviews. Публикационный маршрут SpaceWeb пока не подтверждён: проверенные GitHub Actions workflow обслуживают `main` Pages и отдельный Pages preview, не SpaceWeb.

## Повторная приёмка перед публикацией — 12.11.2026

- Срок хранения заявок 90 дней подтверждён владельцем; повторное утверждение не требуется. Legal RU оценил статическое обновление как допустимое при сохранении точного утверждённого архива 11.11 и нейтральных текстов гарантии, оплаты и монтажа. Backend этого релиза не меняется.
- Production Chrome CDP доступен на localhost:9222; вкладки BANGER.SU и файлового менеджера SpaceWeb присутствуют. Секреты и приватные файлы не читались.
- npm test PASS: release gate 39, online activation 18, document build 10, Yandex 12, frontend/backend unit tests all PASS.
- TypeScript, check:static (142 pages, 434 local URLs, 31 models, 28 plans), verify-price-update (31 models, 39 paid options), calculator (31 models × 45 options), logistics (372 cases), approved calculations, equipment, base specification, budget filters and git diff --check PASS.
- PDF QA PASS: five requested scenarios plus 31-model sweep; representative pages visually inspected. Results/PDFs/PNG renders: D:\Максим\Memory\Projects\BANGER.SU\Work\2026-11-12\SpaceWeb-TZ\pdf-qa-final-release.
- Browser QA PASS: 28 captures of home and BG-01/BG-24/BG-31 at 1440/390 px, DAY/NIGHT; zero overflow, broken images or browser errors. Legal pages captured at desktop/mobile themes; first-visit cookie panel is visible with a continue button, not a release blocker. Screenshots: ...\screenshots-final-release.
- Security Auditor found no secrets/config leakage; artifact endpoint is same-origin https://banger.su/leads.php. Required SHA integrity sequence: commit, production rebuild, verify dist/release.json SHA equals committed SHA.
- QA Tester: PASS for current online-leads artifact. Do not publish stale dist until rebuild after commit. Owner confirmed publication is approved.
- Legal RU: conditional pass for static copy update; consent archive text and backend remain unchanged. Owner confirmed the 90-day term.

### Next exact steps

1. Commit only reviewed source, legal archive metadata, memory files and tests; exclude four line-ending-only QR SVG changes and tsconfig.tsbuildinfo.
2. Rebuild with approved online-leads environment and re-run artifact gate; verify release SHA matches commit.
3. Use existing authenticated SpaceWeb file manager. Save a local backup in Memory before replacing public files; preserve the working PHP handler and .htaccess unless the static deploy requires a documented update.
4. Publish static artifact and verify live release.json, homepage, model page, calculator, PDF and existing form endpoint without sending a test submission.
