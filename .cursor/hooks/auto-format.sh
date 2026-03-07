#!/bin/bash
# Hook: afterFileEdit
# Purpose: Auto-format edited files
# Runs the project's formatter on the edited file

set -e

EDITED_FILE="${1:-}"

if [ -z "$EDITED_FILE" ]; then
  exit 0
fi

# Get file extension
EXT="${EDITED_FILE##*.}"

# Check if formatter is available
if command -v prettier &> /dev/null; then
  case "$EXT" in
    ts|tsx|js|jsx|json|css|scss|md)
      prettier --write "$EDITED_FILE" 2>/dev/null || true
      ;;
  esac
elif command -v black &> /dev/null; then
  case "$EXT" in
    py)
      black "$EDITED_FILE" 2>/dev/null || true
      ;;
  esac
elif command -v gofmt &> /dev/null; then
  case "$EXT" in
    go)
      gofmt -w "$EDITED_FILE" 2>/dev/null || true
      ;;
  esac
fi
