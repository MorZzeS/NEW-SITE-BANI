# Точка продолжения — 12.11.2026, актуальное состояние

> Последний production-релиз — `ad8473a5384ca36d488a26bebc8c2850dde96aca`, опубликован на SpaceWeb. Онлайн-формы остались включены; погода выключена. Результат и проверка новой формы записаны в последнем разделе этого файла. Более ранние записи ниже — история предыдущих состояний и не являются актуальным статусом.

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

Завершено; фактическая публикация и контрольная заявка записаны в заключительном разделе файла. Новую тестовую заявку повторно не отправлять.

## Завершение публикации и проверка онлайн-заявки — 12.11.2026

- Код релиза: 3d5c845819f876ea28b0bd9d0fd01269bcce1cff (feat: refine BANGER calculator and release content). Production release.json подтверждает тот же SHA, профиль online-leads, onlineLeads:true, погода disabled.
- Сборка и обязательные тесты, TypeScript, статические проверки, калькулятор/цены/логистика, PDF-сценарии и 31-модельный sweep пройдены; Legal RU, Security Auditor и QA Tester дали необходимые результаты для этой публикации.
- Реальная production-проверка из формы «Исток 4»: POST /leads.php → HTTP 202 за 698 мс; номер f2c9675a-9d4d-4cba-89de-3902332ec3d4; серверный интерфейс подтвердил durable admission со статусом «уведомление ожидает доставки». В заявке были базовая цена 412 500 ₽, перепланировка 10 000 ₽, итог 422 500 ₽.
- Владелец подтвердил получение этого сообщения в MAX. Отправка выполнялась один раз; повторов не было.
- Production: https://banger.su/ и /banya/istok-4 вернули HTTP 200; калькулятор, выбранная опция и форма видны, fallback отсутствует. Скриншоты: D:\Максим\Memory\Projects\BANGER.SU\Work\2026-11-12\SpaceWeb-TZ\screenshots-final-release.
- До замены файлов сделана локальная копия web-root: D:\Максим\Memory\Projects\BANGER.SU\Backups\SpaceWeb\2026-11-12-before-static-release\site-public_html-before-3d5c845.zip (270 127 907 байт; архив развёрнут во временный каталог и проверен, временная распаковка удалена).
- Подготовленный ZIP релиза сохранён локально: D:\Максим\Memory\Projects\BANGER.SU\Backups\SpaceWeb\2026-11-12-before-static-release\BANGER_SPACEWEB_READY_3d5c845.zip (269 749 909 байт; SHA256 8061d21cdd854e14c399ffae50044f5262a14a1839c03310afa20605309523fd). Временный экземпляр ZIP удалён из public_html; .htaccess, leads.php и health.php не заменялись.
- Секреты не читались и не попадали в артефакт. Отдельную настройку сервера, домена, БД, Cron и DNS в ходе статического релиза не меняли.
- Изменения кода опубликованы на SpaceWeb; test form → MySQL durable admission → MAX human receipt подтверждены. Известное операционное замечание по ручной обработке отзыва/раннего удаления и неизвестных записей очереди описано выше в этой памяти и остаётся отдельной задачей.

### Следующая точка продолжения

Пользователь может открыть production-сайт сейчас. Для будущей работы сначала прочитать этот файл и PROJECT_CONTEXT.md; повторная отправка контрольной заявки не нужна.

## 2026-11-12 — Urgent post-publication fixes deployed

