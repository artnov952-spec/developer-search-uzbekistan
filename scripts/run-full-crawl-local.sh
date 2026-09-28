#!/bin/bash
set -euo pipefail
set +x
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
RUNTIME_ENV="$ROOT/.runtime/server.env"
if [[ ! -r "$RUNTIME_ENV" ]]; then echo "Missing local runtime; run scripts/setup-local-runtime.sh" >&2; exit 1; fi
set -a; source "$RUNTIME_ENV"; set +a
NODE="$NODE_BIN"; DB_PATH="$DEVELOPER_SEARCH_DB_PATH"
unset DEVELOPER_SEARCH_SESSION_SECRET DEVELOPER_SEARCH_ALLOWED_TELEGRAM_USER_IDS DEVELOPER_SEARCH_APP_ORIGIN
cd "$ROOT"
npm run crawl -- --input tools/contact-crawler/sources.json --output data/crawler-full.json --checkpoint data/crawler-full.checkpoint.json --resume --listing-pages 0 --candidates 0 --depth 3 --pages 30 --timeout 8000 --delay 150
DEVELOPER_SEARCH_DB_PATH="$DB_PATH" "$NODE" apps/server/src/import-crawler.mjs data/crawler-full.json
