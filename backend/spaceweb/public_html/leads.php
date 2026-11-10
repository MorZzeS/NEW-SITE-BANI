<?php
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8'); header('Cache-Control: no-store');
function reply(int $status, array $value): never {
    http_response_code($status); if ($status!==204) echo json_encode($value,JSON_THROW_ON_ERROR); exit;
}
if (!in_array($_SERVER['HTTPS']??'',['on','1'],true)) reply(403,['ok'=>false]);
$configPath=dirname(__DIR__).'/private/config.php'; $docroot=realpath($_SERVER['DOCUMENT_ROOT']??''); $private=realpath(dirname($configPath));
if (!$docroot || !$private || str_starts_with($private.DIRECTORY_SEPARATOR,$docroot.DIRECTORY_SEPARATOR) || !is_file($configPath)) reply(503,['ok'=>false]);
require dirname(__DIR__).'/private/readiness.php';
try { $c=require $configPath; if (!is_array($c) || !readiness($c)) reply(503,['ok'=>false]); $c['documents']=approvedDocuments($c); }
catch (Throwable) { reply(503,['ok'=>false]); }
$origin=$_SERVER['HTTP_ORIGIN']??'';
if (!in_array($origin,$c['origins'],true)) reply(403,['ok'=>false]);
header('Access-Control-Allow-Origin: '.$origin); header('Vary: Origin');
if (($_SERVER['REQUEST_METHOD']??'')==='OPTIONS') { header('Access-Control-Allow-Methods: POST'); header('Access-Control-Allow-Headers: Content-Type'); reply(204,[]); }
if (($_SERVER['REQUEST_METHOD']??'')!=='POST') reply(405,['ok'=>false]);
if (!preg_match('/^application\/json(?:\s*;\s*charset=utf-8)?$/iD',$_SERVER['CONTENT_TYPE']??'')) reply(415,['ok'=>false]);
// Full structured configurations can exceed the old 8 KiB legacy-comment limit.
if ((int)($_SERVER['CONTENT_LENGTH']??0)>65536) reply(413,['ok'=>false]);
$body=file_get_contents('php://input',false,null,0,65537);
if ($body===false || strlen($body)>65536) reply(413,['ok'=>false]);
try { $d=json_decode($body,true,16,JSON_THROW_ON_ERROR); } catch (Throwable) { reply(400,['ok'=>false]); }
require dirname(__DIR__).'/private/validation.php'; require dirname(__DIR__).'/private/admission.php';
$id=is_array($d) && is_string($d['requestId']??null) && preg_match('/^[A-Za-z0-9_-]{16,80}$/D',$d['requestId'])?$d['requestId']:'';
if (!is_array($d) || !validLead($d,$c,(int)floor(microtime(true)*1000))) reply(...leadResponse($id,'rejected',false));
$page=parse_url($d['page']); $pageOrigin='https://'.$page['host'].(isset($page['port'])?':'.$page['port']:'');
if ($pageOrigin!==$origin) reply(...leadResponse($id,'rejected',false));
if (($c['dry_run']??true)===true) reply(...leadResponse($id,'storage_unavailable',false,null,true));
$remote=$_SERVER['REMOTE_ADDR']??'';
if (!filter_var($remote,FILTER_VALIDATE_IP) || !is_string($c['ip_hmac_key']??null) || strlen($c['ip_hmac_key'])<32) reply(...leadResponse($id,'storage_unavailable',false,null,true));
$ipHash=hash_hmac('sha256',inet_pton($remote),$c['ip_hmac_key'],true);
try { $db=operationDb($c); } catch (Throwable) { reply(...leadResponse($id,'storage_unavailable',false,null,true)); }
reply(...admitLead($db,$d,$c,$ipHash));
