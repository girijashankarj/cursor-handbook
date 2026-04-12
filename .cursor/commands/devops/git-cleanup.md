---
name: git-cleanup
description: Delete merged and stale local branches to keep the repository tidy.
---

# Command: Git Cleanup

## Invocation
`/git-cleanup`

## Description
Identify and delete local branches that have been merged into the base branch or are stale (no commits in 30+ days).

## Parameters
- `base`: Base branch to compare against (default: `main`)
- `dry-run`: List branches without deleting (default: true)
- `include-stale`: Also flag branches with no recent commits (default: false)

## Action
1. Fetch latest: `git fetch --prune`
2. List merged branches: `git branch --merged main | grep -v 'main\|develop\|\*'`
3. List stale branches (optional): branches with last commit > 30 days ago
4. In dry-run mode: list candidates for deletion
5. If confirmed: `git branch -d <branch>` for each merged branch

## When to Use
- Weekly repository hygiene
- After a release when feature branches are merged
- When `git branch` output is too long to read

## Token Cost
~1–2K tokens

## Expected Output
- **Dry run:** List of branches safe to delete with last commit date
- **Execute:** Confirmation of deleted branches
- Branches that could NOT be safely deleted (unmerged)

## Troubleshooting
- **Branch not fully merged:** Use `git branch -D` only after confirming changes are in main
- **Remote tracking branches:** Run `git remote prune origin` to clean stale remotes
