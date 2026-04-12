# Cursor folder meta-prompt for teams

Generates a guide for setting up and maintaining the .cursor folder for your team.

---

## Meta-prompt

```
You are creating a ".cursor folder setup and maintenance guide" for our team.

Read the project context:
1. The full .cursor/ directory structure — rules, agents, skills, commands, hooks, templates
2. project.json — current configuration
3. .cursor/agents/cursor-setup-agent.md — the setup agent's detection logic
4. README.md — how the handbook is described

Generate a comprehensive guide:

### What's in the .cursor folder
Directory tree with one-line descriptions per category:
```
.cursor/
├── config/     — ...
├── rules/      — ...
├── agents/     — ...
├── skills/     — ...
├── commands/   — ...
├── hooks/      — ...
└── templates/  — ...
```

Total: [X] rules, [X] agents, [X] skills, [X] commands, [X] hooks

### Which components our team uses
Based on our tech stack ([from project.json]), these are the active components:

**Core (everyone needs)**
- List the always-applied rules
- List the universal agents

**Backend** (if applicable)
- Relevant rules, agents, skills

**Frontend** (if applicable)
- Relevant rules, agents, skills

**Cloud/DevOps** (if applicable)
- Relevant rules, agents, skills

**Testing**
- Testing rules, agents, skills

### How to add this to a new project
Step-by-step instructions for our team:
1. Clone/copy the .cursor folder
2. Configure project.json for the new project
3. Remove irrelevant components
4. Make hooks executable
5. Verify with the handbook validator

### How to customize
- Adding a new rule: where to put it, how to scope it, update the sync checklist
- Adding a new agent: template, registration in cursor-setup-agent.md
- Adding a new skill: SKILL.md format, scripts folder

### Maintenance
- When to update: new framework, new convention, team agreement
- How to update: edit the rule/agent/skill, run validator
- Sync rule: if you add/remove a component, update cursor-setup-agent.md

### Common questions
- "Do I need all components?" — No, use the setup agent to select by stack
- "Can I add my own rules?" — Yes, follow the .mdc format in rules/
- "How do I share changes with the team?" — Commit .cursor/ to your repo

Use our actual component inventory and configuration — not the generic handbook docs.
```

## Expected output

A team-specific .cursor folder guide (2-3 pages) for onboarding and maintenance.
