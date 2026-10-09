<?php
declare(strict_types=1);
function readiness(array $c): bool {
 foreach (['enabled','approved','retention_approved','ru_storage_confirmed','ru_backups_confirmed','document_archive_contract_verified'] as $key) if (($c[$key]??false)!==true) return false;
 return in_array($c['environment']??'', ['TEST','PRODUCTION'],true) && is_string($c['consent_version']??null) && $c['consent_version']!=='' && is_string($c['policy_version']??null) && $c['policy_version']!=='' && is_array($c['origins']??null) && count($c['origins'])>0;
}
function operationReady(array $c, string $operation): bool {
 return readiness($c) && ($c['dry_run']??true)===false && ($c[$operation.'_enabled']??false)===true && ($c[$operation.'_approved']??false)===true;
}
function retentionDurations(array $c): array {
 $durations=$c['retention_seconds']??[];
 foreach (['leads','consent_journal','outbox','rate_buckets','backups'] as $table) if (!is_int($durations[$table]??null) || $durations[$table]<1 || $durations[$table]>2147483647) throw new RuntimeException('retention_not_approved');
 return $durations;
}
function privateConfig(): array {
 $path=__DIR__.'/config.php'; if (!is_file($path)) throw new RuntimeException('disabled');
 $c=require $path; if (!is_array($c)) throw new RuntimeException('disabled'); return $c;
}
function operationDb(array $c): PDO {
 $db=new PDO($c['db_dsn'],$c['db_user'],$c['db_password'],[PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION,PDO::ATTR_EMULATE_PREPARES=>false]); $db->exec("SET time_zone = '+00:00'"); return $db;
}
