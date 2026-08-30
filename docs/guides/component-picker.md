# Component Picker — What's Right for Your Project?

> **Don't know where to start?** Find your project type below and get the exact components you need. Skip everything else.

cursor-handbook ships 208+ components. You don't need all of them. This guide maps components to **project types** so you can pick only what's relevant.

**Prefer automation?** Run `@cursor-setup-agent` and it will detect your stack and install the right components automatically. This guide is for manual selection or browsing.

---

## Quick Matrix

Find your project type in the rows and see which component categories apply:

| Project Type | Core | Frontend | Backend | Database | Cloud | Testing | DevOps | Security | Docs |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **React / Next.js SPA** | Y | Y | — | — | — | Y | Y | Y | — |
| **Angular app** | Y | Y | — | — | — | Y | Y | Y | — |
| **Vue / Nuxt app** | Y | Y | — | — | — | Y | Y | Y | — |
| **Svelte / SvelteKit** | Y | Y | — | — | — | Y | Y | Y | — |
| **Node.js API** | Y | — | Y | Y | — | Y | Y | Y | Y |
| **Python API (FastAPI / Django)** | Y | — | Y | Y | — | Y | Y | Y | Y |
| **Go API** | Y | — | Y | Y | — | Y | Y | Y | Y |
| **Java / Kotlin API** | Y | — | Y | Y | — | Y | Y | Y | Y |
| **Full-stack (React + Node)** | Y | Y | Y | Y | — | Y | Y | Y | Y |
| **Full-stack (Next.js)** | Y | Y | Y | Y | — | Y | Y | Y | Y |
| **Microservices** | Y | — | Y | Y | Y | Y | Y | Y | Y |
| **Serverless (Lambda / Functions)** | Y | — | Y | Y | Y | Y | Y | Y | — |
| **Infrastructure / IaC only** | Y | — | — | — | Y | — | Y | Y | — |
| **Mobile (Flutter)** | Y | Y | — | — | — | Y | Y | Y | — |

**Y** = recommended  |  **—** = not needed (skip these components)

---

## Core Components (Every Project)

These apply to **all** project types. Always include them.

### Rules (11)

| Rule | What It Does |
|---|---|
| `rules/main-rules.mdc` | Master rules: token efficiency, security, code organization |
| `rules/architecture/core-principles.mdc` | Design philosophy, dependency direction, error handling |
| `rules/architecture/dependency-management.mdc` | Package management, versioning, security audits |
| `rules/architecture/token-efficiency.mdc` | Context layering, expensive-operation guards (saves 30%+ tokens) |
| `rules/security/guardrails.mdc` | No hardcoded secrets, no PII in logs, input validation |
| `rules/security/secrets-rules.mdc` | Environment variable patterns, `.env` file rules |
| `rules/security/security-compliance.mdc` | Data classification, encryption, API security |
| `rules/devops/ci-cd.mdc` | Pipeline stages, branch strategy, commit conventions |
| `rules/devops/documentation-standards.mdc` | Code docs, API docs, README template |
| `rules/devops/monitoring.mdc` | Logging, metrics, tracing, alerting |
| `rules/devops/response-summary.mdc` | Consistent AI response footer |

### Agents (11)

| Agent | Invocation | Purpose |
|---|---|---|
| Code Reviewer | `/code-reviewer` | PR reviews with security and performance checks |
| Architect | `/architect-agent` | High-level architecture guidance |
| Implementation | `/implementation-agent` | End-to-end feature building |
| Refactor | `/refactor-agent` | Safe incremental refactoring |
| Git Agent | `/git-agent` | Git workflow assistance |
| Design Pattern | `/design-pattern-agent` | Pattern selection and application |
| Business Agent | `/business-agent` | Business logic and requirements |
| Multi-Role Agent | `/multi-role-agent` | Cross-domain tasks |
| Agent Creator | `/agent-creator-agent` | Create new custom agents |
| Cursor Setup | `/cursor-setup-agent` | Auto-detect and install components |
| Performance | `/performance-agent` | General performance optimization |

### Skills (9)

