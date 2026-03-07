# Skill: Improve Test Coverage

## Description
Systematic workflow for identifying coverage gaps and writing missing tests.

## Trigger
When coverage is below {{CONFIG.testing.coverageMinimum}}% or user asks to improve coverage.

## Steps

### Step 1: Analyze Current Coverage
- [ ] Run coverage report: `{{CONFIG.testing.coverageCommand}}`
- [ ] Identify files below {{CONFIG.testing.coverageMinimum}}% coverage
- [ ] Rank by: business criticality × uncovered percentage

### Step 2: Identify Gaps
For each uncovered file:
- [ ] List uncovered functions/methods
- [ ] List uncovered branches (if/else, switch)
- [ ] List uncovered error paths
- [ ] Determine which gaps are most important

### Step 3: Write Missing Tests
Priority order:
1. Error handling paths
2. Business logic branches
3. Edge cases (null, empty, boundary)
4. Success paths (usually already covered)

For each test:
- [ ] Follow AAA pattern (Arrange-Act-Assert)
- [ ] Use descriptive test names
- [ ] Mock external dependencies
- [ ] Assert specific behaviors, not implementation

### Step 4: Verify Coverage
- [ ] Run coverage again: `{{CONFIG.testing.coverageCommand}}`
- [ ] Confirm target met: ≥{{CONFIG.testing.coverageMinimum}}%
- [ ] All new tests pass

## Completion
Coverage meets or exceeds {{CONFIG.testing.coverageMinimum}}% with meaningful tests.
