# Testing quality meta-prompt for teams

Generates a project-specific testing guide with your framework, patterns, and targets.

---

## Meta-prompt

```
You are creating a testing guide for our team.

Read the project context:
1. project.json — test command, coverage command, coverage target, test framework
2. Existing test files — find patterns for mocking, naming, setup/teardown
3. tests/mocks/ — factory patterns, mock infrastructure
4. .cursor/rules/testing/ — testing standards, mock patterns, naming rules
5. package.json or equivalent — test-related dependencies

Generate a comprehensive testing guide:

### Testing overview
- Test framework: [from project.json]
- Coverage target: [from project.json]
- Test command (single file): [actual command]
- Test command (full suite): [actual command]
- Coverage command: [actual command]

### Test structure
Show our actual test directory structure with descriptions:
```
tests/
├── unit/        — ...
├── integration/ — ...
├── mocks/       — ...
└── fixtures/    — ...
```

### Unit test patterns
Show a real example from our codebase demonstrating:
- File naming convention
- Test naming: "should X when Y"
- AAA pattern (Arrange-Act-Assert)
- How we mock dependencies
- How we use factories/fixtures

### Integration test patterns
Show how we test API endpoints:
- Test server setup
- Auth handling in tests
- Database setup/teardown
- Request/response validation

### Mock patterns
Document our mock infrastructure:
- How to create a service mock
- How to use test data factories
- When to use fixtures vs factories
- Mock reset between tests

### What to test (and what not to)
- Test: business logic, error handling, input validation, edge cases
- Skip: framework internals, trivial getters, private methods, generated code

### Common testing prompts
Ready-to-paste prompts for:
1. "Write tests for [file]"
2. "Improve coverage for [module]"
3. "Fix this failing test: [error]"
4. "Add integration test for [endpoint]"

Each customized with our framework syntax, mock patterns, and conventions.

Use real examples from THIS project — not generic testing advice.
```

## Expected output

A team testing reference (2-3 pages) that ensures consistent test quality. Share in docs/ or team wiki.
