---
name: changelog-generator
description: Generate a CHANGELOG.md from Conventional Commit history with grouped sections and version headers. Use when the user asks to create or update a changelog.
---

# Skill: Changelog Generator

Parse git commit history and produce a structured CHANGELOG following Keep a Changelog format and Conventional Commits.

## Trigger
When the user asks to generate, update, or create a changelog — or before a release.

## Prerequisites
- [ ] Git repository with Conventional Commit messages
- [ ] Previous version tag known (or first release)

## Quick Usage

For a quick changelog from recent commits, run the bundled script:

```bash
scripts/generate-changelog.sh [output-file] [since-tag]
```

Examples:
```bash
scripts/generate-changelog.sh                    # Last 20 commits → CHANGELOG.md
scripts/generate-changelog.sh CHANGELOG.md v1.0  # Commits since v1.0
```

For a fully structured Keep a Changelog output, follow the detailed steps below.

## Steps

### Step 1: Determine Version Range
- [ ] Get the latest tag: `git describe --tags --abbrev=0 2>/dev/null || echo "none"`
- [ ] Get all tags sorted: `git tag --sort=-v:refname | head -10`
- [ ] Determine range: `{last-tag}..HEAD` (or all commits if no tag)
- [ ] Ask user for the new version number or suggest based on changes:
  - Has `feat` → minor bump
  - Has `fix` only → patch bump
  - Has `BREAKING CHANGE` or `!` → major bump

### Step 2: Collect Commits
- [ ] Run: `git log {range} --pretty=format:"%H|%s|%an|%ad" --date=short`
- [ ] Parse each commit into: hash, type, scope, description, author, date
- [ ] Identify breaking changes (footer or `!` in type)

### Step 3: Categorize Changes

| Section | Commit Types | Emoji (optional) |
|---------|-------------|-------------------|
| **Added** | `feat` | |
| **Fixed** | `fix` | |
| **Changed** | `refactor`, `perf` | |
| **Deprecated** | Commits mentioning deprecation | |
| **Removed** | Commits removing features | |
| **Security** | `fix` with security scope | |
| **Documentation** | `docs` | |
| **Internal** | `chore`, `ci`, `test`, `style`, `build` | |

### Step 4: Generate Changelog Entry

```markdown
## [X.Y.Z] - YYYY-MM-DD

### Added
- **scope:** description ([hash](commit-url)) — @author

### Fixed
- **scope:** description ([hash](commit-url)) — @author

### Changed
- **scope:** description ([hash](commit-url)) — @author

### Breaking Changes
- **scope:** description of what broke and migration path
```

### Step 5: Handle Edge Cases
- [ ] Commits with no type prefix → categorize as **Internal**
- [ ] Merge commits → skip (use `--no-merges` flag)
- [ ] Multiple scopes → list under primary scope
- [ ] Very long descriptions → truncate to first sentence

### Step 6: Assemble Full Changelog
- [ ] If CHANGELOG.md exists, prepend new entry after the header
- [ ] If new file, add header:
```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/),
and this project adheres to [Semantic Versioning](https://semver.org/).
```
- [ ] Include comparison link: `[X.Y.Z]: https://github.com/org/repo/compare/vPREV...vX.Y.Z`

### Step 7: Validate & Output
- [ ] Verify no PII, secrets, or internal URLs in entries
- [ ] Verify markdown renders correctly
- [ ] Present as copyable output or write to `CHANGELOG.md`

## Rules
- **ALWAYS** follow Keep a Changelog format
- **ALWAYS** group by change type, not by date or author
- **NEVER** include merge commits or version bump commits
- **NEVER** include secrets, internal URLs, or PII
- Skip `chore`/`ci`/`style` commits by default (include if user requests)
- Most recent version goes at the top

## Completion
CHANGELOG.md entry ready to paste or written to file. Includes version header, grouped changes, and comparison links.

## If a Step Fails
- **No tags exist:** Treat all commits as the first release (v0.1.0 or v1.0.0)
- **Non-conventional commits:** Group under "Other" with the raw message
- **Too many commits:** Summarize by scope, list top 20, note "and N more"
- **No new commits since last tag:** Report "No changes since vX.Y.Z"
