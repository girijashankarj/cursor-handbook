---
name: release-manager
description: Manage the full release lifecycle — version bump, changelog, tag, and release notes. Use when the user asks to prepare, create, or publish a release.
---

# Skill: Release Manager

Orchestrate the complete release workflow from version bump through tagging and release notes.

## Trigger
When the user asks to create a release, bump version, tag a release, or publish release notes.

## Prerequisites
- [ ] On `main` or `release/*` branch
- [ ] All CI checks passing
- [ ] No uncommitted changes: `git status --porcelain`

## Steps

### Step 1: Determine Release Type
- [ ] Analyze commits since last tag: `git log $(git describe --tags --abbrev=0)..HEAD --oneline`
- [ ] Apply semver rules:

| Commits Include | Bump | Example |
|----------------|------|---------|
| `BREAKING CHANGE` or `!` | **Major** | 1.0.0 → 2.0.0 |
| `feat` | **Minor** | 1.0.0 → 1.1.0 |
| `fix`, `perf`, `refactor` only | **Patch** | 1.0.0 → 1.0.1 |

- [ ] Confirm with user before proceeding

### Step 2: Update Version
- [ ] Update `package.json` version field (if Node.js project)
- [ ] Update any other version references (e.g., `version.ts`, `pyproject.toml`)
- [ ] Update lock file if needed: `npm install --package-lock-only`

### Step 3: Generate Changelog
- [ ] Use the `changelog-generator` skill to produce the entry
- [ ] Prepend to `CHANGELOG.md`
- [ ] Review with user

### Step 4: Create Release Commit
```bash
git add package.json package-lock.json CHANGELOG.md
git commit -m "chore(release): vX.Y.Z"
```

### Step 5: Create Git Tag
```bash
git tag -a vX.Y.Z -m "Release vX.Y.Z"
```

### Step 6: Generate Release Notes
Format for GitHub Release:

```markdown
## What's Changed

### Highlights
- [Key feature or fix — 1 sentence each]

### Added
- feat(scope): description (#PR)

### Fixed
- fix(scope): description (#PR)

### Breaking Changes
- Description of what broke and migration steps

**Full Changelog**: https://github.com/org/repo/compare/vPREV...vX.Y.Z
```

### Step 7: Push & Publish
- [ ] Push commits: `git push origin main`
- [ ] Push tag: `git push origin vX.Y.Z`
- [ ] Create GitHub release: `gh release create vX.Y.Z --title "vX.Y.Z" --notes-file release-notes.md`
- [ ] Verify release appears on GitHub

### Step 8: Post-Release
- [ ] Verify CI runs on the tag
- [ ] Verify deployment triggers (if auto-deploy on tag)
- [ ] Notify team (Slack, email, or ticket update)
- [ ] Close related milestone/epic if applicable

## Rules
- **ALWAYS** confirm version bump with user before executing
- **ALWAYS** run on clean working tree (no uncommitted changes)
- **NEVER** release from a feature branch
- **NEVER** skip changelog generation
- **NEVER** include secrets or internal URLs in release notes
- Follow semver strictly — breaking changes = major bump
- Tag format: `vX.Y.Z` (with `v` prefix)

## Completion
Version bumped, changelog updated, tag created, release notes published. CI/CD triggered for deployment.

## If a Step Fails
- **Dirty working tree:** Stash or commit changes first
- **Tag already exists:** Verify version, use next available
- **Push fails:** Check branch protection rules and permissions
- **CI fails on tag:** Fix forward with a patch release, don't delete the tag
