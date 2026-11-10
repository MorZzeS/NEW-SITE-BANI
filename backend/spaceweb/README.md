# SpaceWeb leads / MAX: local implementation, activation pending

Target: PHP 8.4, PDO MySQL, mbstring, cURL with CAINFO_BLOB, OpenSSL, JSON; MySQL 5.7.27+ / InnoDB. No production config, token or approved legal text is supplied. Both examples remain disabled, unapproved, dry-run, notification off. Nothing here changes the hosting account or sends a real message.

The account audit on 2026-11-09 found PHP 7.1 selected, PHP 8.4 available, MySQL 5.7.27, no created MySQL database and minute-level Cron. The selected runtime cannot execute this PHP. Extensions, CLI path, InnoDB/privileges, egress/TLS, storage and backups remain external checks. Do not mark these checks passed from successful local lint.

## Placement and preservation

Install only `public_html/leads.php` as a separately reviewed new endpoint. Example actual layout:

```
/home/g/gv3310mail/bangersu/
  public_html/               existing site document root
    leads.php                new endpoint; do not overwrite an existing handler
  private/                   new backend private files + private config.php
  bin/                       new CLI files
```

These sibling names must not collide with existing account files; reconcile paths before upload if they do. `private/`, `bin/`, approved bundle, keys and backup directory must remain outside **every** served root/alias and symlink. The endpoint checks the real private directory against DOCUMENT_ROOT. Verify account permissions (private files 0600, directories 0700 where supported), aliases and direct HTTP non-disclosure independently. Do not upload this whole source package into the static website root. Preserve existing `.htaccess`, PHP handlers, mail settings and all secrets. Do not replace the existing account configuration with these examples.

## Browser/API contract 3

The existing frontend must be built with `NEXT_PUBLIC_LEADS_CONTRACT=3` and the approved HTTPS endpoint (for the example layout `https://banger.su/leads.php`). Contract 1/2 requests are rejected. No endpoint should be enabled while the independently verified legal bundle or operational prerequisites are absent.

The exact request fields match `src/lib/leads.ts` and OnlineLeadForm: requestId, contact/model/page/comment, client timestamps, empty honeypot, consent=true, contractVersion=3, purposeCode=inquiry_response, action=unchecked_checkbox_then_submit; consent/checkbox/policy versions and SHA256 values; source/article/modelKind/promotion/configuration; optional configurationDetails. The full configuration includes model ID/name/type, base price, selected IDs, every option ID/name/unit price or null/quantity/kind, district/address, equipment/logistics/options subtotals, discount/label, total, individual IDs/count, currency and calculatedAt. Values are bounded and arithmetic is checked; these remain **client estimates**, not a server-authoritative catalog or order quote. A manager must confirm price and applicability. The JSON body limit is 65536 bytes; no field or selected option is silently truncated by the server.

HTTPS is checked before body/config reads; forwarding headers are ignored. Only POST application/json with an exact allowlisted Origin and same-origin HTTPS page is admitted. Query/fragment/credentials are forbidden; the shared GitHub origin is additionally scoped to `/NEW-SITE-BANI`. CORS and honeypot are not authentication. Use host body/time/concurrency limits and approved abuse controls. A durable HMAC-IP bucket limits new admissions to five per ten minutes. Do not expose raw addresses/tokens/PII in error or access logs; configure display_errors=Off.

Responses are exact contract-3 envelopes `{ok,contractVersion,requestId,status,admitted,retryable,receipt?}`. A committed lead returns HTTP202 accepted and its durable matching receipt; HTTP200 sent is possible for an already-admitted ID only after all MAX parts have confirmed message IDs. Accepted means saved, awaiting notification; it never claims MAX delivery. The receipt contains the exact keys expected by `matchingReceipt()` in leads.ts, with UUIDv4 receiptId and server UTC receivedAt. A known rejection/rolled-back admission returns admitted=false; unknown commit returns admitted=null, retryable=false. A changed payload with the same ID returns 409 conflict, with no receipt and no retry. A duplicate returns its original receipt/state, even after the IP bucket fills. The frontend's unresolved-attempt lock must remain enabled.

Lead + journal + immutable archive + outbox are committed together. Canonical payload hash includes all business data/options/quantities and document identities; it excludes client createdAt/startedAt/calculatedAt. Native prepares, utf8mb4 DSN and strict SQL modes avoid silent character or field loss. Only a confirmed rollback permits retryable storage rejection. Any uncertain commit/network result remains unknown and is reconciled by original requestId; do not create a new attempt to bypass it.

## Approved exact-byte archive

The owner/legal reviewer must supply the three final exact UTF-8 snapshots. Use the same static bundle in the reviewed frontend and a private JSON file shaped exactly as:

```
{"approved":true,"documents":{"consent":{"version":"UNIQUE_VERSION","text":"EXACT_TEXT","sha256":"LOWERCASE_64_HEX"},"checkbox":{"version":"UNIQUE_VERSION","text":"EXACT_TEXT","sha256":"LOWERCASE_64_HEX"},"policy":{"version":"UNIQUE_VERSION","text":"EXACT_TEXT","sha256":"LOWERCASE_64_HEX"}}}
```

