# Cursor Hooks

Hooks run automatically at key points in the Cursor AI loop.

## Canonical configuration

**The active hook config is `.cursor/hooks.json`** (project root). Cursor reads that file only.

| File | Purpose |
|------|---------|
| `.cursor/hooks.json` | **Canonical** — Cursor uses this |
| `.cursor/hooks/hooks.json` | Reference schema (different format); not used by Cursor |

## Active vs available

| Status | Count | Scripts |
|--------|-------|---------|
| **Active** (wired in `.cursor/hooks.json` by default) | 4 | `context-enrichment.sh`, `post-edit-check.sh`, `auto-format.sh`, `shell-guard.sh` |
| **Available** (ready to enable) | 8 | `inject-context.sh`, `format-on-edit.sh`, `lint-check.sh`, `type-check.sh`, `pre-commit-check.sh`, `scan-secrets.sh`, `validate-sql.sh`, `coverage-check.sh` |

To enable an available hook, add it to `.cursor/hooks.json` under the appropriate event. See each script's header for its intended trigger.

## Active hooks (default)

| Script | Trigger | Description |
|--------|---------|-------------|
| `context-enrichment.sh` | beforeSubmitPrompt | Injects project config into prompts (requires `jq`) |
| `post-edit-check.sh` | afterFileEdit | Validates changes, checks for secrets |
| `auto-format.sh` | afterFileEdit | Formats edited files |
| `shell-guard.sh` | beforeShellExecution | Blocks dangerous commands, warns on expensive ops |

## Adding hooks

Edit `.cursor/hooks.json` and add your script path under the appropriate trigger.
