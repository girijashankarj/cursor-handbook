# Skill: Fix Failing Tests

## Description
Systematic workflow for diagnosing and fixing failing tests.

## Trigger
When the user reports failing tests or asks to fix test failures.

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

## Completion
All tests passing, coverage maintained, type check clean.
