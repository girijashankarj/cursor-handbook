#!/bin/bash
# Search for a term across rules, agents, commands, and skills.

set -e

QUERY="${1:-}"

if [ -z "$QUERY" ]; then
  echo "Usage: $0 <search-term>"
  exit 1
fi

ROOT=".cursor"
echo "Searching for: $QUERY"
echo ""

for dir in rules agents commands skills; do
  if [ -d "$ROOT/$dir" ]; then
    echo "=== $dir ==="
    grep -ril "$QUERY" "$ROOT/$dir" 2>/dev/null || true
    echo ""
  fi
done
