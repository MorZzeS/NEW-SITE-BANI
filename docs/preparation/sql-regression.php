<?php
declare(strict_types=1);
if(getenv('SPACEWEB_TEST_DB_ACK')!=='ISOLATED_SYNTHETIC_DATABASE'||getenv('SPACEWEB_TEST_DSN')!=='mysql:host=127.0.0.1;port=18306;dbname=banger_unified_tests;charset=utf8mb4')exit(78);
require $argv[1].'/private/notifier.php';require $argv[1].'/private/backup-format.php';
$db=new PDO(getenv('SPACEWEB_TEST_DSN'),getenv('SPACEWEB_TEST_USER'),getenv('SPACEWEB_TEST_PASSWORD'),[PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION,PDO::ATTR_EMULATE_PREPARES=>false]);$db->exec("SET time_zone='+00:00'");
$counts=static function()use($db):array{$r=[];foreach(BACKUP_TABLES as $t)$r[$t]=(int)$db->query('SELECT COUNT(*) FROM '.$t)->fetchColumn();return $r;};
foreach($counts() as $n)if($n!==0)exit(78);
$checks=[];$ids=[];$ip=random_bytes(32);$request=bin2hex(random_bytes(16));$hash=hash('sha256',$request,true);
$must=static function(bool $ok,string $name)use(&$checks):void{if(!$ok)throw new RuntimeException($name);$checks[]=$name;};
$insert=static function()use($db,$request,$hash,&$ids):string{
$q=$db->prepare("INSERT INTO leads(environment,request_id,payload_hash,name,phone,model,comment,page)VALUES('TEST',?,?, 'Synthetic','+79000000000','','','https://test.invalid/form')");$q->execute([$request,$hash]);$id=$db->lastInsertId();$ids[]=$id;
$q=$db->prepare("INSERT INTO consent_journal(lead_id,consent_version,policy_version,request_id,page,client_created_at,client_started_at_ms,assertion)VALUES(?,'synthetic-consent','synthetic-policy',?,'https://test.invalid/form','2026-10-09T00:00:00.000Z',1800000000000,'client_asserted_v2')");$q->execute([$id,$request]);$q=$db->prepare('INSERT INTO outbox(lead_id)VALUES(?)');$q->execute([$id]);return $id;};
try{
$db->beginTransaction();$insert();$db->rollBack();$must(array_sum($counts())===0,'atomic_rollback');
$db->beginTransaction();$id=$insert();$db->commit();$c=$counts();$must($c['leads']===1&&$c['consent_journal']===1&&$c['outbox']===1,'atomic_commit_three_tables');
try{$q=$db->prepare("INSERT INTO leads(environment,request_id,payload_hash,name,phone,model,comment,page)VALUES('TEST',?,?,'Synthetic','+79000000000','','','https://test.invalid/form')");$q->execute([$request,$hash]);throw new RuntimeException('duplicate_not_rejected');}catch(PDOException $e){$must($e->getCode()==='23000','request_unique');}
try{$q=$db->prepare('INSERT INTO outbox(lead_id)VALUES(?)');$q->execute([$id]);throw new RuntimeException('outbox_duplicate_not_rejected');}catch(PDOException $e){$must($e->getCode()==='23000','outbox_unique');}
try{$db->exec('INSERT INTO outbox(lead_id)VALUES(999999999)');throw new RuntimeException('foreign_key_not_rejected');}catch(PDOException $e){$must($e->getCode()==='23000','foreign_key');}
$q=$db->prepare("INSERT INTO rate_buckets(environment,ip_hash,bucket,hits)VALUES('TEST',?,1,1)ON DUPLICATE KEY UPDATE hits=hits+1");for($i=0;$i<6;$i++)$q->execute([$ip]);$q=$db->prepare("SELECT hits FROM rate_buckets WHERE environment='TEST' AND  ip_hash=? AND  bucket=1");$q->execute([$ip]);$must((int)$q->fetchColumn()===6,'durable_rate_upsert');
$q=$db->prepare("UPDATE outbox SET state='processing',lease_until=DATE_SUB(UTC_TIMESTAMP(6),INTERVAL 10 SECOND)WHERE lead_id=?");$q->execute([$id]);$called=0;$more=runOutbox($db,'TEST',function()use(&$called):array{$called++;throw new RuntimeException('must_not_notify');});$q=$db->prepare('SELECT state FROM outbox WHERE lead_id=?');$q->execute([$id]);$must(!$more&&$called===0&&$q->fetchColumn()==='unknown','expired_claim_quarantined');
$key=random_bytes(32);$stream=fopen('php://memory','w+');writeBackupRecord($stream,['format'=>'spaceweb-backup-v1','environment'=>'TEST','at'=>gmdate('c')],$key);$snapshot=[];$totals=[];
foreach(BACKUP_TABLES as $t){$rows=$db->query('SELECT * FROM '.$t)->fetchAll(PDO::FETCH_ASSOC);$totals[$t]=count($rows);foreach($rows as $row){foreach(['payload_hash','ip_hash']as$b)if(isset($row[$b]))$row[$b]=base64_encode($row[$b]);$snapshot[]=['table'=>$t,'row'=>$row];writeBackupRecord($stream,['table'=>$t,'row'=>$row],$key);}}
writeBackupRecord($stream,['completed'=>true,'counts'=>$totals],$key);rewind($stream);$must(validateBackup($stream,$key,'TEST')===$totals,'backup_actual_sql_rows_valid');
$db->beginTransaction();$q=$db->prepare('DELETE FROM outbox WHERE lead_id=?');$q->execute([$id]);$q=$db->prepare('DELETE FROM consent_journal WHERE lead_id=?');$q->execute([$id]);$q=$db->prepare('DELETE FROM leads WHERE id=?');$q->execute([$id]);$q=$db->prepare("DELETE FROM rate_buckets WHERE environment='TEST' AND  ip_hash=?");$q->execute([$ip]);
rewind($stream);openBackup(fgets($stream),$key);while(($line=fgets($stream))!==false){$r=openBackup($line,$key);if(isset($r['completed']))break;$row=$r['row'];foreach(['payload_hash','ip_hash']as$b)if(isset($row[$b]))$row[$b]=base64_decode($row[$b],true);$columns=array_keys($row);$q=$db->prepare('INSERT INTO '.$r['table'].'(`'.implode('`,`',$columns).'`)VALUES('.implode(',',array_fill(0,count($columns),'?')).')');$q->execute(array_values($row));}
$must($counts()===$totals,'synthetic_snapshot_restore');$db->rollBack();fclose($stream);
echo json_encode(['result'=>'PASS','mysql'=>'8.4.11','checks'=>$checks,'externalCalls'=>0,'scope'=>'Isolated synthetic SQL and memory snapshot; not operational backup/hosting/MAX/API proof'],JSON_PRETTY_PRINT)."\n";
}catch(Throwable $e){if($db->inTransaction())$db->rollBack();fwrite(STDERR,'SQL regression failed: '.$e->getCode().' '.str_replace(getenv('SPACEWEB_TEST_PASSWORD'),'[redacted]',$e->getMessage())."\n");$failed=true;}finally{if($db->inTransaction())$db->rollBack();foreach(array_unique($ids)as$ownedId){foreach(['outbox','consent_journal']as$t){$q=$db->prepare('DELETE FROM '.$t.' WHERE lead_id=?');$q->execute([$ownedId]);}$q=$db->prepare("DELETE FROM leads WHERE id=? AND  environment='TEST'");$q->execute([$ownedId]);}$q=$db->prepare("DELETE FROM rate_buckets WHERE environment='TEST' AND  ip_hash=? AND  bucket=1");$q->execute([$ip]);}

if(!empty($failed))exit(1);
