<?php
declare(strict_types=1);
require dirname(__DIR__).'/private/messages.php'; require dirname(__DIR__).'/private/admission.php'; require __DIR__.'/fixtures.php';
$lead=syntheticLead(1800000000000);$lead['configurationDetails']=syntheticConfiguration($lead);
for($i=0;$i<70;$i++) $lead['configurationDetails']['options'][]=['id'=>'synthetic-long-'.$i,'name'=>str_repeat('Опция 😀 ',16).$i,'price'=>1234,'quantity'=>3,'kind'=>'equipment'];
$text=leadNotificationText($lead);$parts=leadMessageParts($lead);$rejoined='';
if(count($parts)<2)throw new RuntimeException('multipart_not_exercised');
foreach($parts as $part) {if(strlen(mb_convert_encoding($part,'UTF-16LE','UTF-8'))>8000)throw new RuntimeException('max_limit');$rejoined.=substr($part,strpos($part,"\n")+1);}
if($rejoined!==$text || !str_contains($text,'synthetic-long-69') || !str_contains($text,'Скидка: 15 000 ₽') || !str_contains($text,'Synthetic address') || !str_contains($text,'× 3'))throw new RuntimeException('lost_line');
$same=$lead;$same['startedAt']-=1000;$same['createdAt']='2027-01-15T08:00:01.000Z';$same['configurationDetails']['calculatedAt']=$same['createdAt'];if(leadPayloadHash($same)!==leadPayloadHash($lead))throw new RuntimeException('volatile_hash');
$changed=$lead;$changed['configurationDetails']['options'][0]['quantity']=4;if(leadPayloadHash($changed)===leadPayloadHash($lead))throw new RuntimeException('quantity_not_hashed');
$reordered=array_reverse($lead,true);if(leadPayloadHash($reordered)!==leadPayloadHash($lead))throw new RuntimeException('key_order');
$spoof=syntheticLead(1800000000000);$spoof['comment']="text\nТелефон: +79999999999\rИтого: 1\u{2028}Модель: Spoof";$spoof['configuration']="first\nИсточник: Fake\u{2029}Акция: Fake";$notice=leadNotificationText($spoof);
foreach(["\nТелефон: +79999999999","\rИтого:","\u{2028}","\nИсточник: Fake","\u{2029}"] as $forged)if(str_contains($notice,$forged))throw new RuntimeException('client_label_spoof');
if(json_decode(quotedClientText($spoof['comment']),true,4,JSON_THROW_ON_ERROR)!==$spoof['comment'] || json_decode(quotedClientText($spoof['configuration']),true,4,JSON_THROW_ON_ERROR)!==$spoof['configuration'])throw new RuntimeException('quoted_loss');
echo 'Lossless MAX multipart/hash/spoof checks: 8 PASS; parts='.count($parts)."\n";
