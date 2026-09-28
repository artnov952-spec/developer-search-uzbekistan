ALTER TABLE users ADD COLUMN phone_number TEXT;
CREATE INDEX IF NOT EXISTS users_phone_number_idx ON users(phone_number);
