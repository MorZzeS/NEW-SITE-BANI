<?php
declare(strict_types=1);
require_once __DIR__.'/documents.php';
function boundedText(mixed $v, int $min, int $max, bool $multiline=false): bool {
    return is_string($v) && mb_check_encoding($v,'UTF-8') && mb_strlen(trim($v))>=$min && mb_strlen($v)<=$max && !preg_match($multiline?'/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/u':'/[\x00-\x1f\x7f]/u',$v);
}
function isoDate(mixed $value): bool {
    if (!is_string($value) || !preg_match('/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/D',$value)) return false;
    $date=DateTimeImmutable::createFromFormat('!Y-m-d\TH:i:s.v\Z',$value,new DateTimeZone('UTC'));
    return $date!==false && $date->format('Y-m-d\TH:i:s.v\Z')===$value;
}
function rubles(mixed $v): bool { return is_int($v) && $v>=0 && $v<=1000000000; }
function validConfiguration(mixed $v, array $lead): bool {
    $fields=['modelId','modelName','modelType','basePrice','selectedOptionIds','options','deliveryDistrict','deliveryAddress','equipmentSubtotal','logisticsSubtotal','individualItems','optionsSubtotal','discount','discountLabel','total','unpricedCount','currency','calculatedAt'];
    if (!exactKeys($v,$fields) || !boundedText($v['modelId'],1,80) || !boundedText($v['modelName'],1,160) || $v['modelName']!==$lead['model'] || $v['modelType']!==match($lead['modelKind']) {'bath'=>'sauna','house'=>'home',default=>''} || $v['currency']!=='RUB' || !isoDate($v['calculatedAt'])) return false;
    foreach (['basePrice','equipmentSubtotal','logisticsSubtotal','optionsSubtotal','discount','total'] as $key) if (!rubles($v[$key])) return false;
    if (!in_array($v['deliveryDistrict'],['unknown','ramenskoe','outside'],true) || !boundedText($v['deliveryAddress'],0,300) || !boundedText($v['discountLabel'],0,120) || !is_array($v['options']) || !array_is_list($v['options']) || count($v['options'])>80 || !is_array($v['selectedOptionIds']) || !array_is_list($v['selectedOptionIds']) || !is_array($v['individualItems']) || !array_is_list($v['individualItems'])) return false;
    $ids=[]; $individual=[]; $equipment=0; $logistics=0;
    foreach ($v['options'] as $option) {
        if (!exactKeys($option,['id','name','price','quantity','kind']) || !boundedText($option['id'],1,80) || !boundedText($option['name'],1,160) || !is_int($option['quantity']) || $option['quantity']<1 || $option['quantity']>100 || !in_array($option['kind'],['equipment','logistics'],true) || ($option['price']!==null && !rubles($option['price'])) || in_array($option['id'],$ids,true)) return false;
        $ids[]=$option['id'];
        if ($option['kind']==='logistics' && $v['deliveryDistrict']!=='ramenskoe' && $option['price']!==null) return false;
        if ($option['price']===null) $individual[]=$option['id'];
        elseif ($option['kind']==='equipment') $equipment+=$option['price']*$option['quantity'];
        else $logistics+=$option['price']*$option['quantity'];
    }
    $subtotal=$equipment+$logistics;
    return $v['selectedOptionIds']===$ids && $v['individualItems']===$individual && $v['equipmentSubtotal']===$equipment && $v['logisticsSubtotal']===$logistics && $v['optionsSubtotal']===$subtotal && $v['unpricedCount']===count($individual) && $v['discount']<=$v['basePrice']+$subtotal && ($v['discount']>0 ? $v['discountLabel']!=='' : $v['discountLabel']==='') && $v['total']===$v['basePrice']+$subtotal-$v['discount'];
}
function validLead(array $d, array $c, int $now): bool {
    $fields=['contractVersion','consentVersion','policyVersion','checkboxVersion','purposeCode','action','consentTextSha256','checkboxTextSha256','policyTextSha256','requestId','name','phone','model','page','comment','createdAt','consent','website','startedAt','source','article','configuration','promotion','modelKind'];
    if (array_key_exists('configurationDetails',$d)) $fields[]='configurationDetails';
    if (!exactKeys($d,$fields)) return false;
    foreach (['requestId'=>[16,80],'name'=>[2,80],'phone'=>[10,30],'model'=>[0,160],'page'=>[8,600],'comment'=>[0,1500],'article'=>[0,80],'configuration'=>[0,2000]] as $key=>[$min,$max]) if (!boundedText($d[$key],$min,$max,in_array($key,['comment','configuration'],true))) return false;
    if (!preg_match('/^[A-Za-z0-9_-]{16,80}$/D',$d['requestId']) || !preg_match('/^\+?[0-9 ()-]+$/D',$d['phone']) || !preg_match('/^[78][0-9]{10}$/D',preg_replace('/\D/','',$d['phone'])) || !isoDate($d['createdAt'])) return false;
    $date=new DateTimeImmutable($d['createdAt']); $start=$d['startedAt'];
    if (abs($now-(int)$date->format('Uv'))>86400000 || !is_int($start) || $now-$start<3000 || $now-$start>=86400000 || $d['website']!=='' || $d['consent']!==true || $d['contractVersion']!==3 || $d['purposeCode']!=='inquiry_response' || $d['action']!=='unchecked_checkbox_then_submit') return false;
    if (!in_array($d['source'],['Карточка модели','Получить консультацию','Контакты','Конфигуратор','Exit-intent'],true) || !in_array($d['modelKind'],['','bath','house'],true) || !in_array($d['promotion'],['','Скидка 15 000 ₽'],true) || ($d['promotion']!=='' && ($d['source']!=='Exit-intent' || $d['modelKind']!=='bath'))) return false;
    foreach (['consent','checkbox','policy'] as $kind) {
        $doc=$c['documents'][$kind]??null;
        if (!$doc || $d[$kind.'Version']!==$doc['version'] || $d[$kind.'TextSha256']!==$doc['sha256']) return false;
    }
    if (array_key_exists('configurationDetails',$d) && !validConfiguration($d['configurationDetails'],$d)) return false;
    $p=parse_url($d['page']);
    if (!$p || ($p['scheme']??'')!=='https' || isset($p['user']) || isset($p['pass']) || isset($p['query']) || isset($p['fragment'])) return false;
    $origin='https://'.($p['host']??'').(isset($p['port'])?':'.$p['port']:'');
    return in_array($origin,$c['origins'],true) && ($origin!=='https://morzzes.github.io' || ($p['path']??'')==='/NEW-SITE-BANI' || str_starts_with($p['path']??'','/NEW-SITE-BANI/'));
}
