<?php
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('Referrer-Policy: no-referrer');
header('X-Content-Type-Options: nosniff');

const MODEL_VIEW_ALLOWED_IDS = [
    'bg-09', 'bg-10', 'bg-11', 'bg-12', 'bg-13', 'bg-14', 'bg-15',
    'bg-16', 'bg-17', 'bg-18', 'bg-19', 'bg-20', 'bg-21', 'bg-28',
];
const MODEL_VIEW_MAX_BODY_BYTES = 512;

function modelViewsReply(int $status, array $value): never {
    http_response_code($status);
    echo json_encode($value, JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE);
    exit;
}

function modelViewsRequestId(): ?string {
    $contentType = $_SERVER['CONTENT_TYPE'] ?? '';
    if (!is_string($contentType) || !preg_match('/^application\/json(?:\s*;\s*charset=utf-8)?$/iD', $contentType)) {
        modelViewsReply(415, ['ok' => false]);
    }
    $length = $_SERVER['CONTENT_LENGTH'] ?? '';
    if ($length !== '' && (!preg_match('/^\d+$/D', (string)$length) || (int)$length > MODEL_VIEW_MAX_BODY_BYTES)) {
        modelViewsReply(413, ['ok' => false]);
    }
    $body = file_get_contents('php://input', false, null, 0, MODEL_VIEW_MAX_BODY_BYTES + 1);
    if ($body === false || strlen($body) > MODEL_VIEW_MAX_BODY_BYTES) modelViewsReply(413, ['ok' => false]);
    try { $payload = json_decode($body, true, 4, JSON_THROW_ON_ERROR); } catch (Throwable) { modelViewsReply(400, ['ok' => false]); }
    if (!is_array($payload) || array_keys($payload) !== ['modelId'] || !is_string($payload['modelId'])
        || !preg_match('/^bg-[0-9]{2}$/D', $payload['modelId'])
        || !in_array($payload['modelId'], MODEL_VIEW_ALLOWED_IDS, true)) {
        modelViewsReply(400, ['ok' => false]);
    }
    return $payload['modelId'];
}

$method = $_SERVER['REQUEST_METHOD'] ?? '';
if (!in_array($method, ['GET', 'POST'], true)) {
    header('Allow: GET, POST');
    modelViewsReply(405, ['ok' => false]);
}
if (!empty($_GET)) modelViewsReply(400, ['ok' => false]);

// Validate every client-controlled input before loading the database connection.
$modelId = null;
if ($method === 'GET') {
    $bodyLength = $_SERVER['CONTENT_LENGTH'] ?? '';
    if ($bodyLength !== '' && (!ctype_digit((string)$bodyLength) || (int)$bodyLength > 0)) modelViewsReply(400, ['ok' => false]);
} else {
    $modelId = modelViewsRequestId();
}

if (!in_array($_SERVER['HTTPS'] ?? '', ['on', '1'], true)) modelViewsReply(403, ['ok' => false]);
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$fetchSite = $_SERVER['HTTP_SEC_FETCH_SITE'] ?? '';
if ($fetchSite !== 'same-origin') modelViewsReply(403, ['ok' => false]);

$configPath = dirname(__DIR__) . '/private/config.php';
$docroot = realpath($_SERVER['DOCUMENT_ROOT'] ?? '');
$private = realpath(dirname($configPath));
if (!$docroot || !$private || str_starts_with($private . DIRECTORY_SEPARATOR, $docroot . DIRECTORY_SEPARATOR) || !is_file($configPath)) {
    modelViewsReply(503, ['ok' => false]);
}

require dirname(__DIR__) . '/private/readiness.php';
try {
    $c = privateConfig();
    $origins = $c['origins'] ?? [];
    if (($c['model_views_enabled'] ?? false) !== true
        || ($c['model_views_approved'] ?? false) !== true
        || ($c['model_views_https_proxy_verified'] ?? false) !== true
        || !in_array($c['environment'] ?? '', ['TEST', 'PRODUCTION'], true)
        || !is_array($origins) || !$origins
        || ($origin !== '' && (!is_string($origin) || !in_array($origin, $origins, true)))
        || ($method === 'POST' && (!is_string($origin) || !in_array($origin, $origins, true)))) {
        modelViewsReply(503, ['ok' => false]);
    }
} catch (Throwable) {
    modelViewsReply(503, ['ok' => false]);
}

$host = strtolower((string)($_SERVER['HTTP_HOST'] ?? ''));
$allowedHosts = array_map(static function (string $approved): string {
    $parsed = parse_url($approved);
    return is_array($parsed) ? strtolower((string)($parsed['host'] ?? '')) . (isset($parsed['port']) ? ':' . (int)$parsed['port'] : '') : '';
}, $origins);
if ($host === '' || !in_array($host, $allowedHosts, true)) modelViewsReply(403, ['ok' => false]);

try {
    $db = operationDb($c);
    if ($method === 'GET') {
        $rows = $db->query('SELECT model_id, views FROM model_view_counts ORDER BY model_id')->fetchAll(PDO::FETCH_ASSOC);
        $counts = [];
        foreach ($rows as $row) {
            if (!is_string($row['model_id']) || !in_array($row['model_id'], MODEL_VIEW_ALLOWED_IDS, true)
                || (!is_string($row['views']) && !is_int($row['views'])) || !preg_match('/^\d+$/D', (string)$row['views'])) {
                throw new RuntimeException('count_row_invalid');
            }
            $counts[$row['model_id']] = (int)$row['views'];
        }
        modelViewsReply(200, ['ok' => true, 'counts' => $counts]);
    }

    // MySQL serializes concurrent updates to this row; every accepted page opening adds exactly one.
    $increment = $db->prepare('UPDATE model_view_counts SET views = views + 1 WHERE model_id = ?');
    $increment->execute([$modelId]);
    if ($increment->rowCount() !== 1) modelViewsReply(404, ['ok' => false]);
    $count = $db->prepare('SELECT views FROM model_view_counts WHERE model_id = ?');
    $count->execute([$modelId]);
    $views = $count->fetchColumn();
    if ((!is_string($views) && !is_int($views)) || !preg_match('/^\d+$/D', (string)$views)) throw new RuntimeException('count_read_failed');
    modelViewsReply(200, ['ok' => true, 'modelId' => $modelId, 'views' => (int)$views]);
} catch (Throwable) {
    modelViewsReply(503, ['ok' => false]);
}
