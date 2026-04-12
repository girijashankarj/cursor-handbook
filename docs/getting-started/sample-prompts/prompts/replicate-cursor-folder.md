# Replicate .cursor folder prompt

Use this when setting up cursor-handbook in a new project.

---

## Full setup

```
I want to set up cursor-handbook in my project at [PROJECT_PATH].

My project uses:
- Language: [LANGUAGE]
- Framework: [FRAMEWORK]
- Database: [DATABASE]
- Cloud: [CLOUD]

Steps:
1. Copy the .cursor folder from cursor-handbook to my project
2. Create a project.json configured for my tech stack
3. Select only the relevant rules, agents, and skills for my stack:
   - Remove rules I don't need (e.g. remove React rules for a backend-only project)
   - Keep all security and testing rules
   - Keep all devops rules
4. Update all {{CONFIG.*}} placeholders to match my project.json
5. Make hook scripts executable
6. Verify the setup works by listing active rules

Show me what was copied and what was removed, with reasoning.
```

## Minimal setup (rules only)

```
Set up just the essential rules from cursor-handbook in my project:
- Security guardrails (secrets, PII)
- Error handling
- Testing standards
- Code organization

Skip agents, skills, commands, and hooks for now. Create a minimal project.json with my stack: [LANGUAGE] / [FRAMEWORK].
```

## Selective copy

```
From cursor-handbook, I only want these components:
[LIST_COMPONENTS]

Copy them to my project at [PROJECT_PATH] and create a minimal project.json that supports them.
```

## Placeholders

| Placeholder | Replace with |
|-------------|-------------|
| `[PROJECT_PATH]` | Absolute path to your project |
| `[LANGUAGE]` | Primary language |
| `[FRAMEWORK]` | Framework |
| `[DATABASE]` | Database |
| `[CLOUD]` | Cloud provider |
| `[LIST_COMPONENTS]` | Component paths you want |
