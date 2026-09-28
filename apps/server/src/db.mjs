import { DatabaseSync } from 'node:sqlite'
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

export function openDatabase(dbPath) {
  fs.mkdirSync(path.dirname(dbPath), { recursive: true })
  const db = new DatabaseSync(dbPath)
  db.exec('PRAGMA foreign_keys = ON; PRAGMA journal_mode = WAL; PRAGMA busy_timeout = 5000;')
  return db
}
export function migrate(db, migrationsDir = new URL('../migrations/', import.meta.url)) {
  db.exec('CREATE TABLE IF NOT EXISTS schema_migrations (version TEXT PRIMARY KEY, applied_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)')
  const applied = new Set(db.prepare('SELECT version FROM schema_migrations').all().map(row => row.version))
  const dir = migrationsDir instanceof URL ? migrationsDir : new URL(`${pathToFileURL(path.resolve(migrationsDir)).href}/`)
  const files = fs.readdirSync(dir).filter(name => /^\d+.*\.sql$/.test(name)).sort()
  for (const file of files) {
    if (applied.has(file)) continue
    const sql = fs.readFileSync(new URL(file, dir), 'utf8')
    db.exec('BEGIN IMMEDIATE')
    try { db.exec(sql); db.prepare('INSERT INTO schema_migrations(version) VALUES (?)').run(file); db.exec('COMMIT') }
    catch (error) { db.exec('ROLLBACK'); throw error }
  }
}
