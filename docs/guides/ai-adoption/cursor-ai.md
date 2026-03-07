# Cursor AI

Cursor IDE integrates AI into the editor: chat, inline edits, and command execution. This doc summarizes how to use it with cursor-handbook.

## Features

- **Chat** — Ask questions, generate code, refactor; rules and agents from `.cursor` are applied automatically.
- **Inline edit** — Select code and ask for a change; the AI follows project rules (e.g. handler pattern, no secrets).
- **Commands** — Run tasks by name (format, type-check, test-single); see `.cursor/commands/`.
- **Agents** — Invoke specialized behavior (code review, migration, security) by referencing the agent.

## Best practices

- Keep prompts focused; mention the file or area you care about.
- Use "run type-check" or "run test for this file" instead of "run all tests" to save time and tokens.
- Reference an agent when you want structured output (e.g. "Use the code-reviewer agent").
- Rely on rules for consistency; avoid re-explaining project conventions in every prompt.

## Handbook integration

- Rules in `.cursor/rules/` are always applied.
- Skills in `.cursor/skills/` are used when the task matches (e.g. create handler, fix tests).
- Hooks run at prompt submit, after edit, or before shell; see `.cursor/hooks/README.md`.
