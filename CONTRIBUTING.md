# Contributing to cursor-handbook

Thank you for your interest in contributing to cursor-handbook! This guide will help you get started.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Component Guidelines](#component-guidelines)
- [Submission Process](#submission-process)
- [Style Guide](#style-guide)

## Code of Conduct

Please be respectful, inclusive, and constructive in all interactions. We follow the [Contributor Covenant](https://www.contributor-covenant.org/).

## Getting Started

### Prerequisites

- Git
- A text editor (preferably Cursor IDE)
- Basic understanding of Cursor IDE components (rules, agents, skills)

### Setup

```bash
# Fork the repository on GitHub

# Clone your fork
git clone https://github.com/YOUR_USERNAME/cursor-handbook.git
cd cursor-handbook

# Create a branch for your changes
git checkout -b feature/your-feature-name
```

## Development Workflow

### Branch Naming

- `feature/` — New features or components
- `fix/` — Bug fixes
- `docs/` — Documentation changes
- `refactor/` — Code improvements without new features

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

Types: feat, fix, docs, style, refactor, test, chore
Scope: rules, agents, skills, commands, hooks, docs, config

Examples:
  feat(agents): add kubernetes deployment agent
  fix(rules): correct token efficiency threshold
  docs(readme): update quick start instructions
```

## Component Guidelines

### Rules (.mdc files)

- Location: `.cursor/rules/{category}/{name}.mdc`
- Must include YAML frontmatter with `alwaysApply: true`
- Use `{{CONFIG.section.key}}` for configuration values
- Maximum 300 lines (for token efficiency)
- Focus on one concern per rule

### Agents (.md files)

- Location: `.cursor/agents/<name>.md` (at root only — Cursor does not discover agents in subdirectories)
- Naming: `{domain}-{purpose}-agent.md` (e.g. `backend-code-reviewer.md`)
- Must include: Invocation, Scope, Expertise, When to Use, Output Format
- Maximum 150 lines
- Clear, actionable output format

### Skills (SKILL.md)

- Location: `.cursor/skills/{domain}/{skill-name}/SKILL.md`
- Must include: Description, Trigger, Steps with checklists
- Maximum 200 lines
- Each step should have actionable checkboxes

### Commands (.md files)

- Location: `.cursor/commands/{domain}/{name}.md`
- Follow the format in `.cursor/commands/COMMAND_TEMPLATE.md`: Invocation, Description, Action, When to Use, Token Cost, Expected Output
- Keep commands simple and focused
- Document token cost savings when applicable

### Hooks (.sh scripts)

- Location: `.cursor/hooks/{name}.sh`
- Must be registered in `.cursor/hooks.json` under the appropriate event

- Include shebang: `#!/bin/bash`
- Use `set -e` for safety
- Handle missing dependencies gracefully

## Submission Process

### Pull Request

1. Create your branch from `main`
2. Make your changes following the guidelines above
3. Test your changes in Cursor IDE
4. Create a pull request with:
    - Clear title following commit conventions
    - Description of what and why
    - Screenshots or examples if applicable
    - List of components added/modified

### Review Criteria

- [ ] Follows component guidelines
- [ ] No hardcoded secrets or organization-specific data
- [ ] Uses `{{CONFIG}}` placeholders for project-specific values
- [ ] Within line limits (rules: 300, agents: 150, skills: 200)
- [ ] Documentation is clear and complete
- [ ] No breaking changes to existing components

## Style Guide

### Markdown

- Use ATX-style headers (`# H1`, `## H2`)
- Use fenced code blocks with language tags
- Use tables for structured data
- Keep lines under 120 characters

### Configuration Placeholders

- Use `{{CONFIG.section.key}}` syntax
- Reference valid paths from `project.json`
- Provide sensible defaults where possible

### Security

- **NEVER** include real secrets, API keys, or credentials
- **NEVER** include organization-specific names or URLs
- Use generic placeholders: `[YOUR_ORG]`, `[API_KEY]`, `[ACCOUNT_ID]`
- Check the data sanitization checklist before submitting

## Questions?

Open an issue on GitHub if you have questions or need help. We're happy to assist!
