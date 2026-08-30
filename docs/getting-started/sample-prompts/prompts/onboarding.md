# Onboarding prompt

Use this when joining a project that uses cursor-handbook.

---

## Prompt

```
I'm new to this project. Help me get oriented:

1. Read the project.json config and summarize the tech stack, conventions, and folder structure.
2. List the active rules in .cursor/rules/ and explain what each enforces (one line per rule).
3. Show me the handler pattern this project uses — find an example handler and walk through it.
4. What agents and skills are available? Which ones are most relevant for [YOUR_ROLE: backend/frontend/fullstack]?
5. What's the test command and minimum coverage target?
6. List any team-specific conventions I should know (commit format, branch naming, PR process).

Keep answers concise — bullet points preferred.
```

## Placeholders

| Placeholder | Replace with |
|-------------|-------------|
| `[YOUR_ROLE]` | Your role: `backend`, `frontend`, `fullstack`, `devops` |

## Expected output

- Tech stack summary from `project.json`
- One-line description of each rule
- Example handler walkthrough
- Agent/skill inventory relevant to your role
- Testing and CI commands
