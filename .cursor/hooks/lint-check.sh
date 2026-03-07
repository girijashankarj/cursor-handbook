#!/bin/bash
# Hook: afterFileEdit or beforeShellExecution
# Purpose: Run lint on project or specific file. Supports npm, pnpm, yarn.
# Usage: Invoked by Cursor hooks; optional arg = file path. Runs from project root.

set -e

TARGET="${1:-.}"

# Detect package manager
if [ -f "pnpm-lock.yaml" ] && command -v pnpm &> /dev/null; then
  PM="pnpm"
elif [ -f "yarn.lock" ] && command -v yarn &> /dev/null; then
  PM="yarn"
else
  PM="npm"
fi

if [ "$TARGET" = "." ] && [ -f "package.json" ]; then
  if grep -q '"lint"' package.json; then
    $PM run lint -- --max-warnings 0 2>/dev/null || true
  fi
elif [ -f "$TARGET" ]; then
  if command -v eslint &> /dev/null; then
    eslint "$TARGET" 2>/dev/null || true
  fi
fi

exit 0
