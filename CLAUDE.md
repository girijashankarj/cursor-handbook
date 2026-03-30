# CLAUDE.md — Instructions for Claude

> This file provides project-specific instructions for Claude when working in this repository.

## Project

**cursor-handbook** — A Cursor IDE configuration boilerplate with 117 components (rules, agents, skills, commands, hooks).

## Critical Rules

### Token Efficiency (MOST IMPORTANT)

- **NEVER** auto-run full test suites — costs 100K+ tokens
- **NEVER** auto-run full lint — costs 50K+ tokens
- Use `read_lints` tool to check for lint errors
- Run type-check (~10K tokens) as the default validation step
- Run single-file tests instead of full suites
- Ask for confirmation before any operation that may cost 50K+ tokens
- Keep responses concise: bullet points, not paragraphs

### Security (CRITICAL)

- NEVER hardcode secrets, API keys, passwords, or tokens in any file
- NEVER log PII (personally identifiable information)
- Use environment variables for all configuration secrets
- Use placeholders for infrastructure: `[AWS_ACCOUNT_ID]`, `[RESOURCE_NAME]`
- NEVER expose internal URLs, hostnames, or resource ARNs

### Code Standards

- Follow the handler pattern in `.cursor/rules/backend/handler-patterns.mdc`
- Soft delete only — NEVER use `DELETE FROM` SQL statements
- Structured JSON logging with `correlationId`
- Import order: external packages → internal packages → relative imports

## Project Structure

```
.cursor/
├── config/     # project.json configuration
├── rules/      # 29 always-applied .mdc rules
├── agents/     # 34 specialized AI agents
├── skills/     # 21 step-by-step workflows
├── commands/   # 14 quick action commands
├── hooks/      # 12 automation scripts
├── templates/  # Code scaffolding templates
└── settings/   # IDE settings
```

## Workflow

1. Read relevant files before making changes
2. Follow established patterns in the codebase
3. Run type-check after changes (not full tests)
4. Use `read_lints` instead of running lint
5. Provide concise, actionable output

## Configuration

All components reference project settings via `{{CONFIG.section.key}}` placeholders.
Configuration file: `.cursor/config/project.json`
