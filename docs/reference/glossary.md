# Glossary

| Term | Definition |
|------|------------|
| **Agent** | A specialized AI assistant defined in `.cursor/agents/` with a focused role (e.g. code review, migration). |
| **Command** | A quick-action task defined in `.cursor/commands/` (e.g. format, type-check, deploy). |
| **CONFIG** | Project configuration from `config/project.json`; referenced in rules/skills as `{{CONFIG.section.key}}`. |
| **Handler pattern** | The 7-step flow for API handlers: validate request → validate business → pre-process → operation → post-operation → response → exit. |
| **Hook** | A script in `.cursor/hooks/` that runs at a specific point (before prompt, after edit, before shell). |
| **Rule** | An always-applied standard in `.cursor/rules/` (`.mdc`); e.g. token efficiency, security, handler pattern. |
| **Skill** | A step-by-step workflow in `.cursor/skills/*/SKILL.md` triggered by user intent. |
| **Soft delete** | Marking records as deleted (e.g. `active_indicator = false`) instead of `DELETE`; required by handbook DB rules. |
| **Token efficiency** | Minimizing prompt and response size to reduce cost and latency; enforced by handbook rules. |
