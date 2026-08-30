---
name: changelog
description: Generate a changelog entry from recent commits using Conventional Commits format.
---

# Command: Changelog

## Invocation
`/changelog`

## Description
Parse commits since the last tag and generate a Keep a Changelog entry grouped by change type (Added, Fixed, Changed).

## Parameters
- `since`: Git ref to start from (default: latest tag or `HEAD~20`)
- `version`: Version number for the entry (default: auto-suggest from commit types)

## Action
1. Get latest tag: `git describe --tags --abbrev=0`
2. Collect commits: `git log {tag}..HEAD --pretty=format:"%h|%s" --no-merges`
3. Categorize by Conventional Commit type → Keep a Changelog section
4. Output formatted entry with version header and date

## When to Use
- Before a release to generate changelog
- Reviewing what changed since last version
- Updating CHANGELOG.md

## Token Cost
~2–5K tokens

## Expected Output
- Formatted changelog entry in markdown
- Suggested version bump (major/minor/patch)

## Troubleshooting
- **No tags:** Uses last 20 commits instead
- **Non-conventional commits:** Grouped under "Other"
