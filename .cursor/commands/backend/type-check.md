---
name: type-check
description: Run TypeScript type checking without full test suite. Saves ~90K tokens vs full tests.
---

# Command: Type Check

## Invocation
`/type-check`

## Description
Run TypeScript type checking without full test suite execution. Saves ~90K tokens compared to running full tests.

## Action
```bash
{{CONFIG.testing.typeCheckCommand}}
```

## When to Use
- After making code changes
- Before committing
- Instead of running full tests for quick validation
- After refactoring type definitions

## Token Cost
~10K tokens (vs ~100K for full test suite)

## Expected Output
- **Success**: "Found 0 errors" or no output (exit 0)
- **Failure**: List of errors with file, line, column, and message (exit 1)

## Troubleshooting
- **"Cannot find module"**: Run `{{CONFIG.techStack.packageManager}} install`; check tsconfig paths
- **"Declaration emit" errors**: Often from missing types; add `@types/*` or fix import
- **Slow**: Use `--noEmit` if not building; exclude test files in tsconfig if needed

## Env Notes
- Requires `tsconfig.json` and TypeScript installed
- `NODE_OPTIONS` can affect memory; increase if large codebase fails
