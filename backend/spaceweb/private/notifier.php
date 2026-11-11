<?php
declare(strict_types=1);
function maxRecipientQuery(array $c): string {
    if (($c['max_recipient_approved']??false)!==true || !in_array($c['max_recipient_type']??'', ['user_id','chat_id'],true) || !is_string($c['max_recipient_id']??null) || !preg_match('/^-?[1-9][0-9]{0,18}$/D',$c['max_recipient_id']) || ($c['max_recipient_type']==='user_id' && str_starts_with($c['max_recipient_id'],'-'))) throw new RuntimeException('recipient_not_approved');
    $magnitude=ltrim($c['max_recipient_id'],'-');$limit=str_starts_with($c['max_recipient_id'],'-')?'9223372036854775808':'9223372036854775807';
    if (strlen($magnitude)===19 && strcmp($magnitude,$limit)>0) throw new RuntimeException('recipient_not_approved');
    return $c['max_recipient_type'].'='.$c['max_recipient_id'];
}
/** An explicit TEST invocation cannot consume a production configuration or destination. */
function outboxEnvironment(array $arguments, array $c): string {
    $environment=match ($arguments) {
        [] => 'PRODUCTION',
        ['--test'] => 'TEST',
        default => throw new RuntimeException('invalid_worker_arguments')
    };
    if (($c['environment']??null)!==$environment) throw new RuntimeException('worker_environment_mismatch');
    return $environment;
}
function maxDestination(array $c): array {
    if (($c['environment']??null)==='TEST') {
        if (!empty($c['max_token']) || !empty($c['max_recipient_id']) || !empty($c['max_recipient_approved'])) {
            throw new RuntimeException('mixed_worker_credentials');
        }
        $test=$c['max_test_destination']??null;
        if (!is_array($test)) throw new RuntimeException('test_destination_missing');
        $token=$test['token']??null;
        $recipient=maxRecipientQuery([
            'max_recipient_type'=>$test['recipient_type']??null,
            'max_recipient_id'=>$test['recipient_id']??null,
            'max_recipient_approved'=>$test['approved']??false
        ]);
    } elseif (($c['environment']??null)==='PRODUCTION') {
        $token=$c['max_token']??null;
        $recipient=maxRecipientQuery($c);
    } else {
        throw new RuntimeException('worker_environment_mismatch');
    }
    if (!is_string($token) || $token==='' || strpbrk($token,"\r\n")!==false) throw new RuntimeException('notifier_disabled');
    return ['token'=>$token,'recipient'=>$recipient];
}
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
/** Validate local adapter prerequisites before claiming any durable message. No network I/O. */
function maxAdapterConfiguration(array $c): array {
    require_once __DIR__.'/ca.php';
    require_once __DIR__.'/readiness.php';
    if (!readiness($c) || ($c['dry_run']??true)!==false || ($c['notify_enabled']??false)!==true ||
        ($c['max_tls_public_ca_verified']??false)!==true) throw new RuntimeException('notifier_disabled');
    if (!function_exists('curl_init') || !defined('CURLOPT_CAINFO_BLOB')) throw new RuntimeException('curl_unavailable');
    return maxDestination($c)+['ca'=>combinedPublicCa($c)];
}
function notifyMax(array $lead, array $c): array {
    if (($lead['environment']??null)!==($c['environment']??null)) throw new RuntimeException('worker_environment_mismatch');
    $adapter=maxAdapterConfiguration($c);
    $text=$lead['notification_text']??null;
    if (!is_string($text) || $text==='' || !mb_check_encoding($text,'UTF-8') || strlen(mb_convert_encoding($text,'UTF-16LE','UTF-8'))>8000) throw new RuntimeException('message_invalid');
    $h = curl_init('https://platform-api2.max.ru/messages?'.$adapter['recipient'].'&disable_link_preview=true');
    curl_setopt_array($h, [CURLOPT_POST=>true, CURLOPT_POSTFIELDS=>json_encode(['text'=>$text], JSON_THROW_ON_ERROR|JSON_UNESCAPED_UNICODE),
        CURLOPT_HTTPHEADER=>['Authorization: '.$adapter['token'], 'Content-Type: application/json'],
        CURLOPT_RETURNTRANSFER=>true, CURLOPT_CONNECTTIMEOUT=>5, CURLOPT_TIMEOUT=>15,
        CURLOPT_CAINFO_BLOB=>$adapter['ca'], CURLOPT_SSL_VERIFYPEER=>true, CURLOPT_SSL_VERIFYHOST=>2, CURLOPT_FOLLOWLOCATION=>false,
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
    // MySQL 5.7: a short blocking row lock serializes claims across hosts/CLI processes.
    // Network I/O is outside this transaction; no SKIP LOCKED dependency.
    $q=$db->prepare("SELECT o.id AS outbox_id,o.attempts,o.message_parts,o.next_part,o.delivery_ids,l.* FROM outbox o JOIN leads l ON l.id=o.lead_id WHERE l.environment=? AND o.state IN ('pending','retry') AND o.available_at<=UTC_TIMESTAMP(6) AND o.attempts<3 ORDER BY o.id LIMIT 1 FOR UPDATE"); $q->execute([$environment]); $row=$q->fetch(PDO::FETCH_ASSOC);
    if (!$row) { $db->commit(); return false; }
    $outboxId=$row['outbox_id'];
    $q=$db->prepare("UPDATE outbox SET state='processing',attempts=attempts+1,lease_until=DATE_ADD(UTC_TIMESTAMP(6),INTERVAL 60 SECOND) WHERE id=?"); $q->execute([$outboxId]); $db->commit();
    try {
        $parts=json_decode($row['message_parts'],true,4,JSON_THROW_ON_ERROR); $part=(int)$row['next_part'];
        if (!is_array($parts) || !array_is_list($parts) || !is_string($parts[$part]??null)) throw new RuntimeException('invalid_parts');
        $row['notification_text']=$parts[$part];
    } catch (Throwable) {
        $q=$db->prepare("UPDATE outbox SET state='unknown',error_code='invalid_parts',lease_until=NULL WHERE id=? AND state='processing'"); $q->execute([$outboxId]); return true;
    }
    try { $result=$notify($row); } catch (Throwable) { $result=['state'=>'unknown','code'=>'adapter_unconfirmed','id'=>null]; }
    if (!in_array($result['state'] ?? '', ['sent','retry','dead','unknown'], true)) $result=['state'=>'unknown','code'=>'adapter_invalid','id'=>null];
    if ($result['state']==='sent' && (!is_string($result['id']??null) || $result['id']==='' || strlen($result['id'])>200)) $result=['state'=>'unknown','code'=>'adapter_invalid_receipt','id'=>null];
    if ($result['state']==='retry' && (int)$row['attempts']+1>=3) $result=['state'=>'dead','code'=>'retry_exhausted','id'=>null];
    if ($result['state']==='sent') {
        $ids=json_decode($row['delivery_ids']??'[]',true,4,JSON_THROW_ON_ERROR); $ids[]=$result['id'];
        // Persist each confirmed part before sending another. Ambiguous parts never replay.
        $next=$part+1; $state=$next===count($parts)?'sent':'pending';
        $q=$db->prepare("UPDATE outbox SET state=?,next_part=?,delivery_ids=?,delivery_id=?,attempts=0,error_code=NULL,lease_until=NULL,available_at=UTC_TIMESTAMP(6) WHERE id=? AND state='processing'");
        $q->execute([$state,$next,json_encode($ids,JSON_THROW_ON_ERROR),$result['id'],$outboxId]); return true;
    }
    $q=$db->prepare("UPDATE outbox SET state=?,error_code=?,delivery_id=?,lease_until=NULL,available_at=DATE_ADD(UTC_TIMESTAMP(6),INTERVAL 120 SECOND) WHERE id=? AND state='processing'");
    $q->execute([$result['state'],$result['code'],$result['id'],$outboxId]); return true;
}
