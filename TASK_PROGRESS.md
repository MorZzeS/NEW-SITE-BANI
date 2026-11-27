# Точка продолжения — 27.11.2026

## Текущий статус
На локальной тестовой ветке codex/2026-11-27-articles-catalog-implementation (HEAD deb3b2f) получен архив «Рендеры наших бань.zip». Добавлены недостающие 24 варианта цвета BG-09—BG-12; каталог теперь содержит 84 варианта для 14 опубликованных моделей, по шесть на модель. Предыдущие 60 исходников не заменялись.

24 новых PNG преобразованы в WebP quality 88, effort 6; разрешение каждого исходника 2752×1536 сохранено, без кадрирования, изменения пропорций или цветокоррекции. Входной объём — 177 554 151 байт, WebP — 22 045 162 байта (сжатие 87,6%). Исходники, их SHA-256, список файлов и контакт-листы хранятся в D:/Максим/Memory/Projects/BANGER.SU/Work/2026-11-27/Implementation-articles-catalog/qa-final-audit/incoming-renders-2026-11-27.

Визуальная сверка контакт-листов подтвердила, что внутри каждой шестёрки совпадают общий силуэт, крыша, проёмы и расположение дверей/окон; варианты различаются отделкой/цветом. Это не инженерная проверка по чертежам. Независимая read-only проверка PASS: проверены hashes/размеры 24 PNG и 24 WebP, корректность 84 записей и переключения; в Chromium все 84 swatch сопоставлены точным URL модели и цвета. Замечаний, блокирующих эти рендеры, нет.

## Проверки текущего этапа
- npm test — PASS; включая 28 статей и каталог: 84 варианта, все 14 опубликованных бань имеют 6 swatches.
- npx tsc --noEmit — PASS.
- npm run build — PASS: статический экспорт 163 HTML, 125 ссылок на ресурсы, пропусков нет.
- npm run check:static — PASS: 163 страниц, 474 локальных URL, 31 модель, 28 планировок, 549 файлов production path audit.
- Изолированный Chromium — PASS: 84/84 переключения на 14 карточках; DAY/NIGHT при 1440 px и 390 px; JS exceptions 0, мобильный overflow 0. Свидетельства: qa-final-audit/incoming-renders-2026-11-27/chromium-smoke-renders-exact-results.json и screenshots-renders-exact-20261127/.
- Общие ограничения остаются: PHP/MySQL hosting runtime и миграция не тестировались, WebKit недоступен, достоверные картинки наружных отделок ещё ожидаются, настройка access logs SpaceWeb аккаунта неизвестна.

Изменения не закоммичены и не опубликованы. GitHub, SpaceWeb, production, база, DNS и MAX не менялись. Новые 24 изображения взяты из комплекта владельца; остальные JPEG/PNG архива в публичную сборку не импортировались. Точка продолжения: получить достоверные изображения трёх вариантов фасадной отделки; завершить PHP/MySQL staging и проверку access logs для счётчика; повторить WebKit, когда он доступен. До закрытия оставшихся release gates не публиковать.

## Рабочий стол
Удаление C:/Users/maxto/Desktop/НОВЫЙ САЙТ ранее было отклонено политикой среды; обход не выполнялся. 74 обычных файла каталожной презентации и QA-рендеров сохранены с SHA-256 проверкой в D:/Максим/Memory/Projects/BANGER.SU/Work/2026-11-27/Desktop-cleanup/BANGER_Catalog_Refresh_2026-11-16. Исходная desktop-папка ранее оставалась; пользователь запрещал размещать там новые рабочие материалы.


## Историческая задача — обновление комплекта «Полезное» и рабочий процесс SpaceWeb (26.11.2026)

- Рабочая база: `D:\Максим\Memory\Projects\BANGER.SU\Work\2026-11-24\Emergency-recovery\worktree`; ветка `fix/emergency-static-assets-20261124`, базовый HEAD `2a23ae0ba64f48904f05bb183cb02e1584be24e0`. Неиспользуемые `output/pdf/`, `tmp/`, `tsconfig.tsbuildinfo` не трогать и не коммитить.
- В коде оставлено ровно 28 уникальных статей, URL не изменялись. Удалён старый appended-блок с семью дубликатами. Сохранены шесть утверждённых обложек; 27 исходных визуалов пакета скопированы byte-for-byte. Для статьи о производстве создана отдельная нейтральная 3D-визуализация после прямого разрешения владельца; подпись не выдаёт её за фото заказа или техчертёж.
- «pochemu-karkasnaya-banya» теперь «Как устроена каркасная баня BANGER: от производства до готового изделия». Данные содержат 10 этапов без неподтверждённых размеров/узлов. Из двух предоставленных статей убраны явные упоминания ROCKWOOL по действующему правилу проекта; базовый ISOVER/URSA 100 мм оставлен. URL прежние.
- Статьи, список, metadata, адаптивные темы, контент-ограничитель HTML и увеличиваемые иллюстрации подготовлены. Индивидуальный отчёт по 28 материалам: `docs/editorial-assets/2026-11-26/editorial-audit.md`; исходные редакционные данные и SHA manifest находятся рядом.
- Проверки PASS: `npm test`; `npm run check:articles`; `npm run check:static` (163 pages/416 URLs); `npx tsc --noEmit`; `npm run build` для SpaceWeb и `BANGER_GITHUB_PAGES=true npm run build` для GitHub Pages (163 HTML/124 assets, missing=0). Локальная визуальная проверка: 1440 и 390px, DAY/NIGHT, нет overflow; диалог изображения работает клавиатурой.
- **Перед публикацией в работе обязательные ревью Legal RU, Security Auditor, QA Tester.** Тестовую GitHub Pages и SpaceWeb пока не обновляли; коммита ещё нет. После ответов устранить подтверждённые дефекты, сделать только целевые повторные проверки, зафиксировать отдельный коммит, обновить тестовую ветку GitHub и проверить Actions; затем упаковать релиз, загрузить через SpaceWeb File Manager, сверить имя/размер/SHA и опубликовать на SpaceWeb.
- Восстановление Chrome: `C:\Users\maxto\Desktop\BANGER_Chrome_Audit.cmd`, профиль `Chrome-SpaceWeb-Audit`, CDP 9222 на loopback. Через Chrome extension текущей сессии проверена авторизованная панель. В File Manager `iframe#file-manager-frame` штатный `input[type=file]` и chooser успешно обнаружены; реальный файл пока не выбран и передача ещё не доказана. Историческую блокировку отдельного системного picker нельзя приписать Google/Chrome: факт не подтверждён. Не менять защитные настройки; перед публикацией проверить поддерживаемый chooser API и контрольный SHA загруженного файла.

