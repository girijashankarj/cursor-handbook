# Agents

Agents are specialized AI assistants defined in `.cursor/agents/` (by domain: backend, frontend, cloud, testing, security, etc.). Each agent has a focused role and is invoked when the user selects it or references it in chat.

## Usage

- **Invoke**: Use the agent name in Cursor chat (e.g. "Use the code-reviewer agent") or via Cursor's agent picker if available.
- **Purpose**: Get consistent, domain-specific behavior (e.g. code review, migration, security audit) instead of generic answers.

## Structure

Agents are Markdown files (`.md`) that describe:

- When to use the agent
- Expected inputs and outputs
- Steps or constraints the AI should follow
- Links to related rules or skills

See `.cursor/agents/` for the full list and `docs/components/overview.md` for the component map.
