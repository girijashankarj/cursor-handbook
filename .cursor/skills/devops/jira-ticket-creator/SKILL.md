---
name: jira-ticket-creator
description: Generate well-structured JIRA tickets (stories, bugs, tasks, epics) with acceptance criteria, estimates, and labels. Use when the user asks to create a JIRA ticket, write a story, or document a bug report.
---

# Skill: JIRA Ticket Creator

Generate structured JIRA-compatible tickets from requirements, bug reports, or feature requests.

## Trigger
When the user asks to create a JIRA ticket, write a user story, document a bug, or break down work into trackable items.

## Prerequisites
- [ ] Clear understanding of the request (feature, bug, task, or epic)
- [ ] Project key or naming convention known (ask if not provided)

## Steps

### Step 1: Identify Ticket Type

| Type | When to Use |
|------|-------------|
| **Epic** | Large feature spanning multiple sprints |
| **Story** | User-facing functionality deliverable in one sprint |
| **Task** | Technical work not directly user-facing |
| **Bug** | Defect in existing functionality |
| **Sub-task** | Breakdown of a Story or Task |
| **Spike** | Research or investigation with time-box |

### Step 2: Gather Context
- [ ] What problem does this solve? (the **why**)
- [ ] Who is affected? (user persona or system)
- [ ] What is the desired outcome?
- [ ] What is the current behavior? (for bugs)
- [ ] Priority: Critical / High / Medium / Low
- [ ] Affected components or services

### Step 3: Write Title
- [ ] Format: `[Type] Concise action-oriented description`
- [ ] Use imperative mood for stories/tasks: "Add...", "Implement...", "Fix..."
- [ ] Keep under 80 characters
- [ ] Be specific — avoid vague titles like "Update backend"

### Step 4: Write Description

#### For Stories
```markdown
## User Story
As a [persona], I want to [action] so that [benefit].

## Context
Background information, links to designs, related tickets.

## Acceptance Criteria
- [ ] Given [precondition], when [action], then [expected result]
- [ ] Given [precondition], when [action], then [expected result]
- [ ] Edge case: [scenario] → [expected behavior]

## Technical Notes
- Affected services: [list]
- Database changes: Yes/No
- API changes: Yes/No
- Feature flag: [flag name] (if applicable)

## Out of Scope
- [Explicitly list what this ticket does NOT cover]
```

#### For Bugs
```markdown
## Bug Summary
One sentence describing the defect.

## Steps to Reproduce
1. Navigate to [page/endpoint]
2. Perform [action]
3. Observe [incorrect behavior]

## Expected Behavior
What should happen.

## Actual Behavior
What actually happens (include error messages, status codes).

## Environment
- Environment: [dev/staging/production]
- Browser/Client: [if applicable]
- Version/Commit: [if known]

## Impact
- Severity: [Critical/High/Medium/Low]
- Users affected: [count or scope]
- Workaround available: Yes/No

## Logs / Screenshots
[Attach or paste relevant logs — redact PII]
```

#### For Tasks
```markdown
## Objective
What needs to be accomplished.

## Requirements
- [ ] Requirement 1
- [ ] Requirement 2

## Approach
Suggested technical approach (optional).

## Done Criteria
- [ ] Implementation complete
- [ ] Tests added (≥{{CONFIG.testing.coverageMinimum}}% coverage)
- [ ] Documentation updated
- [ ] Code reviewed
```

#### For Epics
```markdown
## Vision
High-level goal and business value.

## Scope
What's included in this epic.

## Stories
- [ ] Story 1: [title]
- [ ] Story 2: [title]
- [ ] Story 3: [title]

## Success Metrics
- [Metric 1]: [target]
- [Metric 2]: [target]

## Timeline
- Start: [date]
- Target completion: [date]
```

### Step 5: Add Metadata
- [ ] **Priority:** Critical / High / Medium / Low
- [ ] **Labels:** `backend`, `frontend`, `infrastructure`, `security`, `tech-debt`, `breaking-change`
- [ ] **Components:** Affected service or module names
- [ ] **Story Points / Estimate:** Use team's scale (Fibonacci: 1, 2, 3, 5, 8, 13)
- [ ] **Sprint:** Current or backlog
- [ ] **Linked tickets:** Blocks, is blocked by, relates to

### Step 6: Estimate Complexity

| Points | Meaning |
|--------|---------|
| 1 | Trivial — config change, typo fix |
| 2 | Small — single file, well-understood change |
| 3 | Medium — few files, some design decisions |
| 5 | Large — multiple files, integration work |
| 8 | Complex — cross-service, new patterns |
| 13 | Very complex — significant unknowns, suggest spike first |

### Step 7: Review & Output
- [ ] Verify no PII, secrets, or internal infrastructure names
- [ ] Verify acceptance criteria are testable and specific
- [ ] Verify title is clear and actionable
- [ ] Present the complete ticket in a copyable format

## Rules
- **ALWAYS** include acceptance criteria for stories
- **ALWAYS** include steps to reproduce for bugs
- **NEVER** include secrets, real credentials, or PII in ticket text
- **NEVER** use vague acceptance criteria ("it should work well")
- Acceptance criteria must be binary (pass/fail), not subjective
- One ticket = one deliverable; split if it exceeds 8 story points

## Completion
Ready-to-paste JIRA ticket content with title, description, acceptance criteria, metadata, and estimate.

## If a Step Fails
- **Unclear requirements:** Ask clarifying questions before generating; list assumptions explicitly
- **Too large for one ticket:** Break into an epic with child stories
- **No reproduction steps (bug):** Mark as "Needs investigation" and suggest a spike ticket
- **Can't estimate:** Suggest a time-boxed spike (2–4 hours) to reduce unknowns
