# Quick Start Guide

## Prerequisites

- [Cursor IDE](https://cursor.sh/) installed
- Git installed
- A project to configure

## Setup (5 minutes)

### Step 1: Clone cursor-handbook

```bash
# Navigate to your project root
cd your-project/

# Clone cursor-handbook as .cursor directory
git clone https://github.com/girijashankarj/cursor-handbook.git .cursor
```

### Step 2: Create Configuration

```bash
cp .cursor/config/project.json.template .cursor/config/project.json
```

### Step 3: Edit Configuration

Open `.cursor/config/project.json` and replace all `{{PLACEHOLDER}}` values:

```json
{
	"project": {
		"name": "your-project-name",
		"description": "Your project description"
	},
	"techStack": {
		"language": "TypeScript",
		"framework": "Express.js",
		"database": "PostgreSQL",
		"testing": "Jest",
		"packageManager": "pnpm"
	},
	"testing": {
		"coverageMinimum": 90,
		"testCommand": "pnpm run test",
		"typeCheckCommand": "pnpm run type-check"
	}
}
```

### Step 4: Restart Cursor IDE

Close and reopen Cursor IDE to load the new configuration.

### Step 5: Verify

Try one of these commands in Cursor:

- `/type-check` — Run type checking
- `/code-reviewer` — Start a code review
- Ask Cursor to "create a new handler for orders"

## What's Included

After setup, you'll have:

- **27 rules** automatically applied to all AI interactions
- **34 agents** available via `/agent-name` commands
- **13 skills** for guided workflows
- **8 commands** for quick actions
- **6 hooks** automating the AI loop

## Next Steps

- [Configuration Guide](./configuration.md)
- [Component Overview](../components/overview.md)
- [Best Practices](../guides/best-practices.md)
