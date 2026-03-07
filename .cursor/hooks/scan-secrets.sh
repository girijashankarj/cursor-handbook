#!/bin/bash
# Hook: beforeShellExecution (e.g. before git push) or on-demand
# Purpose: Scan staged or working files for likely secrets

set -e

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

[ $FOUND -eq 1 ] && echo "Review and remove secrets before committing."
exit 0
