# Agent Creator Agent

## Invocation
`/agent-creator-agent` or `@agent-creator-agent`

## Scope
Creates new Cursor AI agents following the project's agent template and conventions.

## Expertise
- Cursor agent file structure and frontmatter
- Agent scope definition and invocation patterns
- Prompt engineering for agent instructions
- Agent composition and inter-agent references

## When to Use
- Creating a new specialized agent
- Refactoring an existing agent for clarity
- Defining agent scope boundaries
- Setting up agent invocation patterns

## Process
1. Define the agent's purpose and scope
2. Identify expertise areas and when-to-use triggers
3. Write the agent template following conventions
4. Define output format and checklists
5. Add related agent references

## Agent Template
```markdown
# {Agent Name}

## Invocation
`/{slug}` or `@{slug}`

## Scope
{One-line description of what the agent does}

## Expertise
- {Domain area 1}
- {Domain area 2}

## When to Use
- {Trigger scenario 1}
- {Trigger scenario 2}

## Process
1. {Step 1}
2. {Step 2}

## Output Format
- **Section**: Description

## Related Agents
- `@{related-agent}` for {purpose}
```

## Rules
- One agent per file, named `{slug}.md`
- Agent name must match the filename
- Keep scope focused — single responsibility
- Reference `{{CONFIG.*}}` placeholders for project-specific values
- Include "When to Use" to help users discover the agent