The example is a schema, not approved content. Versions are 1–80 ASCII letters/digits/dot/underscore/hyphen. Each SHA256 covers exact UTF-8 text bytes, including line endings. Independently set private `document_bundle_path` and `document_bundle_sha256` (the hash of the entire exact JSON file). A public flag/environment variable cannot approve the server archive. Readiness independently checks pinned bytes and all three document hashes. Browser hashes/versions must match them. Keep approval records and the file pin separately protected, preserve old bundle files for recovery and never reuse a version after changing text.

At admission, `documents` stores all exact texts/versions/hashes. Its primary key and INSERT-then-compare reject version reuse. Database triggers prohibit UPDATE and DELETE; use separate installation credentials for DDL/TRIGGER and runtime credentials without ALTER/DROP/TRIGGER privileges. Grant only needed SELECT/INSERT on documents, and scoped operational rights on the other tables. Journal keeps all three hashes/versions, bundle pin, request/page, client times, authoritative receipt and assertion. It records a client assertion rather than independently proving the human's identity. Common readiness still requires explicit actual legal/storage/backup/retention approval flags; passing hash checks does not create those facts.

## MySQL 5.7 queue and MAX

`schema.sql` is for a **new empty, explicitly approved database**; it is not an upgrade script. There was no account database at audit time. Validate this DDL on isolated MySQL 5.7 before production. Use `mysql:host=HOST;dbname=DB;charset=utf8mb4` in private config. InnoDB and privileges must be verified. Do not silently modify any pre-existing database if account state changed.

Worker uses short transactions with `FOR UPDATE`, compatible with MySQL 5.7; no SKIP LOCKED. The claim commits before network I/O. Local nonblocking flock prevents overlapping local Cron invocations; DB row locks serialize claims across processes. Each message is persisted in message_parts, with next_part and delivery_ids updated after each confirmed part. MAX allows 4000 characters; conservative UTF-16 chunks reserve stable request/part headers and preserve every character, option, quantity, price and logistical detail. Worker throttles to below two messages/sec and processes at most 20 parts per invocation.

Only a confirmed MAX200 with message.body.mid advances a part. Explicit429 can retry the same part up to three times, with 120-second delay. Transport error/timeout/5xx/unrecognized receipt/crash after send/expired60-second claim moves to unknown and **never automatically resends**. Earlier confirmed parts remain recorded; unknown means manual reconciliation by request and part, including actual recipient history. Permanent upstream rejection becomes dead. This does not promise exactly-once delivery. Never requeue unknown/processing manually until recipient-side reconciliation establishes what was received.

There is no hardcoded recipient. Private config needs max_recipient_type=user_id or chat_id, max_recipient_id as a signed decimal string (user positive), and max_recipient_approved=true only for the confirmed destination. A historical test recipient does not authorize messages to a manager channel. Token stays in private max_token, sent only in Authorization. MAX URL is fixed HTTPS platform-api2.max.ru/messages, no redirects; peer/host verification is required. Maintained actual system public CA bundle + pinned official Ministry root are composed by ca.php; root-only or malformed bundles are rejected. Current root provenance is retained in private/certs. max_tls_public_ca_verified defaults false until a real hosting TLS check. Official API reference: https://dev.max.ru/docs-api/methods/POST/messages (checked 2026-11-09).

Cron must invoke the actual **verified PHP8.4 CLI absolute path**, e.g. `VERIFIED_PHP84 /home/g/gv3310mail/bangersu/bin/outbox.php` every minute. Do not copy this placeholder as a valid path. No SSH/CLI availability was established by the audit. If CLI/Cron cannot execute PHP8.4, this worker is not ready; do not substitute public worker URLs. Test web and CLI extensions separately.

## Backup, retention, restore

Existing AES256-GCM streaming backup now writes strict `spaceweb-backup-v3` metadata and includes documents, full business JSON, journal receipt/hashes and multipart progress. Every record authenticates its random256-bit snapshot ID and contiguous zero-based sequence in AAD; header and footer share that snapshot context. Swapped/repeated/reordered rows from this or another same-key snapshot are rejected. The five-table schema is strictly validated, authenticated and count-checked before final rename. Previous backup-v1/v2 rows are deliberately rejected by this v3 validator; this unreleased schema has no claimed deployed migration. All document versions are shared non-personal archive data and included in each environment backup; lead/rate/journal/outbox data is environment-scoped. Keep prior bundle files, approval records and private config/key recovery separately.

Backup and retention remain independently disabled until owner-approved durations/operations/private path/keys and RU storage/backup facts are supplied. No duration is invented. Retention does not delete unknown/pending/processing/retry leads and evidence. Dead/sent are terminal; unresolved cases need manual process. Documents are never automatically deleted. Longer effective retention from dependencies must be explicitly accepted. Use runtime credentials without archive mutation privileges. A verified ciphertext is not a proven restore.

