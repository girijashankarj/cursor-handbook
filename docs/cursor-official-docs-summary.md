# Cursor official docs summary

Short summary of Cursor IDE features relevant to cursor-handbook. For the latest details, see [Cursor's official documentation](https://cursor.com/docs).

## Features

- **AI chat** — In-editor chat with project context; rules and agents from `.cursor` are applied.
- **Inline edit** — Select code and request changes; AI follows project conventions.
- **Composer** — Multi-file edits and generation.
- **Rules** — `.cursor/rules/` (and `.mdc` files) with `description`, `alwaysApply`, `globs`.
- **Skills** — `.cursor/skills/` with `name`, `description`; optional `scripts/`, `references/`, `assets/`.
- **Agents** — Custom agents in `.cursor/agents/` (root only); support `name`, `description` frontmatter.
- **Commands** — Custom commands in `.cursor/commands/`; support `name`, `description` frontmatter.
- **Hooks** — `.cursor/hooks.json`; command-based or `type: "prompt"` for LLM-evaluated conditions.
- **BugBot** — PR review; rules in `.cursor/BUGBOT.md`; nested `backend/.cursor/BUGBOT.md` etc.
- **Remote Rules** — Import rules from GitHub; stays synced.
- **Plugins** — Package rules, skills, agents, commands, hooks, MCP into distributable bundles.
- **MCP** — Model Context Protocol for external tools (databases, APIs).
- **CLI** — Headless mode, shell mode, GitHub Actions.

## Configuration

- Project-specific config lives under `.cursor/` (rules, agents, commands, hooks, config, settings, skills, templates).
- Cursor also uses user-level settings; handbook focuses on project-level behavior.

## Documentation

- [Cursor-Recognized Files and Keywords](reference/cursor-recognized-files.md) — Full keyword reference
- [Cursor Official Features Index](reference/cursor-official-features.md) — Comprehensive feature index
