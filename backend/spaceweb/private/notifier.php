<?php
declare(strict_types=1);
function deliveryOutcome(int $status, string $body, int $error): array {
    // Only an explicit rate-limit rejection is automatically retryable.
    if ($error !== 0) return ['state'=>'unknown','code'=>'transport_unconfirmed','id'=>null];
    if ($status === 429) return ['state'=>'retry','code'=>'rate_limited','id'=>null];
    if (in_array($status, [400,401,403,404,405,413,415,422], true)) return ['state'=>'dead','code'=>'upstream_rejected','id'=>null];
    try { $d = json_decode($body, true, 16, JSON_THROW_ON_ERROR); } catch (Throwable) { $d = []; }
    $id = $d['message']['body']['mid'] ?? null;
    if ($status === 200 && is_string($id) && strlen($id) > 0 && strlen($id) <= 200) return ['state'=>'sent','code'=>null,'id'=>$id];
    return ['state'=>'unknown','code'=>'delivery_unconfirmed','id'=>null];
}
function notifyMax(array $lead, array $c): array {
    require_once __DIR__.'/ca.php';
    require_once __DIR__.'/readiness.php';
    if (!readiness($c)) throw new RuntimeException('notifier_disabled');
    $ca=combinedPublicCa($c);
    if (($c['environment'] ?? '') !== 'PRODUCTION' || ($c['notify_enabled'] ?? false) !== true ||
        ($c['max_tls_public_ca_verified'] ?? false) !== true || !is_string($c['max_token'] ?? null) || $c['max_token'] === '' ||
        strpbrk($c['max_token'], "\r\n") !== false) throw new RuntimeException('notifier_disabled');
    $text = "Новая заявка BANGER.SU\nID: ".$lead['request_id']."\nИмя: ".$lead['name']."\nТелефон: ".$lead['phone']."\nМодель: ".$lead['model']."\nСтраница: ".$lead['page']."\nКомментарий: ".$lead['comment'];
    $h = curl_init('https://platform-api2.max.ru/messages?user_id=2758798&disable_link_preview=true');
    curl_setopt_array($h, [CURLOPT_POST=>true, CURLOPT_POSTFIELDS=>json_encode(['text'=>$text], JSON_THROW_ON_ERROR|JSON_UNESCAPED_UNICODE),
        CURLOPT_HTTPHEADER=>['Authorization: '.$c['max_token'], 'Content-Type: application/json'],
        CURLOPT_RETURNTRANSFER=>true, CURLOPT_CONNECTTIMEOUT=>5, CURLOPT_TIMEOUT=>15,
        CURLOPT_CAINFO_BLOB=>$ca, CURLOPT_SSL_VERIFYPEER=>true, CURLOPT_SSL_VERIFYHOST=>2, CURLOPT_FOLLOWLOCATION=>false,
        CURLOPT_PROTOCOLS=>CURLPROTO_HTTPS, CURLOPT_MAXFILESIZE=>65536]);
    // Maintained system public CA bundle PLUS fingerprint-pinned official public root; no bypass.
    $body='';
    curl_setopt($h, CURLOPT_WRITEFUNCTION, static function($handle, string $chunk) use (&$body): int {
        if (strlen($body)+strlen($chunk)>65536) return 0;
        $body.=$chunk; return strlen($chunk);
    });
    curl_exec($h); $error = curl_errno($h); $status = (int)curl_getinfo($h, CURLINFO_RESPONSE_CODE);
    curl_close($h);
    return deliveryOutcome($status, is_string($body) ? $body : '', $error);
}
function runOutbox(PDO $db, string $environment, callable $notify): bool {
    $db->beginTransaction();
    // Expired claims may already have been sent: quarantine, never resend.
    $q=$db->prepare("UPDATE outbox o JOIN leads l ON l.id=o.lead_id SET o.state='unknown',o.error_code='expired_claim' WHERE l.environment=? AND o.state='processing' AND o.lease_until < UTC_TIMESTAMP(6)"); $q->execute([$environment]);
    $q=$db->prepare("SELECT o.id AS outbox_id,o.attempts,l.* FROM outbox o JOIN leads l ON l.id=o.lead_id WHERE l.environment=? AND o.state IN ('pending','retry') AND o.available_at<=UTC_TIMESTAMP(6) AND o.attempts<3 ORDER BY o.id LIMIT 1 FOR UPDATE SKIP LOCKED"); $q->execute([$environment]); $row=$q->fetch(PDO::FETCH_ASSOC);
    if (!$row) { $db->commit(); return false; }
    $outboxId=$row['outbox_id'];
    $q=$db->prepare("UPDATE outbox SET state='processing',attempts=attempts+1,lease_until=DATE_ADD(UTC_TIMESTAMP(6),INTERVAL 60 SECOND) WHERE id=?"); $q->execute([$outboxId]); $db->commit();
    try { $result=$notify($row); } catch (Throwable) { $result=['state'=>'unknown','code'=>'adapter_unconfirmed','id'=>null]; }
    if (!in_array($result['state'] ?? '', ['sent','retry','dead','unknown'], true)) $result=['state'=>'unknown','code'=>'adapter_invalid','id'=>null];
    if ($result['state']==='retry' && (int)$row['attempts']+1>=3) $result=['state'=>'dead','code'=>'retry_exhausted','id'=>null];
    $q=$db->prepare("UPDATE outbox SET state=?,error_code=?,delivery_id=?,lease_until=NULL,available_at=DATE_ADD(UTC_TIMESTAMP(6),INTERVAL 120 SECOND) WHERE id=? AND state='processing'");
    $q->execute([$result['state'],$result['code'],$result['id'],$outboxId]); return true;
}
