# Social/QR — реальные ссылки владельца

VK: https://vk.ru/banigerasimov

Instagram: https://www.instagram.com/banigerasimov?stkn=ZHR3d3M3eTRqYnJh&utm_source=qr

Оба адреса сохранены без изменений в src/data/social.ts. При build созданы реальные vk-qr.svg и instagram-qr.svg. MAX/Telegram сохранены.

Проверено: 1440/390 px, Hero и Footer, порядок MAX → VK → Telegram → Instagram, точные href, QR 140px desktop / 133px mobile Hero, отсутствие horizontal scroll. Контролы ссылок кликабельны; параметры Instagram сохранены. Доступность внешних профилей и авторизация на сторонних платформах не входят в проверку локальных маршрутов.

npm run build — PASS. npm run check:static — PASS: 136 HTML, 286 локальных URL, 31 модель, 28 планировок, errors [].

VK и Instagram больше не требуют данных владельца. Остальные ранее перечисленные потребности (MAX backend credentials/HTTPS hosting, цена поддона) остаются без изменений. Push не выполнялся.
