#!/bin/bash
# Hook: afterFileEdit
# Purpose: Format code when a file is edited (alias for auto-format behavior)
# Use with Cursor hooks; runs formatter on the edited file

set -e

EDITED_FILE="${1:-}"

if [ -z "$EDITED_FILE" ]; then
  exit 0
fi

EXT="${EDITED_FILE##*.}"

if command -v prettier &> /dev/null; then
  case "$EXT" in
    ts|tsx|js|jsx|json|css|scss|md)
      prettier --write "$EDITED_FILE" 2>/dev/null || true
      ;;
  esac
elif command -v black &> /dev/null; then
  case "$EXT" in
    py)
      black -q "$EDITED_FILE" 2>/dev/null || true
      ;;
  esac
fi

exit 0