Restore drill must use an empty isolated TEST DB, reviewed schema, no notifier/Cron/endpoint. Pin the chosen complete ciphertext SHA256 and snapshot ID in the separately protected backup inventory; this selection prevents substituting an entire otherwise valid old backup. Decrypt and validateBackup(stream,key,environment,expectedSnapshot) the whole file before a restore transaction, verify counts, hashes, FK joins, exact snapshots/receipt/progress, and preserve IDs. Every openBackup call requires the expected snapshot and sequence; reset sequence to0 only at the authenticated header. Restore documents first (verify existing text/hash before deduplication), then leads, consent_journal, outbox, rate_buckets. Decode payload_hash/ip_hash base64. Quarantine pending/processing/retry/unknown before any worker is considered; never replay drill messages. Record RPO/RTO and rollback/restore evidence without PII. Key/ciphertext separate custody and private backup filesystem tests remain external.

## Local checks and honest limits

Run PHP8.4 lint on all PHP files and these offline tests (no DB/network/private config):

```
php tests/validation.php
php tests/documents.php
php tests/messages.php
php tests/notifier.php
php tests/operations.php
php tests/backup-format.php
```

Integration opt-in requires a **pre-created empty isolated synthetic database with this schema**. Supply SPACEWEB_TEST_DB_ACK=ISOLATED_SYNTHETIC_DATABASE and SPACEWEB_TEST_DSN/USER/PASSWORD privately (never CLI args/logs). `php tests/integration.php` uses fake notification callbacks only. It checks atomic admission, stable duplicate receipt, full snapshot, conflicting quantity, rollback and uncertain commit, archive immutability/version reuse, delivery states, retry exhaustion, expired claim, multipart progress/unknown/no-resend and durable rate rejection. It removes only its own synthetic leads/rates; three immutable synthetic document versions deliberately remain. Existing non-fixture archives or nonempty business tables are refused. Multi-process races, real MySQL5.7 DDL/SQL, host TLS/HTTP and real backup/restore must still be checked separately; absent live DB execution is **SKIP**, not PASS.

The portable local PHP8.4.27 runtime was downloaded from the official PHP.net Windows release with published SHA256 checked. Official MySQL5.7.44 Community portable ZIP was also obtained from Oracle's CDN and checked against its published MD5 (local SHA256 recorded). An ephemeral instance bound only to127.0.0.1:33079 applied schema.sql cleanly; integration30 PASS. Separate-process tests/concurrency.php passed7 checks: eight concurrent admissions produced one lead/journal/outbox and stable receipt, four concurrent workers produced one fake adapter call and one committed receipt. That instance was stopped by its verified PID/path after the account-scoped SQL user could not perform administrative shutdown; no process remains. To repeat concurrency checks provide SPACEWEB_RACE_DIR as an existing private synthetic working directory; the same DB opt-in/credentials and empty business tables are required. Windows child extensions resolve relative to the portable PHP binary; adjust test-launch extensions for other runtime packaging. PHP8.4 lint24 files PASS; offline behavior checks111 PASS after security fixes. No global installation or PATH changes were made. No real lead/MAX delivery, production deployment, paid resource or account modification occurred. MySQL5.7.44 local execution is not proof of actual SpaceWeb5.7.27/runtime, filesystem isolation, backup/restore or recipient delivery.

## External activation sequence (owner-controlled)

1. Preserve the existing site's verified external backup, handlers, .htaccess and configuration. Confirm available disk space before archive upload/extraction; audit found insufficient space for both a new complete ZIP and extracted site while old archives remain.
2. Confirm actual PHP8.4 web+CLI extensions, InnoDB/rights, TLS/egress, privacy of the sibling directory, RU data/backup location, approved retention/access/deletion and restore procedure. Select PHP8.4 only after checking existing scripts.
3. Review isolated MySQL5.7 schema/integration/concurrency and backup/restore evidence. Create the included account DB only under the owner's explicit account-change authorization; use reviewed install/runtime credentials.
4. Supply real approved document snapshots/pin and matching reviewed frontend static bundle; record approval and archival recovery. Supply private token and explicitly approved **test** recipient without revealing values in release artifacts.
5. Place reviewed backend outside the root; keep enable/notify flags false until all prerequisites pass. Verify negative HTTP/CORS/media/body/consent/storage cases and that no public path exposes config/archive/worker. Use approved synthetic data and an isolated recipient.
6. Under explicit test authorization, enable the controlled test pipeline: form HTTPS POST -> committed lead/journal/outbox -> matching202 receipt -> CLI worker -> MAX receipt for every part -> human confirmation in test recipient. Exercise timeout/429/outage/unknown without unsafe duplicate; reconcile original IDs.
7. Only after successful evidence and approval, switch to the approved actual manager recipient, configure Cron and enable the same-domain endpoint in the final static build. Keep reporting202 as queued; no success message may imply real delivery without confirmed state. Publish/install only within the owner's explicit scope. Document rollback: stop Cron and admissions first, preserve/reconcile queue, restore approved files/config/database consistently without notification replay.

Until these external checks and actual approval facts exist, the code candidate cannot be described as working production MAX delivery.
