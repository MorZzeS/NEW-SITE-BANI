<?php
declare(strict_types=1);
function validLead(array $d, array $c, int $now): bool {
    $fields = ['requestId'=>[16,80], 'name'=>[2,80], 'phone'=>[10,30],
        'model'=>[0,160], 'comment'=>[0,1500], 'page'=>[8,600]];
    foreach ($fields as $k=>$bounds) {
        if (!isset($d[$k]) || !is_string($d[$k]) || !mb_check_encoding($d[$k], 'UTF-8') ||
            mb_strlen(trim($d[$k])) < $bounds[0] || mb_strlen($d[$k]) > $bounds[1] ||
            preg_match('/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/u', $d[$k])) return false;
    }
    if (!preg_match('/^[A-Za-z0-9_-]{16,80}$/D', $d['requestId']) ||
        !preg_match('/^\+?[0-9 ()-]+$/D', $d['phone']) ||
        !preg_match('/^[78][0-9]{10}$/D', preg_replace('/\D/', '', $d['phone']))) return false;
    if (!is_string($d['createdAt'] ?? null) || !preg_match('/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/D', $d['createdAt'])) return false;
    $date=DateTimeImmutable::createFromFormat('!Y-m-d\TH:i:s.v\Z', $d['createdAt'], new DateTimeZone('UTC'));
    if (!$date || $date->format('Y-m-d\TH:i:s.v\Z') !== $d['createdAt'] || abs($now-(int)$date->format('Uv'))>86400000) return false;
    $start = $d['startedAt'] ?? null;
    if (!is_int($start) || !is_finite((float)$start) ||
        $now-$start < 3000 || $now-$start >= 86400000 || ($d['website'] ?? null) !== '' ||
        ($d['consent'] ?? null) !== true || ($d['contractVersion'] ?? null) !== 2 ||
        ($d['consentVersion'] ?? null) !== $c['consent_version'] ||
        ($d['policyVersion'] ?? null) !== $c['policy_version']) return false;
    $p = parse_url($d['page']);
    if (!$p || ($p['scheme'] ?? '') !== 'https' || isset($p['user']) || isset($p['pass']) ||
        isset($p['query']) || isset($p['fragment'])) return false;
    $origin = 'https://'.($p['host'] ?? '').(isset($p['port']) ? ':'.$p['port'] : '');
    return in_array($origin, $c['origins'], true);
}