## Историческая точка — 13.11.2026

> Последний production-релиз — `476c604a96a69f6e344ea298bc0553788df08dd1`: точечные исправления гарантии, установки, SEO и sitemap опубликованы на SpaceWeb и проверены. Live 16 браузерных сценариев PASS; 31 модель / 93 SEO-тега и 74 URL sitemap PASS. Онлайн-формы включены, серверная обработка не менялась; погода выключена. Текущая задача завершена. Более ранние записи ниже — история.

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

### Hero refinement — опубликовано и проверено

- На SpaceWeb опубликован `7751fda433ae309ffd8ca36a081060483ee35758` (`fix: align homepage hero and contact panel`). Live release.json: тот же SHA, online-leads / onlineLeads:true / weather:disabled.
- Overlay: 268 изменённых статических файлов из 825, 3 444 961 байт, SHA256 `9357A84407456F1C06FCBB8B5CFB0CD22D2D73FE5D8AC14C90CC54660A016CBC`. Путь: `D:\Максим\Memory\Projects\BANGER.SU\Work\2026-11-12\hero-refinement\BANGER_HERO_7751fda.zip`. ZIP проверен по каждому entry; assets шли перед HTML, release.json последним. Временный ZIP после извлечения удалён из public_html.
- Live Chrome QA: 8 состояний 1440×800/390×844, DAY/NIGHT, closed/open — PASS. Реальные скриншоты и `qa-results.json`: `...\hero-refinement\live`. Desktop panel 464×141, right 751 < trust right1325.5, bottom602 < trust top690. Mobile panel358×265.125, right374 = trust right374, bottom743.375 < trust top759.375. Заголовок76.32px desktop (прежний64), responsive31.97px на390; обе заданные строки сохранены.
- Главная, «Исток 4» и контакты HTTP200, формы присутствуют; GET /leads.php405. SHA256 `.htaccess`, leads.php, health.php до/после одинаковы (`server-files-before.json` / `server-files-after.json` в папке evidence). Новые тестовые сообщения MAX не отправлялись: backend/контракт/поток не менялись; предыдущая полная production-проверка с подтверждением владельца остаётся в записи выше.
- Откат: точная предыдущая статика `D:\Максим\Memory\Projects\BANGER.SU\Work\2026-11-12\SpaceWeb-TZ\urgent-fixes-2026-11-12\release-artifact\BANGER_SPACEWEB_READY_ad8473a.zip`; её целостность и baseline SHA проверены перед выкладкой. Сервер, DNS, main, цены и документы не менялись.
- Задача завершена. Следующее действие — новая задача владельца; текущий hero повторно не перерабатывать и контрольные заявки не дублировать. Существующий дефект header на320px записан отдельно выше; исправление не входило в согласованный объём hero.

## QR вправо — уточнение владельца, 12.11.2026

- Предыдущее раскрытие вверх заменено горизонтальным продолжением кнопки на desktop >=1280px. Панель в flex-потоке справа с зазором12px, нижняя граница совпадает с кнопкой, правый край совпадает с trust strip. Все4QR128×128px в ряд, изображения/ссылки/подписи сохранены. Tablet1024–1279 отдельной строкой, mobile2×2 без горизонтального скролла. Анимация x/clipPath вместо height, reduced-motion duration0.
- Изменены только globals.css и HeroContactDisclosure.tsx. Заголовок/фон/другие кнопки/четыре преимущества не редактировались; baseline comparison1440×800 подтвердил одинаковые rects H1/trust/двухCTA closed/open.
- Build/typecheck/online-leads artifact gate и check:static PASS. Chrome/CDP36 состояний на320/390/768/1024/1280/1366/1440/1920px, обе темы: QR128, right placement, границы/перекрытия,4ссылки,Escape — PASS. Evidence `D:\Максим\Memory\Projects\BANGER.SU\Work\2026-11-12\qr-right\local`.
- Legal RU, Security Auditor, QA Tester и independent_reviewer PASS в новом diff. Новые сообщения MAX не отправлялись; формы/endpoint/backend не затрагивались.
- Далее: commit/rebuild с точным SHA, проверенный overlay на SpaceWeb и live-приёмка. Baseline7751fda; для отката сохранены прежний overlay BANGER_HERO_7751fda.zip и полная база статики ad8473a; контрольные хеши серверных файлов сохранены в qr-right/server-files-before.json. Серверные настройки не менять.

