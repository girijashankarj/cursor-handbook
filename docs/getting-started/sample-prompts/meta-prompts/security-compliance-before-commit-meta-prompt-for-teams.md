# Security compliance meta-prompt for teams

Generates a project-specific pre-commit security checklist and compliance guide.

---

## Meta-prompt

```
You are creating a security compliance guide for our team.

Read the project context:
1. .cursor/rules/security/ — all security rules (guardrails, secrets, compliance)
2. project.json — cloud provider, tech stack
3. .gitignore — verify secrets exclusion
4. .env.example or similar — check for placeholder patterns
5. Existing auth/middleware code — how we handle authentication

Generate a comprehensive security compliance guide:

### Pre-commit checklist
A checklist developers run before every commit:

**Secrets**
- [ ] No API keys, tokens, or passwords in source code
- [ ] No database connection strings with credentials
- [ ] No private keys or certificates
- [ ] .env files are in .gitignore
- [ ] .env.example uses placeholders only (YOUR_API_KEY, not real values)

**PII protection**
- [ ] No full names, emails, or phone numbers in log statements
- [ ] No SSN, credit card, or financial data in logs
- [ ] User references use only userId, sessionId, correlationId
- [ ] Error messages to clients don't expose internal details

**Infrastructure**
- [ ] No real AWS/GCP/Azure account IDs in code or comments
- [ ] No internal URLs or hostnames exposed
- [ ] Resource names use placeholders: [BUCKET_NAME], [QUEUE_NAME]

**Input security**
- [ ] All user input validated at the API boundary
- [ ] Database queries use parameterized statements
- [ ] File uploads validated (type, size, content)
- [ ] No eval(), new Function(), or dynamic code execution

**Auth & access**
- [ ] Protected routes have auth middleware
- [ ] Authorization checks verify resource ownership
- [ ] Passwords hashed with bcrypt/argon2 (never plain text)
- [ ] Tokens are short-lived with refresh mechanism

### Automated checks
List the automated security checks in our CI pipeline:
- Dependency audit command: [actual command]
- Secret scanning: [tool or approach]
- SAST tool: [if configured]

### Security review prompt
A prompt to paste into Cursor for a security scan:

"Scan these files for security issues: [files]. Check against all rules in .cursor/rules/security/. Report: file, line, severity (critical/high/medium), issue, fix."

### Incident response
If a secret is accidentally committed:
1. Rotate the secret immediately
2. Remove from git history (git filter-branch or BFG)
3. Notify the team
4. Update .gitignore to prevent recurrence

Tailor everything to our specific cloud provider, tech stack, and security rules.
```

## Expected output

A team security reference that developers check before every commit. Pin it in your team channel or PR template.
