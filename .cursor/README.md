# Cursor configuration

This directory holds Cursor IDE configuration for the project.

## Contents

- **agents/** — Specialized AI agents (backend, frontend, cloud, testing, etc.)
- **commands/** — Quick-action commands (format, lint, type-check, test, deploy)
- **config/** — Project configuration (`project.json`, schema, templates)
- **hooks/** — Automation scripts (pre-commit, format-on-edit, lint-check, etc.)
- **rules/** — Always-applied workspace rules (architecture, backend, frontend, security)
- **settings/** — IDE settings, keybindings, and tasks
- **skills/** — Step-by-step workflows (create-handler, code-review, migration, etc.)
- **templates/** — Code templates for handlers, services, tests, Dockerfile

## Quick start

1. Copy `config/project.json.template` to `config/project.json` and fill in your project values.
2. Ensure hooks are executable: `chmod +x hooks/*.sh` (in the `hooks` directory).
3. See `docs/getting-started/quick-start.md` for full setup.

## Reference

- Component overview: `docs/components/overview.md`
- Configuration: `docs/reference/configuration-reference.md`
- Enrichment checklist: `docs/reference/enrichment-checklist.md` (when adding content to components)
