---
name: release
description: Prepare a release — bump version, generate changelog, and create a git tag.
---

# Command: Release

## Invocation
`/release`

## Description
Orchestrate a release: determine version bump from commits, update changelog, create release commit and tag.

## Parameters
- `bump`: Override version bump — `major`, `minor`, `patch` (default: auto-detect from commits)
- `dry-run`: Preview changes without applying (default: false)

## Action
1. Analyze commits since last tag to determine bump type.
2. Bump version in `package.json` (or equivalent).
3. Generate changelog entry using `/changelog`.
4. Create commit: `chore(release): vX.Y.Z`
5. Create tag: `git tag -a vX.Y.Z -m "Release vX.Y.Z"`
6. Output push commands (does not auto-push).

## When to Use
- Preparing a new version for deployment
- After completing a milestone or sprint

## Token Cost
~5–10K tokens

## Expected Output
- Version bumped in manifest
- Changelog entry prepended
- Release commit and tag created locally
- Push commands provided (not executed)

## Troubleshooting
- **Dirty working tree:** Commit or stash changes first
- **Tag conflict:** Verify version doesn't already exist
- **No commits since last tag:** Nothing to release
