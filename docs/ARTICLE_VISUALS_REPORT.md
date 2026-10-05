# Визуалы «Полезное» — проверка 2026-10-05

Прочитано полное ТЗ `Фотодля статей/BANGER_SU_article_visuals_for_Codex.docx`. Извлечены 21 обложка с точной привязкой по таблицам документа, преобразованы из PNG в WebP 1600×900 без изменения композиции. На карточках — 16:9, object-fit: cover, размеры и lazy loading. Все статьи получили coverImage и соответствующие OG/Twitter; production metadata использует https://banger.su без staging prefix.

Hero: сохранена реальная парная в исследовательской статье; отдельный утверждённый JFIF обработки древесины подготовлен в WebP/AVIF и используется как 3D-hero. Остальные 19 hero используют обложки DOCX. Тексты и SEO/URL всех 21 статьи не изменены. Карта файлов и SHA256 — article-covers-source.json и article-visual-sources.json. Источники сохранены без изменения. Каталог, цены, планы, категории и изображения моделей не изменены.

Правило проверки папки при каждой работе с /poleznoe закреплено в AGENTS.md. При отсутствии нового утверждённого файла сохраняется текущий визуал.

Проверки:
- npm run build — PASS, 21/21 slash aliases.
- npm run check:static -- --base-url http://127.0.0.1:56756 — PASS: 105 HTML, 249 локальных URL, 31 модель / 28 планировок, errors []. Включены все 21 URL обложек HTTP 200.
- verify-articles-word.py — PASS 20/20: полный текст, H1/title, description, canonical, sitemap, slash aliases.
- verify-article-covers.py — PASS 21/21: карточки, OG/Twitter, SHA256 обложек и неизменность источников.
- Сравнение данных с HEAD — все 21 текста/SEO/URL и массивы каталога неизменны.
- Браузер: 21 страница × DAY/NIGHT × 1440/390 = 84 проверки, hero загружены, горизонтального overflow нет. Проверены снимки всех вариантов, сетка карточек в обеих темах и ширинах. Свидетельства: C:/Users/maxto/.codex/tmp/banger-article-visual-workflow/.

Новых проблем не обнаружено. Push не выполнялся; production и DNS не изменялись.