### QR вправо — production PASS

- Опубликован код `5b799b53976b784781701465d05aa02834ebcb6e` (`fix: slide hero QR panel to the right`); live release.json подтверждает online-leads:true и weather:disabled. Главная/Исток4/контакты HTTP200 с формами; GET leads.php405.
- Live Chrome16 состояний:1440/1280 desktop,1024 tablet,390 mobile, DAY/NIGHT и closed/open — PASS. Панель1440:562.453×173px, зазор12px справа от кнопки, низ совпадает, right1325.5 = trust.right1325.5. На1280:557.453×173px, right1243 = trust.right1243. Все4QR128×128; mobile2×2 без обрезки/горизонтального скролла. Скриншоты/JSON: `D:\Максим\Memory\Projects\BANGER.SU\Work\2026-11-12\qr-right\live`.
- Заголовок, trust и первые две CTA не изменились по координатам1440closed/open относительно7751fda (`baseline-comparison.json`). Изображения/URLs/названия соцсетей сохранены; новые реальные заявки не отправлялись.
- Package: `qr-right\BANGER_HERO_5b799b5.zip`,268/825 статических файлов,3 444 951 байт, SHA256 `4A131FB56FD5D6CB898EE820EE3CF92A0D9AED7307F685A2A43A8E4F6AAED902`; все entries проверены, assets доHTML,release.json последним. Временный ZIP из public_html удалён; одноимённого файла в bangersu нет.
- SHA256 .htaccess/leads.php/health.php до/после совпадают. Сервер/БД/Cron/секреты/DNS/main не менялись. Rollback7751fda: прежний проверенный overlay в hero-refinement и сохранённая полная статика ad8473a в urgent-fixes/release-artifact (точные пути в release-manifest.json).
- При upload устаревший выбор файлового менеджера вызвал TypeError mime; после очищения выбора и обычного exec('upload') загрузка подтверждена событием upload+серверным listing. Не считать DOM.setFileInputFiles подтверждением upload; проверять event/listing перед extract.
- Текущая задача завершена. Для дальнейших правок использовать именно раскрытие ВПРАВО, не возвращать верхнюю панель. Новое изменение формы/MAX не требуется.

## Индикатор и motion — проверенный кандидат, 12.11.2026

- По новому поручению ChevronDown полностью удалён. Золотистая полоска с круглым краем в прежнем16px слоте:8px default,14px hover/keyboard focus,20px expanded; transform-origin:left, transition280ms. Габариты кнопки и всей композиции сохранены.
- Панель по-прежнему вправо: opacity/x(-10→0)/clipPath260ms, без Y. Четыре QR входят с CSSstagger0/35/70/105ms, duration240ms. Reduced-motion: initial=false/duration0, без card animations, без воспринимаемого перехода полоски (global CSS safety0.01ms).
- Найден/устранён начальный прозрачный кадр reduced-motion: initial={false} исключает его. Enter/Space/Escape проверены реальными CDP keyboard events, hover реальным mouseMoved; RAF traces normal/reduced сохранены. Local motion8/8 PASS и layout16/16 PASS, DAY/NIGHT1440/1280/1024/390. Геометрия H1/trust/CTA/panel соответствует предыдущей версии, QR128×128.
- Build/typecheck/online-leads artifact gate/check:static/diff-check PASS; Legal RU/Security Auditor/QA Tester PASS в изменённом объёме. Evidence `D:\Максим\Memory\Projects\BANGER.SU\Work\2026-11-12\qr-indicator`; итоговые motion-results.json и local/qa-results.json. Секреты, backend, формы, цены, картинки и URLs не менялись.
- Следующий шаг: commit → rebuild точного SHA → проверенный overlay на SpaceWeb → live motion/keyboard/reduced QA. Baseline5b799b5, rollback qr-right/BANGER_HERO_5b799b5.zip + прежняя полная статикаad8473a в Memory; серверные хеши до замены сохранены.

### Индикатор — production PASS

