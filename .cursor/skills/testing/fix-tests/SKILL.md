---
name: fix-tests
description: Systematic workflow for diagnosing and fixing failing tests. Use when the user reports failing tests or asks to fix test failures.
---

# Skill: Fix Failing Tests

## Trigger
When the user reports failing tests or asks to fix test failures.

## Prerequisites
- [ ] Test command works: `{{CONFIG.testing.testCommand}}`
- [ ] Failing test file path or error output available
- [ ] Type check passes or run first: `{{CONFIG.testing.typeCheckCommand}}`

## Steps

### Step 1: Identify Failing Tests
- [ ] Run the test suite: `{{CONFIG.testing.testCommand}}`
- [ ] List all failing tests with error messages
- [ ] Categorize by failure type (assertion, timeout, mock, type)

### Step 2: Analyze Each Failure
For each failing test:
- [ ] Read the error message carefully
- [ ] Check if it's a test issue or a code issue
- [ ] Look at recent changes to the tested code
- [ ] Check if mocks are correctly set up

### Step 3: Common Fix Patterns

#### Mock Issues
- Mock not returning expected value → Update mock return
- Mock not being called → Check import path
- Mock state leaking → Add `beforeEach` reset

#### Assertion Issues
- Expected value changed → Update test or fix code
- Async not awaited → Add `await` or use `waitFor`
- Wrong matcher → Use correct Jest matcher

#### Type Issues
- Interface changed → Update test data
- New required field → Add to test factories
- Return type changed → Update assertions

### Step 4: Fix Tests
- [ ] Fix one test at a time
- [ ] Run just that test to verify: `{{CONFIG.testing.testCommand}} -- --testPathPattern={test-file}`
- [ ] Ensure fix doesn't break other tests

### Step 5: Verify
- [ ] Run full affected test suite
- [ ] Check coverage hasn't dropped below {{CONFIG.testing.coverageMinimum}}%
- [ ] Run type check: `{{CONFIG.testing.typeCheckCommand}}`

## Completion Checklist
- [ ] All previously failing tests pass
- [ ] No new test failures introduced
- [ ] Coverage at or above {{CONFIG.testing.coverageMinimum}}%
- [ ] Type check passes

## If Step Fails
- **Step 1 (identify)**: Run `{{CONFIG.testing.testCommand}}` — if it hangs, run single file with `--testPathPattern=path/to/file`
- **Step 2 (analyze)**: Mock issues often from wrong import path; use `jest.mock('./path')` matching actual import
- **Step 4 (fix)**: Fix one test, run `--testPathPattern` to verify, then next. Don't fix all at once
- **Step 5 (verify)**: If coverage dropped, add test for uncovered branch. Use `@coverage-improvement` skill

## Example
Failure: "Expected 60, received undefined". Cause: mock for `calculateTotal` not returning. Fix: `mockCalculateTotal.mockReturnValue(60)` in test. Run: `npm test -- order.test.ts`.
