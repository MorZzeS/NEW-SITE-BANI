<?php
declare(strict_types=1);
require dirname(__DIR__).'/private/backup-format.php';
$key=random_bytes(32);$fixture=['table'=>'leads','row'=>['id'=>'1','environment'=>'TEST','request_id'=>'synthetic-request-123','payload_hash'=>base64_encode(random_bytes(32)),'name'=>'synthetic-only','phone'=>'+79000000000','model'=>'','comment'=>'','page'=>'https://synthetic.invalid/','received_at'=>'2026-10-09 00:00:00.000000']];$checks=0;
$sealed=sealBackup($fixture,$key);if(openBackup($sealed,$key)!==$fixture)throw new RuntimeException('roundtrip');$checks++;
try{openBackup($sealed,random_bytes(32));throw new LogicException('wrong_key');}catch(RuntimeException){$checks++;}
$r=json_decode($sealed,true);$r['cipher']=base64_encode('tampered');try{openBackup(json_encode($r),$key);throw new LogicException('tamper');}catch(RuntimeException){$checks++;}
$meta=['format'=>'spaceweb-backup-v1','environment'=>'TEST','at'=>'2026-10-09T00:00:00+00:00'];$counts=array_fill_keys(BACKUP_TABLES,0);$counts['leads']=1;$footer=['completed'=>true,'counts'=>$counts];
$validate=function(array $records,bool $expected)use($key,&$checks):void{$f=fopen('php://temp','w+');try{foreach($records as $r)fwrite($f,sealBackup($r,$key));rewind($f);try{validateBackup($f,$key,'TEST');$accepted=true;}catch(Throwable){$accepted=false;}if($accepted!==$expected)throw new RuntimeException('validation_mismatch');$checks++;}finally{fclose($f);}};
$validate([$meta,$fixture,$footer],true);
$bad=$meta;$bad['environment']='PRODUCTION';$validate([$bad,$fixture,$footer],false);
$bad=$meta;$bad['format']='unknown';$validate([$bad,$fixture,$footer],false);
$validate([$fixture,$footer],false);$validate([$meta,$fixture],false);
$validate([$meta,$fixture,$footer,$footer],false);$validate([$meta,$fixture,$footer,$fixture],false);
$bad=$fixture;$bad['table']='unknown';$validate([$meta,$bad,$footer],false);
$bad=$fixture;$bad['row']['unexpected']='value';$validate([$meta,$bad,$footer],false);
$bad=$fixture;$bad['row']=[];$validate([$meta,$bad,$footer],false);
$bad=$footer;$bad['counts']['leads']=2;$validate([$meta,$fixture,$bad],false);
$f=fopen('php://temp','w+');try{try{writeBackupRecord($f,$meta,$key,fn($stream,$line)=>strlen($line)-1);throw new LogicException('short_first_write');}catch(RuntimeException){$checks++;}writeBackupRecord($f,$meta,$key);$checks++;}finally{fclose($f);}
$name=backupFilename('TEST','20261009-000000','0123456789abcdef');if(!backupBelongsTo($name,'TEST')||backupBelongsTo($name,'PRODUCTION')||backupBelongsTo('spaceweb-20261009-000000-0123456789abcdef.jsonl.enc','TEST'))throw new RuntimeException('environment_isolation');$checks++;
echo "Backup encryption/validation/write/isolation offline checks: $checks\n";
