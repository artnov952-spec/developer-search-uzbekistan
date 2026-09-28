import { loadConfig } from './config.mjs'
import { openDatabase, migrate } from './db.mjs'
const config = loadConfig({ requireTelegram: false })
const db = openDatabase(config.dbPath)
migrate(db)
db.close()
console.log('Database migrations applied')
