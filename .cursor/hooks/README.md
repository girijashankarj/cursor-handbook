# Cursor Hooks

Hooks run automatically at key points in the Cursor AI loop.

## Canonical configuration

**The only hook config Cursor loads for this project is `.cursor/hooks.json`** at the repository root (next to the `hooks/` folder). Format: `version: 1` and per-event **arrays** of `{ "command": ".cursor/hooks/script.sh" }`. Official reference: [Hooks](https://cursor.com/docs/agent/hooks).

## Scripts in this folder

| Status | Count | Scripts |
|--------|-------|---------|
| **Wired by default** in `.cursor/hooks.json` | 4 | `context-enrichment.sh`, `post-edit-check.sh`, `auto-format.sh`, `shell-guard.sh` |
| **Available** (add a `command` entry to enable) | 8 | `inject-context.sh`, `format-on-edit.sh`, `lint-check.sh`, `type-check.sh`, `pre-commit-check.sh`, `scan-secrets.sh`, `validate-sql.sh`, `coverage-check.sh` |

To enable an extra hook, append another `{ "command": ".cursor/hooks/<name>.sh" }` under the right event in `.cursor/hooks.json`. See each script’s header for its intended trigger.

## Default wired hooks

| Script | Trigger | Description |
|--------|---------|-------------|
| `context-enrichment.sh` | beforeSubmitPrompt | Injects project config into prompts (requires `jq`) |
| `post-edit-check.sh` | afterFileEdit | Validates changes, checks for secrets |
| `auto-format.sh` | afterFileEdit | Formats edited files |
| `shell-guard.sh` | beforeShellExecution | Blocks dangerous commands, warns on expensive ops |

## Adding hooks

Edit `.cursor/hooks.json` and add your script path under the appropriate event as a new object in that event’s array.
