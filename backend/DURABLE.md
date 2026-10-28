# Opt-in durable lead backend (disabled by default)

Node 24, built-in `node:sqlite`; no npm dependencies. Existing legacy entrypoints are unchanged.
From repository root:

```
node --test backend/durable.test.mjs
node backend/durable-server.mjs
node backend/durable-backup.mjs backup ABSOLUTE_DB_PATH ABSOLUTE_NEW_BACKUP_PATH
node backend/durable-backup.mjs restore ABSOLUTE_BACKUP_PATH ABSOLUTE_NEW_DB_PATH EXPECTED_SHA256
```

The server command refuses startup until an operator explicitly supplies all of:

- `DURABLE_LEADS_ENABLED=1`
- `LEADS_DB_PATH`: absolute persistent local SQLite disk path in a private directory outside the web root.
- `LEAD_DOCUMENT_BUNDLE`: absolute private approved JSON archive `{approved:true,documents:{consent:{version,text,sha256},checkbox:{version,text,sha256},policy:{version,text,sha256}}}`. SHA-256 is over exact UTF-8 text. Do not invent approved text or versions.
- `ALLOWED_ORIGINS`: comma-separated exact HTTPS origins.
- `RU_STORAGE_ATTESTED=1`, `LEGAL_APPROVAL_ATTESTED=1`, `BACKUP_RESTORE_ATTESTED=1`: operator attestations after verifying actual RU hosting, approved legal documents, restricted backups and successful restoration. Flags are not evidence of those facts.
- `RATE_HMAC_KEY`: independent private random key of at least 32 characters for IP pseudonymization. Keep stable across restarts and out of backups/source control.
- `MAX_BOT_TOKEN` secret and explicit numeric `MAX_USER_ID`. With `TEST_MODE=1`, `TEST_MAX_USER_ID` is mandatory and production recipient is never a fallback.

No environment switches are enabled by these files. `SYNTHETIC_ONLY=1` bypasses deployment attestations only with a programmatically injected notifier. Never expose a synthetic instance publicly. Unit tests inject notifiers and never contact MAX.

Listen address is 127.0.0.1, default port 8788. Terminate TLS at a reviewed reverse proxy; preserve exact Origin and limit request rate/body size there. Set `TRUST_LOOPBACK_PROXY=1` only for a reviewed loopback reverse proxy that REPLACES `X-Real-IP` with the actual client address (never passes user-supplied values). Only loopback socket peers can supply this header; invalid or missing addresses are rejected. Without that switch, the five-per-ten-minute limit uses the socket peer and may be shared. IP rate keys are HMAC pseudonyms with the private key. CORS is not authentication; the public endpoint has validation, honeypot, timing and durable rate limits.

Use one process per database; the entrypoint holds a PID lock and refuses another live owner. SQLite uses WAL, synchronous FULL, atomic lead+consent+outbox and durable request fingerprints. Private directory access must exclude other users; Linux chmod 0600 is applied to DB/backup but does not establish Windows ACLs or encryption. Set private directory ACLs and encrypted volume/backup storage before use. The entrypoint sets umask 077; protect parent directory, WAL/SHM and approved bundle equally. Backups contain plaintext personal data: encrypt before any off-host transfer; file permissions alone are not encryption. This prototype does not attest physical location or operate a retention scheduler.

HTTP 202 `accepted` means durable storage, not delivered MAX message. Duplicate IDs return the original receipt without enqueueing again; changed payload is HTTP 409 conflict. Only HTTP 200 with a nonempty MAX `message.body.mid` yields `sent`; the message ID is persisted, and the notification includes the authoritative receipt timestamp. Explicit MAX 429 may retry after a bounded delay; timeout, unknown response and interrupted claims become `unknown`, never automatically resent. Operator reconciliation is required for unknown records. A failed COMMIT without confirmed rollback returns admitted:null; only successful rollback yields storage_unavailable/admitted:false.

Backups use SQLite's online backup API, integrity checks and checksum output. Store the checksum separately in trusted operator records. Restore verifies checksum, integrity, foreign keys and document hashes; only a new destination is permitted. All restored non-sent jobs are quarantined as unknown because the original database might have delivered after the snapshot. Stop the original service and prevent two independent restored/original workers before switching DB paths. Reconcile records with the original ledger/MAX manually; never reset unknown to accepted blindly. Run backup/restore on the same private encrypted RU storage boundary. Tests demonstrate a synthetic local drill, not a production disaster recovery exercise.

Production remains blocked on real RU infrastructure, approved documents, security/legal/QA review, private ACL/encryption verification, backup schedule/retention and an actual hosting restore drill. No live MAX verification is performed.
