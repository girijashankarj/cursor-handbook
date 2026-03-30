---
name: fix-vulnerable-deps
description: Remediate npm/pnpm/yarn vulnerabilities and review Dependabot-style bumps safely.
---

# Command: Fix vulnerable dependencies

## Invocation
`/fix-vulnerable-deps`

## Description
Reduce **known vulnerabilities** in Node/npm projects using automated fixes first, then manual semver decisions. Complements `/audit-deps` (scan only). Covers **Dependabot** / Renovate PR review patterns.

## Action

### 1. Identify ecosystem
```bash
# Detect lockfile and run audit
# npm
npm audit --json
npm audit fix --dry-run   # preview

# pnpm
pnpm audit
pnpm audit --fix

# Yarn Berry
yarn npm audit
```

### 2. Prefer safe automation
- Run **`npm audit fix`** (or pnpm/yarn equivalent) for compatible semver / patch updates.
- If only **`npm audit fix --force`** resolves issues, **stop** and list breaking major bumps for explicit approval (document each package).

### 3. Manual / major upgrades
- Read advisory: severity, CWE, affected range, fixed version.
- Update `package.json` ranges and **regenerate lockfile** (`npm install`, `pnpm install`, `yarn`).
- Run **smoke tests** / type-check / build as appropriate for the project.

### 4. Dependabot (or similar) PRs
- Verify **lockfile-only** vs **package.json** range changes.
- Check **transitive** updates; run CI locally if possible.
- Confirm **no** malicious package substitution (review changelog, publisher).
- Merge order: security patches before unrelated refactors.

### 5. Document
- Note remaining accepted risk (e.g. no fix available) and compensating controls if any.

## When to Use
- After `/audit-deps` or GitHub Dependabot alerts
- Before release or compliance review
- When upgrading after `npm audit` reports critical/high

## Token Cost
~8–15K tokens (varies with audit output size)

## Expected Output
- Ordered plan: auto-fix → manual bumps → verify
- List of packages still vulnerable with reason

## Troubleshooting
- **No fix available:** Check vendor advisory; consider alternative package or isolation.
- **Python / other stacks:** Use `pip audit`, `poetry audit`, or OSV; adapt steps similarly.

## Related
- Skill: `dependency-remediation` (deeper playbook)
- Command: `/audit-deps`
