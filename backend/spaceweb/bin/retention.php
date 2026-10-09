<?php
declare(strict_types=1);
if (PHP_SAPI!=='cli') { http_response_code(404); exit; }
require dirname(__DIR__).'/private/readiness.php'; require dirname(__DIR__).'/private/backup-format.php';
$db=null;
try {
 $c=privateConfig(); if (!readiness($c) || ($c['dry_run']??true)!==false || ($c['retention_enabled']??false)!==true || ($c['retention_execution_approved']??false)!==true) throw new RuntimeException('disabled');
 $durations=retentionDurations($c); $db=operationDb($c); $db->beginTransaction();
 foreach (['consent_journal'=>'recorded_at','outbox'=>'created_at'] as $table=>$time) {
  $safe=$table==='outbox' ? " AND t.state IN ('sent','dead')" : " AND NOT EXISTS(SELECT 1 FROM outbox o WHERE o.lead_id=t.lead_id AND o.state IN ('pending','processing','retry','unknown'))";
  $q=$db->prepare('DELETE t FROM '.$table.' t JOIN leads l ON l.id=t.lead_id WHERE l.environment=? AND t.'.$time.'<DATE_SUB(UTC_TIMESTAMP(6),INTERVAL ? SECOND)'.$safe); $q->execute([$c['environment'],$durations[$table]]);
 }
 $q=$db->prepare('DELETE FROM leads WHERE environment=? AND received_at<DATE_SUB(UTC_TIMESTAMP(6),INTERVAL ? SECOND) AND NOT EXISTS(SELECT 1 FROM consent_journal c WHERE c.lead_id=leads.id) AND NOT EXISTS(SELECT 1 FROM outbox o WHERE o.lead_id=leads.id)'); $q->execute([$c['environment'],$durations['leads']]);
 $q=$db->prepare('DELETE FROM rate_buckets WHERE environment=? AND bucket<FLOOR((UNIX_TIMESTAMP()-?)/600)'); $q->execute([$c['environment'],$durations['rate_buckets']]); $db->commit();
 // Backup cleanup is separately enabled and approved; only generated regular files, never symlinks.
 if (($c['backup_cleanup_approved']??false)===true) {
  $dir=realpath($c['backup_dir']??''); if (!$dir || str_starts_with($dir.DIRECTORY_SEPARATOR,realpath(dirname(__DIR__).'/public_html').DIRECTORY_SEPARATOR)) throw new RuntimeException('private_destination_required');
  foreach (new DirectoryIterator($dir) as $file) if (!$file->isLink() && $file->isFile() && backupBelongsTo($file->getFilename(),$c['environment']) && $file->getMTime()<time()-$durations['backups']) { if (!unlink($file->getPathname())) throw new RuntimeException('cleanup_failed'); }
 }
 echo "retention_completed\n";
} catch (Throwable) { if ($db instanceof PDO && $db->inTransaction()) $db->rollBack(); fwrite(STDERR,"retention_disabled_or_unconfirmed\n"); exit(78); }
