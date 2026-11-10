<?php
declare(strict_types=1);
/** Only invented, synthetic text and contacts; no production approvals. */
function syntheticDocuments(): array {
    $docs=[];
    foreach (['consent','checkbox','policy'] as $kind) { $text='Synthetic '.$kind.' fixture, not a legal document.'; $docs[$kind]=['version'=>'synthetic-'.$kind.'-v1','text'=>$text,'sha256'=>hash('sha256',$text)]; }
    return $docs;
}
function syntheticBundleFile(): array {
    $path=tempnam(sys_get_temp_dir(),'spaceweb-doc-test-');
    $bytes=json_encode(['approved'=>true,'documents'=>syntheticDocuments()],JSON_THROW_ON_ERROR);
    file_put_contents($path,$bytes);
    return ['document_bundle_path'=>$path,'document_bundle_sha256'=>hash('sha256',$bytes)];
}
function syntheticLead(int $now): array {
    $d=['contractVersion'=>3,'requestId'=>'synthetic-request-12345678','name'=>'Synthetic User','phone'=>'+7 900 000-00-00','model'=>'Synthetic Model','page'=>'https://test.invalid/form','comment'=>'Synthetic only','createdAt'=>DateTimeImmutable::createFromFormat('U.v',sprintf('%.3f',$now/1000))->setTimezone(new DateTimeZone('UTC'))->format('Y-m-d\TH:i:s.v\Z'),'consent'=>true,'website'=>'','startedAt'=>$now-5000,'source'=>'Карточка модели','article'=>'TEST-001','configuration'=>'','promotion'=>'','modelKind'=>'bath','purposeCode'=>'inquiry_response','action'=>'unchecked_checkbox_then_submit'];
    foreach (syntheticDocuments() as $kind=>$doc) { $d[$kind.'Version']=$doc['version']; $d[$kind.'TextSha256']=$doc['sha256']; }
    return $d;
}
function syntheticConfiguration(array $d): array {
    return ['modelId'=>'synthetic','modelName'=>$d['model'],'modelType'=>'sauna','basePrice'=>100000,'selectedOptionIds'=>['synthetic-option','delivery'],'options'=>[['id'=>'synthetic-option','name'=>'Synthetic quantity option','price'=>7000,'quantity'=>3,'kind'=>'equipment'],['id'=>'delivery','name'=>'Synthetic delivery','price'=>null,'quantity'=>1,'kind'=>'logistics']],'deliveryDistrict'=>'outside','deliveryAddress'=>'Synthetic address','equipmentSubtotal'=>21000,'logisticsSubtotal'=>0,'individualItems'=>['delivery'],'optionsSubtotal'=>21000,'discount'=>15000,'discountLabel'=>'Synthetic discount','total'=>106000,'unpricedCount'=>1,'currency'=>'RUB','calculatedAt'=>$d['createdAt']];
}
