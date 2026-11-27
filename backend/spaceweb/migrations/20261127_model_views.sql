-- Additive BANGER.SU model-view counters. Run only in the dedicated BANGER.SU database.
-- The table stores exactly the allowlisted model ID and its aggregate page-open count.
CREATE TABLE IF NOT EXISTS model_view_counts (
  model_id VARCHAR(80) CHARACTER SET ascii COLLATE ascii_bin NOT NULL PRIMARY KEY,
  views BIGINT UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT IGNORE INTO model_view_counts (model_id, views) VALUES
  ('bg-09', 0), ('bg-10', 0), ('bg-11', 0), ('bg-12', 0),
  ('bg-13', 0), ('bg-14', 0), ('bg-15', 0), ('bg-16', 0),
  ('bg-17', 0), ('bg-18', 0), ('bg-19', 0), ('bg-20', 0),
  ('bg-21', 0), ('bg-28', 0);
