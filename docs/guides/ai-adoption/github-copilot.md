# GitHub Copilot

Cursor can be used alongside or instead of GitHub Copilot. This page notes differences and when to use which.

## Cursor vs Copilot

- **Cursor** — Full IDE with integrated AI, project-specific rules and agents, and strong support for custom workflows (handbook rules, skills, hooks).
- **Copilot** — Inline completions and chat in VS Code or other editors; less focus on project-specific rule sets.

## Using both

- You can use Copilot for completions and Cursor for chat and commands if both are installed in the same editor stack.
- Prefer Cursor when you want behavior that follows cursor-handbook (e.g. handler pattern, token efficiency, security rules).

## Migration from Copilot

- If moving from Copilot to Cursor, bring over any team conventions into `.cursor/rules/` and document common tasks in `.cursor/commands/` and `.cursor/skills/`.
