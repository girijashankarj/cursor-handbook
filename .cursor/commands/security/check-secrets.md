# Command: Check for Secrets

## Invocation
`/check-secrets`

## Description
Scan codebase for accidentally committed secrets or credentials.

## Action
Search for common secret patterns in the codebase:
```bash
# API keys and tokens
rg -i "(api[_-]?key|api[_-]?token|access[_-]?token|secret[_-]?key)" --type-not lock -g '!node_modules' -g '!.git'

# Hardcoded passwords
rg -i "(password|passwd|pwd)\s*[:=]\s*['\"][^'\"]{8,}" --type-not lock -g '!node_modules' -g '!.git'

# AWS credentials
rg "(AKIA|ABIA|ACCA|ASIA)[A-Z0-9]{16}" -g '!node_modules' -g '!.git'

# Private keys
rg "BEGIN (RSA |EC |DSA )?PRIVATE KEY" -g '!node_modules' -g '!.git'
```

## When to Use
- Before committing
- Before pushing to public repository
- During security audits
- After onboarding new developers

## Expected Output
- Any matches found are potential secrets
- Each match should be reviewed and remediated
- False positives should be added to allowlist
