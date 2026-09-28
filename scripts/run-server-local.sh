#!/bin/bash
set -euo pipefail
set +x
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
RUNTIME_ENV="$ROOT/.runtime/server.env"
if [[ ! -r "$RUNTIME_ENV" ]]; then echo "Missing $RUNTIME_ENV; run scripts/setup-local-runtime.sh first" >&2; exit 1; fi
set -a
# This ignored file is owner-readable only and contains no Telegram token.
source "$RUNTIME_ENV"
set +a
DEVELOPER_SEARCH_TELEGRAM_BOT_TOKEN="$(/usr/bin/security find-generic-password -s DEVELOPER_SEARCH_TELEGRAM_BOT_TOKEN -w)"
export DEVELOPER_SEARCH_TELEGRAM_BOT_TOKEN
cd "$ROOT"
exec "$NODE_BIN" apps/server/src/index.mjs
