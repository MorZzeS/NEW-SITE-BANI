<?php
declare(strict_types=1);
const BACKUP_TABLES=['documents','leads','consent_journal','outbox','rate_buckets'];
function backupKey(array $c): string {
 $key=base64_decode($c['backup_key_base64']??'',true);if($key===false||strlen($key)!==32||!function_exists('openssl_encrypt'))throw new RuntimeException('backup_key_missing');return $key;
}
function backupAad(string $snapshot,int $sequence): string {
 if(!preg_match('/^[a-f0-9]{64}$/D',$snapshot)||$sequence<0)throw new RuntimeException('record_context_invalid');
 return 'spaceweb-backup-v3:'.$snapshot.':'.$sequence;
}
function sealBackup(array $row,string $key,string $snapshot,int $sequence): string {
 $iv=random_bytes(12);$tag='';$plain=json_encode($row,JSON_THROW_ON_ERROR);
 $cipher=openssl_encrypt($plain,'aes-256-gcm',$key,OPENSSL_RAW_DATA,$iv,$tag,backupAad($snapshot,$sequence));if($cipher===false)throw new RuntimeException('encryption_failed');
 return json_encode(['snapshot'=>$snapshot,'sequence'=>$sequence,'iv'=>base64_encode($iv),'tag'=>base64_encode($tag),'cipher'=>base64_encode($cipher)],JSON_THROW_ON_ERROR)."\n";
}
function openBackup(string $line,string $key,string $snapshot,int $sequence): array {
 $r=json_decode($line,true,16,JSON_THROW_ON_ERROR);
 if(!is_array($r)||array_keys($r)!==['snapshot','sequence','iv','tag','cipher']||$r['snapshot']!==$snapshot||$r['sequence']!==$sequence)throw new RuntimeException('record_context_invalid');
 foreach(['iv','tag','cipher'] as $k)if(!is_string($r[$k]))throw new RuntimeException('record_invalid');
 $iv=base64_decode($r['iv'],true);$tag=base64_decode($r['tag'],true);$cipher=base64_decode($r['cipher'],true);
 if($iv===false||strlen($iv)!==12||$tag===false||strlen($tag)!==16||$cipher===false)throw new RuntimeException('record_invalid');
 $plain=openssl_decrypt($cipher,'aes-256-gcm',$key,OPENSSL_RAW_DATA,$iv,$tag,backupAad($snapshot,$sequence));if($plain===false)throw new RuntimeException('verification_failed');
 $row=json_decode($plain,true,32,JSON_THROW_ON_ERROR);if(!is_array($row))throw new RuntimeException('record_invalid');return $row;
}
function writeBackupRecord($stream,array $record,string $key,string $snapshot,int $sequence,?callable $writer=null): void {
 $line=sealBackup($record,$key,$snapshot,$sequence);$written=$writer?$writer($stream,$line):fwrite($stream,$line);
 if($written!==strlen($line))throw new RuntimeException('write_failed');
}
function validateBackup($stream,string $key,string $environment,string $expectedSnapshot): array {
 if(!in_array($environment,['TEST','PRODUCTION'],true))throw new RuntimeException('environment_invalid');
 $line=fgets($stream);if($line===false)throw new RuntimeException('metadata_missing');$snapshot=$expectedSnapshot;
 $sequence=0;$meta=openBackup($line,$key,$snapshot,$sequence++);
 if(array_keys($meta)!==['format','environment','at','snapshot']||$meta['format']!=='spaceweb-backup-v3'||$meta['environment']!==$environment||$meta['snapshot']!==$snapshot||!is_string($meta['at'])||!preg_match('/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+00:00$/D',$meta['at']))throw new RuntimeException('metadata_invalid');
 $counts=array_fill_keys(BACKUP_TABLES,0);
 while(($line=fgets($stream))!==false){
  $r=openBackup($line,$key,$snapshot,$sequence++);
  if(array_keys($r)===['completed','counts']){
   if($r['completed']!==true||$r['counts']!==$counts||fgets($stream)!==false||!feof($stream))throw new RuntimeException('footer_invalid');return $counts;
  }
  if(array_keys($r)!==['table','row']||!is_string($r['table'])||!in_array($r['table'],BACKUP_TABLES,true)||!is_array($r['row'])||!$r['row']||array_is_list($r['row']))throw new RuntimeException('row_invalid');
  $columns=match($r['table']) {
   'documents'=>['kind','version','text','sha256'],
   'leads'=>['id','environment','request_id','payload_hash','name','phone','model','comment','page','business_json','received_at'],
   'consent_journal'=>['lead_id','consent_version','policy_version','checkbox_version','consent_sha256','checkbox_sha256','policy_sha256','bundle_sha256','receipt_id','receipt_json','request_id','page','client_created_at','client_started_at_ms','assertion','recorded_at'],
   'outbox'=>['id','lead_id','created_at','state','attempts','message_parts','next_part','delivery_ids','available_at','lease_until','delivery_id','error_code'],
   'rate_buckets'=>['environment','ip_hash','bucket','hits']
  };
  $keys=array_keys($r['row']);sort($keys);sort($columns);if($keys!==$columns)throw new RuntimeException('row_columns_invalid');
  foreach($r['row'] as $v)if(!is_string($v)&&!is_int($v)&&$v!==null)throw new RuntimeException('row_value_invalid');
  foreach(['payload_hash','ip_hash'] as $binary)if(isset($r['row'][$binary])){$decoded=base64_decode($r['row'][$binary],true);if($decoded===false||strlen($decoded)!==32)throw new RuntimeException('row_binary_invalid');}
  if(isset($r['row']['environment'])&&$r['row']['environment']!==$environment)throw new RuntimeException('row_environment_invalid');
  $counts[$r['table']]++;
 }
 throw new RuntimeException('footer_missing');
}
function backupFilename(string $environment,string $timestamp,string $nonce): string {
 if(!in_array($environment,['TEST','PRODUCTION'],true)||!preg_match('/^\d{8}-\d{6}$/D',$timestamp)||!preg_match('/^[a-f0-9]{16}$/D',$nonce))throw new RuntimeException('filename_invalid');
 return 'spaceweb-'.$environment.'-'.$timestamp.'-'.$nonce.'.jsonl.enc';
}
function backupBelongsTo(string $filename,string $environment): bool {
 return in_array($environment,['TEST','PRODUCTION'],true)&&preg_match('/^spaceweb-'.preg_quote($environment,'/').'-\d{8}-\d{6}-[a-f0-9]{16}\.jsonl\.enc$/D',$filename)===1;
}