| Skill | Purpose |
|---|---|
| `backend/code-review/` | Structured code review workflow |
| `devops/commit-message-generator/` | Conventional Commit messages from diffs |
| `devops/pr-description-generator/` | PR titles and descriptions |
| `devops/task-master/` | Break requests into ordered tasks |
| `devops/jira-ticket-creator/` | Structured JIRA tickets |
| `devops/doc-redactor/` | Redact secrets and PII from files |
| `devops/automation-helper/` | Shell scripts, hooks, GitHub Actions |
| `documentation/prompt-engineering/` | Craft effective AI prompts |
| `documentation/websearch/` | Web research for current information |

### Commands (11)

| Command | Purpose |
|---|---|
| `/commit-message` | Generate commit message |
| `/pr-description` | Generate PR description |
| `/automate` | Create automation workflows |
| `/jira-ticket` | Create JIRA tickets |
| `/json-diff` | Compare JSON files |
| `/audit` | Full security audit |
| `/audit-deps` | Dependency vulnerability scan |
| `/check-secrets` | Detect leaked secrets |
| `/redact` | Redact sensitive data |
| `/fix-vulnerable-deps` | Fix vulnerable dependencies |
| `/changelog` | Generate changelog |

### Hooks (6)

| Hook | Event | Purpose |
|---|---|---|
| `pre-commit-check.sh` | beforeShellExecution | Pre-commit validation |
| `scan-secrets.sh` | beforeShellExecution | Detect leaked secrets |
| `shell-guard.sh` | beforeShellExecution | Block dangerous commands |
| `context-enrichment.sh` | beforeSubmitPrompt | Inject project context |
| `inject-context.sh` | beforeSubmitPrompt | Inject project configuration |
| `post-edit-check.sh` | afterFileEdit | Post-edit validation |

---

## Frontend Projects

> **For:** React, Next.js, Angular, Vue, Nuxt, Svelte, SvelteKit, Flutter

Add these **on top of Core**.

### Rules

| Rule | When to Include |
|---|---|
| `rules/frontend/component-patterns.mdc` | All frontend projects |
| `rules/frontend/accessibility.mdc` | All frontend projects |
| `rules/frontend/state-management.mdc` | All frontend projects |
| `rules/frontend/performance.mdc` | All frontend projects |
| `rules/frontend/react.mdc` | React or Next.js |
| `rules/frontend/angular.mdc` | Angular |
| `rules/frontend/vue.mdc` | Vue or Nuxt |
| `rules/frontend/svelte.mdc` | Svelte or SvelteKit |

### Agents

| Agent | Invocation | Purpose |
|---|---|---|
| UI Component | `/ui-component-agent` | Build accessible, tested components |
| State Agent | `/frontend-state-agent` | State management decisions |
| Styling Agent | `/frontend-styling-agent` | CSS architecture and theming |
| Frontend Perf | `/frontend-perf-agent` | Core Web Vitals optimization |
| Accessibility | `/accessibility-agent` | WCAG compliance |

### Skills

| Skill | Purpose |
|---|---|
| `frontend/component-creation/` | Step-by-step component scaffolding |
| `frontend/state-management/` | Choose and implement state management |

### Typical Workflow

```
You: "Create a search bar component with debounced input"
→ Skill: frontend/component-creation triggers
→ Rules: component-patterns + accessibility + react.mdc applied
→ Agent: ui-component-agent guides implementation
→ Output: Accessible, tested, performant component
```

---

## Backend API Projects

> **For:** Express, Fastify, NestJS, Django, Flask, FastAPI, Spring Boot, Go (Gin/Echo/Fiber)

Add these **on top of Core**.

### Rules

| Rule | When to Include |
|---|---|
| `rules/backend/error-handling.mdc` | All backend projects |
| `rules/backend/handler-patterns.mdc` | All backend projects |
| `rules/backend/api-design.mdc` | All backend projects |
| `rules/backend/code-organization.mdc` | All backend projects |
| `rules/backend/logging.mdc` | All backend projects |
| `rules/backend/typescript.mdc` | TypeScript projects |
| `rules/backend/nodejs.mdc` | Node.js projects |
| `rules/backend/es6.mdc` | JavaScript/TypeScript projects |
| `rules/backend/python.mdc` | Python projects |
| `rules/backend/go.mdc` | Go projects |
| `rules/backend/java.mdc` | Java/Kotlin projects |
| `rules/backend/graphql.mdc` | GraphQL APIs |

