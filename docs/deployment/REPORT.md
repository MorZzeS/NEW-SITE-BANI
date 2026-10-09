# Offline staging review — corrected routing/security evidence

PASS: Apache template resolves exported .html before colliding directories, sets DirectorySlash Off, preserves explicit article slash index alias, and emits no redirects for tested routes.

PASS: node scripts/spaceweb/test-apache-routes.mjs — 17 checks. Existing local baseline 127.0.0.1:18779 returned 200/no redirect for /, /katalog/bani and /katalog/bani/. Revised template tested with separate Apache fixture at 127.0.0.1:18789, all configuration/docroot/logs confined to assigned scripts/spaceweb/. Confirms root, both collision routes, article aliases, 404, PHP/private/config/userdata/.htaccess 403, WebP/AVIF/MP4 MIME, UTF8 HTML, noindex and wrong-host refusal. Fixture cleaned; source dist and running config unchanged. No live hosting contact. Evidence: apache-route-verification.json.

PASS: node scripts/spaceweb/test-safety.mjs — 42 checks including external configured endpoint, nonempty compiled endpoint fallback, inline external fetch, inline Render/fetch, external script source, Render image reference, and JS outside _next.
Audit parses executable JS with TypeScript AST, validates actual NEXT_PUBLIC_LEADS_ENDPOINT initializer is an env property with EMPTY fallback in a variable declaration, and requires HTTP rejection in the same lead chunk. All .js/.mjs/.cjs files, executable inline scripts, local script-reference existence and textual HTML/export content scanned; recognizable Render/onrender references, external literal network calls, inline network calls and external script sources rejected. Unknown initializer/script syntax fails closed.

PASS: node scripts/spaceweb/test-existing-build.mjs dist — 928 checks against existing C:\Users\maxto\Desktop\НОВЫЙ САЙТ\banger-unified-preparation\dist, no rebuild. 655 files, 136 HTML pages, 2,660 unchanged script tags, 38 unchanged form openings and body DOM. Audit covered 49 JS files, 1,156 executable inline scripts, 1,504 local script references and one actual EMPTY-fallback lead initializer. Source inventory unchanged; temporary package cleaned. Evidence: existing-build-verification.json.
Hydration/preloads/forms preserved. Noindex mutations remain confined to robots metadata/header/robots.txt. CSP permits same-origin navigation and denies native form action. Contract v2 remains off in inactive template.

Bounded assurance: these checks validate a recognized trusted-build initializer and static references/literal destinations. They do not prove arbitrary code cannot construct dynamic URLs, eval/obfuscated destinations or execute injected code, and do not prove browser-global process.env cannot be externally modified. Client HTTP rejection and EMPTY configured endpoint are prerequisites; CSP is a browser barrier, not proof of no dynamic code. No claim of browser theme/menu/lightbox/video/configurator QA is made.

Production workflow unchanged; main remains production Pages. Preparation branch prep/banger-unified-20261008 must move to separate spaceweb-staging only by coordinator/owner approval. Workflow inactive outside .github/workflows and contains no transfer job. Coordinator owns final integration package.

BLOCKED: live personal data over HTTP, HTTPS support pending; publication inactive; atomic symlink requires provider capabilities.
UNCHECKED: final integration package, browser interactions, provider Apache configuration/routes, remote SSH keys/capabilities, remote ownership/backup/restore/SFTP rename and HTTPS. No build, live lead request, remote upload/push/DNS/certificate operation, Memory or sandbox configuration changes.


Transfer gap E: offline-only dry-run command generator and disabled skeleton now prepared. See TRANSFER-CONTRACT.md. Activation BLOCKED on real provider capabilities, verified backup, exact signed owner approval and remote inventory. Generator never connects/uploads and has no execute option; preserves unowned files, no delete commands, root index last. Tests: test-transfer.mjs 25 PASS; test-safety.mjs 42 PASS. Coordinator final ZIP untouched; its statistics are contextual, not this task's verification.
