# Cursor hooks

Scripts that run at specific points in the Cursor workflow (e.g. before submit, after edit, before shell).

## Hook configuration

Hooks are registered in `hooks.json` in this directory. Each hook can run one or more scripts.

## Scripts

| Script | Purpose |
|--------|--------|
| `context-enrichment.sh` / `inject-context.sh` | Add project context before submitting a prompt |
| `auto-format.sh` / `format-on-edit.sh` | Format code after file edit |
| `post-edit-check.sh` | Run light checks after edit |
| `shell-guard.sh` | Guard against dangerous shell commands |
| `pre-commit-check.sh` | Run before git commit (secrets, etc.) |
| `coverage-check.sh` | Check coverage after test run |
| `lint-check.sh` | Run lint on target files |
| `type-check.sh` | Run type check (e.g. tsc) |
| `scan-secrets.sh` | Scan for hardcoded secrets |
| `validate-sql.sh` | Validate SQL/migration files |

## Making scripts executable

```bash
chmod +x .cursor/hooks/*.sh
```

## Disabling hooks

Edit `hooks.json` and set `"enabled": false` for the hook you want to disable.
