---
name: test-coverage
description: Run test coverage report and check against minimum threshold.
---

# Command: Test Coverage

## Invocation
`/test-coverage`

## Description
Run test coverage report and check against minimum threshold.

## Action
```bash
{{CONFIG.testing.coverageCommand}}
```

## When to Use
- Before submitting PR
- After writing new tests
- Periodic coverage check

## Threshold
Minimum: {{CONFIG.testing.coverageMinimum}}%

## Token Cost
~20K tokens (single-file) vs ~100K (full suite)

## Expected Output
- Coverage percentage by file
- Files below threshold highlighted
- Overall project coverage

## Troubleshooting
- **No coverage command**: Use `jest --coverage` or `vitest run --coverage`
- **Scope**: Prefer `--testPathPattern` or changed files only
