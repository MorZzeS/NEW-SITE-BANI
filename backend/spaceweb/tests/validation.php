<?php
declare(strict_types=1);
require dirname(__DIR__).'/private/validation.php'; require __DIR__.'/fixtures.php';
$now=1800000000000; $c=['origins'=>['https://test.invalid'],'documents'=>syntheticDocuments()]; $good=syntheticLead($now); $cases=[[$good,true]];
foreach (['createdAt'=>'invalid','contractVersion'=>2,'consentVersion'=>'old','checkboxTextSha256'=>str_repeat('0',64),'policyVersion'=>'','website'=>'bot','consent'=>false,'startedAt'=>$now,'phone'=>'+1 555 555-5555','page'=>'https://test.invalid/form?phone=pii','requestId'=>'bad','name'=>"Synthetic\nSpoof",'source'=>'invalid','article'=>[],'promotion'=>'Скидка 15 000 ₽'] as $k=>$v) { $bad=$good; $bad[$k]=$v; $cases[]=[$bad,false]; }
$legacy=$good; unset($legacy['action']); $cases[]=[$legacy,false];
$bad=$good;$bad['unexpected']='value';$cases[]=[$bad,false];
$configured=$good; $configured['configurationDetails']=syntheticConfiguration($good); $cases[]=[$configured,true];
$appendConfigurationOption=static function(array $d,array $option,int $amount):array{$c=&$d['configurationDetails'];$c['options'][]=$option;$c['selectedOptionIds'][]=$option['id'];$c['equipmentSubtotal']+=$amount;$c['optionsSubtotal']+=$amount;$c['total']+=$amount;return $d;};
$withBlockhouse=$configured; $finish=['id'=>'exterior-blockhouse','name'=>'Наружная отделка блок-хаусом','price'=>35000,'quantity'=>1,'kind'=>'equipment']; $withBlockhouse['configurationDetails']['options'][]=$finish; $withBlockhouse['configurationDetails']['selectedOptionIds'][]=$finish['id']; $withBlockhouse['configurationDetails']['equipmentSubtotal']+=35000; $withBlockhouse['configurationDetails']['optionsSubtotal']+=35000; $withBlockhouse['configurationDetails']['total']+=35000; $cases[]=[$withBlockhouse,true];
$imitation=['id'=>'exterior-imitation-board','name'=>'Имитация бруса — базовый вариант','price'=>0,'quantity'=>1,'kind'=>'equipment'];
$ral=['id'=>'facade-ral','name'=>'Окраска внешней отделки по RAL','price'=>25000,'quantity'=>1,'kind'=>'equipment'];
$withImitationRal=$appendConfigurationOption($appendConfigurationOption($configured,$imitation,0),$ral,25000);$cases[]=[$withImitationRal,true];
$withBlockhouseRal=$appendConfigurationOption($withBlockhouse,$ral,25000);$cases[]=[$withBlockhouseRal,true];
$profile=['id'=>'exterior-profile-sheet','name'=>'Наружная отделка профлистом','price'=>60000,'quantity'=>1,'kind'=>'equipment'];
$badRalProfile=$appendConfigurationOption($appendConfigurationOption($configured,$profile,60000),$ral,25000);$cases[]=[$badRalProfile,false];
$badRalPrice=$withImitationRal;$badRalPrice['configurationDetails']['options'][3]['price']=1;$badRalPrice['configurationDetails']['equipmentSubtotal']-=24999;$badRalPrice['configurationDetails']['optionsSubtotal']-=24999;$badRalPrice['configurationDetails']['total']-=24999;$cases[]=[$badRalPrice,false];
$bad=$withBlockhouse; $bad['configurationDetails']['options'][2]['price']=1; $bad['configurationDetails']['equipmentSubtotal']-=34999; $bad['configurationDetails']['optionsSubtotal']-=34999; $bad['configurationDetails']['total']-=34999; $cases[]=[$bad,false];
$bad=$withBlockhouse; $second=['id'=>'exterior-profile-sheet','name'=>'Наружная отделка профлистом','price'=>60000,'quantity'=>1,'kind'=>'equipment']; $bad['configurationDetails']['options'][]=$second; $bad['configurationDetails']['selectedOptionIds'][]=$second['id']; $bad['configurationDetails']['equipmentSubtotal']+=60000; $bad['configurationDetails']['optionsSubtotal']+=60000; $bad['configurationDetails']['total']+=60000; $cases[]=[$bad,false];
foreach (['quantity'=>0,'price'=>-1,'kind'=>'unknown','name'=>"Synthetic\nSpoof"] as $key=>$value) { $bad=$configured; $bad['configurationDetails']['options'][0][$key]=$value; $cases[]=[$bad,false]; }
foreach (['total'=>106001,'equipmentSubtotal'=>7000,'logisticsSubtotal'=>1,'unpricedCount'=>0,'selectedOptionIds'=>['delivery'],'individualItems'=>[],'deliveryAddress'=>str_repeat('x',301),'modelType'=>'home','currency'=>'USD'] as $key=>$value) { $bad=$configured; $bad['configurationDetails'][$key]=$value; $cases[]=[$bad,false]; }
$bad=$configured;$bad['configurationDetails']['options'][1]['price']=10000;$cases[]=[$bad,false];
$bad=$configured;$bad['configurationDetails']=null;$cases[]=[$bad,false];
$bad=$good;$bad['page']='https://morzzes.github.io/unrelated';$cPages=$c;$cPages['origins'][]='https://morzzes.github.io';if(validLead($bad,$cPages,$now))throw new RuntimeException('pages_scope');
foreach ($cases as $i=>[$d,$expected]) if (validLead($d,$c,$now)!==$expected) throw new RuntimeException('validation_case_'.$i);
echo 'Validation checks: '.(count($cases)+1)." PASS\n";
