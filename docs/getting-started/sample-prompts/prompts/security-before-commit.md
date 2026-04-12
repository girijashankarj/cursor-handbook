# Security before commit prompt

Use this as a pre-commit security check before pushing code.

---

## Full security scan

```
Scan these files for security issues before I commit:

[LIST_FILES]

Check for:
1. **Hardcoded secrets** — API keys, tokens, passwords, connection strings with credentials
2. **PII in logs** — Names, emails, phone numbers, SSNs, credit card numbers in log statements
3. **SQL injection** — String concatenation in queries instead of parameterized queries
4. **Missing input validation** — User input used without validation or sanitization
5. **Missing auth checks** — Protected routes without authentication/authorization middleware
6. **Exposed internals** — Real infrastructure names, account IDs, or internal URLs in comments/docs
7. **Sensitive data in URLs** — Secrets or PII passed as query parameters
8. **Unsafe patterns** — eval(), new Function(), dangerouslySetInnerHTML without sanitization

For each issue:
- File and line number
- Severity: critical / high / medium
- What to fix

Also check that .env files are in .gitignore.
```

## Quick check

```
Quick security check on my staged changes (git diff --cached). Focus on secrets and PII only.
```

## Dependency audit

```
Check dependencies for known vulnerabilities:
- Run the equivalent of npm audit / pip audit
- Flag critical and high severity issues
- Suggest remediation for each
```

## Placeholders

| Placeholder | Replace with |
|-------------|-------------|
| `[LIST_FILES]` | Files you're about to commit |
