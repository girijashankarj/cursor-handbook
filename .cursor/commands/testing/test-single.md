# Command: Test Single File

## Invocation
`/test-single`

## Description
Run tests for a single file instead of the entire test suite. Saves ~95K tokens.

## Action
```bash
{{CONFIG.testing.testCommand}} -- --testPathPattern={file_path}
```

## Parameters
- `file_path`: Path to the test file or source file to test

## When to Use
- Testing a specific feature after changes
- Debugging a failing test
- Quick validation during development

## Token Cost
~5K tokens (vs ~100K for full suite)

## Expected Output
- Test results for the specified file only
- Coverage for tested file
