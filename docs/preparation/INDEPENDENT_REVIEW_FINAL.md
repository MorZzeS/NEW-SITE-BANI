# Независимое ревью затронутых исправлений — 09.10.2026

Тот же зарегистрированный independent_reviewer. Только Get-Content восьми назначенных файлов; полного повторного аудита не было. Node/PHP, тесты, хеширование, БД и серверы не запускались; ребёнок файлов и настроек не изменял.

Результат: три прежних замечания закрыты по прочитанным исходникам и добавленным тестовым сценариям. Новый дефект, препятствующий сохранению выключенного локального кандидата, в назначенных файлах не подтверждён. Это статическое заключение, не runtime PASS и не готовность к развёртыванию.

## Закрытие прежних замечаний

1. **Root-only CA copy — исправлено.**
   backend/spaceweb/private/ca.php:4 разбирает сертификаты, проверяет X509 и вычисляет DER pins; :24–25 отвергает bundle без сертификата с pin, отличным от официального корня. Копия корня под другим путём и повторение корня больше не обходят проверку.
   backend/spaceweb/tests/operations.php:17–18 содержит отрицательные случаи копии, повторённого корня и некорректного содержимого; :21–23 — объединение с отдельным синтетическим сертификатом и отказ при trailing garbage. Тесты не запускались.
   Подлинность и полнота maintained system bundle этим не доказаны; README теперь прямо ограничивает гарантию.

2. **Первый write и структура backup — исправлено.**
   backend/spaceweb/bin/backup.php:15 записывает metadata через writeBackupRecord().
   backend/spaceweb/private/backup-format.php:21–23 требует точного количества записанных байтов; false/short write вызывают исключение. :27–28 требует metadata первой записью с ожидаемыми format/environment; :32–33 требует единственный последний completion footer, совпадающие counts и EOF; :35–47 проверяет таблицы, столбцы, значения и бинарные поля. Отсутствующий footer отклоняется.
   backend/spaceweb/bin/backup.php:27–28 вызывает validator до rename.
   backend/spaceweb/tests/backup-format.php:10–19 содержит missing metadata/footer, wrong format/environment/counts, unknown table/columns, empty row, duplicate footer/trailing record, injected short first write. Тесты не запускались.

3. **CRLF provenance — документация исправлена.**
   backend/spaceweb/README.md:15 объясняет raw PEM hash mismatch через CRLF → LF и совпадение нормализованного PEM и DER. Соответствует предыдущему независимому проходу; сейчас хеширование не выполнялось.

## Дополнительные затронутые проверки

**TEST/PRODUCTION cleanup isolation.**
backup-format.php:51–57 формирует environment filename и сопоставляет только точный environment. bin/backup.php:11–12 использует имя; bin/retention.php:18 применяет общий matcher с проверками regular file/no symlink. Legacy filename без environment автоматически не удаляется.
tests/backup-format.php:20 проверяет TEST, отказ для PRODUCTION и legacy filename. Это статическая защита matcher, не доказательство filesystem permissions или реальной очистки.

**Gate отсутствующего архива.**
Фактический флаг — document_archive_contract_verified, не document_archive_approved.
private/readiness.php:4 требует строго true; false/отсутствующий ключ отклоняются.
tests/operations.php:4–6 добавляет флаг в положительный fixture и проверяет false.
README раздел Immutable approved-document archive — ACTIVATION BLOCKER описывает отсутствие архива и hash contract, необходимые frontend/API/schema изменения, immutable manifest, отрицательные тесты и restore. Флаг подтверждает завершённую реализацию, а не заменяет архив.
Конфигурационные примеры/остальные callers вне узкого прохода; false defaults и использование gate всеми callers повторно не проверены. Отсутствующий ключ fail-closed подтверждён исходником.

## Риски и непроверенное

- Два прежних Medium-дефекта отсутствуют в прочитанной версии; устаревшая provenance-фраза заменена.
- Архив точных утверждённых документов и проверяемый hash contract остаются блокером активации. Булевый gate не реализует архив.
- Подлинность системного CA bundle, provider/SQL/MAX TLS, legal approval, локализация, фактические backup/restore и retention не подтверждены.
- 655 файлов final artifact / Apache 779 coordinator checks / ожидающие QA runtime cases — переданный контекст, не результаты ревьюера.
- Полный diff, final artifact, конфигурационные примеры и concurrent edits после чтения не проверены.
- Нет runtime/full PASS; прежний отказ auto-review запуска Node не обходился.

Рекомендация: сохранить исправленный выключенный локальный кандидат после отдельного QA затронутых сценариев. Развёртывание и сбор реальных данных остаются неподтверждёнными и заблокированными незавершённой стадией активации.
