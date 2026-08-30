# PR code review meta-prompt for teams

Generates a project-specific PR review checklist and review prompt.

---

## Meta-prompt

```
You are creating a PR code review guide for our team.

Read the project context:
1. .cursor/rules/ — all coding standards, security rules, testing requirements
2. .cursor/agents/code-reviewer.md — the code reviewer agent's checklist
3. project.json — conventions, commit format, coverage targets
4. Existing test patterns — what's expected for test coverage

Generate a document with:

### PR review checklist
A checklist reviewers can copy into PR comments or use mentally:

**Correctness**
- [ ] Logic handles edge cases (null, empty, boundary values)
- [ ] Error handling follows project pattern (AppError, error codes)
- [ ] Database queries are parameterized (no SQL concatenation)
- [ ] Async operations have proper error handling
- [ ] [Add project-specific items based on rules]

**Security**
- [ ] No hardcoded secrets, API keys, or tokens
- [ ] No PII in log statements
- [ ] Input validation on all user-facing endpoints
- [ ] Auth/authz checks on protected routes
- [ ] No eval(), new Function(), or unsafe patterns
- [ ] [Add project-specific items based on security rules]

**Testing**
- [ ] New code has unit tests
- [ ] Tests cover error cases, not just happy path
- [ ] Mocks are used correctly (no real DB/API calls in unit tests)
- [ ] Test names follow "should X when Y" pattern
- [ ] Coverage meets minimum target: [ACTUAL_TARGET]%

**Patterns**
- [ ] Follows handler pattern (controller → service → model)
- [ ] Types in correct location (common/ or types/)
- [ ] Structured logging with correlationId
- [ ] Soft delete only (no DELETE FROM)
- [ ] Import order: external → internal → relative

**Documentation**
- [ ] Public functions have JSDoc/docstrings
- [ ] Complex logic has explanatory comments
- [ ] API changes reflected in docs/specs

### Review prompt for Cursor
A single prompt a reviewer can paste to get an AI review:

"Use the code-reviewer agent. Review these files: [list]. Check against our rules in .cursor/rules/. Focus on bugs, security, and pattern violations. For each issue: severity, file:line, what's wrong, how to fix."

### Review response template
A markdown template for leaving structured review comments.

Use our actual rules, patterns, and targets — not generic advice.
```

## Expected output

A team review guide that ensures consistent, thorough reviews aligned with project standards.