### Agents

| Agent | Invocation | Purpose |
|---|---|---|
| API Agent | `/backend-api-agent` | REST API design and implementation |
| API Gateway | `/api-gateway-agent` | API gateway patterns |
| Backend Reviewer | `/backend-code-reviewer` | Backend-focused code review |
| Debugging Agent | `/backend-debugging-agent` | Root cause analysis |
| Event Handler | `/backend-event-handler-agent` | Async event processing |
| Backend Impl | `/implementation-agent` | Feature implementation |
| Backend Perf | `/performance-agent` | Bottleneck identification |
| Rate Agent | `/rate-agent` | Rate limiting strategies |
| OpenAPI Spec | `/openapi-spec-agent` | OpenAPI specification generation |

### Skills

| Skill | Purpose |
|---|---|
| `backend/create-handler/` | Scaffold complete API handler (9 files) |
| `backend/debug-issue/` | Structured debugging workflow |
| `backend/optimize-performance/` | Performance profiling and fixes |
| `backend/error-handler-generator/` | Generate typed error classes and middleware |
| `backend/feature-flag-manager/` | Create and manage feature flags |
| `backend/api-mock-server/` | Generate mock API server for testing |
| `backend/dependency-graph/` | Visualize module dependencies |
| `documentation/api-docs/` | API documentation generation |
| `documentation/openapi-generator/` | OpenAPI 3.x specs from code |

### Commands

| Command | Purpose |
|---|---|
| `/type-check` | TypeScript validation (~10K tokens vs ~100K for tests) |
| `/lint-check` | Lint with `read_lints` (~2K tokens vs ~50K) |
| `/lint-fix` | Auto-fix lint issues |
| `/format` | Format code |
| `/generate-handler` | Scaffold full API handler |
| `/openapi-spec` | Generate OpenAPI spec |
| `/dead-code` | Find dead/unused code |
| `/complexity` | Analyze code complexity |
| `/regex` | Build and test regex patterns |
| `/feature-flag` | Manage feature flags |

### Hooks

| Hook | Purpose |
|---|---|
| `auto-format.sh` | Auto-format after edits |
| `format-on-edit.sh` | Format on save |
| `lint-check.sh` | Lint after edits |
| `type-check.sh` | Type-check after edits |

### Typical Workflow

```
You: "Create a POST /api/v1/orders endpoint with validation"
→ Skill: backend/create-handler triggers (9 files, 7 steps)
→ Rules: handler-patterns + error-handling + api-design applied
→ Agent: backend-api-agent guides implementation
→ Output: Handler, service, schema, types, tests — all standards-compliant
```

---

## Database Projects

> **For:** Any project with PostgreSQL, MySQL, MongoDB, SQL Server, or ORM usage (Prisma, TypeORM, Sequelize, SQLAlchemy, Mongoose)

Add these **on top of Core** (and usually alongside Backend).

### Rules

| Rule | What It Does |
|---|---|
| `rules/database/patterns.mdc` | General database patterns |
| `rules/database/query-patterns.mdc` | Safe query patterns, parameterized queries |
| `rules/database/schema-design.mdc` | Schema conventions, required columns |
| `rules/database/migration-rules.mdc` | Migration safety rules |

### Agents

| Agent | Invocation | Purpose |
|---|---|---|
| DB Agent | `/db-agent` | General database assistance |
| Schema Agent | `/database-schema-agent` | Schema design and ER diagrams |
| Query Opt Agent | `/database-query-optimization-agent` | EXPLAIN ANALYZE, index recommendations |
| Data Validator | `/data-validator-agent` | Data validation rules |
| Migration Agent | `/migration-agent` | Database migration planning |

### Skills

| Skill | Purpose |
|---|---|
| `database/create-migration/` | Scaffold new migration file |
| `database/migration/` | Full migration workflow (create, test, apply) |
| `database/query-optimization/` | Identify and fix slow queries |

### Commands

| Command | Purpose |
|---|---|
| `/migration-check` | Validate migration safety |
| `/sql-explain` | Run EXPLAIN on queries |

### Hooks

| Hook | Purpose |
|---|---|
| `validate-sql.sh` | Validate SQL safety before execution |

