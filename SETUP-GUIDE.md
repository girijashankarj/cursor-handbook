# cursor-handbook Setup Guide

This guide walks you through setting up cursor-handbook in your project.

## What You Get

cursor-handbook provides **218+ components** for Cursor IDE:

| Category | Count | Examples |
|----------|-------|---------|
| Rules | 47 | TypeScript, React, error handling, security |
| Agents | 71 | Code reviewer, architect, testing, refactoring |
| Skills | 50 | Create handler, debug issue, CI/CD, migrations |
| Commands | 38 | Type-check, lint, test, deploy, changelog |
| Hooks | 12 | Pre-commit, format, secrets scan, coverage |
| Templates | 9 | Handler, service, component, Dockerfile |

## Setup Flow

### 1. Initialize

> **npm package:** [npmjs.com/package/cursor-handbook](https://www.npmjs.com/package/cursor-handbook)

If you haven't already:

```bash
npx cursor-handbook init
```

You'll be prompted to choose:

1. **Copy all components** -- installs everything at once
2. **Select by category** -- pick from frontend, backend, database, cloud, testing, devops, documentation, security (multi-select, core is always included)

To skip the prompt and copy everything:

```bash
npx cursor-handbook init --all
```

This copies the `.cursor/` folder, `CLAUDE.md`, and `AGENTS.md` into your project.

### 2. Configure

Edit `.cursor/config/project.json` and replace all `{{PLACEHOLDER}}` values:

- `{{PROJECT_NAME}}` -- your project name
- `{{LANGUAGE}}` -- e.g., `TypeScript`, `Python`, `Go`
- `{{FRAMEWORK}}` -- e.g., `Express`, `NestJS`, `FastAPI`
- `{{DATABASE}}` -- e.g., `PostgreSQL`, `MongoDB`
- `{{SOURCE_PATH}}` -- e.g., `src/`
- `{{TEST_COMMAND}}` -- e.g., `npm test`, `pytest`

See `.cursor/config/project.json.example` for a complete reference.

### 3. Customize with Setup Agent

Open your project in Cursor and invoke the setup agent:

```
@cursor-setup-agent
```

The agent will:
- Detect your tech stack (languages, frameworks, databases)
- Recommend which components to keep
- Remove components that don't apply to your project
- Generate tailored `CLAUDE.md` and `AGENTS.md`

### 4. Verify

Try these commands in Cursor to confirm everything works:

- `/type-check` -- Run type checking
- `/code-reviewer` -- Start a code review
- `/test-single` -- Test a single file
- `/check-secrets` -- Scan for leaked secrets

### 5. Clean Up

Remove the npm package -- you no longer need it:

```bash
npm uninstall cursor-handbook
```

The `.cursor/` folder and setup files stay in your project. Commit them to version control.

## Project Configuration Reference

The `project.json` file drives all rules, agents, and skills via `{{CONFIG.section.key}}` placeholders. Key sections:

| Section | Purpose |
|---------|---------|
| `project` | Name, description, version |
| `techStack` | Language, framework, database, cloud provider |
| `paths` | Source directories, API paths, handler paths |
| `testing` | Test command, coverage minimum, lint command |
| `database` | Soft-delete field, timestamp field names |
| `conventions` | Branch prefixes, commit format |

## Examples

Pre-built `project.json` files for common stacks live in the `examples/` directory:

- `typescript-express` -- TypeScript + Express + PostgreSQL
- `typescript-nest` -- TypeScript + NestJS
- `react` -- React frontend
- `nextjs` -- Next.js fullstack
- `python-fastapi` -- Python + FastAPI
- `go-chi` -- Go + Chi router
- `kotlin-spring` -- Kotlin + Spring Boot
- `rust-actix` -- Rust + Actix Web
- `flutter` -- Flutter mobile

Copy one as your starting point:

```bash
cp .cursor/config/../../examples/typescript-express/project.json .cursor/config/project.json
```

## Full Documentation

For detailed guides, component reference, and advanced usage:

- **GitHub:** https://github.com/girijashankarj/cursor-handbook
- **npm:** https://www.npmjs.com/package/cursor-handbook
