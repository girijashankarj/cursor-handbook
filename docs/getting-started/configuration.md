# Configuration Guide

## Configuration File

All cursor-handbook components are driven by `.cursor/config/project.json`.

## Schema

The configuration file follows the schema defined in `.cursor/config/project-schema.json`. Your editor will provide autocomplete and validation.

## Key Sections

### project

Basic project metadata.

```json
{
	"project": {
		"name": "my-project",
		"description": "Description of your project",
		"version": "1.0.0",
		"repository": "https://github.com/org/repo"
	}
}
```

### techStack

Your technology choices. This drives which patterns and conventions are applied.

```json
{
	"techStack": {
		"language": "TypeScript",
		"runtime": "Node.js",
		"framework": "Express.js",
		"cloud": "AWS",
		"database": "PostgreSQL",
		"testing": "Jest",
		"packageManager": "pnpm"
	}
}
```

### testing

Test configuration thresholds and commands.

```json
{
	"testing": {
		"coverageMinimum": 90,
		"testCommand": "pnpm run test",
		"typeCheckCommand": "pnpm run type-check",
		"lintCommand": "pnpm run lint",
		"coverageCommand": "pnpm run test:coverage"
	}
}
```

### paths

Project directory structure.

```json
{
	"paths": {
		"source": "src",
		"apiPath": "src/apis",
		"handlerBasePath": "src/apis/handlers/v1",
		"commonPath": "src/apis/common"
	}
}
```

### domain

Business domain configuration.

```json
{
	"domain": {
		"entities": ["Order", "Product", "Customer"],
		"lifecycles": {
			"Order": "DRAFT → SUBMITTED → PROCESSING → COMPLETED"
		}
	}
}
```

## Placeholder Syntax

Components reference configuration values using `{{CONFIG.section.key}}` syntax:

- `{{CONFIG.techStack.language}}` → "TypeScript"
- `{{CONFIG.testing.coverageMinimum}}` → 90
- `{{CONFIG.paths.apiPath}}` → "src/apis"

## Validation

Validate your configuration against the schema:

```bash
# Using ajv-cli
npx ajv validate -s .cursor/config/project-schema.json -d .cursor/config/project.json
```

## Stack Examples

See the `examples/` directory for pre-configured files for popular stacks.
