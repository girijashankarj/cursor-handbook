---
name: flaky-test
description: Diagnose and fix flaky tests. Use when a test passes sometimes and fails other times.
---

# Skill: Fix Flaky Tests

## Trigger
When a test is flaky — passes intermittently, fails on CI but not locally, or depends on timing/order.

## Steps

### Step 1: Reproduce
- [ ] Run the test 10+ times: `{{CONFIG.testing.testCommand}} -- --testPathPattern={file} --runInBand`
- [ ] Note failure rate and any pattern (e.g., fails when run with others)
- [ ] Run in isolation vs with full suite to check order dependency

### Step 2: Categorize
Common causes:
- **Timing** — Async not awaited; `setTimeout`/`setInterval`; race conditions
- **Shared state** — Mocks, globals, or DB state leaking between tests
- **Randomness** — `Date.now()`, `Math.random()`, `uuid` without seed
- **Order dependency** — Tests assume execution order; shared fixtures
- **Environment** — CI vs local (timezone, env vars, network)

### Step 3: Fix

#### Timing
- Add `await` for all async operations
- Use `waitFor` or `act` for React updates
- Replace `setTimeout` with fake timers: `jest.useFakeTimers()`
- Increase timeout only as last resort; prefer fixing the race

#### Shared State
- Reset mocks in `beforeEach`: `jest.clearAllMocks()` or `mockReset()`
- Use `beforeEach` to create fresh fixtures; avoid module-level state
- Run tests with `--runInBand` to isolate; fix root cause rather than rely on it

#### Randomness
- Mock `Date.now()`, `Math.random()`, or ID generators
- Use `jest.setSystemTime()` for date-dependent tests
- Seed random if deterministic output is needed

#### Order Dependency
- Make each test self-contained; no assumptions about other tests
- Use `beforeEach` for setup; avoid `afterAll` that affects later tests

### Step 4: Verify
- [ ] Run test 20+ times: `for i in {1..20}; do {{CONFIG.testing.testCommand}} -- --testPathPattern={file}; done`
- [ ] Run with full suite to ensure no regression
- [ ] Check CI passes on multiple runs

## Completion
- [ ] Test passes consistently (20/20 runs)
- [ ] No new flakiness introduced
- [ ] Root cause fixed, not masked (e.g., no arbitrary `sleep`)
