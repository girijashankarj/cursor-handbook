#!/bin/bash
# Hook: afterFileEdit or beforeShellExecution
# Purpose: Run type check (e.g. tsc --noEmit) for TypeScript projects

set -e

if [ ! -f "package.json" ]; then
  exit 0
fi

if grep -q '"type-check"' package.json || grep -q '"typecheck"' package.json; then
  npm run type-check 2>/dev/null || npm run typecheck 2>/dev/null || true
elif command -v tsc &> /dev/null && [ -f "tsconfig.json" ]; then
  tsc --noEmit 2>/dev/null || true
fi

exit 0
