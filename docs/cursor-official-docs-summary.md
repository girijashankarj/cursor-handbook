# Cursor official docs summary

Short summary of Cursor IDE features relevant to cursor-handbook. For the latest details, see [Cursor’s official documentation](https://docs.cursor.com/).

## Features

- **AI chat** — In-editor chat with project context; rules and agents from `.cursor` are applied.
- **Inline edit** — Select code and request changes; AI follows project conventions.
- **Composer** — Multi-file edits and generation.
- **Rules** — `.cursor/rules/` (and `.mdc` files) are loaded as workspace rules.
- **Agents** — Custom agents can be referenced in chat.
- **Commands** — Custom commands can be run from the AI or command palette.
- **Hooks** — Scripts can run before/after prompt or edit if supported by Cursor.
- **BugBot** — Cursor’s PR review agent: reviews pull requests (GitHub/GitLab), finds bugs and security issues, can autofix. Custom rules go in **`.cursor/BUGBOT.md`** (BugBot does not use `.cursor/rules/`). See [Cursor BugBot docs](https://cursor.com/docs/bugbot).

## Configuration

- Project-specific config lives under `.cursor/` (rules, agents, commands, hooks, config, settings, skills, templates).
- Cursor also uses user-level settings; handbook focuses on project-level behavior.

This file is a placeholder; update with links and highlights from the official docs as needed.