- Код3c7e53f6f8b7fdb6cdc5eac2d0cf16282c6d3dac опубликован на SpaceWeb. Release.json подтверждает точный SHA, online-leads:true, weather:disabled; главная/Исток4/контакты200 с формами,GETleads.php405.
- В проверенном overlay270/825 статических файлов,3 492 886байт, SHA256 `5202C3B7D036C7653E5E5BE66A8B58344BB9A8659E992480CCD0BD829F0DC97D`; файл `qr-indicator/BANGER_HERO_3c7e53f.zip` в Memory. Assets доHTML, manifestпоследним. Серверный временныйZIP удалён.
- Контрольные хеши .htaccess/leads.php/health.php до/после совпадают; сервер/БД/Cron/секреты/DNS не менялись. Новые заявки не отправлялись.
- Оконный CDP9222 перестал отрисовывать вкладку: visibility hidden, а после focus emulation visible, но opacity панели0/не загружены lazyQR/кадр белый. Поэтому не считать незавершённый motion-live доказательством. Для публичного сайта запущен установленный Chrome157 headless в отдельном временном профиле без копирования авторизации и без отключения sandbox/TLS. В нём финальная проверка8/8 PASS:1440/390, DAY/NIGHT, normal/reduced, Enter/Space/Escape, hover8→14→20/reset8, границы/128pxQR/nooverflow. Все вкладки visible, normal RAF показывает плавность, reduced RAF x0/opacity1 и cards animation none.
- Доказательства финального live: `D:\Максим\Memory\Projects\BANGER.SU\Work\2026-11-12\qr-indicator\motion-live-headless\motion-results.json` и скриншоты в том же каталоге. Превью без клавиатурного outline: `qr-indicator\desktop-open.png` / `mobile-open.png`. Local normal stagger дополнительно доказан попарной разницей opacity в actual RAF (`stagger-proof.json`).
- Временный headlessChrome закрыт, порт9223 освобождён. Оригинальное окно9222 и авторизация сохранены. Рекурсивное удаление своего Temp-профиля отклонено автоматической политикой («blocked by policy»); профиль оставлен, повторно не обходить блокировку. Метаданные без секретов: headless-process.json.
- Задача полностью завершена: опубликованный SHA проверен; Desktop/mobile DAY/NIGHT, keyboard/reduced и направление ВПРАВО подтверждены. Больше не отправлять контрольные заявки ради этого косметического изменения. Следующий шаг — новое поручение владельца.

## 13.11.2026 — точечные исправления по готовому аудиту, кандидат PASS

- ТЗ: attachment77ac27ad (точечные исправления); новый аудит запрещён. Новые картинки допов/материалы фасада — отдельная подготовка, в этот релиз не входят. Формы/валидация/consent/backend/MySQL/MAX/цены/опции/QR/анимированная полоска защищены от изменений.
- Выполнено: единый warrantyContent с явно утверждёнными12месяцами, заголовком/абзацем; teaserглавной; nativeDetails на /garantiya. Нейтральные тексты установки на home/about, повтор истории убран, выставочный служебный текст заменён.
- Общий model-seo генератор на25бань/6домов:31уникальное описание в meta/OG/Twitter,93actualHTMLтега, без двойных точек/повторений. Названия/размеры/характеристики/фото/цены не изменены; для домов не перенесены ошибочные скопированные банные особенности.
- Sitemap71→74: исключён /politika, включены /privacy /garantiya /cookie /oplata-i-cheki; canonicalprivacy уже былправильным. Только narrow301блок дляpolitika[.html][/] наbanger/www подготовлен в docs/deployment/politika-privacy-redirect.htaccess; candidateв Audit-fixes/.htaccess.candidate, удаление вставки побайтно восстанавливает серверный c0f488b6… исходник. Пока не применён.
- BaselineBrowser: sellerparagraph1наusloviya-zakaza; no-adparagraph1+informationlink1наsoglasie-reklama. Указанные повторы уже отсутствуют, юридические страницы не редактировались. Галерея /komplektaciya уже4×260.3125×146.421875,16:9; компонент/порядок/картинки оставлены без изменений согласно условиюТЗ.
- Проверки: build/typecheck/online-leads gate PASS; check:static142pages/435URLs/488resourcefiles PASS; priceguardPASS; modelchecker --artifact31pages/93tags PASS; scopedcheck-targetsPASS. Browser16cases1440/390 DAY/NIGHT, warrantyDetails Enter, nooverflow PASS;20screenshots в Work/2026-11-13/Audit-fixes/local. LegalRU/SecurityAuditor/QATester/independent_reviewer PASS в изменённом объёме; liveApacheещёнепроверен.
- Перед обновлением сохранена восстановимая публичная версия3c7e53f из проверенных релизных архивов + актуальные .htaccess/leads.php/health.php/release.json. Backup: D:\Максим\Memory\Projects\BANGER.SU\Backups\SpaceWeb\2026-11-13-audit-fixes\BANGER_PUBLIC_3c7e53f_BEFORE_AUDIT.zip;287710287байт,834entries, полный поток восстановления и SHAкаждой записи PASS. Private/DB/секреты не копировались и не изменялись.
- Chrome9222 подключён владельцем вручную после автоматического отказа запуска («blocked by policy»), владелец самостоятельно вошёл SpaceWeb. Файловый менеджер открыт через «Открыть в отдельном окне»; в свежем FM сначала открыть bangersu, затем public_html (глубокий hash пока не вcache). Секреты не читались.
- Следующий шаг: commit/rebuildточногоSHA → повтор artifact gates → staticoverlay + узкая вставка .htaccess с guardedbaseline → live301/privacy200,74sitemap,93SEOtags и scopedbrowser → Memory/отчёт. Main/DNS не менять; реальные заявки не отправлять.

### 13.11.2026 — production опубликован, точечная задача завершена

