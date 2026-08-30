# Customizing config prompt

Use this when editing `project.json` to match your tech stack and conventions.

---

## Initial configuration

```
Help me configure project.json for my project:

- Project name: [PROJECT_NAME]
- Language: [LANGUAGE] (e.g. TypeScript, Python, Go, Java)
- Framework: [FRAMEWORK] (e.g. Express, NestJS, FastAPI, Spring Boot)
- Database: [DATABASE] (e.g. PostgreSQL, MySQL, MongoDB, DynamoDB)
- Cloud: [CLOUD] (e.g. AWS, GCP, Azure)
- Package manager: [PACKAGE_MANAGER] (e.g. npm, pnpm, yarn, pip)
- Test framework: [TEST_FRAMEWORK] (e.g. Jest, Vitest, pytest)
- Source directory: [SRC_DIR] (e.g. src/, app/, lib/)

Read the current project.json, update all relevant fields, and show me the diff.
```

## Add a new tech to existing config

```
I'm adding [NEW_TECHNOLOGY] to the project. Update project.json to include:
- Any new paths or folder conventions
- Relevant commands (build, test, lint)
- Detection signals for the cursor-setup-agent

Also tell me which rules or agents I should add/enable for this technology.
```

## Validate configuration

```
Read project.json and validate:
1. All required fields are filled (project name, tech stack, paths)
2. Referenced paths actually exist in the project
3. Commands are correct and runnable
4. No placeholder values left (like "your-project-name")

Report issues and suggest fixes.
```

## Placeholders

| Placeholder | Replace with |
|-------------|-------------|
| `[PROJECT_NAME]` | Your project's name |
| `[LANGUAGE]` | Primary programming language |
| `[FRAMEWORK]` | Web/API framework |
| `[DATABASE]` | Database system |
| `[CLOUD]` | Cloud provider |
| `[PACKAGE_MANAGER]` | Package manager |
| `[TEST_FRAMEWORK]` | Test framework |
| `[SRC_DIR]` | Source code directory |
