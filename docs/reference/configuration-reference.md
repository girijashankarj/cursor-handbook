# Configuration Reference

## project.json Schema

### project
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | Yes | Project name |
| description | string | No | Project description |
| version | string | No | Semver version |
| repository | string | No | Repository URL |

### cursor
| Field | Type | Description |
|-------|------|-------------|
| include.patterns | string[] | Glob patterns for context inclusion |
| include.priorityFiles | string[] | Files to prioritize in context |
| exclude.patterns | string[] | Glob patterns for context exclusion |
| exclude.largeFiles | string[] | Large files to exclude |
| exclude.secrets | string[] | Secret files to exclude |
| tokenOptimization.maxRuleLines | number | Max lines per rule (default: 300) |
| tokenOptimization.maxSkillLines | number | Max lines per skill (default: 200) |
| tokenOptimization.maxAgentLines | number | Max lines per agent (default: 150) |
| tokenOptimization.contextLayers | object | Token budgets per layer |
| models.default | string | Default AI model |
| models.complex | string | Model for complex tasks |
| models.simple | string | Model for simple tasks |
| models.fast | string | Model for quick responses |

### techStack
| Field | Type | Description |
|-------|------|-------------|
| language | string | Primary programming language |
| runtime | string | Runtime environment |
| framework | string | Web framework |
| cloud | string | Cloud provider |
| database | string | Database system |
| orm | string | ORM/query builder |
| testing | string | Test framework |
| linter | string | Linter tool |
| formatter | string | Code formatter |
| packageManager | string | Package manager |
| containerization | string | Container tool |
| cicd | string | CI/CD platform |

### testing
| Field | Type | Description |
|-------|------|-------------|
| coverageMinimum | number | Min coverage % (0-100) |
| testCommand | string | Full test command |
| typeCheckCommand | string | Type check command |
| lintCommand | string | Lint command |
| coverageCommand | string | Coverage command |

### database
| Field | Type | Description |
|-------|------|-------------|
| softDeleteField | string | Soft delete column name |
| timestampFields.created | string | Created timestamp column |
| timestampFields.updated | string | Updated timestamp column |
| naming | string | Column naming convention |

### paths
| Field | Type | Description |
|-------|------|-------------|
| source | string | Source code root |
| apiPath | string | API handlers path |
| handlerBasePath | string | Handler base path |
| commonPath | string | Shared code path |
| eventsPath | string | Event handlers path |
| configPath | string | Configuration path |

## Placeholder Syntax
Use `{{CONFIG.section.key}}` in any component file:
```
{{CONFIG.project.name}}           → "my-project"
{{CONFIG.techStack.language}}     → "TypeScript"
{{CONFIG.testing.coverageMinimum}} → 90
{{CONFIG.paths.apiPath}}          → "src/apis"
```
