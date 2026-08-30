---
name: env-check
description: Validate .env file against .env.example to find missing, extra, or undocumented environment variables.
---

# Command: Env Check

## Invocation
`/env-check`

## Description
Compare `.env` with `.env.example` to detect missing variables, undocumented additions, and ensure all required configuration is set.

## Parameters
- `env-file`: Path to .env file (default: `.env`)
- `example-file`: Path to .env.example (default: `.env.example`)

## Action
1. Parse both files, extracting variable names (ignoring comments and blank lines).
2. Compare and report:
   - **Missing:** In `.env.example` but not in `.env` → must add
   - **Extra:** In `.env` but not in `.env.example` → document or remove
   - **Empty:** Present but blank → may cause runtime errors
3. Optionally scan source code for `process.env.*` references not in either file.

## When to Use
- After pulling changes (someone may have added new env vars)
- Onboarding new developers
- Before deployment to verify config completeness
- After modifying environment configuration

## Token Cost
~1–3K tokens

## Expected Output
- List of missing, extra, and empty variables
- Suggestions for values (safe placeholders only)
- Pass/fail summary

## Troubleshooting
- **No .env.example:** Run `env-file-generator` skill to create one
- **Multiple .env files:** Specify which to check with the `env-file` parameter
