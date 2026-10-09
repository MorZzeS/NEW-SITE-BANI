<?php
declare(strict_types=1);
require dirname(__DIR__).'/private/readiness.php'; require dirname(__DIR__).'/private/ca.php';
$c=['enabled'=>true,'approved'=>true,'retention_approved'=>true,'ru_storage_confirmed'=>true,'ru_backups_confirmed'=>true,'document_archive_contract_verified'=>true,'environment'=>'TEST','consent_version'=>'synthetic','policy_version'=>'synthetic','origins'=>['https://test.invalid']];
$checks=0; if(!readiness($c)) throw new RuntimeException('gate_good'); $checks++;
foreach (['enabled','approved','retention_approved','ru_storage_confirmed','ru_backups_confirmed','document_archive_contract_verified'] as $k) {$bad=$c;$bad[$k]=false;if(readiness($bad))throw new RuntimeException('gate_missing');$checks++;}
if(operationReady($c,'backup'))throw new RuntimeException('backup_default');$checks++;
$c+=['backup_enabled'=>true,'backup_approved'=>true,'dry_run'=>false];if(!operationReady($c,'backup'))throw new RuntimeException('backup_explicit');$checks++;
try {retentionDurations($c);throw new LogicException('empty_durations');} catch (RuntimeException) {$checks++;}
$c['retention_seconds']=array_fill_keys(['leads','consent_journal','outbox','rate_buckets','backups'],12345); // Synthetic fixture, never operational defaults.
if(count(retentionDurations($c))!==5)throw new RuntimeException('durations');$checks++;
$c['retention_seconds']['leads']=0;try{retentionDurations($c);throw new LogicException('zero_duration');}catch(RuntimeException){$checks++;}
$official=dirname(__DIR__).'/private/certs/mincifry-ca.pem';
try{combinedPublicCa(['system_ca_bundle'=>$official]);throw new LogicException('root_only');}catch(RuntimeException){$checks++;}
$tmp=tempnam(sys_get_temp_dir(),'spaceweb-ca-test-');
try {
 foreach([file_get_contents($official),file_get_contents($official).file_get_contents($official),'-----BEGIN CERTIFICATE-----\ninvalid\n-----END CERTIFICATE-----','not a certificate'] as $bad){file_put_contents($tmp,$bad);try{combinedPublicCa(['system_ca_bundle'=>$tmp]);throw new LogicException('base_should_fail');}catch(RuntimeException){$checks++;}}
 // Generate synthetic self-signed certificate only; not a trust-chain or real TLS check.
 $conf=tempnam(sys_get_temp_dir(),'spaceweb-openssl-test-');file_put_contents($conf,"[req]\ndistinguished_name=dn\n[dn]\n");$options=['config'=>$conf,'private_key_bits'=>2048];try{$key=openssl_pkey_new($options);$csr=openssl_csr_new(['commonName'=>'synthetic.invalid'],$key,$options);$cert=openssl_csr_sign($csr,null,$key,1,$options);}finally{unlink($conf);}openssl_x509_export($cert,$pem);
 file_put_contents($tmp,$pem);$combined=combinedPublicCa(['system_ca_bundle'=>$tmp]);if(count(pemCertificates($combined))!==2)throw new RuntimeException('ca_append');$checks++;
 file_put_contents($tmp,$pem.'garbage');try{combinedPublicCa(['system_ca_bundle'=>$tmp]);throw new LogicException('garbage_should_fail');}catch(RuntimeException){$checks++;}
}finally{unlink($tmp);}
echo "Readiness/operations/CA offline checks: $checks\n";