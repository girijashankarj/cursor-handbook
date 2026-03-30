---
name: pr-description
description: Draft a pull request title and description with test plan and risks.
---

# Command: PR description

## Invocation
`/pr-description`

## Description
Generate a PR **title** and **body** suitable for GitHub/GitLab: summary, motivation, scope, test plan, rollout risk, and linked issues. Align with [CONTRIBUTING.md](CONTRIBUTING.md) and your team’s PR template if one exists.

## Action
1. Gather context: branch name, commit range vs base (`main`/`develop`), file summary, and user goals.
2. Produce:

### Title
- Imperative, ~50–72 characters
- Often mirrors the primary commit or user-facing outcome

### Body (markdown)
- **Summary** — What changed and why (2–4 sentences)
- **Type of change** — feat / fix / docs / refactor / chore (checkboxes optional)
- **Testing** — What you ran (e.g. `./scripts/validate.sh`, type-check, targeted tests); note what was **not** run if scope is large
- **Risk / rollback** — Breaking changes, migrations, feature flags
- **Screenshots** — If UI (placeholder section)
- **Checklist** — Matches CONTRIBUTING / CI expectations when relevant
- **Related issues** — `Closes #`, `Refs #`

3. Keep security in mind: **no** secrets, internal hostnames, or PII in the PR text.

## When to Use
- Opening or updating a PR
- After review feedback to refresh the description

## Token Cost
~3–8K tokens

## Expected Output
- Copy-paste ready title and body
- Optional shorter version for stacked PRs

## Troubleshooting
- **Draft PR:** Mark as WIP in title or use a Draft section
- **Dependabot-style PR:** Emphasize dependency bump scope and `npm audit` / CI results
