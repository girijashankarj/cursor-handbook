# BugBot (Cursor PR review)

**BugBot** is Cursor’s built-in AI agent that reviews pull requests on GitHub, GitLab, and GitHub Enterprise. It is not part of cursor-handbook—it’s a Cursor product feature.

## What BugBot does

- **Reviews PRs** — Analyzes diffs and comments with bugs, security issues, and quality problems.
- **Runs automatically** — On every PR update, or when you comment `cursor review` or `bugbot run`.
- **Autofix** — Can push suggested fixes to your branch or a new branch (configurable).
- **Custom rules** — Uses `.cursor/BUGBOT.md` in your repo to apply project-specific rules during reviews.

## Setup

1. **Connect your repo** — [Cursor Dashboard](https://cursor.com/dashboard?tab=integrations) → Integrations → Connect GitHub (or GitLab).
2. **Enable BugBot** — Turn on BugBot for the repositories you want.
3. **Add custom rules** — Put project rules in `.cursor/BUGBOT.md` (see below). BugBot always loads the root file and any `.cursor/BUGBOT.md` found when walking up from changed files.

## Custom rules: `.cursor/BUGBOT.md`

BugBot reads **only** `.cursor/BUGBOT.md` files (not `.cursor/rules/*.mdc`). Use them to define:

- Security rules (e.g. no eval, no hardcoded secrets).
- Database rules (e.g. parameterized queries, soft delete only).
- Quality rules (e.g. require tests for backend changes, no PII in logs).

Rules are written in plain language with “If … then …” conditions. See [Cursor BugBot docs → Rules](https://cursor.com/docs/bugbot#rules) for the full format and examples.

This repo’s rules are in [.cursor/BUGBOT.md](../../.cursor/BUGBOT.md). Merge changes to the default branch for BugBot to use them on PRs.

## Pricing

- **Free tier** — Limited PR reviews per month per user.
- **BugBot Pro** — Unlimited reviews (see [Cursor pricing](https://cursor.com/docs/models-and-pricing)).

## More

- [BugBot documentation](https://cursor.com/docs/bugbot)
- [BugBot Autofix](https://cursor.com/blog/bugbot-autofix)
- [Reviewing database migrations with BugBot rules](https://cursor.com/docs/cookbook/bugbot-rules)
