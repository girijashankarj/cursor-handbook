---
name: feature-flag
description: Scaffold a new feature flag with config, utility check, and test template.
---

# Command: Feature Flag

## Invocation
`/feature-flag`

## Description
Scaffold a new feature flag with configuration entry, code check utility, env var setup, and test template for both code paths.

## Parameters
- `name`: Flag name (e.g., `async-processing`, `new-checkout`)
- `domain`: Domain/module the flag belongs to (e.g., `orders`, `auth`)

## Action
1. Generate flag constant: `FEATURE_{DOMAIN}_{NAME}` (uppercase, underscored).
2. Add to feature flag config file.
3. Add to `.env.example` with `false` default.
4. Generate code snippet for flag check.
5. Generate test template covering enabled and disabled paths.

## When to Use
- Gating a new feature for gradual rollout
- Adding a kill switch for a risky change
- Setting up A/B testing infrastructure

## Token Cost
~2–3K tokens

## Expected Output
- Flag config entry
- `.env.example` addition
- Code usage snippet
- Test template snippet
- Cleanup reminder with target date

## Troubleshooting
- **Flag already exists:** Verify name uniqueness before creating
- **Complex rollout:** Use the full `feature-flag-manager` skill instead
