<?php
declare(strict_types=1);
require dirname(__DIR__).'/private/documents.php'; require __DIR__.'/fixtures.php';
$c=syntheticBundleFile();$path=$c['document_bundle_path'];$checks=0;
try {
    if (approvedDocuments($c)!==syntheticDocuments()) throw new RuntimeException('bundle_roundtrip'); $checks++;
    foreach ([[],array_replace($c,['document_bundle_sha256'=>str_repeat('0',64)]),array_replace($c,['document_bundle_path'=>$path.'.missing'])] as $bad) { try {approvedDocuments($bad);throw new LogicException('bad_archive_accepted');} catch(RuntimeException) {$checks++;} }
    foreach (['altered_text','altered_hash','unapproved','missing_checkbox','reused_unknown_key','invalid_version'] as $case) {
        $bundle=['approved'=>true,'documents'=>syntheticDocuments()];
        switch($case) {
            case 'altered_text': $bundle['documents']['consent']['text'].='changed'; break;
            case 'altered_hash': $bundle['documents']['policy']['sha256']=str_repeat('a',64); break;
            case 'unapproved': $bundle['approved']=false; break;
            case 'missing_checkbox': unset($bundle['documents']['checkbox']); break;
            case 'reused_unknown_key': $bundle['documents']['checkbox']['unknown']='value'; break;
            case 'invalid_version': $bundle['documents']['consent']['version']='invalid version'; break;
        }
        $bytes=json_encode($bundle,JSON_THROW_ON_ERROR);file_put_contents($path,$bytes);$bad=$c;$bad['document_bundle_sha256']=hash('sha256',$bytes);
        try {approvedDocuments($bad);throw new LogicException('invalid_bundle_accepted');} catch(RuntimeException) {$checks++;}
    }
} finally {unlink($path);}
echo "Pinned immutable bundle offline checks: $checks PASS\n";
