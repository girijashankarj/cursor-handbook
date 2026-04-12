# Configuration Reference

## project.json — cursor-handbook Centralization

`project.json` is **cursor-handbook's convention** for centralizing project settings. It is not a Cursor-native file. Cursor loads rules; when those rules mention or reference `project.json`, the AI reads it as context. The effective flow is:

**Prompt + Rule + project.json**

Rules use `{{CONFIG.section.key}}` placeholders that map to values in `project.json`. By keeping one config file, you avoid duplicating project name, paths, tech stack, and commands across dozens of rules. See [Configuration Guide — project.json and Centralization](../getting-started/configuration.md#projectjson-and-centralization).

---

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
| tokenOptimization.maxRuleLines | number | Max lines per rule (default: 300). Cursor recommends &lt; 500; we use 300 for token efficiency. |
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

### domain
| Field | Type | Description |
|-------|------|-------------|
| entities | string[] | Domain entity names (e.g. Order, Product, Customer) |
| lifecycles | object | Entity lifecycle state machines (key: entity, value: states) |
| businessRules | string[] | Business rules to enforce across components |

### patterns
| Field | Type | Description |
|-------|------|-------------|
| handlerFlowSteps | integer | Number of steps in handler flow (e.g. 7) |
| handlerFlow | string[] | Handler flow step names |
| errorHandling | string | Error handling strategy: `centralized`, `distributed`, or `hybrid` |
| logging | string | Logging strategy: `structured`, `unstructured`, or `hybrid` |

### packages
| Field | Type | Description |
|-------|------|-------------|
| internalPrefix | string | Internal package scope prefix (e.g. `@my-org`) |
| registryUrl | string | Package registry URL |

### fileNames
| Field | Type | Description |
|-------|------|-------------|
| handlerEntry | string | Handler entry point filename (e.g. `index.ts`) |
| requestSchema | string | Request schema filename |
| responseSchema | string | Response schema filename |
| *(additionalProperties)* | string | Any custom file naming conventions |

### folderNames
| Field | Type | Description |
|-------|------|-------------|
| logic | string | Logic folder name |
| schemas | string | Schemas folder name |
| common | string | Shared code folder name |
| services | string | Services folder name |
| types | string | Type definitions folder name |
| utils | string | Utility functions folder name |
| middleware | string | Middleware folder name |
| models | string | Data models folder name |
| controllers | string | Request handlers folder name |
| routes | string | Route definitions folder name |

### conventions
| Field | Type | Description |
|-------|------|-------------|
| branchPrefix | object | Branch prefix mapping (e.g. `{ "feature": "feature/", "bugfix": "fix/" }`) |
| commitFormat | string | Commit format: `conventional`, `angular`, or `custom` |
| prTemplate | boolean | Whether to use PR template |

## Placeholder Syntax
Use `{{CONFIG.section.key}}` in any component file:
```
{{CONFIG.project.name}}           → "my-project"
{{CONFIG.techStack.language}}     → "TypeScript"
{{CONFIG.testing.coverageMinimum}} → 90
{{CONFIG.paths.apiPath}}          → "src/apis"
```