- Код 476c604a96a69f6e344ea298bc0553788df08dd1 опубликован на https://banger.su/ через существующий файловый менеджер SpaceWeb. Live release.json подтверждает точный SHA, online-leads:true, weather:disabled.
- Проверенный overlay BANGER_AUDIT_476c604.zip: 270/825 файлов, 3489302 байта, SHA256 ADFDE32A42F2A5FE0F36E1AEE7F2BFB338A0CF3E8156F28E653666471E81D947. Временный ZIP удалён с хостинга после проверки.
- Узкий редирект /politika[.html][/] → https://banger.su/privacy применён, все 3 варианта HTTP301; /privacy200. Точный .htaccess a6da52bc77f5aaae2b0d207594a15ed7f5692969f5c925e5abd65d0343f44e62; удаление вставки возвращает исходный c0f488b6… . PHP-файлы совпадают с backup побайтно.
- Первая проверка OPTIONS без Origin вернула ожидаемый защитный403; автоматический guarded rollback восстановил исходный файл. Диагностический запрос исправлен: Origin https://banger.su и Access-Control-Request-Method POST. После повторного применения GET405 / OPTIONS204; никакие защиты формы не ослаблены и ни одна заявка не отправлена.
- Live PASS: 31 модель, 93 SEO description-тега совпадают с артефактом, 74 URL sitemap, canonical4 страниц. Формы на главной/контактах/Исток4 присутствуют. Browser16 случаев 1440/390 DAY/NIGHT, disclosureEnter/nooverflow PASS;20 реальных скриншотов, выбранные просмотрены. Evidence: Work/2026-11-13/Audit-fixes/live и live-content-results.json, redirect-live.json, server-files-after.json.
- Backup: Backups/SpaceWeb/2026-11-13-audit-fixes/BANGER_PUBLIC_3c7e53f_BEFORE_AUDIT.zip (287710287 байт/834 entries, восстановление каждого файла проверено); секреты/БД не затронуты.
- Новых общих проверок, тестовых лидов, GitHub push/main/DNS изменений нет. Отдельная подготовка изображений допов/фасадов остаётся в Options-visuals, не входит в релиз. Следующий шаг: новое поручение владельца; эту задачу не повторять.

## 2026-11-25 — Яндекс Метрика: релиз подготовлен, выкладка в работе

- Владелец подтвердил, что аналитика включена в уведомление РКН, выбор с версией/временем в localStorage принят как доказательство согласия, а обработка счётчиком 111684946 идёт только в РФ; за пределами РФ обработки нет. Это аттестации владельца, не независимая проверка Яндекса.
- В кабинете проверены счётчик 111684946 для `banger.su`, ограничения доменом, цели и выключенная запись нажатий клавиш; карта скроллинга и отчёты аналитики форм на SPA не используются. Вебвизор и карты кликов/ссылок требуют отдельного согласия посетителя.
- Исправлена обработка отказа: sessionStorage-only больше не считается долговременным отказом; UI не скрывает предупреждение; BroadcastChannel и повторная проверка останавливают уже открытые вкладки; после отказа устаревшее разрешение не может автоматически возобновить счётчик без нового сохранённого opt-in.
- Legal RU, Security Auditor и QA Tester дали PASS по проверенным изменениям/сценариям; остаточное ограничение: если браузер блокирует все каналы хранения, отказ действует в текущей вкладке и пользователь получает предупреждение очистить старое разрешение перед перезагрузкой.
- `npm test`, `npx tsc --noEmit`, `npm run check:static` (163 HTML, 436 локальных URL, 31 модель), consent regression и `git diff --check` PASS. Production build надо повторить после коммита последней правки latch; окончательная production-публикация и live-проверка ещё не выполнены.
- Текущий live `release.json`: `a6e0ce40618e3620fd5b15567d4bd278aeb25010`, `onlineLeads:true`, `analytics:false`. Точный rollback-архив сохранён в Memory: `Work/2026-11-24/Emergency-recovery/release-a6e0ce40618e/BANGER_STATIC_RECOVERY_a6e0ce4.zip`, SHA256 `225d154f0c07a398e56630603e88ff9d2879edacda71939fa9a247f03b3b233d`, 426 entries; manifest/live SHA совпадают, PHP/.htaccess/private/bin не входят.
- Следующий шаг: коммит текущего проверенного source diff без `tmp/`, `output/pdf/`, `tsconfig.tsbuildinfo`; production и GitHub Pages builds для точного SHA; ZIP integrity check; upload ZIP в SpaceWeb file manager; проверка live SHA, главной, privacy consent и формы. Не менять PHP, база, DNS, `main`.

