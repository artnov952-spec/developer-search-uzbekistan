#!/bin/bash
set -euo pipefail
set +x
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
RUNTIME_ENV="$ROOT/.runtime/server.env"
if [[ ! -r "$RUNTIME_ENV" ]]; then echo "Missing $RUNTIME_ENV; run scripts/setup-local-runtime.sh first" >&2; exit 1; fi
set -a; source "$RUNTIME_ENV"; set +a
NODE_DIR="$(dirname "$NODE_BIN")"
NPM_BIN="$NODE_DIR/npm"
export PATH="$NODE_DIR:/usr/bin:/bin:/usr/sbin:/sbin"
cd "$ROOT"
exec "$NPM_BIN" run preview -w apps/preview -- --host 127.0.0.1 --port 4180 --strictPort
