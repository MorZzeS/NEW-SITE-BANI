<?php
declare(strict_types=1);
// Separate-process synthetic races only; never reads production config or calls MAX.
require dirname(__DIR__).'/private/admission.php';require dirname(__DIR__).'/private/notifier.php';require dirname(__DIR__).'/private/readiness.php';require __DIR__.'/fixtures.php';
if(getenv('SPACEWEB_TEST_DB_ACK')!=='ISOLATED_SYNTHETIC_DATABASE'){fwrite(STDERR,"SKIP: isolated DB opt-in required\n");exit(78);}
function raceDb():PDO{return operationDb(['db_dsn'=>getenv('SPACEWEB_TEST_DSN'),'db_user'=>getenv('SPACEWEB_TEST_USER'),'db_password'=>getenv('SPACEWEB_TEST_PASSWORD')]);}
$mode=$argv[1]??'';
if($mode==='child'){
 $kind=$argv[2];$request=$argv[3];$barrier=getenv('SPACEWEB_RACE_DIR').'/'.$argv[4];$record=getenv('SPACEWEB_RACE_DIR').'/'.$argv[5];$index=(int)$argv[6];$until=microtime(true)+15;
 while(!is_file($barrier)){if(microtime(true)>$until)exit(70);usleep(10000);}
 $db=raceDb();
 if($kind==='admit'){$d=syntheticLead((int)floor(microtime(true)*1000));$d['requestId']=$request;$c=['environment'=>'TEST','documents'=>syntheticDocuments(),'document_bundle_sha256'=>str_repeat('a',64)];$result=admitLead($db,$d,$c,hash('sha256',$request.'-'.$index,true));echo json_encode($result,JSON_THROW_ON_ERROR);}
 else{$worked=runOutbox($db,'TEST',static function(array $row)use($record):array{if(file_put_contents($record,$row['request_id']."\n",FILE_APPEND|LOCK_EX)===false)throw new RuntimeException('record_failed');usleep(200000);return ['state'=>'sent','code'=>null,'id'=>'fake-concurrent-receipt'];});echo $worked?'worked':'idle';}
 exit;
}
$db=raceDb();foreach(['leads','consent_journal','outbox','rate_buckets'] as $table)if((int)$db->query('SELECT COUNT(*) FROM '.$table)->fetchColumn()!==0)throw new RuntimeException('isolated_tables_must_be_empty');
$root=getenv('SPACEWEB_RACE_DIR');if(!is_string($root)||!is_dir($root))throw new RuntimeException('private_race_dir_required');
$prefix=$root.'/race-'.bin2hex(random_bytes(8));$barrier=$prefix.'.start';$record=$prefix.'.claims';$request='synthetic-race-'.bin2hex(random_bytes(12));$checks=0;
$run=static function(string $kind,int $count)use($barrier,$record,$request):array{
 if(is_file($barrier))unlink($barrier);$jobs=[];
 for($i=0;$i<$count;$i++){$args=[PHP_BINARY,'-n','-d','extension_dir=ext','-d','extension=mbstring','-d','extension=pdo_mysql',__FILE__,'child',$kind,$request,basename($barrier),basename($record),(string)$i];$pipes=[];$p=proc_open($args,[0=>['pipe','r'],1=>['pipe','w'],2=>['pipe','w']],$pipes,dirname(PHP_BINARY));if(!is_resource($p))throw new RuntimeException('child_start');fclose($pipes[0]);$jobs[]=[$p,$pipes];}
 file_put_contents($barrier,'start');$results=[];
 foreach($jobs as [$p,$pipes]){$out=stream_get_contents($pipes[1]);$err=stream_get_contents($pipes[2]);fclose($pipes[1]);fclose($pipes[2]);$code=proc_close($p);if($code!==0)throw new RuntimeException('child_failed_'.$code);$results[]=$out;}
 return $results;
};
try{
 $responses=$run('admit',8);$accepted=0;$receiptIds=[];
 foreach($responses as $raw){[$http,$body]=json_decode($raw,true,16,JSON_THROW_ON_ERROR);if(in_array($http,[200,202],true)){$accepted++;$receiptIds[]=$body['receipt']['receiptId'];}elseif($http!==503||$body['retryable']!==false&&$body['admitted']!==false)throw new RuntimeException('unexpected_admission_result');}
 if($accepted<1||count(array_unique($receiptIds))!==1)throw new RuntimeException('race_receipts');$checks++;
 foreach(['leads','consent_journal','outbox'] as $table){if((int)$db->query('SELECT COUNT(*) FROM '.$table)->fetchColumn()!==1)throw new RuntimeException('race_duplicate_'.$table);$checks++;}
 $workers=$run('worker',4);if(count(array_filter($workers,static fn(string $v):bool=>$v==='worked'))!==1)throw new RuntimeException('race_worker_claims');$checks++;
 $lines=file($record,FILE_IGNORE_NEW_LINES);if($lines!==[$request])throw new RuntimeException('race_adapter_calls');$checks++;
 $row=$db->query('SELECT state,next_part,delivery_ids FROM outbox')->fetch(PDO::FETCH_ASSOC);if($row['state']!=='sent'||(int)$row['next_part']!==1||json_decode($row['delivery_ids'],true)!==['fake-concurrent-receipt'])throw new RuntimeException('race_durable_progress');$checks++;
 echo "Separate-process MySQL5.7 races: $checks PASS; admissions=8; workers=4; durable lead/journal/outbox=1; adapter calls=1\n";
}finally{
 $q=$db->prepare("SELECT id FROM leads WHERE environment='TEST' AND request_id=?");$q->execute([$request]);$id=$q->fetchColumn();if($id!==false){foreach(['outbox','consent_journal'] as $table){$q=$db->prepare('DELETE FROM '.$table.' WHERE lead_id=?');$q->execute([$id]);}$q=$db->prepare("DELETE FROM leads WHERE id=? AND environment='TEST'");$q->execute([$id]);}
 for($i=0;$i<8;$i++){$q=$db->prepare("DELETE FROM rate_buckets WHERE environment='TEST' AND ip_hash=?");$q->execute([hash('sha256',$request.'-'.$i,true)]);}
 foreach([$barrier,$record] as $path)if(is_file($path))unlink($path);
}
