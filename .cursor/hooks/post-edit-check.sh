#!/bin/bash
# Hook: afterFileEdit
# Purpose: Run lightweight checks after file edits
# Avoids expensive operations (full lint, full tests)

set -e

EDITED_FILE="${1:-}"

if [ -z "$EDITED_FILE" ]; then
  exit 0
fi

# Get file extension
EXT="${EDITED_FILE##*.}"

case "$EXT" in
  ts|tsx)
    echo "TypeScript file edited: $EDITED_FILE"
    echo "Recommendation: Run type-check to validate changes"
    ;;
  py)
    echo "Python file edited: $EDITED_FILE"
    echo "Recommendation: Run mypy or pyright for type checking"
    ;;
  sql)
    echo "SQL file edited: $EDITED_FILE"
    echo "Reminder: Ensure no DELETE statements (soft-delete only)"
    ;;
  json)
    # Validate JSON syntax
    if command -v jq &> /dev/null; then
      if ! jq empty "$EDITED_FILE" 2>/dev/null; then
        echo "Warning: Invalid JSON in $EDITED_FILE"
      fi
    fi
    ;;
esac

# Check for potential secrets in the edited file
if grep -qiE "(password|secret|api_key|token)\s*[:=]\s*['\"][^'\"]+['\"]" "$EDITED_FILE" 2>/dev/null; then
  echo "⚠️  Warning: Possible hardcoded secret detected in $EDITED_FILE"
  echo "Please use environment variables instead."
fi
