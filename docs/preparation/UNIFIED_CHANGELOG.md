# Единое ТЗ: журнал подготовки — 08.10.2026

Статус: В РАБОТЕ. Публикация запрещена. Ветка prep/banger-unified-20261008, база cfc2ad5d114f79c6bfd45de1b6fd294966b0a23a. Исходные main/untracked сохранены в исходном checkout.

## A — фактический аудит
- Production GitHub Actions .github/workflows/deploy.yml автоматически публикует push main. Не изменён. Новые staging templates будут вне .github/workflows и неактивны.
- Текущий путь заявки: браузер -> src/components/forms/CTAFormInline.tsx -> src/lib/leads.ts (единственный NEXT_PUBLIC_LEADS_ENDPOINT) -> Render Node backend -> MAX user_id=2758798. Постоянной локальной БД Node backend нет; фактические сроки provider logs неизвестны.
- Формы: имя, телефон, модель, комментарий, page URL, requestId, client createdAt, checkbox, honeypot и startedAt. Checkbox false по умолчанию. Документальная версия в текущем payload отсутствует.
- localStorage: banger-theme; Favorites читает banger-favorites, подключение компонента требует проверки. Аналитика/pixels/iframes/sessionStorage в src поиском не обнаружены. Google font загружается Next на этапе build и self-hosted; это не доказательство отсутствия provider access logs.
- Юридические страницы /politika и /privacy содержат неподтверждённые заявления: обработка/БД РФ, хранение версии согласия, действующий cookie banner, отсутствие передачи третьим лицам, сбор email. Эти страницы production не переписаны; проекты замены отдельно ожидают утверждения.
- HTTP swtest не допускает реальные ПД. Test endpoint должен быть пустым; Render запрещён. Сертификат на чужой banger.ru не оформляется.

## Владельцы файлов
- frontend: HeroSection, Header, SocialBlock, globals.css, новые video CTA/flag; не трогает формы/данные/изображения/trust/theme architecture.
- backend: backend/spaceweb/**. Текущий Render и секреты не изменяет.
- devops: docs/deployment/**, scripts/spaceweb/**. Действующий workflow не изменяет.
- coordinator: docs/preparation/**, юридические draft outputs после legal review, leads/form evidence wiring после утверждения контракта. Lockfile не меняется.

## Запуск ролей
Через свежий native Codex CLI с настоящим agent_type. Elevated сохранён; индивидуальные команды могут проходить штатный auto_review. Unelevated/full-access не используется. Доказательства запусков и отчёты: соседняя папка banger-unified-role-runs. Глобальная конфигурация 16 ролей не изменяется.

## Контрольные точки
B frontend — ожидается. C legal/consent — ожидается; сведения оператора/сроки/рассылки запрошены. D PHP/MySQL — ожидается. E inactive staging — ожидается. F build/static/security/QA/independent review — ожидается.

Браузерная проверка ранее заблокирована elevated provisioning: node_repl.exe sharing violation os error 32. Не выдавать анализ CSS или HTTP за visual PASS.

## B–F — результаты 09.10.2026
Frontend, consent contracts/drafts, disabled PHP/MySQL, inactive deployment templates и static preview готовы в проверенном локальном объёме. Build/static,Node5,PHP17lint/55offline,42safety/928packaging/29transfer,779Apache/ZIP PASS. Coordinator syntheticMySQL8.4 schema/fakeoutbox+9SQLsnapshot checks PASS; ephemeral server/data/credentials удалены. Browser matrix и взаимодействия проверены coordinator, independent UI/realhosting/MAX остаются unverified. Reviewers выявили конкретные defects, исполнители исправили, affected checks повторены. Полный отчёт FINAL_REPORT.md; deploy/activationBLOCKED, правовые проекты AwaitingApproval. No push/upload/DNS/Renderchange.
