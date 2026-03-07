---
name: changelog
description: Generate changelog from recent commits. Use before releases or to draft release notes.
---

# Command: Changelog

## Invocation
`/changelog`

## Description
Generate a changelog from recent git commits using conventional commit messages. Helps draft release notes without manual copy-paste.

## Action
```bash
git log --oneline -20 --no-merges
```

For formatted output with dates:
```bash
git log -20 --no-merges --format="* %s (%h)" --date=short
```

## When to Use
- Before cutting a release
- When drafting release notes for a PR
- To summarize changes since last tag
- When updating CHANGELOG.md

## Token Cost
~2K tokens (reads commit history only)

## Expected Output
- List of recent commits, one per line
- Use output to populate `Added`, `Fixed`, `Changed` sections in CHANGELOG.md
- AI can categorize by conventional commit type (feat, fix, docs, etc.)

## Tips
- Run `git tag` to see existing versions before drafting
- Filter by path: `git log -- path/to/dir` for component-specific notes
- Use `/release-notes` skill for full structured workflow
