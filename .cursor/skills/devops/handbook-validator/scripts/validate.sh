#!/bin/bash
# Validate cursor-handbook structure and config.

set -e

ERRORS=0

echo "Validating cursor-handbook..."

# Check .cursor exists
if [ ! -d ".cursor" ]; then
  echo "FAIL: .cursor directory not found"
  ERRORS=$((ERRORS + 1))
fi

# Check config
if [ ! -f ".cursor/config/project.json" ] && [ ! -f ".cursor/config/project.json.template" ]; then
  echo "WARN: No project.json or project.json.template in .cursor/config/"
fi

# Check hooks.json (Cursor reads .cursor/hooks.json at project root only)
if [ ! -f ".cursor/hooks.json" ]; then
  echo "WARN: No .cursor/hooks.json found (Cursor expects project-level hooks there)"
fi

# Check at least one rule
if [ ! -d ".cursor/rules" ] || [ -z "$(find .cursor/rules -name '*.mdc' 2>/dev/null | head -1)" ]; then
  echo "FAIL: No .mdc rules found in .cursor/rules/"
  ERRORS=$((ERRORS + 1))
fi

if [ $ERRORS -eq 0 ]; then
  echo "OK: Basic structure valid"
else
  echo "Found $ERRORS error(s)"
  exit 1
fi
