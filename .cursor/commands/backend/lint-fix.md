---
name: lint-fix
description: Auto-fix lint issues in backend code. Safe fixes only; list unfixable errors.
---

# Command: Lint Fix

## Invocation
`/lint-fix`

## Description
Auto-fix lint issues in backend code. Restrict to backend/source paths; prefer safe fixes.

## Action
```bash
{{CONFIG.testing.lintCommand}} -- --fix
# Or: eslint --fix "{{CONFIG.paths.source}}/**/*.{ts,js}"
```

## When to Use
- After lint-check reports fixable issues
- Before committing
- Quick cleanup of formatting/unused imports

## Token Cost
~10K tokens (depends on file count)

## Expected Output
- **Success**: Fixed files; remaining unfixable errors listed
- **Failure**: Linter config errors; parse errors

## Troubleshooting
- **Unfixable errors**: List them and suggest manual edits
- **Scope**: Backend/source only; exclude generated/vendor files
- **Behavior**: Prefer safe fixes (formatting, unused imports); avoid changing logic
