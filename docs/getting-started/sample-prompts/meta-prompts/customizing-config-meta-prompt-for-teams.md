# Customizing config meta-prompt for teams

Generates a project.json configuration guide tailored to your team's tech stack.

---

## Meta-prompt

```
You are creating a project.json configuration guide for our team.

Read the project context:
1. .cursor/config/project.json — current configuration
2. .cursor/config/project-schema.json — full schema with all available fields
3. package.json or equivalent — actual dependencies, scripts, tech stack
4. Source directory structure — actual folder names and paths
5. .cursor/rules/ — which rules reference which CONFIG keys

Generate a configuration guide with:

### Current configuration review
Analyze our current project.json and flag:
- Missing fields that should be filled
- Fields with placeholder or default values that need updating
- Fields that don't match our actual project structure
- Unused fields that can be removed

### Configuration walkthrough
For each section of project.json, explain:

**project** — Name, description, version
- Current value: [actual]
- Recommendation: [if any]

**techStack** — Language, framework, database, cloud, package manager
- Current: [actual]
- Recommendation: [if any]

**paths** — Source, API, handlers, common, events
- Current: [actual]
- Do these match your directory structure? [verification]

**testing** — Commands, coverage targets
- Current: [actual]
- Are commands correct? [verification]

**conventions** — Commit format, branch prefixes
- Current: [actual]
- Recommendation: [if any]

### How CONFIG references work
Explain with examples:
- Rules use `{{CONFIG.section.key}}` placeholders
- When a rule says `{{CONFIG.testing.testCommand}}`, it maps to project.json's testing.testCommand
- Changing project.json automatically updates all rules that reference it

### Configuration for different stacks
If the team has multiple services, show config variations:
- Backend service (Node/Express)
- Frontend app (React/Next.js)
- Python service (FastAPI)
- Go service

### Validation
How to verify the configuration:
1. Run the handbook validator
2. Check all referenced paths exist
3. Verify commands are runnable
4. Ensure no placeholder values remain

Use our actual config and codebase — not generic examples.
```

## Expected output

A team reference for maintaining project.json. Useful when onboarding new services or changing tech stack.
