<?php
declare(strict_types=1);
require dirname(__DIR__).'/private/validation.php';
$now=1800000000000;
$c=['origins'=>['https://test.invalid'],'consent_version'=>'synthetic-consent-fixture','policy_version'=>'synthetic-policy-fixture'];
$good=['requestId'=>'12345678-1234-1234','name'=>'Test User','phone'=>'+7 900 000-00-00','model'=>'','comment'=>'','page'=>'https://test.invalid/form','createdAt'=>'2027-01-15T08:00:00.000Z','consent'=>true,'website'=>'','startedAt'=>$now-5000,'contractVersion'=>2,'consentVersion'=>$c['consent_version'],'policyVersion'=>$c['policy_version']];
$cases=[[$good,true]];
foreach (['createdAt'=>'invalid','contractVersion'=>1,'consentVersion'=>'old','policyVersion'=>'','website'=>'bot','consent'=>false,'startedAt'=>$now,'phone'=>'+1 555 555-5555','page'=>'https://test.invalid/form?phone=pii','requestId'=>'bad'] as $k=>$v) {
    $bad=$good; $bad[$k]=$v; $cases[]=[$bad,false];
}
$legacy=$good; unset($legacy['contractVersion'],$legacy['consentVersion'],$legacy['policyVersion']); $cases[]=[$legacy,false];
foreach ($cases as $i=>[$d,$expected]) if (validLead($d,$c,$now)!==$expected) { fwrite(STDERR,"FAIL case $i\n"); exit(1); }
echo 'Validation checks passed: '.count($cases)."\n";