---

## Cloud and Infrastructure Projects

> **For:** AWS, GCP, Azure, Terraform, CDK, CloudFormation, Serverless Framework, Docker, Kubernetes

Add these **on top of Core**.

### Rules

| Rule | When to Include |
|---|---|
| `rules/cloud/infrastructure.mdc` | All cloud projects |
| `rules/cloud/serverless.mdc` | Lambda, Cloud Functions, serverless |
| `rules/cloud/containerization.mdc` | Docker, Kubernetes |
| `rules/cloud/aws.mdc` | AWS-specific projects |
| `rules/cloud/terraform.mdc` | Terraform IaC |
| `rules/devops/docker.mdc` | Docker workflows |

### Agents

| Agent | Invocation | Purpose |
|---|---|---|
| Infra Agent | `/infra-agent` | IaC and cloud architecture |
| Cloud Infra | `/cloud-infrastructure-agent` | Cloud resource provisioning |
| Deployment | `/cloud-deployment-agent` | Zero-downtime deployments |
| Cost Optimizer | `/cloud-cost-optimization-agent` | Cloud cost reduction |
| Cost Agent | `/cost-optimizer-agent` | Cost analysis and optimization |
| AI Platform | `/ai-platform-engineer-agent` | AI/ML platform setup |
| RAG Creator | `/rag-creator-agent` | RAG pipeline creation |

### Skills

| Skill | Purpose |
|---|---|
| `cloud/infrastructure/` | Provision cloud resources with IaC |
| `cloud/aws-cost-estimator/` | Estimate AWS costs for proposed resources |
| `cloud/opensearch/` | OpenSearch cluster setup |
| `cloud/opensearch-dashboard/` | OpenSearch Dashboards / Kibana objects |
| `cloud/docker-compose-generator/` | Generate docker-compose for local dev |

### Commands

| Command | Purpose |
|---|---|
| `/docker-build` | Build Docker image |
| `/docker-compose` | Generate docker-compose config |
| `/deploy` | Deployment workflow |
| `/build` | Build the project |
| `/rollback-plan` | Create rollback plan |
| `/cron` | Create cron job expressions |

---

## Testing

> **For:** Any project with Jest, Vitest, Mocha, Pytest, Cypress, Playwright

Add these **on top of Core**.

### Rules

| Rule | When to Include |
|---|---|
| `rules/testing/testing-standards.mdc` | All projects with tests |
| `rules/testing/integration-testing.mdc` | API/service testing |
| `rules/testing/test-naming.mdc` | All projects with tests |
| `rules/testing/mock-patterns.mdc` | All projects with tests |
| `rules/testing/jest.mdc` | Jest-based projects |

### Agents

| Agent | Invocation | Purpose |
|---|---|---|
| Testing Agent | `/testing-agent` | Write comprehensive tests |
| Test Runner | `/test-runner` | Run and manage tests |
| Regression Agent | `/regression-agent` | Regression test analysis |
| E2E Agent | `/e2e-testing-agent` | End-to-end test flows |
| Load Test Agent | `/testing-load-testing-agent` | Performance benchmarking |
| Security Test | `/testing-security-testing-agent` | Security testing |

### Skills

| Skill | Purpose |
|---|---|
| `testing/fix-tests/` | Diagnose and fix failing tests |
| `testing/flaky-test/` | Identify and fix flaky tests |
| `testing/coverage-improvement/` | Find gaps, write missing tests |
| `testing/load-test-generator/` | Generate k6/Artillery/Locust scripts |
| `testing/test-data-factory/` | Type-safe test data factories |

### Commands

| Command | Purpose | Token Savings |
|---|---|---|
| `/test-single` | Test one file | ~95K (vs full suite) |
| `/coverage` | Quick coverage snapshot | — |
| `/test-coverage` | Detailed coverage report | — |
| `/mock-data` | Generate mock test data | — |
| `/api-test` | Generate API tests | — |
| `/benchmark` | Performance benchmarks | — |

### Hooks

| Hook | Purpose |
|---|---|
| `coverage-check.sh` | Verify coverage thresholds after test runs |

---

## DevOps and CI/CD

