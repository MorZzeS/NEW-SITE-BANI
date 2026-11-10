<?php
declare(strict_types=1);
function exactKeys(mixed $value, array $keys): bool {
    if (!is_array($value) || array_is_list($value)) return false;
    $actual=array_keys($value); sort($actual); sort($keys); return $actual===$keys;
}
/** Private release bytes are pinned independently from browser approval flags. */
function approvedDocuments(array $c): array {
    $path=$c['document_bundle_path']??''; $pin=$c['document_bundle_sha256']??'';
    if (!is_string($path) || !is_string($pin) || !preg_match('/^[a-f0-9]{64}$/D',$pin) || is_link($path) || !is_file($path) || filesize($path)>800000) throw new RuntimeException('archive_missing');
    $real=realpath($path); $root=realpath(dirname(__DIR__).'/public_html');
    if (!$real || !$root || str_starts_with($real,$root.DIRECTORY_SEPARATOR)) throw new RuntimeException('archive_public');
    $bytes=file_get_contents($path);
    if ($bytes===false || !hash_equals($pin,hash('sha256',$bytes))) throw new RuntimeException('archive_pin');
    $bundle=json_decode($bytes,true,8,JSON_THROW_ON_ERROR);
    if (!exactKeys($bundle,['approved','documents']) || $bundle['approved']!==true || !exactKeys($bundle['documents'],['consent','checkbox','policy'])) throw new RuntimeException('archive_invalid');
    foreach ($bundle['documents'] as $doc) {
        if (!exactKeys($doc,['version','text','sha256']) || !is_string($doc['version']) || !preg_match('/^[A-Za-z0-9._-]{1,80}$/D',$doc['version']) || !is_string($doc['text']) || strlen($doc['text'])<1 || strlen($doc['text'])>262144 || !mb_check_encoding($doc['text'],'UTF-8') || !is_string($doc['sha256']) || !hash_equals(hash('sha256',$doc['text']),$doc['sha256'])) throw new RuntimeException('archive_document_invalid');
    }
    return $bundle['documents'];
}
function archiveDocuments(PDO $db, array $documents): void {
    foreach ($documents as $kind=>$doc) {
        $q=$db->prepare('INSERT IGNORE INTO documents(kind,version,text,sha256) VALUES (?,?,?,?)');
        $q->execute([$kind,$doc['version'],$doc['text'],$doc['sha256']]);
        $q=$db->prepare('SELECT text,sha256 FROM documents WHERE kind=? AND version=?'); $q->execute([$kind,$doc['version']]); $stored=$q->fetch(PDO::FETCH_ASSOC);
        if (!$stored || $stored['text']!==$doc['text'] || !hash_equals($stored['sha256'],$doc['sha256'])) throw new RuntimeException('archive_version_reused');
    }
}
