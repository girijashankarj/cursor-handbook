---
name: commit-message-generator
description: Generate structured Conventional Commit messages from staged changes, diffs, or descriptions. Use when the user asks to write a commit message or needs help with commit formatting.
---

# Skill: Commit Message Generator

Analyze code changes and produce well-structured Conventional Commit messages following project conventions.

## Trigger
When the user asks to generate, write, or improve a commit message — or before committing staged changes.

## Prerequisites
- [ ] Git repository initialized
- [ ] Changes staged (`git add`) or described by the user

## Steps

### Step 1: Gather Change Context
- [ ] Run `git diff --cached --stat` to see staged file summary
- [ ] Run `git diff --cached` for detailed diff (limit to first 200 lines if large)
- [ ] Check branch name for scope hints: `git branch --show-current`
- [ ] If no staged changes, ask the user to describe what changed

### Step 2: Classify the Change Type
Map changes to Conventional Commit types:

| Type | When |
|------|------|
| `feat` | New feature or capability |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Formatting, whitespace, semicolons (no logic change) |
| `refactor` | Code restructuring without behavior change |
| `test` | Adding or updating tests |
| `chore` | Build, tooling, dependency updates |
| `perf` | Performance improvement |
| `ci` | CI/CD pipeline changes |

### Step 3: Determine Scope
- [ ] Identify the primary module/package affected
- [ ] Use project-standard scopes: `rules`, `agents`, `skills`, `commands`, `hooks`, `docs`, `config`
- [ ] For cross-cutting changes, use the most significant scope or omit

### Step 4: Write Subject Line
- [ ] Format: `type(scope): imperative description`
- [ ] Keep under 72 characters
- [ ] Use imperative mood ("add", "fix", "update" — not "added", "fixes")
- [ ] Lowercase, no trailing period
- [ ] Focus on **what** changed, not **how**

### Step 5: Write Body (if needed)
Include a body when:
- The **why** isn't obvious from the subject
- Multiple files or concerns are involved
- There are breaking changes

Body rules:
- [ ] Blank line between subject and body
- [ ] Wrap at 72 characters
- [ ] Use bullet points for multiple items
- [ ] Explain motivation and contrast with previous behavior

### Step 6: Add Footer (if needed)
- [ ] Breaking changes: `BREAKING CHANGE: description`
- [ ] Issue references: `Closes #123`, `Refs #456`
- [ ] Co-authors: `Co-authored-by: Name <email>`

### Step 7: Validate & Output
- [ ] Verify subject ≤ 72 chars
- [ ] Verify type is valid Conventional Commit type
- [ ] Verify no secrets, PII, or internal hostnames in message
- [ ] If changes span multiple concerns, suggest splitting into separate commits
- [ ] Present the final message in a copyable code block

## Rules
- **ALWAYS** use Conventional Commits format
- **NEVER** include secrets, API keys, or internal URLs in commit messages
- **NEVER** reference specific infrastructure names — use placeholders
- Prefer atomic commits: one logical change per commit
- If the diff is too large (>500 lines), suggest splitting

## Examples

### Simple feature
```
feat(skills): add commit-message-generator skill

Step-by-step workflow for generating Conventional Commit messages
from staged changes or user descriptions.
```

### Bug fix with issue reference
```
fix(auth): handle expired refresh tokens gracefully

Previously, expired refresh tokens caused a 500 error.
Now returns 401 with a clear message prompting re-authentication.

Closes #247
```

### Breaking change
```
feat(api)!: change pagination from offset to cursor-based

BREAKING CHANGE: All list endpoints now use cursor-based pagination.
Replace `page` and `limit` params with `cursor` and `pageSize`.

Migration guide: docs/migration/v2-pagination.md
```

## Completion
One or more commit messages ready to copy-paste. If changes span multiple concerns, provide separate messages for each suggested split.

## If a Step Fails
- **No staged changes:** Ask the user to describe the change, or run `git add` first
- **Ambiguous type:** Default to `chore` and ask the user for clarification
- **Large diff:** Summarize themes and suggest `feat` vs `fix` based on behavior change
- **Multi-concern diff:** Suggest `git add -p` to stage partial changes for atomic commits