- Production release: `ad8473a5384ca36d488a26bebc8c2850dde96aca` (`fix: refine BANGER homepage and model galleries`), опубликован на SpaceWeb. Live `release.json` подтверждает SHA; профиль `online-leads`, `onlineLeads=true`, погода disabled.
- Главная: CTA контактов размещены непосредственно над trust strip; панель соцсетей/QR компактна и адаптивна, без наложения на hero.
- Все 31 карточка модели: обзор и галерея выровнены; цена, действия и калькулятор интегрированы в обзор; подтверждённые размеры оставлены в спецификациях; базовая комплектация идёт до галереи интерьера. Площади помещений отображаются только при явной подписи на исходном плане.
- Галерея интерьера: автопрокрутка с паузой при взаимодействии, lightbox, мобильный свайп и reduced-motion; неприоритетные изображения лениво загружаются.
- Проверки: build, TypeScript, static checks, tests и необходимые отзывы Legal RU/Security/QA пройдены. Live Chrome QA проверил 31 маршрут модели, 1440/390 px, DAY/NIGHT, галерею; переполнения, наложений и ошибок изображений нет. Генератор PDF и двухстраничный пример проверены по содержимому и рендеру. Автоматическое сохранение PDF в папку через CDP download manager не завершилось; это ограничение браузерной автоматизации, загрузка сайта клиентом подтверждена генерацией PDF blob.
- Релизный ZIP: `D:\Максим\Memory\Projects\BANGER.SU\Work\2026-11-12\SpaceWeb-TZ\urgent-fixes-2026-11-12\release-artifact\BANGER_SPACEWEB_READY_ad8473a.zip`; SHA256 `B7FF7BED0183E4AF3D0214FCAE9BB16BBD985330F753BEDEE3640E57A72BA214`. 825 статических файлов; PHP, `.htaccess`, credentials и закрытые файлы отсутствуют.
- Откатная статика: `D:\Максим\Memory\Projects\BANGER.SU\Backups\SpaceWeb\2026-11-12-before-static-release\BANGER_SPACEWEB_READY_3d5c845.zip`; SHA256 `8061D21CDD854E14C399FFAE50044F5262A14A1839C03310AFA20605309523FD`. Серверные `.htaccess`, PHP-backend, DB, Cron и credentials не менялись.
- Live routes `/`, `/banya/istok-4`, `/dom/usadba-praktik`, `/release.json`, `/robots.txt`, `/sitemap.xml` — HTTP 200. Safe handler: GET `/leads.php` 405, OPTIONS 204; private credentials URL 403.
- Контрольная форма после релиза: синтетическая заявка `8c8b5795-1765-4208-acb4-a140a30a174f`, модель «Исток 4». Реальный сайт вернул HTTP 202 accepted; контракт обработчика подтверждает, что заявка, журнал согласия и outbox сохранены до ответа. Владелец подтвердил «Да, пришло» для этого номера: получение уведомления в MAX подтверждено. Полная цепочка production-форма → сохранение в MySQL → MAX проверена после релиза `ad8473a`. Повторная отправка не выполнялась.
- Скриншоты и live протокол: `D:\Максим\Memory\Projects\BANGER.SU\Work\2026-11-12\SpaceWeb-TZ\urgent-fixes-2026-11-12\release-artifact\live-after`; PDF-пример и PNG-рендеры — в подкаталоге `pdf-download`.

### Следующий шаг

Текущая задача завершена: публикация и получение контрольной заявки в MAX подтверждены. Повторная отправка не требуется. Перед следующей задачей читать `AGENTS.md`, этот файл и `PROJECT_CONTEXT.md`; не повторять уже пройденные проверки без нового изменения. Ранее записанные операционные ограничения по ручному удалению/отзыву и очереди остаются отдельной задачей.

## Hero refinement — 12.11.2026, проверенный кандидат

- Задача: заголовок ровно в две строки, более крупная desktop-типографика, выше расположенный текст; вторичные подписи про город Раменское/2024; аккуратная кнопка контактов и QR-панель в границах композиции.
- Изменены только HeroSection.tsx, HeroContactDisclosure.tsx и связанные hero-стили globals.css. Desktop QR раскрывается вверх, right:0 относительно кнопки; 464×141 px. На mobile панель идёт в потоке перед trust strip, 4 QR/ссылки сохранены. Chevron вращается на 180°, Escape возвращает фокус.
- Проверки: production build с online-leads/PHP endpoint и закреплённым одобренным архивом документов PASS; build typecheck PASS; npm test PASS; check:static 142 pages/435 URLs/31 models, productionPathAudit PASS; diff-check PASS.
- Chrome/CDP QA: 28 состояний (320,390,768,1024,1440,1920 px; DAY/NIGHT; closed/open), 0 ошибок. QR не выходит за trust grid, не пересекает текст; Escape 14/14. Скриншоты/qa-results.json: D:\Максим\Memory\Projects\BANGER.SU\Work\2026-11-12\hero-refinement\local.
- Legal RU, Security Auditor, QA Tester и independent_reviewer: PASS в изменённом объёме. Независимо отмечен существующий дефект header на 320px (обрезанная кнопка меню), отсутствующий в текущем diff; не исправлялся в задаче hero, required mobile390 PASS.
- Production пока ad8473a; далее commit → пересборка с точным SHA → проверенный статический overlay без PHP/.htaccess/секретов → SpaceWeb → live QA. Rollback: сохранённый BANGER_SPACEWEB_READY_ad8473a.zip в Memory. Формы/бэкенд/БД/MAX, погода и цены не меняются.
