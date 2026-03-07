# Rules

Rules are always-applied workspace standards stored as `.mdc` (Markdown Component) files in `.cursor/rules/`. Cursor loads them automatically and applies them to every AI interaction.

## Purpose

- **Token efficiency** — Reduce unnecessary context and long outputs
- **Security** — No hardcoded secrets, no PII in logs
- **Code organization** — Handler pattern, soft delete, structured logging
- **Testing** — Coverage targets, mocking, integration test patterns
- **API and DB** — REST conventions, migrations, query patterns

## Structure

Rules are grouped by domain (architecture, backend, cloud, database, devops, frontend, security, testing). The main entry is `main-rules.mdc`; other files refine behavior for specific areas.

See `.cursor/rules/` for the full list and `docs/reference/configuration-reference.md` for how rules reference `{{CONFIG}}` placeholders.
