# Command: Security audit

Run a security audit (dependencies and/or static analysis).

## Instructions

1. Run dependency audit (e.g. `npm audit`, `yarn audit`, or equivalent).
2. Optionally run SAST or secret scan if configured (see `scripts/` or hooks).
3. Summarize findings: critical/high first; suggest upgrades or mitigations.
4. Do not apply automatic fixes that change lockfiles without user confirmation.
