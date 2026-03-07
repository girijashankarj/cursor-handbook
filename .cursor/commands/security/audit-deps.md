# Command: Audit Dependencies

## Invocation
`/audit-deps`

## Description
Scan dependencies for known security vulnerabilities.

## Action
```bash
# For Node.js
npm audit --production
# or
{{CONFIG.techStack.packageManager}} audit

# For Python
pip audit
# or
safety check
```

## When to Use
- Before releases
- After adding new dependencies
- Weekly scheduled check
- After receiving vulnerability alerts

## Expected Output
- List of vulnerabilities (critical, high, medium, low)
- Affected packages and versions
- Recommended fixes or patches
