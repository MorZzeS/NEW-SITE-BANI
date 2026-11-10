<?php
declare(strict_types=1);
// Explicit EMPTY isolated synthetic MySQL only. No private config or network adapter.
require dirname(__DIR__).'/private/notifier.php'; require dirname(__DIR__).'/private/admission.php'; require dirname(__DIR__).'/private/validation.php'; require __DIR__.'/fixtures.php';
require dirname(__DIR__).'/private/readiness.php';
if (getenv('SPACEWEB_TEST_DB_ACK')!=='ISOLATED_SYNTHETIC_DATABASE') { fwrite(STDERR,"SKIP: isolated DB opt-in required\n"); exit(78); }
$db=operationDb(['db_dsn'=>getenv('SPACEWEB_TEST_DSN'),'db_user'=>getenv('SPACEWEB_TEST_USER'),'db_password'=>getenv('SPACEWEB_TEST_PASSWORD')]);
foreach (['leads','consent_journal','outbox','rate_buckets'] as $table) if ((int)$db->query('SELECT COUNT(*) FROM '.$table)->fetchColumn()!==0) {fwrite(STDERR,"REFUSED: isolated tables must be empty\n");exit(78);}
$docs=syntheticDocuments();
foreach($db->query('SELECT kind,version,text,sha256 FROM documents')->fetchAll(PDO::FETCH_ASSOC) as $r) if(!isset($docs[$r['kind']]) || $docs[$r['kind']]!==array_intersect_key($r,array_flip(['version','text','sha256']))) {fwrite(STDERR,"REFUSED: non-fixture archive\n");exit(78);}
$c=['environment'=>'TEST','documents'=>$docs,'document_bundle_sha256'=>str_repeat('a',64),'origins'=>['https://test.invalid']];$ids=[];$ips=[];$checks=0;
$check=static function(bool $ok,string $name) use(&$checks):void {if(!$ok)throw new RuntimeException($name);$checks++;};
$new=static function()use(&$ids):array{$d=syntheticLead((int)floor(microtime(true)*1000));$d['requestId']='synthetic-'.bin2hex(random_bytes(16));$ids[]=$d['requestId'];return $d;};
$ip=static function()use(&$ips):string{$h=random_bytes(32);$ips[]=$h;return $h;};
$state=static function(string $request)use($db):array{$q=$db->prepare('SELECT o.* FROM outbox o JOIN leads l ON l.id=o.lead_id WHERE l.request_id=?');$q->execute([$request]);return $q->fetch(PDO::FETCH_ASSOC);};
$set=static function(string $request,string $sql)use($db):void{$q=$db->prepare('UPDATE outbox o JOIN leads l ON l.id=o.lead_id SET '.$sql.' WHERE l.request_id=?');$q->execute([$request]);};
try {
 $d=$new();$d['configurationDetails']=syntheticConfiguration($d);$check(validLead($d,$c,(int)floor(microtime(true)*1000)),'valid_fixture');$hash=$ip();
 [$http,$first]=admitLead($db,$d,$c,$hash);$check($http===202&&$first['admitted']===true&&isset($first['receipt']),'atomic_accept');
 [$http,$again]=admitLead($db,$d,$c,$hash);$check($http===202&&$again['receipt']===$first['receipt'],'stable_receipt');
 $changed=$d;$changed['configurationDetails']['options'][0]['quantity']=4;[$http,$conflict]=admitLead($db,$changed,$c,$hash);$check($http===409&&$conflict['status']==='conflict'&&$conflict['retryable']===false,'business_conflict');
 $q=$db->prepare('SELECT business_json FROM leads WHERE request_id=?');$q->execute([$d['requestId']]);$stored=json_decode($q->fetchColumn(),true,16,JSON_THROW_ON_ERROR);$check($stored['configurationDetails']===$d['configurationDetails'],'full_snapshot');
 $check((int)$db->query('SELECT COUNT(*) FROM leads')->fetchColumn()===1&&(int)$db->query('SELECT COUNT(*) FROM consent_journal')->fetchColumn()===1&&(int)$db->query('SELECT COUNT(*) FROM outbox')->fetchColumn()===1,'one_atomic_triple');
 runOutbox($db,'TEST',static fn(array $lead):array=>['state'=>'sent','code'=>null,'id'=>'fake-receipt']);$check($state($d['requestId'])['state']==='sent','sent_state');
 [$http,$sent]=admitLead($db,$d,$c,$hash);$check($http===200&&$sent['status']==='sent'&&$sent['receipt']===$first['receipt'],'sent_duplicate');
 $rollback=$new();[$http,$result]=admitLead($db,$rollback,$c,$ip(),static function(string $stage):void{if($stage==='before_commit')throw new RuntimeException('synthetic');});$check($http===503&&$result['admitted']===false&&$result['retryable']===true,'definitive_rollback');
 $q=$db->prepare('SELECT COUNT(*) FROM leads WHERE request_id=?');$q->execute([$rollback['requestId']]);$check((int)$q->fetchColumn()===0,'rollback_no_lead');
 $uncertain=$new();$uncertainIp=$ip();[$http,$result]=admitLead($db,$uncertain,$c,$uncertainIp,static function(string $stage):void{if($stage==='after_commit')throw new RuntimeException('synthetic');});$check($http===503&&$result['admitted']===null&&!$result['retryable'],'uncertain_commit_no_retry');
 [$http,$result]=admitLead($db,$uncertain,$c,$uncertainIp);$check($http===202&&$result['admitted']===true,'reconcile_committed');$set($uncertain['requestId'],"o.state='dead'");
 $badDocs=$c;$badDocs['documents']['consent']['text'].='changed';$badDocs['documents']['consent']['sha256']=hash('sha256',$badDocs['documents']['consent']['text']);$reuse=$new();[$http,$result]=admitLead($db,$reuse,$badDocs,$ip());$check($http===503&&$result['admitted']===false,'version_reuse_rejected');
 try{$db->exec("UPDATE documents SET text='changed' WHERE kind='consent'");throw new LogicException('immutable_update_accepted');}catch(PDOException){$checks++;}
 try{$db->exec("DELETE FROM documents WHERE kind='checkbox'");throw new LogicException('immutable_delete_accepted');}catch(PDOException){$checks++;}
 foreach(['retry','unknown','dead'] as $expected){$lead=$new();admitLead($db,$lead,$c,$ip());$calls=0;runOutbox($db,'TEST',static function(array $lead)use(&$calls,$expected):array{$calls++;return ['state'=>$expected,'code'=>'fake','id'=>null];});$check($calls===1&&$state($lead['requestId'])['state']===$expected,'outcome_'.$expected);if($expected==='retry'){$set($lead['requestId'],"o.attempts=2,o.available_at=UTC_TIMESTAMP(6)");runOutbox($db,'TEST',static fn():array=>['state'=>'retry','code'=>'fake','id'=>null]);$check($state($lead['requestId'])['state']==='dead','retry_exhaustion');}}
 $expired=$new();admitLead($db,$expired,$c,$ip());$set($expired['requestId'],"o.state='processing',o.lease_until=DATE_SUB(UTC_TIMESTAMP(6),INTERVAL 1 SECOND)");$calls=0;runOutbox($db,'TEST',static function()use(&$calls):array{$calls++;return ['state'=>'sent','code'=>null,'id'=>'forbidden'];});$check($calls===0&&$state($expired['requestId'])['state']==='unknown','expired_claim_quarantine');
 $multi=$new();$multi['comment']=str_repeat('Ж',1500);$multi['configuration']=str_repeat('Я',2000);admitLead($db,$multi,$c,$ip());$expectedParts=leadMessageParts($multi);$check(count($expectedParts)>1,'multipart_fixture');$received=[];
 runOutbox($db,'TEST',static function(array $row)use(&$received):array{$received[]=$row['notification_text'];return ['state'=>'sent','code'=>null,'id'=>'fake-part-1'];});$r=$state($multi['requestId']);$check($r['state']==='pending'&&(int)$r['next_part']===1,'part_progress_committed');
 runOutbox($db,'TEST',static function(array $row)use(&$received):array{$received[]=$row['notification_text'];return ['state'=>'unknown','code'=>'synthetic_timeout','id'=>null];});$check($state($multi['requestId'])['state']==='unknown'&&$received===array_slice($expectedParts,0,2),'multipart_unknown_stops');
 $calls=0;runOutbox($db,'TEST',static function()use(&$calls):array{$calls++;return ['state'=>'sent','code'=>null,'id'=>'forbidden'];});$check($calls===0,'no_unknown_resend');
 $rateIp=$ip();for($i=0;$i<6;$i++){[$http,$result]=admitLead($db,$new(),$c,$rateIp);$check($i<5?$http===202:($http===429&&$result['admitted']===false&&$result['retryable']===true),'durable_rate_'.$i);}
 echo "Synthetic MySQL admission/outbox integration checks: $checks PASS\n";
} finally {
 if($db->inTransaction())$db->rollBack();
 foreach($ids as $request){$q=$db->prepare("SELECT id FROM leads WHERE environment='TEST' AND request_id=?");$q->execute([$request]);$id=$q->fetchColumn();if($id!==false){foreach(['outbox','consent_journal'] as $table){$q=$db->prepare('DELETE FROM '.$table.' WHERE lead_id=?');$q->execute([$id]);}$q=$db->prepare("DELETE FROM leads WHERE id=? AND environment='TEST'");$q->execute([$id]);}}
 foreach($ips as $hash){$q=$db->prepare("DELETE FROM rate_buckets WHERE environment='TEST' AND ip_hash=?");$q->execute([$hash]);}
 // The three immutable synthetic document versions intentionally remain for repeat verification.
}
