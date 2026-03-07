---
name: coverage
description: Generate or report test coverage. Prefer current/changed files; never run full suite without confirmation.
---

# Command: Test Coverage

## Invocation
`/coverage`

## Description
Generate or report test coverage. Prefer running for current file or changed files to save tokens.

## Action
```bash
{{CONFIG.testing.coverageCommand}}
# Or for single file: {{CONFIG.testing.testCommand}} -- --coverage --testPathPattern={file}
```

## When to Use
- Before submitting PR
- After writing new tests
- Periodic coverage check
- Flag lines below {{CONFIG.testing.coverageMinimum}}%

## Token Cost
~20K tokens (single file) vs ~100K (full suite) — avoid full suite without confirmation

## Expected Output
- **Success**: Coverage % by file; statements/branches/functions; files below threshold
- **Failure**: Test failures; missing coverage config

## Troubleshooting
- **Full suite**: Do not run without user confirmation when token cost is a concern
- **Scope**: Use `--testPathPattern` or `--changedSince` when available
