# Cursor Agents

62 specialized AI agents for the cursor-handbook project. Each agent focuses on a specific domain and can be invoked via `/agent-name` or `@agent-name`.

> Full reference with file paths: [COMPONENT_INDEX.md](../../COMPONENT_INDEX.md#agents-62)

## Agent Categories

### Architecture & Design
| Agent | Purpose |
|---|---|
| `architect-agent` | High-level system architecture and ADRs |
| `design-agent` | System design guidance and technical design docs |
| `design-pattern-agent` | Design pattern selection and implementation |
| `boundaries-agent` | Module boundaries and dependency rules |
| `architecture-refactoring-agent` | Safe incremental refactoring |
| `migration-agent` | Database, system, and framework migrations |

### Backend & Implementation
| Agent | Purpose |
|---|---|
| `implementation-agent` | Feature implementation following project patterns |
| `backend-code-reviewer` | Code reviews for correctness, security, and performance |
| `refactor-agent` | Code refactoring and technical debt reduction |
| `performance-agent` | Performance bottleneck identification and resolution |
| `backend-api-agent` | REST API design and implementation |
| `backend-debugging-agent` | Root cause analysis and debugging |
| `backend-event-handler-agent` | Async event processing |
| `backend-database-agent` | Database queries and operations |
| `api-gateway-agent` | API gateway configuration and routing |
| `rate-agent` | Rate limiting and throttling strategies |
| `data-validator-agent` | Data integrity and schema validation |

### Database
| Agent | Purpose |
|---|---|
| `db-agent` | Schema design, queries, and optimization |
| `database-schema-agent` | Schema design and ER diagrams |
| `database-query-optimization-agent` | Query performance tuning |

### Frontend
| Agent | Purpose |
|---|---|
| `ui-component-agent` | Accessible, performant UI components |
| `accessibility-agent` | WCAG 2.1 AA compliance auditing |
| `frontend-state-agent` | State management decisions |
| `frontend-styling-agent` | CSS architecture and theming |
| `frontend-performance-agent` | Core Web Vitals optimization |

### Testing
| Agent | Purpose |
|---|---|
| `testing-agent` | Comprehensive test writing (unit, integration, e2e) |
| `test-runner` | Test execution and failure analysis |
| `regression-agent` | Regression prevention and detection |
| `e2e-testing-agent` | End-to-end test flows |
| `testing-load-testing-agent` | Performance benchmarking |
| `testing-security-testing-agent` | Security vulnerability scanning |

### Security & Compliance
| Agent | Purpose |
|---|---|
| `guardrail-agent` | Security guardrails and vulnerability detection |
| `compliance-agent` | Regulatory compliance (GDPR, SOC 2, HIPAA) |
| `security-audit-agent` | Comprehensive security audit (OWASP) |
| `security-auth-agent` | Auth flows, RBAC, session management |

### Cloud & Infrastructure
| Agent | Purpose |
|---|---|
| `infra-agent` | Cloud infrastructure provisioning (IaC) |
| `cloud-infrastructure-agent` | Cloud architecture and IaC |
| `cloud-deployment-agent` | Zero-downtime deployments |
| `cloud-cost-optimization-agent` | Cloud cost optimization |
| `cost-optimizer-agent` | Cloud cost analysis |
| `monitoring-agent` | Monitoring, alerting, and observability |

### DevOps
| Agent | Purpose |
|---|---|
| `devops-ci-cd-agent` | CI/CD pipeline design |
| `devops-incident-agent` | Incident response |
| `git-agent` | Git workflows and repository management |
| `platform-dx-agent` | Developer experience tooling |

### AI & Data
| Agent | Purpose |
|---|---|
| `ai-ml-prompt-engineering-agent` | Prompt engineering for LLMs |
| `ai-platform-engineer-agent` | AI/ML platform and LLM integration |
| `rag-creator-agent` | RAG pipeline design and implementation |
| `data-labeller-agent` | Data labelling workflows and quality |

### Documentation
| Agent | Purpose |
|---|---|
| `docs-agent` | Technical documentation |
| `diagram-agent` | Technical diagrams (Mermaid, ASCII, PlantUML) |
| `doc-setup-agent` | Documentation structure and templates |
| `doc-sync-agent` | Keeping docs in sync with code |
| `openapi-spec-agent` | OpenAPI/Swagger specifications |
| `reverse-engineering-doc-agent` | Reverse-engineer undocumented codebases |

### Business & Planning
| Agent | Purpose |
|---|---|
| `business-agent` | Business requirements to technical specs |
| `business-requirements-agent` | User stories and specs |
| `business-estimation-agent` | Effort estimation |
| `expense-agent` | Development cost tracking and forecasting |

### Meta / Tooling
| Agent | Purpose |
|---|---|
| `agent-creator-agent` | Create new Cursor agents |
| `cursor-setup-agent` | Configure Cursor IDE settings and rules |
| `multi-role-agent` | Cross-domain task coordination |

## Usage

Invoke any agent in Cursor:
- Chat: Type `@agent-name` to include the agent's context
- Command: Type `/agent-name` to invoke directly

## Creating New Agents

Use `@agent-creator-agent` or follow the template in that file.