### 25.11.2026 — UI-доработки каталога, cookie и idle-контакта (кандидат; review/deploy ещё не завершены)
- Для карточек добавлен компонент фото-карусели с размерным бейджем и счётчиком, если у модели есть несколько подтверждённых фото; карточка модели получила переходы к соседним моделям, заметку про изменение исполнения и отдельные ссылки «Получить расчёт», MAX и Telegram. Фиктивные просмотры и искусственная зачёркнутая цена не добавлялись. У 13 из 14 опубликованных банных моделей в данных одно фото; у «Барн Премиум» — два. Для остальных нельзя добавить смену кадра без новых достоверных фотографий.
- Cookie-уведомление стало узкой нижней плашкой с политикой, настройками и единственной кнопкой согласия. Отказ остался в настройках; opt-in Webvisor по-прежнему отдельный.
- Добавлено глобальное окно связи после 60 секунд бездействия: MAX QR, MAX/VK/Telegram/Instagram и оба номера; без формы и передачи данных. Карусель фото объекта получила исправление захвата указателя на кнопке.
- Локально прошли `npm test` (включая backend), `npx tsc --noEmit`, `npm run check:static` (163 страниц, 416 URL, 31 модель; production path audit 543 файла). Chrome показал страницу модели в 390×844 DAY/NIGHT, каталожные карточки, узкую плашку, закрытие окна галереи и idle-попап после паузы. Это ещё не live-проверка.
- Security Auditor: PASS; Legal RU и QA Tester ещё в работе. Текущая ветка `fix/emergency-static-assets-20261124`, HEAD перед финальным коммитом `6e3ec93`. Дальше: получить два обязательных ревью, исправить конкретные findings, сохранить отдельный коммит, пересобрать с production-профилем (onlineLeads + counter 111684946), затем только статический overlay и live-check SpaceWeb. Не изменять PHP/.htaccess/секреты/DB/DNS/main.

- Финальный gate: Legal RU PASS после замены обещания «30 минут» на опубликованные часы работы; Security Auditor PASS после исправления чтения сохранённого отказа. Повторный браузерный QA ждёт свежую production-сборку. Отказ сохраняется как `analytics:false`, баннер должен скрыться, Метрика остаётся выключенной; при конфликте со старым opt-in denial marker продолжает запрещать загрузку счётчика.

### 26.11.2026 — обновление 28 статей «Полезное»
- Удалён повторный блок публикаций: осталось 28 уникальных статей/URL; материал по URL `pochemu-karkasnaya-banya` заменён на процесс производства BANGER, существующие URL сохранены.
- Сохранены утверждённые рендеры; подготовлена отдельная условная 3D-визуализация производства, не заявленная как реальный заказ или инженерный чертёж. В статьях оставлены только подтверждённые характеристики; убраны упоминания ROCKWOOL.
- QA Tester, Security Auditor, Legal RU — PASS по объёму проверок; Legal закрыл медутверждение первичной ссылкой с ограничением вывода ассоциацией. Профильная рекомендация: отдельно проверить общие формулировки о печах/дымоходах, электрике и основаниях перед переработкой этих инструкций.
- Проверки после изменений: `npm test`, `npx tsc --noEmit`, `npm run check:static` (163 страниц, 389 локальных URL, 544 файла в path audit), `npm run check:articles`, SpaceWeb-profile build и GitHub Pages-profile build PASS. GH artifact имеет `onlineLeads:false`, `analytics:false`; production build сохраняет текущие live flags `onlineLeads:true`, `analytics:true` и счётчик 111684946.
- Локальный Chrome QA: desktop/390px mobile, DAY/NIGHT, без горизонтального overflow; статья отображает 10 этапов, созданный рендер грузится. Производственный билд собран, но его `release.json` сейчас содержит базовый HEAD `2a23ae0`; после коммита нужно пересобрать.
- Следующий шаг: создать отдельный commit, fast-forward push в `work/github-pages-test-20261030` (не main), дождаться GitHub Actions и проверить тестовый Pages; затем повторно собрать release с новым SHA, подготовить статический overlay и опубликовать через авторизованный SpaceWeb File Manager.

- CI follow-up: GitHub Pages run #69 identified a stale verifier that compared the current 28-article package to the superseded November 16 article body and assumed those seven records remained the final array entries. Updated the verifier to preserve/require the legacy seven routes while treating the 2026-11-26 package gate as authoritative. Local verifier PASS; production content/build is unchanged.
- CI follow-up: run #70 then failed at the historic price-update verifier, whose frozen baseline (`0e18849`) predates current production (`2a23ae0`) and whose rules reject approved live catalog differences, including content-only article edits in the shared data module. Replaced only the Pages workflow gate with `verify-production-catalog-unchanged.mjs`: it requires the current production SHA to be an ancestor and compares every sauna/home record and all option data to that exact release. Local gate and editorial-import verifier PASS. The failing historical audit script remains available unchanged for its original snapshot use.
- CI run #71 (`45777044072`) passed the replacement catalog guard, npm test, TypeScript, article import, Pages build and base-specification check, then exposed that `verify-article-covers.py` still expected superseded `/images/articles/<slug>-cover.webp` paths and the old source manifest. Updated it to validate the current package's 28 image paths, exact output hashes, listing alt text, and OG/Twitter metadata against the current asset manifest. A local Node parity check passed all 28 covers and metadata; rerun the Python gate in CI after push.
- CI run #72 (`45777615002`) reached the same cover gate but exposed a base-path-only mismatch: GitHub Pages listing images correctly use `/NEW-SITE-BANI/images/...`, while production uses `/images/...`. The cover verifier now applies the Pages base path only to rendered listing images and continues checking absolute production OG/Twitter URLs. Local Pages build/export PASS (163 HTML, 124 asset references, 0 missing); Node parity validation passed all 28 listing paths/alts, image hashes, and social metadata. CI must rerun the Python gate after this fix.
- Current continuation: commit/push the narrow CI fix to `work/github-pages-test-20261030`; wait for the Pages workflow and inspect the deployed test site. Then rebuild production for the final source SHA (retain online leads, Metрика 111684946, consent-gated analytics), prepare a static-only overlay and rollback package in Memory, publish through the existing authorized SpaceWeb Chrome session, and verify live release SHA plus article pages. Do not touch main, backend, DNS, PHP or secrets.

