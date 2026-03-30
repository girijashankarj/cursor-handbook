# Migration to cursor-handbook

Guide for adopting cursor-handbook in an existing project.

## Steps

1. **Back up** — Ensure your current `.cursor` or Cursor-related config is backed up if you have customizations.
2. **Add handbook** — Clone or copy cursor-handbook into `.cursor` (or merge its contents into your existing `.cursor`).
3. **Configure** — Copy `config/project.json.template` to `config/project.json` and set project name, paths, tech stack, and domain entities.
4. **Adjust rules** — Enable or disable rules that don’t fit your stack (e.g. disable backend rules if you’re frontend-only).
5. **Hooks** — Make hook scripts executable (`chmod +x .cursor/hooks/*.sh`) and enable only the hooks you want in `hooks/hooks.json`.
6. **Validate** — Run type-check and a single test; confirm agents and skills are available in Cursor.

## From another Cursor config

If you’re migrating from another Cursor config (e.g. a different repo’s `.cursor`):

- Map their rules to the handbook’s rule set; keep only the ones you need.
- Merge agents and commands; rename duplicates for clarity.
- Keep a single `project.json`; use placeholders from the handbook’s schema.

## Rollback

To roll back, restore your previous `.cursor` from backup and remove or overwrite the handbook files.
