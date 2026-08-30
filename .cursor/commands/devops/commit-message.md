---
name: commit-message
description: Draft a Conventional Commit message from staged or described changes.
---

# Command: Commit message

## Invocation
`/commit-message`

## Description
Produce a **Conventional Commits** message aligned with this repo’s [CONTRIBUTING.md](CONTRIBUTING.md): `type(scope): description` (imperative, lowercase subject, no trailing period in subject).

## Action
1. If the user has **staged changes**, infer `type`, `scope`, and summary from `git diff --cached --stat` and optionally `git diff --cached` for key renames or intent.
2. If there is **no git context**, use the user’s description of what changed and map it to `feat` | `fix` | `docs` | `style` | `refactor` | `test` | `chore` | `perf` | `ci`.
3. Output:
   - **Subject line** (≤72 chars if possible)
   - Optional **body** with bullets for breaking changes or rationale
   - Optional **footer** for issue references: `Closes #123`

**Types (from project conventions):** feat, fix, docs, style, refactor, test, chore  
**Scopes:** rules, agents, skills, commands, hooks, docs, config — or the affected package/module.

## When to Use
- Before committing
- When squashing or splitting commits
- To align team commit style

## Token Cost
~2–5K tokens (depends on diff size)

## Expected Output
- One or two suggested commit messages
- Brief rationale if multiple files span concerns (suggest split commits)

## Troubleshooting
- **Ambiguous change:** Prefer `chore` or ask for the user’s intent
- **Large diff:** Summarize themes; suggest `feat` vs `fix` based on behavior change
