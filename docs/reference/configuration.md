# Configuration

Project configuration is driven by `.cursor/config/project.json`. See **Configuration Reference** for the full schema.

## Quick reference

- **project** — name, description, version, repository
- **paths** — source, apiPath, handlerBasePath, commonPath, eventsPath
- **techStack** — language, framework, database, testing, linter, packageManager
- **database** — naming (snake_case), softDeleteField, timestampFields
- **cursor** — include/exclude patterns, token optimization, models
- **testing** — coverageMinimum, testCommand, typeCheckCommand
- **domain.entities** — list of domain entities for handlers

## Creating project.json

```bash
cp .cursor/config/project.json.template .cursor/config/project.json
```

Edit and replace all placeholders. Rules and skills use `{{CONFIG.section.key}}` to reference these values.
