#!/bin/bash
# Hook: beforeShellExecution
# Purpose: Guard against dangerous or expensive shell commands
# Prevents accidental execution of costly operations

set -e

COMMAND="${1:-}"

if [ -z "$COMMAND" ]; then
  exit 0
fi

# Block dangerous commands
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
    echo "🛑 BLOCKED: Dangerous command detected: $pattern"
    echo "This command has been blocked by shell-guard hook."
    echo "If you need to run this command, disable the hook in hooks.json."
    exit 1
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
