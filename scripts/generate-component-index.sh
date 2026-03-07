#!/bin/bash
# Verify COMPONENT_INDEX.md counts match filesystem.
# Exit 1 if drift detected. Run from project root.

set -e

CURSOR=".cursor"
INDEX="COMPONENT_INDEX.md"

RULES=$(find "$CURSOR/rules" \( -name "*.mdc" -o -name "*.md" \) 2>/dev/null | wc -l | tr -d ' ')
AGENTS=$(find "$CURSOR/agents" -maxdepth 1 -name "*.md" 2>/dev/null | wc -l | tr -d ' ')
SKILLS=$(find "$CURSOR/skills" -name "SKILL.md" 2>/dev/null | wc -l | tr -d ' ')
COMMANDS=$(find "$CURSOR/commands" -name "*.md" ! -name "COMMAND_TEMPLATE.md" 2>/dev/null | wc -l | tr -d ' ')
HOOKS=$(find "$CURSOR/hooks" -name "*.sh" 2>/dev/null | wc -l | tr -d ' ')

# Extract counts from COMPONENT_INDEX.md
INDEX_RULES=$(grep -E "^## Rules \([0-9]+\)" "$INDEX" 2>/dev/null | sed 's/.*(\([0-9]*\)).*/\1/' || echo "0")
INDEX_AGENTS=$(grep -E "^## Agents \([0-9]+\)" "$INDEX" 2>/dev/null | sed 's/.*(\([0-9]*\)).*/\1/' || echo "0")
INDEX_SKILLS=$(grep -E "^## Skills \([0-9]+\)" "$INDEX" 2>/dev/null | sed 's/.*(\([0-9]*\)).*/\1/' || echo "0")
INDEX_COMMANDS=$(grep -E "^## Commands \([0-9]+\)" "$INDEX" 2>/dev/null | sed 's/.*(\([0-9]*\)).*/\1/' || echo "0")
INDEX_HOOKS=$(grep -E "^## Hooks \([0-9]+\)" "$INDEX" 2>/dev/null | sed 's/.*(\([0-9]*\)).*/\1/' || echo "0")

ERR=0
[ "$RULES" != "$INDEX_RULES" ] && echo "Rules: index=$INDEX_RULES, actual=$RULES" && ERR=1
[ "$AGENTS" != "$INDEX_AGENTS" ] && echo "Agents: index=$INDEX_AGENTS, actual=$AGENTS" && ERR=1
[ "$SKILLS" != "$INDEX_SKILLS" ] && echo "Skills: index=$INDEX_SKILLS, actual=$SKILLS" && ERR=1
[ "$COMMANDS" != "$INDEX_COMMANDS" ] && echo "Commands: index=$INDEX_COMMANDS, actual=$COMMANDS" && ERR=1
[ "$HOOKS" != "$INDEX_HOOKS" ] && echo "Hooks: index=$INDEX_HOOKS, actual=$HOOKS" && ERR=1

if [ $ERR -eq 1 ]; then
  echo ""
  echo "COMPONENT_INDEX.md is out of date. Update the counts and file lists to match the filesystem."
  exit 1
fi

TOTAL=$((RULES + AGENTS + SKILLS + COMMANDS + HOOKS))
README_BADGE=$(grep -oE 'Components-[0-9]+-green' README.md 2>/dev/null | head -1 | sed 's/Components-\([0-9]*\)-green/\1/' || echo "0")
[ -n "$README_BADGE" ] && [ "$TOTAL" != "$README_BADGE" ] && echo "README badge: Components-$README_BADGE, actual total=$TOTAL. Update README.md badge." && exit 1

echo "Component counts verified: Rules=$RULES, Agents=$AGENTS, Skills=$SKILLS, Commands=$COMMANDS, Hooks=$HOOKS (total=$TOTAL)"
