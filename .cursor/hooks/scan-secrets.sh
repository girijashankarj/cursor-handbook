#!/bin/bash
# Hook: beforeShellExecution (e.g. before git push) or on-demand
# Purpose: Scan staged or working files for likely secrets
# Set CURSOR_HOOK_SECRETS_WARN_ONLY=1 to warn but not block (exit 0)

set -e

WARN_ONLY="${CURSOR_HOOK_SECRETS_WARN_ONLY:-0}"
FILES="${1:-}"

if [ -z "$FILES" ]; then
  FILES=$(git diff --cached --name-only 2>/dev/null || git ls-files 2>/dev/null || echo "")
fi

FOUND=0
PATTERNS="(password|secret|api_key|apikey|token|private_key)\s*[:=]\s*['\"][^'\"]{8,}['\"]"

for f in $FILES; do
  [ ! -f "$f" ] && continue
  if grep -qiE "$PATTERNS" "$f" 2>/dev/null; then
    echo "⚠️  Possible secret in: $f"
    FOUND=1
  fi
done

if [ $FOUND -eq 1 ]; then
  echo "Review and remove secrets before committing."
  [ "$WARN_ONLY" = "1" ] && exit 0 || exit 1
fi
exit 0
