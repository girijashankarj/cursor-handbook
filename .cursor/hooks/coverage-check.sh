#!/bin/bash
# Hook: afterTestRun
# Purpose: Check test coverage after test runs
# Warns if coverage drops below minimum threshold

set -e

CONFIG_FILE=".cursor/config/project.json"

# Default minimum coverage
MIN_COVERAGE=90

# Try to read from config
if [ -f "$CONFIG_FILE" ] && command -v jq &> /dev/null; then
  MIN_COVERAGE=$(jq -r '.testing.coverageMinimum // 90' "$CONFIG_FILE" 2>/dev/null || echo "90")
fi

# Look for coverage summary
COVERAGE_FILE="coverage/coverage-summary.json"

if [ ! -f "$COVERAGE_FILE" ]; then
  echo "No coverage report found. Run tests with --coverage flag."
  exit 0
fi

if command -v jq &> /dev/null; then
  TOTAL_COVERAGE=$(jq -r '.total.lines.pct // 0' "$COVERAGE_FILE" 2>/dev/null || echo "0")

  echo "Test Coverage: ${TOTAL_COVERAGE}%"
  echo "Minimum Required: ${MIN_COVERAGE}%"

  if (( $(echo "$TOTAL_COVERAGE < $MIN_COVERAGE" | bc -l 2>/dev/null || echo "0") )); then
    echo "⚠️  Coverage is below minimum threshold!"
    echo "Please add tests to bring coverage to ${MIN_COVERAGE}% or above."
    exit 1
  else
    echo "✅ Coverage meets minimum threshold."
  fi
fi
