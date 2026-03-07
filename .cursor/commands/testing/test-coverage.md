# Command: Check Coverage

## Invocation
`/check-coverage`

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

## Expected Output
- Coverage percentage by file
- Files below threshold highlighted
- Overall project coverage
