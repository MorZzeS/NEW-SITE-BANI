<?php
declare(strict_types=1);
if (PHP_SAPI!=='cli') { http_response_code(404); exit; }
require dirname(__DIR__).'/private/readiness.php'; require dirname(__DIR__).'/private/backup-format.php';
$path=null; $db=null;
try {
 $c=privateConfig(); if (!operationReady($c,'backup')) throw new RuntimeException('disabled'); retentionDurations($c); $key=backupKey($c);
 $dir=realpath($c['backup_dir']??''); $root=realpath(dirname(__DIR__).'/public_html');
 if (!$dir || !$root || str_starts_with($dir.DIRECTORY_SEPARATOR,$root.DIRECTORY_SEPARATOR) || !is_writable($dir)) throw new RuntimeException('private_destination_required');
 $lock=fopen(__DIR__.'/../private/backup.lock','c'); if (!$lock || !flock($lock,LOCK_EX|LOCK_NB)) throw new RuntimeException('locked');
 $finalName=backupFilename($c['environment'],gmdate('Ymd-His'),bin2hex(random_bytes(8)));
 $path=$dir.'/'.$finalName.'.partial'; $f=fopen($path,'x'); if (!$f || !chmod($path,0600)) throw new RuntimeException('private_file_required');
 $db=operationDb($c); $db->exec('SET TRANSACTION ISOLATION LEVEL REPEATABLE READ'); $db->beginTransaction();
 $tables=['leads','consent_journal','outbox','rate_buckets']; $counts=[];
 writeBackupRecord($f,['format'=>'spaceweb-backup-v1','environment'=>$c['environment'],'at'=>gmdate('c')],$key);
 foreach ($tables as $table) {
  $sql=match($table) {'leads'=>'SELECT * FROM leads WHERE environment=?','rate_buckets'=>'SELECT * FROM rate_buckets WHERE environment=?',default=>'SELECT t.* FROM '.$table.' t JOIN leads l ON l.id=t.lead_id WHERE l.environment=?'};
  $q=$db->prepare($sql); $q->execute([$c['environment']]); $counts[$table]=0;
  while ($row=$q->fetch(PDO::FETCH_ASSOC)) { // Binary hashes are base64, not lossy UTF-8 conversion.
   foreach (['payload_hash','ip_hash'] as $column) if (isset($row[$column])) $row[$column]=base64_encode($row[$column]);
   $line=sealBackup(['table'=>$table,'row'=>$row],$key); if (fwrite($f,$line)!==strlen($line)) throw new RuntimeException('write_failed'); $counts[$table]++;
  }
 }
 $line=sealBackup(['completed'=>true,'counts'=>$counts],$key); if(fwrite($f,$line)!==strlen($line)||!fflush($f)) throw new RuntimeException('write_failed');
 $db->commit(); fclose($f);
 // Verify every AEAD record and count before finalising; no plaintext file is emitted.
 $verify=fopen($path,'r'); if(!$verify)throw new RuntimeException('verification_failed');
 try { validateBackup($verify,$key,$c['environment']); } finally { fclose($verify); }
 if (!rename($path,$dir.'/'.$finalName)) throw new RuntimeException('finalise_failed'); $path=null; echo "backup_verified\n";
} catch (Throwable) { if ($db instanceof PDO && $db->inTransaction()) $db->rollBack(); if ($path && is_file($path)) unlink($path); fwrite(STDERR,"backup_disabled_or_unconfirmed\n"); exit(78); }
