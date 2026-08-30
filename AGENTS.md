# AGENTS.md — Instructions for AI Agents

> This file provides instructions to AI agents working in this repository.

## Project Overview

This is **cursor-handbook**, a Cursor IDE configuration boilerplate providing rules, agents, skills, commands, and hooks for software development.

## Key Principles

### 1. Token Efficiency

- NEVER auto-run full test suites (100K+ tokens)
- NEVER auto-run full lint (50K+ tokens)
- Use `read_lints` tool instead of lint commands
- Run type-check (~10K tokens) as the default validation
- Require explicit user confirmation for 50K+ token operations

### 2. Security

- NEVER hardcode secrets, API keys, passwords
- NEVER log PII (names, emails, SSN, credit cards)
- Use environment variables for all secrets
- Use generic placeholders for infrastructure: [ACCOUNT_ID], [RESOURCE_NAME]

### 3. Code Conventions

- Follow the handler pattern for API endpoints
- Soft delete only — never use DELETE SQL statements
- Structured JSON logging with correlationId
- All shared types in common/ directories
- Import order: external → internal → relative

### 4. Database

- All tables require: id, created_at, updated_at, active_indicator
- Parameterized queries only — never concatenate SQL
- Cursor-based pagination preferred
- Schema changes only via migrations

### 5. Testing

- Minimum 90% code coverage
- Mock all external dependencies
- Follow AAA pattern (Arrange-Act-Assert)
- No real API/database calls in unit tests

## Configuration

Project settings are in `.cursor/config/project.json`. Components reference settings via `{{CONFIG.section.key}}` placeholders.

## Component Map

- **Rules**: `.cursor/rules/*.mdc` — Always-applied standards
- **Agents**: `.cursor/agents/*.md` — Specialized AI assistants
- **Skills**: `.cursor/skills/*/SKILL.md` — Step-by-step workflows
- **Commands**: `.cursor/commands/*.md` — Quick actions
- **Hooks**: `.cursor/hooks/*.sh` — Automation scripts
