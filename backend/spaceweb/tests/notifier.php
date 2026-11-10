<?php
declare(strict_types=1);
require dirname(__DIR__).'/private/notifier.php';
$cases=[
 [200,'{"message":{"body":{"mid":"synthetic-message"}}}',0,'sent'],
 [200,'{}',0,'unknown'],[429,'{}',0,'retry'],[401,'{}',0,'dead'],
 [500,'{}',0,'unknown'],[0,'',28,'unknown'],[200,'invalid',0,'unknown']
];
foreach ($cases as $i=>[$status,$body,$error,$expected]) {
 if (deliveryOutcome($status,$body,$error)['state']!==$expected) { fwrite(STDERR,"FAIL outcome $i\n"); exit(1); }
}
// A callable fake is the only delivery adapter used by integration.php.
foreach ([[],['max_recipient_approved'=>false,'max_recipient_type'=>'user_id','max_recipient_id'=>'123'],['max_recipient_approved'=>true,'max_recipient_type'=>'user_id','max_recipient_id'=>'123&chat_id=456'],['max_recipient_approved'=>true,'max_recipient_type'=>'user_id','max_recipient_id'=>'-123'],['max_recipient_approved'=>true,'max_recipient_type'=>'user_id','max_recipient_id'=>'9223372036854775808']] as $c) {
 try {maxRecipientQuery($c);throw new LogicException('recipient_should_fail');}catch(RuntimeException){}
}
if(maxRecipientQuery(['max_recipient_approved'=>true,'max_recipient_type'=>'chat_id','max_recipient_id'=>'-123'])!=='chat_id=-123')throw new RuntimeException('recipient_query');
if(maxRecipientQuery(['max_recipient_approved'=>true,'max_recipient_type'=>'chat_id','max_recipient_id'=>'-9223372036854775808'])!=='chat_id=-9223372036854775808')throw new RuntimeException('recipient_int64');
echo "Private recipient checks: 7 PASS\n";
echo 'Offline outcome checks: '.count($cases)."\n";
