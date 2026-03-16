#!/usr/bin/env bash
# InfiPragma Notification Helper
# Usage: notify.sh "message" [level]
# level: info (default), warning, critical

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONFIG="$SCRIPT_DIR/config.yaml"

message="${1:-}"
level="${2:-info}"

if [ -z "$message" ]; then
  echo "Usage: notify.sh \"message\" [level]"
  exit 1
fi

# Webhook notification
webhook=$(yq '.notify.webhook' "$CONFIG" 2>/dev/null)
if [ -n "$webhook" ] && [ "$webhook" != "null" ] && [ "$webhook" != "" ]; then
  # Escape message for safe JSON embedding
  safe_message=$(printf '%s' "[InfiPragma ${level}] ${message}" | sed 's/\\/\\\\/g; s/"/\\"/g; s/\t/\\t/g' | tr '\n' ' ')
  curl -s -X POST "$webhook" \
    -H "Content-Type: application/json" \
    -d "{\"text\":\"${safe_message}\"}" \
    > /dev/null 2>&1 || true
fi

# Telegram notification
telegram_token=$(yq '.notify.telegram' "$CONFIG" 2>/dev/null)
if [ -n "$telegram_token" ] && [ "$telegram_token" != "null" ] && [ "$telegram_token" != "" ]; then
  echo "[notify] Telegram configured but chat_id not yet supported"
fi

# Log notification
echo "[$(date -u +%FT%TZ)] [$level] $message"
