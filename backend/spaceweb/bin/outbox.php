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
    maxAdapterConfiguration($c);
    $lock=fopen(dirname(__DIR__).'/private/outbox.lock','c');
    if (!$lock || !flock($lock,LOCK_EX|LOCK_NB)) throw new RuntimeException('locked');
    $db=operationDb($c);
    for ($i=0;$i<20;$i++) {
        if (!runOutbox($db,'PRODUCTION',fn(array $lead): array=>notifyMax($lead,$c))) break;
        usleep(600000); // MAX: at most two messages/second to one recipient.
    }
    flock($lock,LOCK_UN); fclose($lock);
} catch (Throwable) { fwrite(STDERR,"outbox_unconfirmed_or_disabled\n"); exit(78); }
