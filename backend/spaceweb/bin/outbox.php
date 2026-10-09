<?php
declare(strict_types=1);
if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }
require dirname(__DIR__).'/private/notifier.php';
require dirname(__DIR__).'/private/readiness.php';
try {
    $path=dirname(__DIR__).'/private/config.php';
    if (!is_file($path)) throw new RuntimeException('disabled');
    $c=require $path;
    if (!readiness($c) || ($c['dry_run'] ?? true)!==false ||
        ($c['notify_enabled'] ?? false)!==true || ($c['environment'] ?? '')!=='PRODUCTION' || ($c['max_tls_public_ca_verified'] ?? false)!==true) throw new RuntimeException('disabled');
    $lock=fopen(dirname(__DIR__).'/private/outbox.lock','c');
    if (!$lock || !flock($lock,LOCK_EX|LOCK_NB)) throw new RuntimeException('locked');
    $db=new PDO($c['db_dsn'],$c['db_user'],$c['db_password'],[PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION,PDO::ATTR_EMULATE_PREPARES=>false]);
    $db->exec("SET time_zone = '+00:00'");
    for ($i=0;$i<20;$i++) if (!runOutbox($db,'PRODUCTION',fn(array $lead): array=>notifyMax($lead,$c))) break;
    flock($lock,LOCK_UN); fclose($lock);
} catch (Throwable) { fwrite(STDERR,"outbox_unconfirmed_or_disabled\n"); exit(78); }
