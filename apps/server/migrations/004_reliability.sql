CREATE UNIQUE INDEX IF NOT EXISTS login_codes_one_active_hash
ON login_codes(code_hash)
WHERE used_at IS NULL;

CREATE TABLE IF NOT EXISTS login_attempt_windows (
  attempt_key TEXT PRIMARY KEY,
  attempts INTEGER NOT NULL DEFAULT 0,
  window_started_at INTEGER NOT NULL,
  blocked_until INTEGER
);

CREATE TABLE IF NOT EXISTS telegram_polling_state (
  id INTEGER PRIMARY KEY CHECK(id = 1),
  next_update_id INTEGER NOT NULL DEFAULT 0,
  updated_at INTEGER NOT NULL
);
INSERT OR IGNORE INTO telegram_polling_state(id,next_update_id,updated_at) VALUES (1,0,0);

ALTER TABLE notification_outbox ADD COLUMN locked_at INTEGER;
CREATE INDEX IF NOT EXISTS notification_outbox_lease_idx ON notification_outbox(status,locked_at);
