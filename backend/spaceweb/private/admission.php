<?php
declare(strict_types=1);
require_once __DIR__.'/documents.php';
require_once __DIR__.'/messages.php';
function leadResponse(string $requestId, string $status, ?bool $admitted, ?array $receipt=null, bool $retryable=false): array {
    $http=match($status) {'sent'=>200,'accepted'=>202,'rejected'=>$retryable?429:400,'conflict'=>409,default=>503};
    $body=['ok'=>in_array($status,['sent','accepted'],true),'contractVersion'=>3,'requestId'=>$requestId,'status'=>$status,'admitted'=>$admitted,'retryable'=>$retryable];
    if ($receipt!==null) $body['receipt']=$receipt;
    return [$http,$body];
}
function canonicalLeadValue(mixed $v): mixed {
    if (!is_array($v)) return $v;
    if (!array_is_list($v)) ksort($v,SORT_STRING);
    return array_map('canonicalLeadValue',$v);
}
function leadPayloadHash(array $lead): string {
    unset($lead['createdAt'],$lead['startedAt']);
    if (isset($lead['configurationDetails'])) unset($lead['configurationDetails']['calculatedAt']);
    return hash('sha256',json_encode(canonicalLeadValue($lead),JSON_UNESCAPED_UNICODE|JSON_THROW_ON_ERROR),true);
}
function existingAdmission(PDO $db, array $d, array $c, string $hash): ?array {
    $q=$db->prepare('SELECT l.payload_hash,c.receipt_json,o.state FROM leads l JOIN consent_journal c ON c.lead_id=l.id JOIN outbox o ON o.lead_id=l.id WHERE l.environment=? AND l.request_id=?');
    $q->execute([$c['environment'],$d['requestId']]); $row=$q->fetch(PDO::FETCH_ASSOC);
    if (!$row) return null;
    if (!hash_equals($row['payload_hash'],$hash)) return leadResponse($d['requestId'],'conflict',true);
    $state=match($row['state']) {'sent'=>'sent','pending','retry'=>'accepted','processing'=>'claimed',default=>'unknown'};
    return leadResponse($d['requestId'],$state,true,json_decode($row['receipt_json'],true,8,JSON_THROW_ON_ERROR));
}
/** One transaction admits the lead, immutable evidence and every notification part. */
function admitLead(PDO $db, array $d, array $c, string $ipHash, ?callable $fault=null): array {
    $hash=leadPayloadHash($d); $commitAttempted=false;
    try {
        // An already-admitted request must never be represented as a retryable rejection.
        if ($prior=existingAdmission($db,$d,$c,$hash)) return $prior;
        $db->beginTransaction();
        archiveDocuments($db,$c['documents']);
        $bucket=intdiv(time(),600);
        $q=$db->prepare('INSERT INTO rate_buckets(environment,ip_hash,bucket,hits) VALUES (?,?,?,1) ON DUPLICATE KEY UPDATE hits=hits+1'); $q->execute([$c['environment'],$ipHash,$bucket]);
        $q=$db->prepare('SELECT hits FROM rate_buckets WHERE environment=? AND ip_hash=? AND bucket=? FOR UPDATE'); $q->execute([$c['environment'],$ipHash,$bucket]); $hits=(int)$q->fetchColumn();
        // A locking read sees a concurrent committed admission under MySQL REPEATABLE READ.
        $q=$db->prepare('SELECT request_id FROM leads WHERE environment=? AND request_id=? FOR UPDATE'); $q->execute([$c['environment'],$d['requestId']]);
        if ($q->fetchColumn()!==false) { $db->commit(); return existingAdmission($db,$d,$c,$hash)??leadResponse($d['requestId'],'unknown',null); }
        if ($hits>5) { $db->commit(); return leadResponse($d['requestId'],'rejected',false,null,true); }
        $business=array_intersect_key($d,array_flip(['source','article','modelKind','promotion','configuration','configurationDetails']));
        $q=$db->prepare('INSERT INTO leads(environment,request_id,payload_hash,name,phone,model,comment,page,business_json) VALUES (?,?,?,?,?,?,?,?,?)');
        $q->execute([$c['environment'],$d['requestId'],$hash,$d['name'],$d['phone'],$d['model'],$d['comment'],$d['page'],json_encode($business,JSON_THROW_ON_ERROR|JSON_UNESCAPED_UNICODE)]); $id=$db->lastInsertId();
        $bytes=random_bytes(16); $bytes[6]=chr((ord($bytes[6])&15)|64); $bytes[8]=chr((ord($bytes[8])&63)|128); $hex=bin2hex($bytes);
        $receipt=['contractVersion'=>3,'receiptId'=>substr($hex,0,8).'-'.substr($hex,8,4).'-'.substr($hex,12,4).'-'.substr($hex,16,4).'-'.substr($hex,20),'requestId'=>$d['requestId'],'receivedAt'=>(new DateTimeImmutable('now',new DateTimeZone('UTC')))->format('Y-m-d\TH:i:s.v\Z'),'purposeCode'=>$d['purposeCode'],'consent'=>true,'action'=>$d['action'],'page'=>$d['page'],'consentVersion'=>$d['consentVersion'],'policyVersion'=>$d['policyVersion'],'consentTextSha256'=>$d['consentTextSha256'],'checkboxTextSha256'=>$d['checkboxTextSha256'],'policyTextSha256'=>$d['policyTextSha256']];
        $q=$db->prepare("INSERT INTO consent_journal(lead_id,consent_version,policy_version,checkbox_version,consent_sha256,checkbox_sha256,policy_sha256,bundle_sha256,receipt_id,receipt_json,request_id,page,client_created_at,client_started_at_ms,assertion) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,'client_asserted_v3')");
        $q->execute([$id,$d['consentVersion'],$d['policyVersion'],$d['checkboxVersion'],$d['consentTextSha256'],$d['checkboxTextSha256'],$d['policyTextSha256'],$c['document_bundle_sha256'],$receipt['receiptId'],json_encode($receipt,JSON_THROW_ON_ERROR),$d['requestId'],$d['page'],$d['createdAt'],$d['startedAt']]);
        $q=$db->prepare('INSERT INTO outbox(lead_id,message_parts) VALUES (?,?)'); $q->execute([$id,json_encode(leadMessageParts($d),JSON_THROW_ON_ERROR|JSON_UNESCAPED_UNICODE)]);
        if ($fault) $fault('before_commit');
        $commitAttempted=true; $db->commit();
        if ($fault) $fault('after_commit');
        return leadResponse($d['requestId'],'accepted',true,$receipt);
    } catch (Throwable) {
        $rolledBack=false;
        try { if ($db->inTransaction()) { $db->rollBack(); $rolledBack=true; } } catch (Throwable) { /* unknown */ }
        return !$commitAttempted && $rolledBack ? leadResponse($d['requestId'],'storage_unavailable',false,null,true) : leadResponse($d['requestId'],'unknown',null);
    }
}