## 27.11.2026 — Articles and catalog implementation (owner-authorized, no production)

- Base: deb3b2fd54f0f4a99c386eec52e4809840f440af; isolated branch codex/2026-11-27-articles-catalog-implementation in Memory. Recovery ref backup/2026-11-27-catalog-base. Prior worktree and its changes remain untouched.
- Live release.json probe timed out; latest recorded production SHA in Memory is deb3b2f. No deploy, DB change, DNS, or GitHub publication.
- Preparation audit: prepared 28-article JSON, 60 color images for 10 model sets; missing BG-09—BG-12 (24). All candidate color render geometry is still marked for visual verification. No production assets have been replaced.
- In progress: import clean article text/meta while retaining URLs and illustrations; implement server-persisted counter, color picker only for supplied assets, and exterior-finish pricing/images/placeholder states. Preserve current form contract and consent; do not send test leads.
- Next checkpoint: inspect the article verifier, option compatibility flow, current PHP bootstrap/validation, and local test tooling before edits. Never access or write the user Desktop.

## 27.11.2026 — реализация статей и каталога (тестовая ветка, не опубликовано)
- На изолированной ветке codex/2026-11-27-articles-catalog-implementation внедрены 28 статей (641 блок) с сохранением URL, SEO и существующих иллюстраций; Chromium и WebKit прошли 28/28 страниц.
- Добавлены отделки: имитация бруса 0 ₽, блок-хаус +35 000 ₽, профлист +60 000 ₽. Проверен расчёт, сводка заявки и PDF; Барн Премиум и дома исключены.
- 60 предоставленных цветовых рендеров оптимизированы в WebP без resize и доступны только в dev preview с маркировкой сверки. BG-09—BG-12: отсутствуют 24 варианта. WebKit выявил обрезание zoom-окна, исправлено portal-компонентом, повторная проверка PASS.
- Подготовлены, но выключены, MySQL/PHP миграция и endpoint счётчика просмотров. PHP CLI и MySQL runtime отсутствовали; серверная интеграция не запускалась.
- PASS: npm test, npx tsc --noEmit, npm run build, npm run check:static, PDF (12 сценариев + 31 модель), Chromium/WebKit (28 статей и мобильный калькулятор), git diff --check. Production/GitHub/SpaceWeb/DNS не тронуты; коммита и push нет.
- До публикации: подтвердить производство статьи, сверить 60 цветов, получить 24 отсутствующих рендера, три точных изображения отделки, пройти Legal RU/Security Auditor/QA, выполнить PHP/MySQL integration и утвердить включение счётчика.
- Отчёт: Work/2026-11-27/Implementation-articles-catalog/IMPLEMENTATION_REPORT.md. Скриншоты/PDF рядом в qa-screenshots/. Cleanup временных QA-файлов отклонён automatic review («blocked by policy»); они остались в Memory/worktree, Desktop не использовался.
- Точка продолжения: ждать проверки владельца и решений по blocker-списку. После этого повторять только затронутые проверки; production не публиковать без отдельного разрешения.

## 27.11.2026 — финальная проверка после уточнений владельца

- Исправлена статья по slug pochemu-karkasnaya-banya: фактическая последовательность заказа изложена в шести утверждённых шагах; URL и обложка сохранены.
- 60 существующих цветовых рендеров помечены как одобренные владельцем; исходные изображения не менялись. Цветовой выбор доступен на 10 карточках с готовыми изображениями; 24 рендера BG-09—BG-12 остаются ожидаемым материалом владельца.
- Отделки: имитация бруса 0 ₽, блок-хаус +35 000 ₽, профлист +60 000 ₽; RAL +25 000 ₽ допускается с имитацией/блок-хаусом и взаимоисключается с профлистом. Проверены клиентский расчёт, серверная валидация и PDF-сценарии.
- Счётчик переделан в агрегатную таблицу только model_id + views; каждое открытие увеличивает значение атомарным UPDATE. Нет cookie/localStorage/UUID/HMAC/IP/UA/referer/истории в приложении. Endpoint остаётся выключенным флагами, в том числе до проверки HTTPS proxy.
- PASS: npm test, npx tsc --noEmit, npm run check:static (163 HTML, 391 URL, 550 файлов production path audit), статья (28/28), PDF (14 сценариев + 31 модель), production build (163 HTML, 125 ссылок на ресурсы, 0 отсутствующих), isolated Chromium (1440/390 DAY/NIGHT, 60/60 swatches, 0 JS exceptions, mobile overflow 0).
- PHP lint/integration, MySQL atomicity и WebKit не проверены: локально отсутствует PHP runtime и изолированная тестовая БД; WebKit недоступен. Production counter и deployment не включались.
- SpaceWeb документирует access logs с IP/временем/путём/User-Agent (формат может включать Referer); срок — до 30 дней. Настройка логов данного аккаунта не подтверждена. Само приложение не хранит эти поля, но хостинг может их журналировать; см. backend/spaceweb/README.md и https://help.sweb.ru/kak-posmotret6-logi_42.html.
- Ожидаются: ZIP с 24 цветами BG-09—BG-12, проверенные изображения трёх наружных отделок, подтверждение фактического режима access logs, тестовая среда PHP/MySQL и проверка поведения HTTPS reverse proxy.
- Chromium screenshots/result: Work/2026-11-27/Implementation-articles-catalog/qa-final-audit/screenshots и chromium-smoke-results.json. Код не коммичен и не опубликован; SpaceWeb, GitHub, DNS, MAX и production не менялись. Текущая точка продолжения — получить недостающие материалы и предоставить эту сводку владельцу.

