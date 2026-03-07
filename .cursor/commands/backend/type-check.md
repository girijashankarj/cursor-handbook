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
- Clean: "No type errors found"
- Errors: List of type errors with file, line, and message
