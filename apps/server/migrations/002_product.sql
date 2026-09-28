CREATE TABLE saved_criteria (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  query TEXT NOT NULL DEFAULT '',
  filters_json TEXT NOT NULL DEFAULT '{}',
  enabled INTEGER NOT NULL DEFAULT 1 CHECK(enabled IN (0,1)),
  interval_minutes INTEGER NOT NULL DEFAULT 60 CHECK(interval_minutes BETWEEN 1 AND 10080),
  last_run_at INTEGER,
  next_run_at INTEGER,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
CREATE INDEX saved_criteria_due_idx ON saved_criteria(enabled,next_run_at);
CREATE INDEX saved_criteria_user_idx ON saved_criteria(user_id,id);

CREATE TABLE candidates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  external_id TEXT UNIQUE,
  name TEXT NOT NULL,
  headline TEXT,
  location TEXT,
  experience_years REAL,
  skills_json TEXT NOT NULL DEFAULT '[]',
  contacts_json TEXT NOT NULL DEFAULT '[]',
  source_url TEXT,
  data_json TEXT NOT NULL DEFAULT '{}',
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
CREATE INDEX candidates_updated_idx ON candidates(updated_at DESC,id DESC);

CREATE TABLE monitoring_runs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  criterion_id INTEGER NOT NULL REFERENCES saved_criteria(id) ON DELETE CASCADE,
  started_at INTEGER NOT NULL,
  finished_at INTEGER,
  status TEXT NOT NULL CHECK(status IN ('running','succeeded','failed')),
  candidates_scanned INTEGER NOT NULL DEFAULT 0,
  matches_found INTEGER NOT NULL DEFAULT 0,
  error TEXT
);
CREATE INDEX monitoring_runs_criterion_idx ON monitoring_runs(criterion_id,id DESC);

CREATE TABLE monitoring_matches (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  run_id INTEGER NOT NULL REFERENCES monitoring_runs(id) ON DELETE CASCADE,
  criterion_id INTEGER NOT NULL REFERENCES saved_criteria(id) ON DELETE CASCADE,
  candidate_id INTEGER NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
  matched_at INTEGER NOT NULL,
  UNIQUE(criterion_id,candidate_id)
);
CREATE INDEX monitoring_matches_run_idx ON monitoring_matches(run_id);

CREATE TABLE notification_outbox (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  match_id INTEGER NOT NULL UNIQUE REFERENCES monitoring_matches(id) ON DELETE CASCADE,
  channel TEXT NOT NULL DEFAULT 'telegram',
  payload_json TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','sending','sent','failed')),
  attempts INTEGER NOT NULL DEFAULT 0,
  available_at INTEGER NOT NULL,
  sent_at INTEGER,
  last_error TEXT,
  created_at INTEGER NOT NULL
);
CREATE INDEX notification_outbox_pending_idx ON notification_outbox(status,available_at,id);

CREATE TABLE telegram_connections (
  user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK(status IN ('connected','disconnected','reconnecting','error')),
  reconnect_requested_at INTEGER,
  last_connected_at INTEGER,
  last_error TEXT,
  updated_at INTEGER NOT NULL
);
