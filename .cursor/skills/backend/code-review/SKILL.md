# Skill: Code Review Workflow

## Description
Structured workflow for conducting thorough code reviews.

## Trigger
When the user asks to review code, a PR, or specific files.

## Steps

### Step 1: Understand Context
- [ ] Read the PR description or user's explanation
- [ ] Identify the type of change (feature, bug fix, refactor, test)
- [ ] Check which files are modified

### Step 2: High-Level Review
- [ ] Does the change accomplish its stated goal?
- [ ] Is the approach appropriate for the problem?
- [ ] Are there simpler alternatives?
- [ ] Does it follow project architecture patterns?

### Step 3: Security Review
- [ ] No hardcoded secrets or credentials
- [ ] No PII in logs or error messages
- [ ] Input validation on all external inputs
- [ ] Parameterized database queries
- [ ] Proper authentication/authorization checks
- [ ] No sensitive data in URLs or headers

### Step 4: Code Quality Review
- [ ] Functions are single-responsibility and < 30 lines
- [ ] Naming is clear and consistent
- [ ] No code duplication
- [ ] Error handling is comprehensive
- [ ] Logging includes correlationId
- [ ] Import order follows conventions

### Step 5: Testing Review
- [ ] Tests exist for new/changed code
- [ ] Success and error paths tested
- [ ] Edge cases covered
- [ ] Mocks are appropriate (not over-mocking)
- [ ] Test names are descriptive

### Step 6: Performance Review
- [ ] No N+1 database queries
- [ ] Appropriate use of indexes
- [ ] No unnecessary data loading
- [ ] Caching where appropriate
- [ ] No memory leaks

### Step 7: Provide Feedback
Use this format:
- 🔴 **Critical**: Must fix before merge
- 🟡 **Suggestion**: Should improve
- 🟢 **Nitpick**: Optional improvement
- 👍 **Positive**: Things done well

## Completion
Review is complete with actionable feedback categorized by priority.
