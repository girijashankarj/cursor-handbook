---
name: audit
description: Run security audit (dependencies and/or static analysis). Summarize findings; do not auto-fix without confirmation.
---

# Command: Security Audit

## Invocation
`/audit`

## Description
Run a security audit (dependencies and/or static analysis). Summarize critical/high first; suggest upgrades or mitigations.

## Action
```bash
# Dependency audit
{{CONFIG.techStack.packageManager}} audit

# Optionally: SAST or secret scan if configured (see scripts/ or hooks)
```

## When to Use
- Before releases
- After adding dependencies
- Scheduled security checks
- After vulnerability alerts

## Token Cost
~15K tokens (depends on audit output size)

## Expected Output
- **Success**: List of findings (critical/high first); suggested fixes
- **Failure**: Audit tool errors; missing config

## Troubleshooting
- **No audit command**: Use `npm audit`, `yarn audit`, or `pnpm audit` for Node.js
- **Lockfile changes**: Do not apply automatic fixes without user confirmation
- **SAST/secret scan**: See `scripts/` or `.cursor/hooks/` for configured tools
