<?php
declare(strict_types=1);
const OFFICIAL_CA_PIN='d26d2d0231b7c39f92cc738512ba54103519e4405d68b5bd703e9788ca8ecf31';
function pemCertificates(string $pem): array {
 $pins=[];
 // Permit only whitespace and conventional bundle comments outside certificates.
 $remaining=preg_replace_callback('/-----BEGIN CERTIFICATE-----\s*([A-Za-z0-9+\/=\s]+)-----END CERTIFICATE-----/',function(array $m) use (&$pins): string {
  $der=base64_decode(preg_replace('/\s/','',$m[1]),true);
  if ($der===false || !openssl_x509_read($m[0])) throw new RuntimeException('ca_invalid');
  $pins[]=hash('sha256',$der); return '';
 },$pem);
 $remaining=preg_replace('/^\s*#[^\r\n]*$/m','',$remaining??'invalid');
 if (!$pins || trim($remaining)!=='') throw new RuntimeException('ca_invalid');
 return $pins;
}
function officialCaFingerprint(string $pem): string {
 $pins=pemCertificates($pem); if(count($pins)!==1)throw new RuntimeException('ca_invalid'); return $pins[0];
}
function combinedPublicCa(array $c): string {
 $standard=$c['system_ca_bundle']??'';
 if (!is_string($standard) || !is_file($standard)) throw new RuntimeException('system_ca_missing');
 $base=file_get_contents($standard);$extra=file_get_contents(__DIR__.'/certs/mincifry-ca.pem');
 if ($base===false || $extra===false || officialCaFingerprint($extra)!==OFFICIAL_CA_PIN)throw new RuntimeException('ca_unverified');
 $pins=pemCertificates($base);
 if (count(array_filter($pins,static fn(string $pin): bool=>$pin!==OFFICIAL_CA_PIN))===0)throw new RuntimeException('system_ca_root_only');
 // Certificate syntax/pins do not prove completeness: maintained system bundle is an administrator attestation.
 return rtrim($base)."\n".$extra;
}
