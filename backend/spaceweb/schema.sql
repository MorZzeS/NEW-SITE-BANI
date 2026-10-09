-- Candidate MySQL 8 schema; run only on an explicitly approved isolated database.
CREATE TABLE leads (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 environment ENUM('TEST','PRODUCTION') NOT NULL,
 request_id VARCHAR(80) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
 payload_hash BINARY(32) NOT NULL,
 name VARCHAR(80) NOT NULL, phone VARCHAR(30) NOT NULL,
 model VARCHAR(160) NOT NULL, comment TEXT NOT NULL, page VARCHAR(600) NOT NULL,
 received_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
 UNIQUE KEY request_unique(environment, request_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE consent_journal (
 lead_id BIGINT UNSIGNED PRIMARY KEY,
 consent_version VARCHAR(100) NOT NULL, policy_version VARCHAR(100) NOT NULL,
 request_id VARCHAR(80) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
 page VARCHAR(600) NOT NULL, client_created_at VARCHAR(24) CHARACTER SET ascii NOT NULL,
 client_started_at_ms BIGINT UNSIGNED NOT NULL,
 assertion ENUM('client_asserted_v2') NOT NULL,
 recorded_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
 FOREIGN KEY (lead_id) REFERENCES leads(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE outbox (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 lead_id BIGINT UNSIGNED NOT NULL UNIQUE,
 created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
 state ENUM('pending','processing','sent','retry','unknown','dead') NOT NULL DEFAULT 'pending',
 attempts SMALLINT UNSIGNED NOT NULL DEFAULT 0,
 available_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
 lease_until TIMESTAMP(6) NULL, delivery_id VARCHAR(200) NULL,
 error_code VARCHAR(40) NULL,
 FOREIGN KEY (lead_id) REFERENCES leads(id), KEY ready(state,available_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE rate_buckets (
 environment ENUM('TEST','PRODUCTION') NOT NULL,
 ip_hash BINARY(32) NOT NULL, bucket BIGINT UNSIGNED NOT NULL,
 hits INT UNSIGNED NOT NULL,
 PRIMARY KEY(environment,ip_hash,bucket)
) ENGINE=InnoDB;
