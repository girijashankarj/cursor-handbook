---
name: lint-check
description: Check lint errors using read_lints tool instead of full lint. Saves ~50K tokens.
---

# Command: Lint Check

## Invocation
`/lint-check`

## Description
Check for lint errors using the `read_lints` tool instead of running the full linter. Saves ~50K tokens.

## Action
Use the `read_lints` tool on recently changed files. Do NOT run the full lint command.

## When to Use
- After making code changes
- Before committing
- Quick quality check

## Token Cost
~2K tokens (vs ~50K for full lint run)

## Expected Output
- **Success**: No lint errors; or list of errors with file/line
- **Failure**: Use `read_lints` tool output

## Troubleshooting
- **NEVER** run `{{CONFIG.testing.lintCommand}}` directly — always use `read_lints` tool
