<?php
declare(strict_types=1);
require dirname(__DIR__).'/private/validation.php'; require __DIR__.'/fixtures.php';
$now=1800000000000; $c=['origins'=>['https://test.invalid'],'documents'=>syntheticDocuments()]; $good=syntheticLead($now); $cases=[[$good,true]];
foreach (['createdAt'=>'invalid','contractVersion'=>2,'consentVersion'=>'old','checkboxTextSha256'=>str_repeat('0',64),'policyVersion'=>'','website'=>'bot','consent'=>false,'startedAt'=>$now,'phone'=>'+1 555 555-5555','page'=>'https://test.invalid/form?phone=pii','requestId'=>'bad','name'=>"Synthetic\nSpoof",'source'=>'invalid','article'=>[],'promotion'=>'Скидка 15 000 ₽'] as $k=>$v) { $bad=$good; $bad[$k]=$v; $cases[]=[$bad,false]; }
$legacy=$good; unset($legacy['action']); $cases[]=[$legacy,false];
$bad=$good;$bad['unexpected']='value';$cases[]=[$bad,false];
$configured=$good; $configured['configurationDetails']=syntheticConfiguration($good); $cases[]=[$configured,true];
foreach (['quantity'=>0,'price'=>-1,'kind'=>'unknown','name'=>"Synthetic\nSpoof"] as $key=>$value) { $bad=$configured; $bad['configurationDetails']['options'][0][$key]=$value; $cases[]=[$bad,false]; }
foreach (['total'=>106001,'equipmentSubtotal'=>7000,'logisticsSubtotal'=>1,'unpricedCount'=>0,'selectedOptionIds'=>['delivery'],'individualItems'=>[],'deliveryAddress'=>str_repeat('x',301),'modelType'=>'home','currency'=>'USD'] as $key=>$value) { $bad=$configured; $bad['configurationDetails'][$key]=$value; $cases[]=[$bad,false]; }
$bad=$configured;$bad['configurationDetails']['options'][1]['price']=10000;$cases[]=[$bad,false];
$bad=$configured;$bad['configurationDetails']=null;$cases[]=[$bad,false];
$bad=$good;$bad['page']='https://morzzes.github.io/unrelated';$cPages=$c;$cPages['origins'][]='https://morzzes.github.io';if(validLead($bad,$cPages,$now))throw new RuntimeException('pages_scope');
foreach ($cases as $i=>[$d,$expected]) if (validLead($d,$c,$now)!==$expected) throw new RuntimeException('validation_case_'.$i);
echo 'Validation checks: '.(count($cases)+1)." PASS\n";
