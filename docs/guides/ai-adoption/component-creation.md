# Component creation

How to add new rules, agents, commands, skills, and hooks to cursor-handbook.

## Rules (`.mdc`)

- Add a new `.mdc` file under `.cursor/rules/` (or the right subfolder: backend, frontend, etc.).
- Use `{{CONFIG.section.key}}` for project-specific values (see `config/project.json` and schema).
- Keep one concern per file; reference other rules by topic.

## Agents (`.md`)

- Add a new `.md` file under `.cursor/agents/` (e.g. `agents/backend/my-agent.md`).
- Describe: when to use, inputs/outputs, steps or constraints.
- Name clearly so users can say "Use the my-agent agent."

## Commands (`.md`)

- Add a `.md` file under `.cursor/commands/{domain}/` (e.g. `commands/backend/format.md`).
- Describe the exact command (e.g. `npm run format`) and scope (e.g. backend paths only).

## Skills (`SKILL.md`)

- Create a folder under `.cursor/skills/{domain}/` and add `SKILL.md` inside.
- Include: trigger phrase, prerequisites, ordered steps, optional code snippets.
- Use `{{CONFIG}}` placeholders where relevant.

## Hooks (`.sh`)

- Add a script in `.cursor/hooks/` and make it executable (`chmod +x`).
- Register it in **`.cursor/hooks.json`** under the right event key, as an array of `{ "command": ".cursor/hooks/your-script.sh" }` entries (see [Hooks](https://cursor.com/docs/agent/hooks)).
- Keep scripts minimal and fast; avoid heavy work in the hot path.
