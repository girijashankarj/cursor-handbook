# Daily development prompt

Use this for common tasks during your development workflow.

---

## Add a feature

```
Add [FEATURE_DESCRIPTION] to [MODULE/FILE].

Follow the existing handler pattern in this project. Use the schemas/ folder for validation and logic/ for business logic. Make sure to:
- Add input validation with Zod/joi
- Include error handling following the project's error pattern
- Add structured logging with correlationId
- No hardcoded secrets or PII in logs

After the change, run type-check to validate.
```

## Fix a bug

```
There's a bug in [FILE_PATH]: [DESCRIBE_THE_BUG].

Steps to reproduce: [STEPS]
Expected: [EXPECTED_BEHAVIOR]
Actual: [ACTUAL_BEHAVIOR]

Find the root cause, fix it, and add a test that covers this case. Follow the test naming pattern: "should {expected} when {condition}".
```

## Refactor

```
Refactor [FILE_OR_FUNCTION] to [GOAL: improve readability / reduce duplication / extract utility].

Keep the public API the same. Follow project conventions:
- Pure functions first, side effects at boundaries
- Shared types in common/ or types/
- No circular dependencies

Show me only the changed sections, not the entire file.
```

## Write a test

```
Write unit tests for [FUNCTION_NAME] in [FILE_PATH].

Follow these rules:
- Use "should {expected behavior} when {condition}" naming
- Arrange-Act-Assert pattern
- Mock external dependencies (DB, HTTP, cache)
- Cover: happy path, edge cases (null, empty, boundary), error cases
- Target the project's coverage minimum

Don't test private methods directly — test via the public API.
```

## Placeholders

| Placeholder | Replace with |
|-------------|-------------|
| `[FEATURE_DESCRIPTION]` | What you're building |
| `[MODULE/FILE]` | Target file or module path |
| `[FILE_PATH]` | Full path to the file |
| `[FUNCTION_NAME]` | Function to test |
