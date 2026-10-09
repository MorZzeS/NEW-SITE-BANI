# Inactive SFTP transfer contract (offline command generator)

Generator: scripts/spaceweb/dry-run-transfer.mjs. It imports no networking/process execution APIs and exposes NO execute option. CLI reads three review files and prints JSON:
node scripts/spaceweb/dry-run-transfer.mjs bundle.json approval.json trusted-owner-public-key.pem

Do not pipe output into a shell or SFTP. Output is review text; no command is executed. Activation remains BLOCKED: real SFTP/rename/protection/temp-name/backup capabilities and owner approval have not been verified. No atomic/symlink guarantee is asserted.

## Exact inputs and trusted approval

bundle fields: branch=spaceweb-staging, host=banger.ru.swtest.ru, docroot=/home/b/bangerramb/bangersu/public_html, unique releaseId (8–40 ASCII alphanumeric/hyphen), previous/next/remote owned-file manifests, reviewedPlan equal to plan.mjs output, remoteDirectories (relative, including empty root), temporaryNamesAbsentVerified=true and evidence.
remote manifest contains reviewed safe public files; separately record excluded protected/private paths without reading contents. Before approving, verify all generated temporary dotfile paths are absent via a separately authorized provider inventory. Existing protected/unowned files must never be adopted or overwritten by guessing.

capabilities must explicitly attest sftp, sameDirectoryRename, renameOverwrite, existingProtectionVerified, with provider evidence. These are signed assertions, NOT proof performed by the generator.
backup must have verified=true, previousManifestSha256=digest(previous), private timestamped receipt. Independently hash and restore-test backup before signing.
ssh must specify provider-confirmed host/user/port, exact unhashed ed25519 knownHosts line, matching independently verified SHA256 fingerprint, providerEvidence. HTTP host and SSH server are distinct; the SSH destination is bound to the exact owner-signed bundle. The generator validates SSH wire-key format/fingerprint but cannot verify who supplied the key.

digest is SHA256 of UTF8 JSON.stringify(bundle); JSON key ordering is significant. approval contains version, approved=true, owner, planSha256=digest(bundle), signature (base64 Ed25519 signature over UTF8 JSON.stringify(approval without signature)). All approval fields except signature are signed. The separately supplied trusted owner public key MUST come from protected, independently pinned operator configuration, never from bundle or an untrusted artifact. No private signing key or real approval is provided. An arbitrary replacement trust key defeats identity; protect the trust anchor.

Before approval, verify next manifest against the exact coordinator artifact via safety.mjs, compiled audit, source checks and coordinator final integration checks. Generator validates manifests/plan, not artifact bytes or backup receipt authenticity. Bind approval to that exact manifest and actual review evidence.

## Literal SFTP plan and mandatory phases

Output uploadBatch contains literal parent-before-child mkdir commands only for missing reviewed directories, then per-file put to unique sibling dotfile temporary paths. CommitBatch contains literal per-file rename, assets before HTML, root index.html LAST. .htaccess is first when changed; existing protection must already be verified. Names are narrowly allowlisted and quoted. Ownership plan is recomputed; unexpected uploads, traversal, unowned collisions and drift fail closed.
Known existing directories are not mkdir'd; missing parents must be reviewed. Root docroot is never created/replaced by the generator.
Between uploadBatch and ANY commit: independently download/hash all verifyTemporaryBeforeCommit entries, compare to next manifest, recheck live previous-owned hashes and backup receipt. Obtain explicit commit approval. No automatic hash/transfer execution is implemented.
SSH configuration pins strict host keys, key-only authentication, no forwarding, no trust-on-first-use. Local key/config must be privately protected. No FTP/insecure TLS.
retirementCommands is always EMPTY: no rm, mirror --delete, blanket cleanup, remote recursive delete or symlink switch. Stale owned-file retirement needs a separate approved hash-checked plan after route verification.
Whole-site update is NON-ATOMIC even if a provider proves per-file rename. Maintenance window and rollback remain necessary. Symlink capabilities unknown and not used.

## Evidence and gaps

node scripts/spaceweb/test-transfer.mjs — 25 PASS (in-memory synthetic keys/approvals only): staging allowlists, traversal/private paths, exact reviewed plan, signature/change/unapproved/wrong trust-key rejection, backup/capability gates, hostkey format/pin, temp-name verification, mkdir ordering, root index last, unowned preservation and zero retirement commands.
node scripts/spaceweb/test-safety.mjs — 42 PASS after import-main guard adjustment in plan.mjs.
Actual owner approval, provider capabilities, backup receipt, SSH key trust, live remote inventory and staged-file hash verification: BLOCKED/unverified. No actual transfer can be claimed ready to execute.
Coordinator's final ZIP statistics are context only; this devops task neither altered nor independently verified that ZIP.


Targeted SFTP correction (2026-10-09): quoted command paths now backslash-escape glob characters [ and ] (helper also covers * and ?, which remain rejected by the narrow path allowlist). Reference: https://man.openbsd.org/sftp.1, INTERACTIVE COMMANDS — glob-special pathname characters require backslash escaping; quoting alone is insufficient. Regression uses actual Next path _next/static/chunks/app/banya/[slug]/page.js and asserts exact literal escaped put arguments, no unescaped brackets across batches; wildcard * and ? remain rejected. ONLY node scripts/spaceweb/test-transfer.mjs ran for this correction: 29 PASS. No SFTP connection, build, artifact/ZIP/source edit or other suite run. Provider SFTP parser/rename capabilities and actual activation still unverified/BLOCKED.
