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
echo 'Offline outcome checks: '.count($cases)."\n";
