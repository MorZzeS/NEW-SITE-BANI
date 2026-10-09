# BANGER — итог подготовки, 09.10.2026

**Локальная техническая подготовка: PASS в указанном объёме. Развёртывание/активация: BLOCKED.**
Ветка prep/banger-unified-20261008, база cfc2ad5d114f79c6bfd45de1b6fd294966b0a23a. Push, загрузки, DNS, production и Render не изменялись. Read-only ls-remote 09.10 подтвердил remote main cfc2ad5d114f79c6bfd45de1b6fd294966b0a23a. Прежние локальные файлы исходного main сохранены.

## Реальные изменения
- Компактнее панель «Мы на связи»: ширина272px desktop, меньше gaps/padding, labels14px, blur4/3px, прозрачность. QR96/80/72px сохранены.
- Header: центральный кликабельный основной телефон768–1279px;390 скрыт;1280+ прежняя навигация/два телефона. Мобильное меню сохраняет оба номера.
- Video CTA «Смотреть видео изнутри», Play/hover/focus. Прежний вариант сохранён через USE_INTERIOR_VIDEO_CTA=false. Изображения/video mechanics/trust/theme architecture/catalog/article data не изменены.
- Общая форма: отдельная ссылка согласия и политика, false checkbox; HTTP запрещён до fetch. Новый evidence contract2 opt-in с двумя утверждёнными версиями; по умолчанию contract1, Render backend не переключён. URL query/fragment исключаются в новом контракте.
- PHP/MySQL: default-disabled API, validation/evidence/dedup/transaction/rate/outbox, минимальные error codes; публичный официальный CA добавляется к системному bundle с TLS verification; gated encrypted backup/retention. Документальный архив остаётся отдельным activation blocker, document_archive_contract_verified=false.
- Юридические проекты отдельно docs/legal-drafts, статус «Ожидает утверждения». Production legal pages не переписаны.
- Неактивный workflow template вне .github/workflows; branch/host/docroot/noindex/EMPTY endpoint, Apache routes/CSP, manifest ownership/rollback, SSH pinning. SFTP generator только формирует подписанный review-план, не выполняет команды; rename/files/root index ordering, literal [slug] escaping. Ни один workflow не активирован.
- Node health test теперь слушает только127.0.0.1; это изменение теста, не production server.

## Проверки и доказательства
| Проверка | Результат | Границы |
|---|---|---|
| npm run build | PASS | Полный static export; frontend source после build не менялся |
| npm run check:static | PASS |136HTML,355URLs,31models,28plans; root path audit388files |
| Статьи | PASS маршруты |21article slash aliases, данные/media сохранены; не повторный редакционный аудит |
| Configurator | PASS |19options, prices/dedup/reset/count/total/full form payload; browser3/42900 |
| Consent | PASS |Legacy/v2 gates, HTTP rejection before network, minimizedURL, synthetic receipt |
| Existing Node backend | PASS |5/5, fake MAX, loopback only |
| PHP | PASS |Lint17; offline55:validation12,notifier7,gates/CA19,backup17 |
| MySQL8.4.11 | PASS локальный |Official ZIP checksum и Oracle Authenticode valid; schema,4fake outbox states,9SQL/snapshot checks; не liveAPI/MAX/SpaceWeb |
| Staging safety | PASS |42negative/ownership checks |
| Packaging | PASS |928checks;655files;136HTML;2660script tags+38forms preserved |
| SFTP generator | PASS offline |29cases; no network/execute/delete; host capabilities unverified |
| Apache2.4.69 | PASS |779local HTTPchecks,0failures,UTF8/MIME/ranges/root/slash/404/assets |
| ZIP | PASS |Rootindex655files+1emptydirectory; SHA256 каждого файла сверены с manifest; QA archive hash/inventory checked |
| UI | PASS указанная выборка |Coordinator CUA widths390/768/1024/1280/1440+breakpoint neighbors boththemes; nooverflow,phones/menu/QR/video/lightbox/configurator; no observedconsoleerrors |
| Независимая UI QA | BLOCKED |Role browser runtime unavailable; coordinator observations отдельно, без подмены independentPASS |
| Real SpaceWeb/MAX/TLS/API | NOT RUN/BLOCKED |No approval/HTTPS/provider proof/reallead |

См. BROWSER_EVIDENCE.md, INDEPENDENT_REVIEW_FINAL.md, apache-http-results.json, sql-regression-results.json, output/qa-report.md и output/qa-evidence/*.json. SQL fixture sql-regression.php работает только с явным isolated opt-in и точным loopback DSN; вне подготовленной новой синтетической БД не запускать. SQL driver/deployment/конкурентные races/uncertain commits и операционный backup restore не покрыты. Windows MySQL не смог работать с исходным Unicode path; тест проведён в собственной ASCII temporary папке. Первоначальный fixture SQL whitespace error исправлен до финального PASS. Сервер остановлен, temporary root/учётные данные удалены; ни service, ни global tools/config не установлены.

## Работа специалистов
Настоящие зарегистрированные Frontend, Backend, DevOps, Legal RU, Security Auditor, QA Tester, Independent Reviewer; не более3 одновременно, один владелец файла. Windows elevated не менялся. Штатные индивидуальные auto_review approvals; readonly reviewer не запускал тесты после отказа review. Usage interruption не объявлялся PASS.
Исправлены/повторно проверены: JS stripping, Apache directory/html priority, audit inline/executable scripts, outbox readiness, CA root-only copy, backup firstwrite/metadata/footer/EOF, cross-environment cleanup, CRLF provenance, SFTP [slug] literal paths. Reviewer закрыл прежние конкретные PHP findings; QA подтвердил affected offline tests. Новые инфраструктурные факты не выдуманы.

## ZIP и применение
C:\Users\maxto\Desktop\SpaceWeb-BANGER\unified-preview-20261009\BANGER-SPACEWEB-TEST.zip
249454119bytes (~238MiB), SHA256 cc276ccdf505fbf0147430b4a8b6a458e60be4d1c71d33febae96124b1b54d94.
Прежний ZIP сохранён. README.txt и manifest рядом. Backend/source/env/internal docs в ZIP отсутствуют. Существующие статические юридические страницы сохранены и не являются юридическим утверждением оператора для новой инфраструктуры.
До разрешения НЕ загружать. После разрешения подтвердить bindingtesthost/docroot, backup существующего root, распаковать непосредственно public_html с .htaccess, не удалять чужие/server files. HTTP формы отключены. Автоматизация не включена.

## Что нужно подтвердить вне кода
1. Оператор: реквизиты, адрес/email/режим/контакт обращений; рекламные планы; цели/основания/retention; документы и immutable archive утверждённых текстов/версий/hash.
2. Полные актуальные официальные редакции законов, РКН notification/трансграничная схема и договоры обработчиков. Legal drafts не доказывают соответствие152ФЗ.
3. РФ размещение server/DB/logs/backups, доступы и backup/restore/retention drill; не только owner flags.
4. Управляемый staging HTTPS: ответ SpaceWeb или собственный контролируемый домен. Чужой banger.ru не использовать для сертификата.
5. SpaceWeb SFTP/hostkey/rename/AllowOverride/cron/CURL/systemCA, remoteinventory, verifiedbackup, ownership/plan approvals. Whole-site atomicity не подтверждена; per-file fallback non-atomic.
6. Отдельное разрешение push/stagingupload/workflow activation и затем PHP/forms migration. Render не отключать до реального HTTPS acceptance+MAXdelivery и разрешённого переключения.

Полный deployment PASS не заявляется. Подготовленный выключенный кандидат сохранён; остановиться до разрешения публикации.
