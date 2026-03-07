#!/bin/bash
# Hook: beforeShellExecution (for git commit)
# Purpose: Run pre-commit checks before git operations
# Set CURSOR_HOOK_SECRETS_WARN_ONLY=1 to warn but not block (exit 0)

set -e

COMMAND="${1:-}"
WARN_ONLY="${CURSOR_HOOK_SECRETS_WARN_ONLY:-0}"

# Only run for git commit commands
if ! echo "$COMMAND" | grep -q "git commit"; then
  exit 0
fi

echo "Running pre-commit checks..."

# Check for secrets in staged files
STAGED_FILES=$(git diff --cached --name-only 2>/dev/null || echo "")

if [ -z "$STAGED_FILES" ]; then
  exit 0
fi

# Check for common secret patterns in staged files
SECRETS_FOUND=false
while IFS= read -r file; do
  if [ -f "$file" ]; then
    if grep -qiE "(password|secret|api_key|token)\s*[:=]\s*['\"][^'\"]+['\"]" "$file" 2>/dev/null; then
      echo "⚠️  Possible secret in staged file: $file"
      SECRETS_FOUND=true
    fi
  fi
done <<< "$STAGED_FILES"

# Check for .env files being committed
if echo "$STAGED_FILES" | grep -q "\.env"; then
  echo "🛑 WARNING: .env file is staged for commit!"
  echo "Remove it with: git reset HEAD .env"
  SECRETS_FOUND=true
fi

if [ "$SECRETS_FOUND" = true ]; then
  echo ""
  echo "⚠️  Potential secrets detected in staged files."
  echo "Please review before committing."
  echo "Pre-commit checks complete."
  [ "$WARN_ONLY" = "1" ] && exit 0 || exit 1
fi

echo "Pre-commit checks complete."
