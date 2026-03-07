#!/bin/bash
# Hook: beforeSubmitPrompt
# Purpose: Enrich AI prompts with project context
# This hook adds relevant project context to prompts automatically

set -e

# Load project configuration
CONFIG_FILE=".cursor/config/project.json"

if [ ! -f "$CONFIG_FILE" ]; then
  echo "Warning: Project configuration not found at $CONFIG_FILE"
  exit 0
fi

# Extract key configuration values
PROJECT_NAME=$(jq -r '.project.name // "unknown"' "$CONFIG_FILE" 2>/dev/null || echo "unknown")
TECH_STACK=$(jq -r '.techStack.language // "unknown"' "$CONFIG_FILE" 2>/dev/null || echo "unknown")
FRAMEWORK=$(jq -r '.techStack.framework // "unknown"' "$CONFIG_FILE" 2>/dev/null || echo "unknown")

echo "Context: Project=$PROJECT_NAME, Stack=$TECH_STACK/$FRAMEWORK"
echo "Rules: Token efficiency, security guardrails, soft-delete only"
