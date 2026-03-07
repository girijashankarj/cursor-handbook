# Component Overview

cursor-handbook provides 5 types of components that work together to enhance your Cursor IDE experience.

## Component Types

### 1. Rules (.mdc files)

**Location**: `.cursor/rules/`
**Count**: 27
**Purpose**: Always-applied coding standards that guide every AI interaction.

Rules are automatically loaded by Cursor IDE and applied to all prompts. They enforce:

- Token efficiency (save 30%+ on AI costs)
- Security guardrails (no secrets, no PII)
- Code organization (consistent patterns)
- Testing standards (coverage, mocking)

### 2. Agents (.md files)

**Location**: `.cursor/agents/`
**Count**: 34
**Purpose**: Specialized AI assistants for complex tasks.

Invoke agents with `/agent-name` in the Cursor chat:

- `/code-reviewer` — Structured code review
- `/design-agent` — Architecture design
- `/testing-agent` — Write comprehensive tests
- `/security-audit-agent` — Security audit

### 3. Skills (SKILL.md)

**Location**: `.cursor/skills/`
**Count**: 13
**Purpose**: Step-by-step guided workflows with checklists.

Skills are loaded automatically when context matches. They provide:

- Checklists for complex tasks
- Templates for common patterns
- Step-by-step guidance

### 4. Commands (.md files)

**Location**: `.cursor/commands/`
**Count**: 8
**Purpose**: Quick single actions.

Commands are lightweight operations:

- `/type-check` — Run type checking (saves ~90K tokens vs tests)
- `/test-single` — Test one file (saves ~95K tokens)
- `/lint-check` — Check lints efficiently

### 5. Hooks (.sh scripts)

**Location**: `.cursor/hooks/`
**Count**: 6
**Purpose**: Automate the AI loop.

Hooks run automatically at specific events:

- Before prompt submission
- After file edits
- Before shell execution
- After test runs

## How They Work Together

```
User Prompt
    │
    ▼
[Hooks: beforeSubmitPrompt] ─── Enrich with context
    │
    ▼
[Rules: Always Applied] ─────── Enforce standards
    │
    ▼
[Agent/Skill/Command] ────────── Specialized behavior
    │
    ▼
[Hooks: afterFileEdit] ──────── Post-edit checks
    │
    ▼
Response to User
```

## See Also

- [COMPONENT_INDEX.md](../../COMPONENT_INDEX.md) — Full component reference
- [Rules Documentation](./rules.md)
- [Agents Documentation](./agents.md)
