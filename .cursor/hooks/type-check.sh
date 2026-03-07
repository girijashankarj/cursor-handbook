#!/bin/bash
# Hook: afterFileEdit or beforeShellExecution
# Purpose: Run type check (tsc --noEmit) for TypeScript projects
# Usage: Invoked by Cursor hooks; runs from project root. Supports npm, pnpm, yarn.

set -e

if [ ! -f "package.json" ]; then
  exit 0
fi

# Detect package manager
if [ -f "pnpm-lock.yaml" ] && command -v pnpm &> /dev/null; then
  PM="pnpm"
elif [ -f "yarn.lock" ] && command -v yarn &> /dev/null; then
  PM="yarn"
else
  PM="npm"
fi

if grep -q '"type-check"' package.json || grep -q '"typecheck"' package.json; then
  $PM run type-check 2>/dev/null || $PM run typecheck 2>/dev/null || true
elif command -v tsc &> /dev/null && [ -f "tsconfig.json" ]; then
  tsc --noEmit 2>/dev/null || true
fi

exit 0
