---
name: release-notes
description: Draft release notes from git history. Use when preparing a release or updating CHANGELOG.
---

# Skill: Release Notes

## Trigger
When the user asks to "draft release notes," "prepare changelog," "what changed since last release," or "update CHANGELOG."

## Steps

1. **Determine scope** — Get last tag or release version. Run `git tag -l` and `git log --oneline -1` to see current state.
2. **List commits** — Run `git log <last-tag>..HEAD --oneline --no-merges` (or last 20 commits if no tag).
3. **Categorize** — Group commits by type: `feat` → Added, `fix` → Fixed, `docs` → Documentation, `refactor`/`perf` → Changed, `chore` → omit or internal.
4. **Draft** — Output CHANGELOG.md format with sections: `## [Unreleased]` or `## [X.Y.Z] - YYYY-MM-DD` with `### Added`, `### Fixed`, etc.
5. **Offer** — Ask if user wants this applied to CHANGELOG.md or just as preview.

## Rules
- Use imperative mood in entries
- One line per change; avoid duplicates
- Skip merge commits and internal chore commits unless user asks
- Follow Keep a Changelog format; do not add raw commit hashes to user-facing output
