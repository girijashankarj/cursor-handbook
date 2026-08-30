---
name: redact
description: Scan a file or snippet for secrets, PII, and internal infrastructure names, then redact them with safe placeholders.
---

# Command: Redact

## Invocation
`/redact`

## Description
Scan the current file, a specified file, or pasted content for sensitive information and replace it with standardized placeholders.

## Parameters
- `target`: File path, `current` (focused file), or pasted content
- `mode`: `scan` (report only, no changes) or `apply` (redact in place, default: `scan`)

## Action
1. Scan for sensitive patterns:
   - API keys, tokens, credentials
   - Email addresses, phone numbers, names
   - Internal URLs, hostnames, IP addresses
   - AWS account IDs, ARNs, resource names
   - Database connection strings
   - PEM certificates and private keys
2. Report findings with line numbers and category.
3. If `mode=apply`: replace with standardized placeholders (`[API_KEY]`, `[EMAIL]`, `[DB_HOST]`, etc.)

## When to Use
- Before sharing code or configs externally
- Before committing `.env.example` files
- Sanitizing log files for bug reports
- Preparing documentation for public repos
- Pre-commit review for accidental secrets

## Token Cost
~2–5K tokens

## Expected Output
- **Scan mode:** List of findings with line numbers, no file changes
- **Apply mode:** Redacted file + summary of changes made

## Troubleshooting
- **False positives:** Review scan results before applying; use `scan` mode first
- **Missed secrets:** Report the pattern so it can be added to the scan list
