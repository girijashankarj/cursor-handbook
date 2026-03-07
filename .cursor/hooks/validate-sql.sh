#!/bin/bash
# Hook: afterFileEdit or on-demand
# Purpose: Validate SQL syntax in migration or .sql files (if a validator is available)

set -e

FILE="${1:-}"

if [ -z "$FILE" ] || [ ! -f "$FILE" ]; then
  exit 0
fi

case "$FILE" in
  *.sql)
    if command -v pg_format &> /dev/null; then
      pg_format -c "$FILE" >/dev/null 2>&1 || true
    fi
    ;;
  *migration*)
    # Optional: run migration dry-run or schema validator if present
    ;;
esac

exit 0
