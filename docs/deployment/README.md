# SpaceWeb staging — INACTIVE, offline preparation

Target: http://banger.ru.swtest.ru
Exact document root: /home/b/bangerramb/bangersu/public_html
Current preparation branch: prep/banger-unified-20261008. Separate staging branch: spaceweb-staging, chosen/activated only by coordinator and owner approval. Production workflow is unchanged.
Read-only audit: .github/workflows/deploy.yml triggers push main, builds dist with repository leads variable, uploads Pages artifact and deploys github-pages.
Audited SHA256: 5eb4701888065bed176b1a9f78a1c9213ac02a56e1462a5ff861a52642af3e33.

## Activation and build handoff

spaceweb-staging.workflow.yml.template is intentionally outside .github/workflows.
Coordinator must review and activate separately; no production environment/Pages permissions/transfer job.
Create GitHub environment spaceweb-staging with required reviewers, prevent self approval, and deployment branch policy spaceweb-staging only. GitHub plan support must be verified; without enforceable reviewers, remain blocked.
Only isolated staging secrets may be used; never inherit production SSH/lead secrets.
Template supports push of separate staging branch and manual dispatch, both refuse main.
GitHub actions use upstream major tags; pin to reviewed immutable commits before activation.
Do not run simultaneous builds. Coordinator runs single root static export with NEXT_PUBLIC_LEADS_ENDPOINT explicitly EMPTY (including overriding any .env.local value), then npm run check:static before packaging.
Node guard also enforces exact branch, HTTP virtual host and docroot.
prepare.mjs accepts existing dist and a NEW artifact directory; refuses overwrite.
HTML receives noindex and robots deny-all. Hydration scripts, preload links, real forms and body DOM remain unchanged. Compiled client rejects HTTP and EMPTY endpoints; native form-action is blocked while CSP permits same-origin navigation.
Do not copy this packaging policy to production. Every compiled JavaScript file is preserved byte-for-byte; Render/onrender endpoint references fail packaging before copying. Optional contract v2 remains off.
A root export has no basePath. Existing production canonicals stay unchanged; header/meta noindex overrides indexing, robots alone is insufficient.
No build, upload, lead call, git push, DNS or certificate operations were performed.

## HTTPS / personal data

HTTPS support request is pending (owner-provided fact, not independently verified here). banger.ru is not owned; do not route it or request changes. Current target is HTTP.
Live personal-data collection/transmission remains BLOCKED, even if a lead endpoint itself uses HTTPS. Explicit EMPTY configured leads endpoint and compiled client HTTP rejection are mandatory. Real forms remain in the DOM; submission fails locally before network dispatch.
No insecure TLS flags, no certificate changes, no network testing.

## Apache requirements and route checks

staging.htaccess requires Apache 2.4, AllowOverride permitting Options/FileInfo/AuthConfig, and mod_rewrite/mod_headers/mod_mime. Missing required module/directive fails closed with server error; do not weaken protections.
Host is constrained to banger.ru.swtest.ru. Root index, exported .html, extensionless routes resolve .html before colliding directories; DirectorySlash Off prevents redirect, explicit article /slug/index.html aliases are preserved; UTF-8 and WebP/AVIF/MP4 MIME configured.
PHP and private/config/userdata/API/backend/dotfiles are denied over HTTP. Existing host files are preserved on disk, never blanket deleted.
Before any future transfer: verify /, catalog/detail, /poleznoe, article with/without slash, genuine 404, UTF8 and MIME responses, X-Robots-Tag, CSP, and HTTP 403 for PHP/private/config/userdata. Denied files must not be created just to test on live server without separate authorization.
Apache capabilities and server-side path semantics have NOT been verified by these offline tests.

## Owned files, backup and rollback

manifest is external to docroot and records relative path, bytes and SHA256 for every packaged file; never upload manifest or SSH secrets into public_html.
safety.mjs rejects traversal, symlinks, hidden/private/server executable files and verifies exact inventory/hash/noindex and preserved compiled scripts. Empty .gitkeep export placeholders are omitted; other hidden files still fail.
plan.mjs takes previous trusted manifest, next manifest and complete SAFE remote public-file inventory; outputs JSON only. It blocks scope mismatch, remote drift and unowned collisions; preserves all unowned files and retires only previous owned entries after verification.
Protected host-side files remain outside manifests and must be separately recorded as excluded protected paths. Never recursively enumerate/read their contents to construct inventory.
First deployment has no trusted ownership: empty previous manifest is allowed only after explicit remote inventory review; existing colliding filenames require owner-approved adoption and byte-for-byte backups recorded in the previous manifest. No guessing ownership.
Backup before replacement: download each previously owned file using pinned SFTP to a timestamped private backup outside docroot, verify SHA256, record original permissions and inventory, test restoration offline. Keep previous manifest and .htaccess. Never overwrite prior ZIPs.
Rollback: restore backed-up previous owned files; remove only new files listed by rollback.removeNewOnly after confirming live hashes equal next manifest. If live drift occurs, stop. Preserve unrelated/protected data and previous backups.

