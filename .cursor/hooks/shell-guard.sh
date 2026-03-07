#!/bin/bash
# Hook: beforeShellExecution
# Purpose: Block dangerous commands (rm -rf /, DROP TABLE, etc.) and warn on expensive ones (full test, lint).
# Exit 2 = block; exit 0 = allow. Invoked by Cursor with command string.

set -e

COMMAND="${1:-}"

if [ -z "$COMMAND" ]; then
  exit 0
fi

# Block dangerous commands (exit 2 per Cursor hooks spec = deny)
DANGEROUS_PATTERNS=(
  "rm -rf /"
  "rm -rf ~"
  "DROP DATABASE"
  "DROP TABLE"
  "DELETE FROM"
  "TRUNCATE"
  "format c:"
  "mkfs"
)

for pattern in "${DANGEROUS_PATTERNS[@]}"; do
  if echo "$COMMAND" | grep -qi "$pattern"; then
    echo "BLOCKED: Dangerous command detected: $pattern"
    echo "This command has been blocked by shell-guard hook."
    echo "To run it: disable the hook in .cursor/hooks.json or run outside Cursor."
    exit 2
  fi
done

# Warn about expensive commands
EXPENSIVE_PATTERNS=(
  "npm test$"
  "jest$"
  "pytest$"
  "npm run lint$"
  "eslint \."
)

for pattern in "${EXPENSIVE_PATTERNS[@]}"; do
  if echo "$COMMAND" | grep -qiE "$pattern"; then
    echo "⚠️  Warning: This command may be expensive (high token usage)."
    echo "Consider using a more targeted version instead."
    echo "Command: $COMMAND"
  fi
done
