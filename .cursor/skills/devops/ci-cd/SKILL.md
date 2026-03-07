# Skill: Set Up CI/CD Pipeline

## Description
Workflow for creating a complete CI/CD pipeline.

## Trigger
When the user needs to set up or modify CI/CD pipelines.

## Steps

### Step 1: Define Pipeline Stages
- [ ] Lint and format check
- [ ] Type check: `{{CONFIG.testing.typeCheckCommand}}`
- [ ] Unit tests: `{{CONFIG.testing.testCommand}}`
- [ ] Build
- [ ] Integration tests
- [ ] Security scan
- [ ] Deploy

### Step 2: Create Pipeline Configuration
- [ ] Create workflow file (`.github/workflows/ci.yml` for GitHub Actions)
- [ ] Define trigger events (push, PR, schedule)
- [ ] Configure job runners and environments
- [ ] Set up caching for dependencies

### Step 3: Configure Secrets
- [ ] List required secrets
- [ ] Add to CI/CD secrets store (never in code)
- [ ] Document required secrets in README

### Step 4: Add Quality Gates
- [ ] Tests must pass (0 failures)
- [ ] Coverage ≥ {{CONFIG.testing.coverageMinimum}}%
- [ ] No type errors
- [ ] No critical security vulnerabilities
- [ ] Build succeeds

### Step 5: Set Up Deployment
- [ ] Configure environment promotion (dev → staging → prod)
- [ ] Add manual approval for production
- [ ] Configure rollback triggers
- [ ] Set up smoke tests post-deployment

### Step 6: Test Pipeline
- [ ] Trigger on a test branch
- [ ] Verify all stages complete
- [ ] Verify failure handling (intentionally break a stage)
- [ ] Verify notifications work

## Completion
CI/CD pipeline is running, tested, and documented.
