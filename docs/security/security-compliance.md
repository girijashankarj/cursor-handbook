# Security compliance

High-level compliance expectations for projects using cursor-handbook. Details are in the security rules.

## Data

- **Secrets** — Never in code or logs; use env vars or secrets manager.
- **PII** — Do not log; mask if necessary; classify per data policy.
- **Transit** — TLS for all external communication.
- **At rest** — Encryption for DB and backups; use provider/KMS where applicable.

## Access

- **Auth** — Short-lived tokens; refresh flow; secure session handling.
- **Authorization** — Least privilege; check permissions per request.
- **Infrastructure** — IAM roles; no long-lived keys in code.

## Development

- **Dependencies** — Audit in CI; no critical/high vulnerabilities in production deps.
- **Input** — Validate at boundary; parameterized queries only.
- **Errors** — No stack traces or internal details to clients.

See `.cursor/rules/security/` for the full rule set and `docs/security/security-guide.md` for the security guide.
