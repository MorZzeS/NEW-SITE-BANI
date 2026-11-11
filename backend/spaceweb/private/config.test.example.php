<?php
declare(strict_types=1);
return [
    'environment' => 'TEST', 'enabled' => false, 'dry_run' => true,
    'origins' => [], 'consent_version' => '', 'policy_version' => '',
    'document_bundle_path' => '', 'document_bundle_sha256' => '',
    // Dedicated test bot and authorised test recipient, used only by bin/outbox.php --test.
    'max_test_destination' => ['token' => '', 'recipient_type' => '', 'recipient_id' => '', 'approved' => false],
    'approved' => false, 'db_dsn' => '', 'db_user' => '', 'db_password' => '',
    'ip_hmac_key' => '', 'notify_enabled' => false, 'max_tls_public_ca_verified' => false,
    'system_ca_bundle' => '', // Actual maintained host CA bundle, never the Ministry root alone.
    'backup_cleanup_approved' => false,
    'backup_enabled' => false, 'backup_approved' => false, 'backup_dir' => '', 'backup_key_base64' => '',
    'retention_enabled' => false, 'retention_execution_approved' => false, 'retention_seconds' => [],
    'document_archive_contract_verified' => false, // Blocked until coordinated archive/hash contract is implemented and reviewed.
    'retention_approved' => false, 'ru_storage_confirmed' => false, 'ru_backups_confirmed' => false,
];