> **For:** GitHub Actions, GitLab CI, Jenkins, release management, incident response

Add these **on top of Core**.

### Agents

| Agent | Invocation | Purpose |
|---|---|---|
| CI/CD Agent | `/devops-ci-cd-agent` | Pipeline design and optimization |
| Monitoring Agent | `/monitoring-agent` | Observability setup |
| Incident Agent | `/devops-incident-agent` | Incident response workflows |
| DX Agent | `/platform-dx-agent` | Developer experience improvement |

### Skills

| Skill | Purpose |
|---|---|
| `devops/ci-cd/` | Set up complete CI/CD pipeline |
| `devops/monitoring/` | Implement monitoring and alerting |
| `devops/setup-monitoring/` | Bootstrap monitoring infrastructure |
| `devops/dependency-remediation/` | Fix vulnerabilities, review Dependabot PRs |
| `devops/changelog-generator/` | Generate CHANGELOG from git history |
| `devops/release-manager/` | Version bump, tag, release notes |
| `devops/incident-runbook-creator/` | Operational runbooks for services |
| `devops/env-file-generator/` | Scan codebase and generate `.env.example` |
| `devops/git-conflict-resolver/` | Resolve merge conflicts systematically |
| `devops/cursor-setup/` | Bootstrap Cursor config for new projects |
| `devops/handbook-validator/` | Validate handbook structure and integrity |
| `devops/token-counter/` | Estimate LLM token counts for files |
| `devops/component-search/` | Search across handbook components |

### Commands

| Command | Purpose |
|---|---|
| `/changelog` | Generate changelog |
| `/release` | Prepare a release |
| `/git-cleanup` | Clean up git branches |
| `/rollback-plan` | Create rollback plan |
| `/env-check` | Audit environment variables |

---

## Documentation and Architecture

> **For:** Technical writers, architects, anyone documenting systems

### Agents

| Agent | Invocation | Purpose |
|---|---|---|
| Docs Agent | `/docs-agent` | Technical documentation |
| Diagram Agent | `/diagram-agent` | Architecture diagrams (Mermaid) |
| Doc Setup | `/doc-setup-agent` | Documentation structure |
| Doc Sync | `/doc-sync-agent` | Keep docs in sync with code |
| Reverse Eng Doc | `/reverse-engineering-doc-agent` | Document existing codebases |
| Design Agent | `/design-agent` | System design and trade-offs |
| Boundaries | `/boundaries-agent` | Service/module boundary analysis |

### Skills

| Skill | Purpose |
|---|---|
| `documentation/api-docs/` | API documentation workflow |
| `documentation/architecture-docs/` | Architecture documentation |
| `documentation/openapi-generator/` | OpenAPI 3.x specification |
| `documentation/postman-collection-generator/` | Postman/Insomnia collections |
| `documentation/adr-generator/` | Architecture Decision Records |
| `documentation/regex-builder/` | Build and explain regex patterns |

---

## Security and Compliance

> **For:** Projects with security requirements, GDPR, SOC 2, HIPAA compliance

Core already includes 3 security rules, audit commands, and secret scanning hooks. Add these for deeper security coverage.

### Agents

| Agent | Invocation | Purpose |
|---|---|---|
| Security Audit | `/security-audit-agent` | Comprehensive security audit |
| Auth Agent | `/security-auth-agent` | Authentication and authorization flows |
| Compliance | `/compliance-agent` | GDPR, SOC 2, HIPAA compliance |
| Guardrail Agent | `/guardrail-agent` | Security guardrail enforcement |
| Data Labeller | `/data-labeller-agent` | Data classification and labelling |

---

## AI / ML Projects

> **For:** LLM applications, ML pipelines, RAG systems

### Agents

| Agent | Invocation | Purpose |
|---|---|---|
| Prompt Agent | `/ai-ml-prompt-engineering-agent` | Prompt engineering for LLMs |
| AI Platform | `/ai-platform-engineer-agent` | AI/ML platform architecture |
| RAG Creator | `/rag-creator-agent` | RAG pipeline design |
| Data Labeller | `/data-labeller-agent` | Data labelling workflows |
| Data Validator | `/data-validator-agent` | Data quality validation |

---

## Example Stacks — What to Install

### React + TypeScript SPA

