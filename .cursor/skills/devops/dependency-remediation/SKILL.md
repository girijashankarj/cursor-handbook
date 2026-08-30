---
name: dependency-remediation
description: Step-by-step workflow to fix npm/pnpm/yarn vulnerabilities and review Dependabot PRs with semver and CI safety.
---

# Skill: Dependency remediation

## When to use
- Vulnerabilities from `npm audit`, GitHub Dependabot, Snyk, or similar
- You need a repeatable review before merging version bumps

## Prerequisites
- Lockfile committed (`package-lock.json`, `pnpm-lock.yaml`, or `yarn.lock`)
- CI that runs install + tests (or type-check)

## Steps

### 1. Baseline
Run `/audit-deps` or `npm audit` and save severity counts (critical/high/medium/low).

### 2. Automated path
1. `npm audit fix` (non-breaking) or `pnpm audit --fix` / yarn equivalent.
2. Run **`{{CONFIG.testing.typeCheckCommand}}`** and targeted tests — not necessarily full suite unless user confirms.

### 3. Dependabot PR checklist
- [ ] Advisory ID and fixed version match lockfile diff
- [ ] No unexpected `postinstall` scripts from new transitive deps
- [ ] Changelog reviewed for breaking API changes in minors (rare but possible)
- [ ] Lockfile regenerated in CI matches local

### 4. Major upgrades
- Read migration guide; update code in the same PR or split PRs by package.
- Avoid `--force` without listing each major and risk.

### 5. Residual risk
If no patched version exists: document, track issue, consider pinning or removing the dependency.

## Output
- Table: package, from → to, severity, verification command run
- Explicit **merge / hold / split** recommendation

## Related commands
- `/fix-vulnerable-deps`
- `/audit-deps`