Atomic symlink release ONLY after provider confirms SSH, symlink permission, Apache FollowSymLinks, docroot symlink handling, same filesystem atomic rename, separate private release/backup paths and that switching preserves protected/unowned files. Current capabilities UNVERIFIED, so atomic deployment BLOCKED.

Non-atomic safe alternative (documented, not executed): approved maintenance window, private backup verified first, transfer changed owned files via pinned SFTP to unique sibling temporary names, verify remote SHA256 using provider-confirmed SSH or download-and-hash, then per-file rename. Upload assets first; HTML last; .htaccess protection established before public exposure. Keep stale owned assets until successful route check and retire only manifest-listed unchanged files. SFTP rename atomicity and overwrite behavior must be verified; mixed-page versions remain possible. If host cannot stage/rename or safely deny public access during update, STOP. On failure restore from backup in maintenance mode and verify old manifest. No mirror --delete, rm -rf, blanket cleanup or unattended transfer.

## Pinned transport (no connection in supplied scripts)

ssh-config.mjs writes fresh local configuration only. Provide SPACEWEB_STAGING_SSH_HOST/USER/PORT and SPACEWEB_STAGING_KNOWN_HOSTS from isolated reviewed environment secrets; SSH host is provider-confirmed, not assumed equal to HTTP virtual host.
Obtain exact host public key and SHA256 fingerprint through authenticated provider support/control panel, verify out of band, store exact unhashed known_hosts entry matching host/port. Do not bootstrap trust via ssh-keyscan.
Store staging_ssh_key privately, mode 600 on Linux; Windows ACLs require independent review. Use OpenSSH SFTP/SSH with -F staging_ssh_config and host alias spaceweb-staging. StrictHostKeyChecking yes, BatchMode yes, no agent/password fallback. Key mismatch stops transfer. No FTP, insecure HTTPS, StrictHostKeyChecking=no or curl -k.
No ready transfer command is activated: future coordinator must approve concrete manifest plan/backup and implement controlled per-file upload after capabilities are verified.

## Offline validation

node scripts/spaceweb/test-safety.mjs (42 checks); node scripts/spaceweb/test-existing-build.mjs dist (928 checks on existing export).
No integration build or remote/network validation is included. Fixtures and actual packaging outputs are temporary within assigned scripts/spaceweb/ and safely cleaned. Existing source export is read-only; no build is invoked.



## Review corrections and bounded audit

node scripts/spaceweb/test-apache-routes.mjs passes 17 local checks against an isolated Apache fixture. It reads existing 127.0.0.1:18779 baseline without edits, creates a separate owned-dir config/docroot at loopback 18789, and cleans only its own fixture. Host header is explicit using node:http. See apache-route-verification.json; provider behavior remains unverified.

audit-compiled.mjs examines ALL JS/MJS/CJS files and executable inline HTML scripts, validates script references, rejects recognizable Render/onrender anywhere in textual export content, external script sources, inline network API calls and external literal fetch/open/beacon destinations. TypeScript AST checks the actual endpoint variable initializer and its empty env fallback; markers alone are insufficient. Negative fixtures test external configured endpoint, nonempty fallback, inline Render/fetch, non-Next JS and external script sources. Existing export audit: 49 JS files, 1156 inline scripts, 1504 local script references and one recognized empty-fallback lead initializer.

Assurance is bounded to recognized trusted-build AST/static references, not an arbitrary-code theorem. Dynamic/obfuscated destinations, eval, runtime injection and externally modified browser-global process.env are not proven absent. HTTP client guard, EMPTY configuration and CSP remain prerequisites. Browser interactions and coordinator final integration package are unverified by devops. No rebuild or live host request is authorized by these tests.

Inactive SFTP review contract: see TRANSFER-CONTRACT.md and scripts/spaceweb/dry-run-transfer.mjs. Only offline command text is generated after exact signature/scope/backup/capability checks. Real transfer implementation/activation remains blocked; no execute option is supplied. Current disabled workflow skeleton documents owner approval and verified backup gates.