### Браузерная проверка RAL — 27.11.2026

В изолированном Chromium проверена модель «Скандинавия 6 В» в собранном сайте: RAL +25 000 ₽; блок-хаус +35 000 ₽ вместе с RAL даёт +60 000 ₽; профлист заменяет блок-хаус и снимает RAL, сохраняя только +60 000 ₽; выбор RAL при профлисте возвращает базовую имитацию бруса и +25 000 ₽. Выбранные опции отражены в сводке модели. Изменений рабочего сайта нет.

Независимый read-only reviewer проверил изменённые каталожные, PDF, статейные и counter-файлы; подтверждённых дефектов не выявил. Его ограничение совпадает с нашим: PHP/MySQL runtime и SpaceWeb staging не проверены.

## Источники цветовых рендеров — 27.11.2026

- Исправленный набор из C:\Users\maxto\Downloads\BANGER_CATALOG_COLOR_RENDERS скопирован в docs/source-assets/catalog-color-renders/BANGER_CATALOG_COLOR_RENDERS внутри активной локальной рабочей копии проекта.
- Копия включает 10 папок моделей, 60 PNG и README (около 420,6 МБ). SHA-256 каждого файла сверены с источником. Исходная папка и ZIP не изменялись.
- Оригиналы находятся вне public/, не входят в статическую сборку и исключены из локального Git status через .git/info/exclude, чтобы не добавить случайно 420 МБ исходников в релиз. Для сайта используются уже подготовленные оптимизированные WebP в public/images/catalog/color-variants/ (84 файла для 14 моделей).
- BG-09—BG-12 в этой копии отсутствуют; набор для сайта ранее поступал отдельным архивом.
- Commit, push и публикация не выполнялись. Следующий шаг по запросу владельца: использовать копию как исходники при подготовке новых цветовых рендеров/обновлении моделей, затем оптимизировать нужные изображения в WebP.
### Updated color-render source set — 27.11.2026

- The owner added BG-09—BG-12 to Downloads. Repaired their extraction names by decoding CP866 and normalizing Unicode NFC; each of four folders contains six PNGs. All 24 source SHA-256 values match the already-approved sourceSha256 entries in catalog-color-variants.ts.
- Merged the four model folders into docs/source-assets/catalog-color-renders/BANGER_CATALOG_COLOR_RENDERS. The local source copy now has 14 model folders/84 PNGs (plus the retained original README and a source-set index); all copied image SHA-256 values match their Downloads source.
- The __MACOSX AppleDouble metadata files in Downloads are not image renders and were left untouched there, but excluded from the project copy. The already connected public WebP variants remain the website assets; no duplicate PNGs were added to public.
- No application code, commit, push, GitHub, SpaceWeb or production update was made. Next: verify all 84 source hashes against the local render registry and confirm only the four previously integrated BG-09—BG-12 assets were added to the source archive.
### Source render set — final verification 27.11.2026

- Final durable folder: docs/source-assets/catalog-color-renders/BANGER_CATALOG_COLOR_RENDERS. It contains 14 correctly named model folders and 84 source PNGs, six variants per model. The four added folders BG-09—BG-12 were repaired from CP866 extraction and Unicode-normalized.
- Integrity: all 84 source SHA-256 hashes match the corresponding src/data/catalog-color-variants.ts entries; all 84 optimized public WebP hashes match the registry. Every PNG decodes. There are no missing models in the 14-model published set. Contact sheets were reviewed for all 14 model groups.
- Resolution: 82 images at 2752×1536; BG-28 variants 04 and 06 are 1376×768. The __MACOSX AppleDouble metadata was excluded from the project copy.
- Report/evidence: D:\Максим\Memory\Projects\BANGER.SU\Work\2026-11-27\Implementation-articles-catalog\qa-final-audit\extracted-color-renders-2026-11-27\quality-report.md and source-set-integrity.json. Source-set index is in the durable folder.
- The specified Downloads folder path was absent at final verification; this agent did not remove it. The complete verified D: copy remains intact and the original 60-image ZIP remains in Downloads. The current app already uses the matching 84 WebP variants, so no code changes were required. No commit, push or production publication was made.
- Resume point: use source originals from the durable D: folder for any future image conversion. Before production publication, satisfy the current release gates and get the separately required publication authorization.