<?php
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'GET') { http_response_code(405); echo '{"ok":false}'; exit; }
// Liveness only. Never assert database, legal, TLS or delivery readiness.
echo '{"ok":true,"service":"spaceweb-leads","readiness":"unconfirmed"}';