```
Core (11 rules, 11 agents, 9 skills, 11 commands, 6 hooks)
+ Frontend rules: react.mdc, component-patterns.mdc, accessibility.mdc, state-management.mdc, performance.mdc
+ Frontend agents: ui-component-agent, frontend-state-agent, frontend-styling-agent, frontend-perf-agent
+ Frontend skills: component-creation, state-management
+ Testing rules: testing-standards.mdc, mock-patterns.mdc, test-naming.mdc, jest.mdc
+ Testing agents: testing-agent, test-runner
+ Testing skills: fix-tests, coverage-improvement
+ Testing commands: /test-single, /coverage

Total: ~55 components
```

### Node.js + Express + PostgreSQL API

```
Core (11 rules, 11 agents, 9 skills, 11 commands, 6 hooks)
+ Backend rules: handler-patterns.mdc, error-handling.mdc, api-design.mdc, code-organization.mdc, logging.mdc, typescript.mdc, nodejs.mdc, es6.mdc
+ Backend agents: backend-api-agent, backend-code-reviewer, backend-debugging-agent, backend-event-handler-agent, performance-agent, openapi-spec-agent, rate-agent
+ Backend skills: create-handler, debug-issue, optimize-performance, error-handler-generator, api-mock-server
+ Backend commands: /type-check, /lint-check, /lint-fix, /format, /generate-handler, /openapi-spec
+ Backend hooks: auto-format.sh, lint-check.sh, type-check.sh
+ Database rules: patterns.mdc, query-patterns.mdc, schema-design.mdc, migration-rules.mdc
+ Database agents: db-agent, database-schema-agent, database-query-optimization-agent
+ Database skills: create-migration, migration, query-optimization
+ Database commands: /migration-check, /sql-explain
+ Testing rules: testing-standards.mdc, integration-testing.mdc, mock-patterns.mdc, test-naming.mdc, jest.mdc
+ Testing agents: testing-agent, test-runner
+ Testing skills: fix-tests, coverage-improvement, test-data-factory

Total: ~85 components
```

### Full-Stack Next.js + Prisma

```
Core + Frontend (React) + Backend (TypeScript/Node.js) + Database + Testing

Total: ~95 components
```

### Microservices on AWS with Terraform

```
Core + Backend + Database + Cloud + Testing + DevOps

Total: ~100+ components
```

---

## Decision Flowchart

Use this to quickly decide what you need:

```
Start
  ├─ Does your project have a UI?
  │   ├─ Yes → Add FRONTEND components
  │   │   ├─ React? → + react.mdc
  │   │   ├─ Angular? → + angular.mdc
  │   │   ├─ Vue? → + vue.mdc
  │   │   └─ Svelte? → + svelte.mdc
  │   └─ No → Skip frontend
  │
  ├─ Does your project have an API / server?
  │   ├─ Yes → Add BACKEND components
  │   │   ├─ TypeScript? → + typescript.mdc, es6.mdc
  │   │   ├─ Python? → + python.mdc
  │   │   ├─ Go? → + go.mdc
  │   │   └─ Java? → + java.mdc
  │   └─ No → Skip backend
  │
  ├─ Does your project use a database?
  │   └─ Yes → Add DATABASE components
  │
  ├─ Does your project deploy to the cloud?
  │   └─ Yes → Add CLOUD components
  │       ├─ AWS? → + aws.mdc
  │       ├─ Terraform? → + terraform.mdc
  │       └─ Docker? → + containerization.mdc, docker.mdc
  │
  ├─ Does your project have tests?
  │   └─ Yes → Add TESTING components
  │       └─ Jest? → + jest.mdc
  │
  └─ Does your project have CI/CD?
      └─ Yes → Add DEVOPS components
```

---

## Related

- [Component Index](../../COMPONENT_INDEX.md) — flat list of all 208 components
- [SDLC Role Map](../reference/sdlc-role-map.md) — components by job role (PM, QA, DevOps, etc.)
- [Cursor Setup Agent](../../.cursor/agents/cursor-setup-agent.md) — auto-detect and install components
- [Stack Presets](../../examples/) — pre-made `project.json` for common stacks
- [Quick Start](../getting-started/quick-start.md) — get running in 5 minutes
