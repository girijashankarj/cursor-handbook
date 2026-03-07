# Hooks

Hooks are shell scripts in `.cursor/hooks/` that run at specific points in the Cursor workflow (e.g. before submitting a prompt, after editing a file, before running a shell command).

## Configuration

Hooks are registered in `.cursor/hooks/hooks.json`. Each hook type can run one or more scripts:

- **beforeSubmitPrompt** — Enrich context before the AI receives the prompt
- **afterFileEdit** — Format or run light checks after a file is edited
- **beforeShellExecution** — Guard dangerous commands or run validation

## Scripts

See `.cursor/hooks/README.md` for the list of scripts (format-on-edit, lint-check, type-check, scan-secrets, validate-sql, etc.) and how to enable or disable them.

## Making scripts executable

```bash
chmod +x .cursor/hooks/*.sh
```
