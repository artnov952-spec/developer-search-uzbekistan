#!/bin/bash
set -euo pipefail
set +x
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
RUNTIME_DIR="$ROOT/.runtime"
ENV_FILE="$RUNTIME_DIR/server.env"
/usr/bin/security find-generic-password -s DEVELOPER_SEARCH_TELEGRAM_BOT_TOKEN >/dev/null 2>&1 || { echo "Keychain item DEVELOPER_SEARCH_TELEGRAM_BOT_TOKEN not found" >&2; exit 1; }
mkdir -p "$RUNTIME_DIR" "$ROOT/data" "$ROOT/logs"
chmod 700 "$RUNTIME_DIR"
if [[ -e "$ENV_FILE" ]]; then
  chmod 600 "$ENV_FILE"
  echo "Existing local runtime retained at $ENV_FILE (session secret was not rotated)."
  exit 0
fi
NODE_BIN="$(command -v node)"
SESSION_SECRET="$(/usr/bin/openssl rand -base64 48)"
umask 077
cat > "$ENV_FILE" <<ENV
DEVELOPER_SEARCH_SESSION_SECRET='$SESSION_SECRET'
DEVELOPER_SEARCH_ALLOWED_TELEGRAM_USER_IDS='910449149'
DEVELOPER_SEARCH_DB_PATH='$ROOT/data/developer-search.sqlite'
DEVELOPER_SEARCH_APP_ORIGIN='http://localhost:4180'
TELEGRAM_MODE='polling'
HOST='127.0.0.1'
PORT='4182'
NODE_ENV='development'
NODE_BIN='$NODE_BIN'
ENV
chmod 600 "$ENV_FILE"
echo "Local runtime created at $ENV_FILE (mode 600; Telegram token remains in Keychain)."
