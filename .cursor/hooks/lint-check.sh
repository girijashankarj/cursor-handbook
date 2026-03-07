#!/bin/bash
# Hook: afterFileEdit or beforeShellExecution
# Purpose: Run lint on changed or specified files

set -e

TARGET="${1:-.}"

if [ "$TARGET" = "." ] && [ -f "package.json" ]; then
  if grep -q '"lint"' package.json; then
    npm run lint -- --max-warnings 0 2>/dev/null || true
  fi
elif [ -f "$TARGET" ]; then
  if command -v eslint &> /dev/null; then
    eslint "$TARGET" 2>/dev/null || true
  fi
fi

exit 0
