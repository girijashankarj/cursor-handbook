#!/bin/bash
# Estimate token count for a file or directory (rough approximation for LLM context).
# Uses wc -w * 1.3 as a simple heuristic; for accurate counts use tiktoken or similar.

set -e

TARGET="${1:-.}"

count_tokens() {
  local file="$1"
  if [ ! -f "$file" ]; then return; fi
  local words
  words=$(wc -w < "$file" 2>/dev/null || echo 0)
  echo "$file: ~$(( words * 13 / 10 )) tokens (approx)"
}

if [ -f "$TARGET" ]; then
  count_tokens "$TARGET"
elif [ -d "$TARGET" ]; then
  find "$TARGET" -type f \( -name "*.md" -o -name "*.mdc" -o -name "*.ts" -o -name "*.tsx" -o -name "*.py" \) \
    | head -50 \
    | while read -r f; do count_tokens "$f"; done
else
  echo "Usage: $0 <file-or-directory>"
  exit 1
fi
