# Cursor Official Features Index

A comprehensive index of Cursor IDE features from the [official documentation](https://cursor.com/docs). Use this to ensure cursor-handbook uses all supported keywords and capabilities.

---

## Customization Features (Project-Level)

| Feature | Location | Keywords / Options | Docs |
|---------|----------|-------------------|------|
| **Project Rules** | `.cursor/rules/` | `description`, `alwaysApply`, `globs` | [Rules](https://cursor.com/docs/rules) |
| **AGENTS.md** | Root or subdirs | Plain markdown; nested support | [Rules → AGENTS.md](https://cursor.com/docs/rules#agentsmd) |
| **Skills** | `.cursor/skills/`, `.agents/skills/` | `name`, `description`, `license`, `compatibility`, `metadata`, `disable-model-invocation` | [Skills](https://cursor.com/docs/skills) |
| **Agents** | `.cursor/agents/` (root only) | `name`, `description` (frontmatter) | [Plugins Reference](https://cursor.com/docs/reference/plugins) |
| **Commands** | `.cursor/commands/` | `name`, `description` (frontmatter) | [Plugins Reference](https://cursor.com/docs/reference/plugins) |
| **Hooks** | `.cursor/hooks.json` | `version`, `hooks`, `command`, `timeout`, `matcher`, `type`, `prompt` | [Hooks](https://cursor.com/docs/agent/hooks) |
| **BugBot** | `.cursor/BUGBOT.md` | Nested: `backend/.cursor/BUGBOT.md` etc. | [BugBot](https://cursor.com/docs/bugbot) |

---

## Rule Keywords

| Keyword | Type | Purpose |
|---------|------|---------|
| `description` | string | Agent uses for relevance when `alwaysApply: false` |
| `alwaysApply` | boolean | `true` = every session; `false` = Agent decides or globs |
| `globs` | string or array | File patterns; rule applies when matching files in context |

---

## Skill Keywords

| Keyword | Required | Purpose |
|---------|----------|---------|
| `name` | Yes | Identifier; lowercase, hyphens; must match folder |
| `description` | Yes | What it does and when to use; Agent uses for relevance |
| `license` | No | License name or reference |
| `compatibility` | No | Environment requirements |
| `metadata` | No | Arbitrary key-value |
| `disable-model-invocation` | No | `true` = only via `/skill-name`; no auto-apply |

### Skill Optional Directories

- `scripts/` — Executable code agents can run
- `references/` — Additional docs loaded on demand
- `assets/` — Templates, images, data files

---

## Command & Agent Frontmatter

Per [Plugins Reference](https://cursor.com/docs/reference/plugins), commands and agents support YAML frontmatter:

| Field | Type | Purpose |
|-------|------|---------|
| `name` | string | Identifier (lowercase, kebab-case) |
| `description` | string | Brief description for discovery |

---

## Hook Options

| Option | Type | Purpose |
|--------|------|---------|
| `command` | string | Path to script (required for command-based) |
| `timeout` | number | Execution timeout in seconds |
| `matcher` | string | Regex to match (e.g. `beforeShellExecution`: `curl\|wget`) |
| `type` | string | `"prompt"` for LLM-evaluated hooks |
| `prompt` | string | Natural language condition (when `type: "prompt"`) |

### Hook Events

**Agent:** `sessionStart`, `sessionEnd`, `beforeSubmitPrompt`, `afterAgentResponse`, `afterAgentThought`, `beforeReadFile`, `afterFileEdit`, `beforeShellExecution`, `afterShellExecution`, `beforeMCPExecution`, `afterMCPExecution`, `subagentStart`, `subagentStop`, `preToolUse`, `postToolUse`, `postToolUseFailure`, `preCompact`, `stop`

**Tab (inline completions):** `beforeTabFileRead`, `afterTabFileEdit`

### Prompt-Based Hooks

Use an LLM to evaluate conditions without custom scripts:

```json
{
  "beforeShellExecution": [
    {
      "type": "prompt",
      "prompt": "Does this command look safe? Only allow read-only operations.",
      "timeout": 10
    }
  ]
}
```

---

## Additional Cursor Features

| Feature | Description | Docs |
|---------|-------------|------|
| **Remote Rules** | Import rules from GitHub; stays synced | [Rules → Importing](https://cursor.com/docs/rules#importing-rules) |
| **Team Rules** | Dashboard-managed; Team/Enterprise | [Rules → Team Rules](https://cursor.com/docs/rules#team-rules) |
| **Plugins** | Package rules, skills, agents, commands, hooks, MCP | [Plugins](https://cursor.com/docs/plugins) |
| **MCP** | Model Context Protocol; external tools | [MCP](https://cursor.com/docs/mcp) |
| **Nested BUGBOT.md** | `backend/.cursor/BUGBOT.md` when reviewing backend files | [BugBot Rules](https://cursor.com/docs/bugbot#rules) |
| **Migrate to Skills** | `/migrate-to-skills` converts rules/commands to skills | [Skills](https://cursor.com/docs/skills#migrating-rules-and-commands-to-skills) |

---

## Cursor Official Best Practices

From [Cursor Rules docs](https://cursor.com/docs/rules#best-practices) and [Skills docs](https://cursor.com/docs/skills).

### Rules Best Practices

| Practice | Cursor Says | cursor-handbook |
|----------|-------------|-----------------|
| **Keep rules under 500 lines** | Split large rules; keep under 500 | Uses 300 max (stricter for token efficiency); all 29 rules &lt; 130 lines |
| **Reference files instead of copying** | Point to `@filename.ts`; don't duplicate code | Rules use `{{CONFIG}}`; reference templates |
| **Avoid vague guidance** | Write like clear internal docs | Rules are concrete (patterns, examples, checklists) |
| **Provide concrete examples** | Include examples or referenced files | Rules include code snippets, tables, patterns |
| **Split large rules** | Multiple composable rules | 29 domain-scoped rules (architecture, backend, frontend, etc.) |
| **Reuse rules** | When repeating prompts in chat | `@rule-name` for manual invocation |

### What to Avoid (Rules)

- Duplicating what's already in your codebase — point to canonical examples
- Adding instructions for edge cases that rarely apply
- Documenting every possible command — Agent knows npm, git, pytest, etc.
- Copying entire style guides — use a linter instead

### Skills Best Practices

| Practice | Cursor Says | cursor-handbook |
|----------|-------------|-----------------|
| **Keep SKILL.md focused** | Move detailed reference material to separate files | Skills use `scripts/`, `references/`; main SKILL.md has steps only |
| **Progressive loading** | Agents load resources on demand | `references/` and `assets/` loaded when needed |
| **Scripts self-contained** | Include error messages, handle edge cases | `create-handler` has `scripts/scaffold-handler-dirs.sh` |

### Line Limits (cursor-handbook)

| Component | Cursor | cursor-handbook default | Schema max |
|-----------|--------|-------------------------|------------|
| Rules | &lt; 500 lines | 300 | 500 |
| Skills | — | 200 | 500 |
| Agents | — | 150 | 300 |

Configure via `project.json` → `cursor.tokenOptimization.maxRuleLines`, etc.

---

## Full Docs Sitemap

For the complete Cursor docs index, see [cursor.com/llms.txt](https://cursor.com/llms.txt).

### Key Sections

- **Get Started:** quickstart, models, pricing
- **Agent:** overview, plan mode, prompting, tools (terminal, browser, search)
- **Customizing:** plugins, rules, skills, hooks, MCP, subagents
- **Cloud Agents:** BugBot, Cloud Agent setup
- **Integrations:** Slack, Linear, GitHub, GitLab, JetBrains
- **CLI:** overview, installation, shell mode, headless, slash commands
- **Account:** teams, enterprise, billing
