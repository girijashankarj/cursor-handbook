# Troubleshooting

## Rules or agents not applied

- Ensure files are under `.cursor/rules/` (`.mdc`) and `.cursor/agents/` (`.md`).
- Restart Cursor or reload the window (Command Palette → "Developer: Reload Window").
- Check that `.cursor` is at the project root and not ignored by Cursor.

## Hooks not running

- Make scripts executable: `chmod +x .cursor/hooks/*.sh`
- Check `.cursor/hooks.json` (project root) — Cursor reads this file only. Format: `{ "version": 1, "hooks": { "beforeSubmitPrompt": [{ "command": ".cursor/hooks/context-enrichment.sh" }], ... } }`
- Add your script under the event you want (e.g. `afterFileEdit`, `beforeShellExecution`).
- Run a script manually to debug: `./.cursor/hooks/context-enrichment.sh` or `./.cursor/hooks/post-edit-check.sh path/to/file`

## Placeholders not replaced

- `{{CONFIG.xxx}}` placeholders are resolved from `config/project.json`. Create `project.json` from `project.json.template` and fill in values.
- If a key is missing, the placeholder may appear literally; add the key to `project.json` or the schema.

## Type-check or lint fails

- Run the same command in the terminal (e.g. `npm run type-check`) to see the real error.
- Ensure dependencies are installed (`npm install`) and that paths in `project.json` match your repo.

## "Permission denied" on hooks

- Run: `chmod +x .cursor/hooks/*.sh`
- On Windows, use Git Bash or WSL to run `.sh` hooks; or add equivalent scripts in another format if your hooks runner supports it.
