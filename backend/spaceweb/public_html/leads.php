<?php
declare(strict_types=1);
// Fail closed before reading php://input. Do not trust forwarding headers.
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
function reply(int $status, array $value): never {
    http_response_code($status);
    if ($status !== 204) echo json_encode($value, JSON_THROW_ON_ERROR);
    exit;
}
if (($_SERVER['HTTPS'] ?? '') !== 'on' && ($_SERVER['HTTPS'] ?? '') !== '1') reply(403, ['ok'=>false]);
// This fixed sibling directory MUST be outside the actual hosting document root.
$configPath = dirname(__DIR__).'/private/config.php';
$docroot=realpath($_SERVER['DOCUMENT_ROOT'] ?? '');
$private=realpath(dirname($configPath));
if (!$docroot || !$private || str_starts_with($private.DIRECTORY_SEPARATOR, $docroot.DIRECTORY_SEPARATOR)) reply(503, ['ok'=>false]);
if (!is_file($configPath)) reply(503, ['ok'=>false]);
try { $c = require $configPath; } catch (Throwable) { reply(503, ['ok'=>false]); }
require dirname(__DIR__).'/private/readiness.php';
if (!is_array($c) || !readiness($c)) reply(503, ['ok'=>false]);
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (!in_array($origin, $c['origins'], true)) reply(403, ['ok'=>false]);
header('Access-Control-Allow-Origin: '.$origin); header('Vary: Origin');
if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    header('Access-Control-Allow-Methods: POST'); header('Access-Control-Allow-Headers: Content-Type');
    reply(204, []);
}
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') reply(405, ['ok'=>false]);
if (!preg_match('/^application\/json(?:\s*;\s*charset=utf-8)?$/iD', $_SERVER['CONTENT_TYPE'] ?? '')) reply(415, ['ok'=>false]);
if ((int)($_SERVER['CONTENT_LENGTH'] ?? 0) > 8192) reply(413, ['ok'=>false]);
$body = file_get_contents('php://input', false, null, 0, 8193);
if ($body === false || strlen($body) > 8192) reply(413, ['ok'=>false]);
try { $d = json_decode($body, true, 16, JSON_THROW_ON_ERROR); } catch (Throwable) { reply(400, ['ok'=>false]); }
require dirname(__DIR__).'/private/validation.php';
if (!is_array($d) || !validLead($d, $c, (int)floor(microtime(true)*1000))) reply(400, ['ok'=>false]);
$page = parse_url($d['page']);
$pageOrigin = 'https://'.$page['host'].(isset($page['port']) ? ':'.$page['port'] : '');
if ($pageOrigin !== $origin) reply(400, ['ok'=>false]);
// Dry run does not claim acceptance and does not persist or notify.
if (($c['dry_run'] ?? true) === true) reply(202, ['ok'=>false, 'validated'=>true, 'dryRun'=>true, 'requestId'=>$d['requestId']]);
$remote = $_SERVER['REMOTE_ADDR'] ?? '';
if (!filter_var($remote, FILTER_VALIDATE_IP) || strlen($c['ip_hmac_key'] ?? '') < 32) reply(503, ['ok'=>false]);
$ipHash = hash_hmac('sha256', inet_pton($remote), $c['ip_hmac_key'], true);
$canonical = [];
foreach (['requestId','name','phone','model','comment','page','consent','contractVersion','consentVersion','policyVersion'] as $key) $canonical[$key] = $d[$key];
$hash = hash('sha256', json_encode($canonical, JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR), true);
$db = null;
try {
    $db = new PDO($c['db_dsn'], $c['db_user'], $c['db_password'], [PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION, PDO::ATTR_EMULATE_PREPARES=>false]);
    $db->exec("SET time_zone = '+00:00'");
    $db->beginTransaction();
    $bucket = intdiv(time(), 600);
    $q = $db->prepare('INSERT INTO rate_buckets(environment,ip_hash,bucket,hits) VALUES (?,?,?,1) ON DUPLICATE KEY UPDATE hits=hits+1');
    $q->execute([$c['environment'], $ipHash, $bucket]);
    $q = $db->prepare('SELECT hits FROM rate_buckets WHERE environment=? AND ip_hash=? AND bucket=? FOR UPDATE');
    $q->execute([$c['environment'], $ipHash, $bucket]);
    if ((int)$q->fetchColumn() > 5) { $db->commit(); reply(429, ['ok'=>false]); }
    // Lock rate first: same-IP retries serialize; UNIQUE catches cross-IP races.
    $q = $db->prepare('SELECT payload_hash FROM leads WHERE environment=? AND request_id=?');
    $q->execute([$c['environment'], $d['requestId']]); $prior = $q->fetchColumn();
    if ($prior !== false) {
        $db->commit();
        if (!hash_equals($prior, $hash)) reply(409, ['ok'=>false, 'requestId'=>$d['requestId']]);
        reply(200, ['ok'=>true, 'requestId'=>$d['requestId']]);
    }
    $q = $db->prepare('INSERT INTO leads(environment,request_id,payload_hash,name,phone,model,comment,page) VALUES (?,?,?,?,?,?,?,?)');
    $q->execute([$c['environment'],$d['requestId'],$hash,trim($d['name']),$d['phone'],$d['model'],$d['comment'],$d['page']]);
    $id = $db->lastInsertId();
    $q = $db->prepare("INSERT INTO consent_journal(lead_id,consent_version,policy_version,assertion,request_id,page,client_created_at,client_started_at_ms) VALUES (?,?,?,'client_asserted_v2',?,?,?,?)");
    $q->execute([$id,$d['consentVersion'],$d['policyVersion'],$d['requestId'],$d['page'],$d['createdAt'],$d['startedAt']]);
    $q = $db->prepare('INSERT INTO outbox(lead_id) VALUES (?)'); $q->execute([$id]);
    $db->commit(); reply(200, ['ok'=>true, 'requestId'=>$d['requestId']]);
} catch (Throwable $e) {
    if ($db instanceof PDO && $db->inTransaction()) $db->rollBack();
    // A concurrent duplicate or uncertain commit is retryable with the SAME ID.
    error_log('lead_storage_unconfirmed'); reply(503, ['ok'=>false]);
}
