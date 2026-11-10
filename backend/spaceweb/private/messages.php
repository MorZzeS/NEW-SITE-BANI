<?php
declare(strict_types=1);
/** Quoted JSON keeps client newlines/Unicode line separators inside one attributed value. */
function quotedClientText(string $value): string { return json_encode($value,JSON_THROW_ON_ERROR|JSON_UNESCAPED_UNICODE); }
/** Prices are validated client estimates, not an authoritative quote or catalog. */
function leadNotificationText(array $lead): string {
    $money=static fn(int $v): string=>number_format($v,0,',',' ').' ₽';
    $lines=['Новая заявка BANGER.SU','ID: '.$lead['requestId']];
    foreach (['name'=>'Имя','phone'=>'Телефон','model'=>'Модель','article'=>'Артикул','source'=>'Источник','promotion'=>'Акция','page'=>'Страница','comment'=>'Комментарий (текст клиента)'] as $key=>$label) $lines[]=$label.': '.quotedClientText($lead[$key]);
    if (isset($lead['configurationDetails'])) {
        $v=$lead['configurationDetails'];
        $lines[]='Предварительный расчёт клиента; цену и применимость подтвердит менеджер.';
        $lines[]='Модель: '.quotedClientText($v['modelName']).' ['.quotedClientText($v['modelId']).']'; $lines[]='База: '.$money($v['basePrice']);
        foreach ($v['options'] as $option) $lines[]=quotedClientText($option['name']).' ['.quotedClientText($option['id']).'] × '.$option['quantity'].' — '.($option['price']===null?'По согласованию':$money($option['price']).'/ед.; '.$money($option['price']*$option['quantity'])).' ('.quotedClientText($option['kind']).')';
        $lines[]='Оборудование: '.$money($v['equipmentSubtotal']); $lines[]='Логистика: '.$money($v['logisticsSubtotal']);
        $lines[]='Район: '.match($v['deliveryDistrict']) {'ramenskoe'=>'Раменский район','outside'=>'За пределами Раменского района',default=>'Не указан'};
        $lines[]='Адрес: '.quotedClientText($v['deliveryAddress']); $lines[]='Дополнения: '.$money($v['optionsSubtotal']);
        $lines[]='Скидка: '.$money($v['discount']).' '.quotedClientText($v['discountLabel']); $lines[]='Итого: '.$money($v['total']);
        $lines[]='Индивидуальных позиций (не включены в итог): '.$v['unpricedCount']; $lines[]='Расчёт: '.quotedClientText($v['calculatedAt']);
    } elseif ($lead['configuration']!=='') $lines[]='Комплектация (текст клиента): '.quotedClientText($lead['configuration']);
    return implode("\n",$lines);
}
/** MAX permits 4000 characters; reserve room for stable request/part headers. No truncation. */
function leadMessageParts(array $lead): array {
    $text=leadNotificationText($lead); $chunks=[];
    // UTF-16 units are conservative for both Unicode codepoint and JS-string limits.
    $chunk=''; $units=0;
    foreach (mb_str_split($text) as $char) {
        $size=mb_ord($char)>0xffff?2:1;
        if ($units+$size>3600) { $chunks[]=$chunk; $chunk=''; $units=0; }
        $chunk.=$char; $units+=$size;
    }
    if ($chunk!=='') $chunks[]=$chunk;
    $total=count($chunks);
    return array_map(static fn(string $part,int $i): string=>'BANGER.SU / '.$lead['requestId'].' / '.($i+1).'/'.$total."\n".$part,$chunks,array_keys($chunks));
}
