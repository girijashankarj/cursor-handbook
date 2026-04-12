# Testing & quality prompt

Use this when writing tests, improving coverage, or fixing test issues.

---

## Write unit tests

```
Write unit tests for [FILE_PATH].

Follow project conventions:
- Test naming: "should {expected behavior} when {condition}"
- AAA pattern (Arrange-Act-Assert)
- Mock all external deps (database, HTTP, cache, queue)
- Cover: happy path, null/empty inputs, boundary values, error cases
- Use factories from tests/mocks/factories/ if available
- Reset mocks between tests

Target: project's minimum coverage threshold.
```

## Improve coverage

```
Check the coverage for [MODULE_OR_FILE] and identify untested branches.

For each gap:
1. What's not covered (function, branch, line)
2. A test case that would cover it
3. Priority (critical path vs edge case)

Write the missing tests, starting with the highest-priority gaps.
```

## Fix a failing test

```
This test is failing:

Test: [TEST_NAME]
File: [TEST_FILE_PATH]
Error: [ERROR_MESSAGE]

Diagnose the root cause:
- Is the test wrong, or is the code wrong?
- Check if mocks are set up correctly
- Check if test data matches expected schema
- Check for async/timing issues

Fix it and explain what went wrong.
```

## Fix a flaky test

```
This test is flaky — passes sometimes, fails other times:

Test: [TEST_NAME]
File: [TEST_FILE_PATH]

Common flaky causes to check:
- Shared mutable state between tests
- Time-dependent assertions
- Async race conditions
- External dependency leaking through mocks
- Test order dependency

Diagnose and fix.
```

## Placeholders

| Placeholder | Replace with |
|-------------|-------------|
| `[FILE_PATH]` | Source file to test |
| `[MODULE_OR_FILE]` | Module or file to check coverage for |
| `[TEST_NAME]` | Name of the failing/flaky test |
| `[TEST_FILE_PATH]` | Path to the test file |
| `[ERROR_MESSAGE]` | The error output |
