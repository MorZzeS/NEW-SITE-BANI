<?php
declare(strict_types=1);
// Explicit isolated synthetic DB only. Never loads production config or network adapter.
require dirname(__DIR__).'/private/notifier.php';
if (getenv('SPACEWEB_TEST_DB_ACK')!=='ISOLATED_SYNTHETIC_DATABASE') { fwrite(STDERR,"SKIP: isolated DB opt-in required\n"); exit(78); }
$db=new PDO(getenv('SPACEWEB_TEST_DSN'),getenv('SPACEWEB_TEST_USER'),getenv('SPACEWEB_TEST_PASSWORD'),[PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION,PDO::ATTR_EMULATE_PREPARES=>false]);
$db->exec("SET time_zone = '+00:00'");
if ((int)$db->query("SELECT COUNT(*) FROM leads")->fetchColumn()!==0) { fwrite(STDERR,"REFUSED: test database must be empty\n"); exit(78); }
$ids=[];
try {
 foreach (['sent','retry','unknown','dead'] as $expected) {
  $request=bin2hex(random_bytes(16));
  $q=$db->prepare("INSERT INTO leads(environment,request_id,payload_hash,name,phone,model,comment,page) VALUES ('TEST',?,?, 'Synthetic','+79000000000','','','https://test.invalid/form')");
  $q->execute([$request,hash('sha256',$request,true)]); $id=$db->lastInsertId(); $ids[]=$id;
  $q=$db->prepare('INSERT INTO outbox(lead_id) VALUES (?)'); $q->execute([$id]);
  $calls=0;
  runOutbox($db,'TEST',function(array $lead) use (&$calls,$expected): array { $calls++; return ['state'=>$expected,'code'=>$expected==='sent'?null:'fake_result','id'=>$expected==='sent'?'fake-mid':null]; });
  $q=$db->prepare('SELECT state FROM outbox WHERE lead_id=?'); $q->execute([$id]);
  if ($calls!==1 || $q->fetchColumn()!==$expected) throw new RuntimeException('fake_state_mismatch');
  // Previously sent/unknown/dead rows must never be selected again.
  if ($expected!=='retry' && runOutbox($db,'TEST',function(): array { throw new RuntimeException('unexpected resend'); })) throw new RuntimeException('unexpected_work');
 }
 echo "Fake outbox integration checks passed\n";
} finally {
 // Delete only synthetic rows created by this test, never pre-existing data.
 foreach ($ids as $id) { $q=$db->prepare('DELETE FROM outbox WHERE lead_id=?'); $q->execute([$id]); $q=$db->prepare('DELETE FROM leads WHERE id=? AND environment=\'TEST\''); $q->execute([$id]); }
}
