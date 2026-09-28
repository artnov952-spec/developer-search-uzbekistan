CREATE TABLE IF NOT EXISTS auth_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  telegram_user_id TEXT,
  display_name TEXT,
  phone_number TEXT,
  event_type TEXT NOT NULL,
  success INTEGER NOT NULL DEFAULT 1,
  ip_address TEXT,
  user_agent TEXT,
  details_json TEXT NOT NULL DEFAULT '{}',
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS auth_events_created_idx ON auth_events(created_at DESC);
CREATE INDEX IF NOT EXISTS auth_events_user_idx ON auth_events(user_id, created_at DESC);
