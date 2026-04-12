---
name: pr-description-generator
description: Generate comprehensive PR titles and descriptions with summary, test plan, risks, and linked issues. Use when the user asks to write or improve a pull request description.
---

# Skill: PR Description Generator

Analyze branch changes and produce a complete pull request title and description following team conventions.

## Trigger
When the user asks to generate, write, or improve a PR description — or when opening a new pull request.

## Prerequisites
- [ ] Working on a feature/fix branch (not `main` or `develop`)
- [ ] Commits exist on the branch
- [ ] Base branch identified (default: `main`)

## Steps

### Step 1: Gather Branch Context
- [ ] Get current branch: `git branch --show-current`
- [ ] Get base branch (ask user or default to `main`)
- [ ] Get commit log: `git log --oneline $(git merge-base HEAD origin/main)..HEAD`
- [ ] Get file summary: `git diff --stat origin/main...HEAD`
- [ ] Get full diff summary: `git diff origin/main...HEAD --stat`
- [ ] Count changes: files changed, insertions, deletions

### Step 2: Analyze Change Scope
- [ ] Identify the primary change category (feature, fix, refactor, docs, chore)
- [ ] List all affected modules/packages
- [ ] Identify breaking changes
- [ ] Identify database migrations
- [ ] Identify new dependencies
- [ ] Note any security-relevant changes (auth, permissions, input validation)

### Step 3: Generate PR Title
- [ ] Format: imperative mood, 50–72 characters
- [ ] Mirror the primary commit or user-facing outcome
- [ ] Prefix with type if team convention: `feat: ...`, `fix: ...`
- [ ] For draft PRs, prefix with `[WIP]` or `[Draft]`

### Step 4: Generate PR Body

#### Summary Section
- [ ] 2–4 sentences explaining **what** changed and **why**
- [ ] Link to design doc, RFC, or ticket if applicable

#### Type of Change
- [ ] Classify: feature / bug fix / docs / refactor / chore / breaking change
- [ ] Use checkboxes if PR template supports it

#### Changes Made
- [ ] Bullet list of key changes (grouped by module if multi-module)
- [ ] Mention new files, deleted files, renamed files
- [ ] Highlight architectural decisions

#### Testing
- [ ] List what was tested: unit, integration, manual
- [ ] Note what was **not** tested and why
- [ ] Include commands to reproduce: `npm test -- --grep "feature-name"`
- [ ] Mention if type-check and lint pass

#### Risk & Rollback
- [ ] Breaking changes and migration steps
- [ ] Feature flags used
- [ ] Rollback strategy (revert commit, feature flag toggle)
- [ ] Performance implications

#### Screenshots / Recordings
- [ ] Include placeholder section for UI changes
- [ ] Before/after screenshots when relevant

#### Checklist
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No secrets or PII in code
- [ ] Type-check passes
- [ ] Lint passes
- [ ] Breaking changes documented

#### Related Issues
- [ ] `Closes #123` for issues this PR resolves
- [ ] `Refs #456` for related issues
- [ ] Link to parent epic or project board

### Step 5: Security Review
- [ ] Verify no secrets, internal hostnames, or PII in the PR description
- [ ] Verify no internal URLs or resource ARNs
- [ ] Use generic placeholders where needed

### Step 6: Output
- [ ] Present title and body in a copyable format
- [ ] Optionally provide a shorter version for stacked PRs
- [ ] Suggest reviewers based on changed files (if CODEOWNERS exists)

## Rules
- **NEVER** include secrets, API keys, or real infrastructure names in PR text
- **NEVER** include PII (customer names, emails, etc.)
- **ALWAYS** mention what testing was done and what was skipped
- **ALWAYS** flag breaking changes prominently
- Keep the summary concise — reviewers skim first, read details second

## Template Output

```markdown
## Summary
Brief description of changes and motivation.

## Type of Change
- [ ] Feature
- [ ] Bug fix
- [ ] Refactor
- [ ] Documentation
- [ ] Breaking change

## Changes
- Added X to handle Y
- Updated Z for better performance
- Removed deprecated W

## Testing
- [x] Unit tests added for new service
- [x] Type-check passes
- [ ] Integration tests (not applicable — no API changes)

## Risk & Rollback
- Low risk — additive change behind feature flag
- Rollback: disable `FEATURE_X` flag

## Screenshots
N/A (backend only)

## Checklist
- [x] Tests added
- [x] Docs updated
- [x] No secrets in code
- [x] Type-check passes

## Related Issues
Closes #123
Refs #100
```

## Completion
Copy-paste ready PR title and description. If the branch has many commits spanning multiple concerns, suggest splitting into stacked PRs.

## If a Step Fails
- **No commits on branch:** Ask the user to describe planned changes
- **Can't determine base branch:** Default to `main`, ask for confirmation
- **Large diff (>50 files):** Group changes by module, provide high-level summary
- **No test info:** Add a note: "Testing plan TBD" and flag for the user
