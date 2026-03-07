---
name: format
description: Format backend code using project formatter (e.g. Prettier). Backend paths only.
---

# Command: Format

## Invocation
`/format`

## Description
Format backend source files using the project's formatter (e.g. Prettier). Limit scope to backend paths.

## Action
```bash
# Prettier
npx prettier --write "{{CONFIG.paths.source}}/**/*.{ts,js,json}"

# Or project command
{{CONFIG.techStack.packageManager}} run format
```

## When to Use
- After making code changes
- Before committing
- After bulk edits

## Token Cost
—

## Expected Output
- **Success**: Formatted files; no logic changes
- **Failure**: Parser errors; unsupported syntax

## Scope
- Backend directories only ({{CONFIG.paths.source}})
- File types: .ts, .js, .json — do not change logic or add/remove imports
