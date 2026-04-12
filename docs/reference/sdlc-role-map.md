# SDLC role map

This document maps **software development lifecycle** roles to cursor-handbook **components**. Use [COMPONENT_INDEX.md](../../COMPONENT_INDEX.md) for the full file list; this page is a curated index by role.

## How to use

- **Rules** — Always-on or scoped standards (`/.cursor/rules/`).
- **Agents** — Invoke with `/agent-name` in Cursor chat.
- **Skills** — Step workflows in `/.cursor/skills/<name>/SKILL.md`.
- **Commands** — Slash commands in `/.cursor/commands/` (e.g. `/type-check`).

## Product and business

| Need | Start here |
|------|------------|
| Requirements, user stories | Agent: `business-requirements-agent` (`/requirements-agent`) |
| Estimation, sizing | Agent: `business-estimation-agent` (`/estimation-agent`) |
| Task breakdown | Skill: `devops/task-master` |

## Architecture

| Need | Start here |
|------|------------|
| System design | Agent: `design-agent` (`/design-agent`) |
| Refactors | Agent: `architecture-refactoring-agent` (`/refactoring-agent`) |
| Migrations | Agent: `migration-agent`, skill: `database/migration` |

## Backend

| Need | Start here |
|------|------------|
| APIs, handlers | Agent: `backend-api-agent`, skill: `backend/create-handler`, rules: `backend/handler-patterns.mdc` |
| Implementation | Agent: `implementation-agent` |
| Debugging | Agent: `backend-debugging-agent`, skill: `backend/debug-issue` |
| Performance | Agent: `performance-agent`, skill: `backend/optimize-performance` |
| Events | Agent: `backend-event-handler-agent` |
| Code review | Agent: `backend-code-reviewer`, skill: `backend/code-review` |

## Frontend

| Need | Start here |
|------|------------|
| UI components | Agent: `ui-component-agent`, skill: `frontend/component-creation` |
| State | Agent: `frontend-state-agent`, skill: `frontend/state-management` |
| Styling | Agent: `frontend-styling-agent` |
| Performance / a11y | Agent: `frontend-performance-agent`, rules: `frontend/accessibility.mdc`, `frontend/performance.mdc` |

## Quality assurance and testing

| Need | Start here |
|------|------------|
| Unit / integration tests | Agent: `testing-agent`, rules: `testing/testing-standards.mdc` |
| E2E | Agent: `e2e-testing-agent` |
| Load | Agent: `testing-load-testing-agent` |
| Security testing | Agent: `testing-security-testing-agent` |
| Flaky tests | Skill: `testing/flaky-test` |
| Fix failures | Skill: `testing/fix-tests` |
| Coverage | Skill: `testing/coverage-improvement`, commands: `/test-single`, `/coverage` |

## Database

| Need | Start here |
|------|------------|
| Schema | Agent: `database-schema-agent`, rules: `database/schema-design.mdc` |
| Migrations | Skills: `database/migration`, `database/create-migration` |
| Slow queries | Agent: `database-query-optimization-agent`, skill: `database/query-optimization` |

## Security and compliance

| Need | Start here |
|------|------------|
| Audits | Agent: `security-audit-agent` |
| Auth | Agent: `security-auth-agent` |
| Compliance | Agent: `compliance-agent` |
| Secrets / deps | Rules: `security/secrets-rules.mdc`, commands: `/audit-deps`, `/fix-vulnerable-deps`, `/check-secrets` |

## Cloud and infrastructure

| Need | Start here |
|------|------------|
| IaC | Agent: `cloud-infrastructure-agent`, skill: `cloud/infrastructure` |
| Deploy | Agent: `cloud-deployment-agent` |
| Cost | Agent: `cloud-cost-optimization-agent`, skill: `cloud/aws-cost-estimator` |
| OpenSearch | Skill: `cloud/opensearch` |

## DevOps and SRE

| Need | Start here |
|------|------------|
| CI/CD | Agent: `devops-ci-cd-agent`, skill: `devops/ci-cd` |
| Monitoring | Agent: `monitoring-agent`, skills: `devops/monitoring`, `devops/setup-monitoring` |
| Incidents | Agent: `devops-incident-agent` |
| Commits / PRs | Commands: `/commit-message`, `/pr-description` |
| Dependency remediation | Skill: `devops/dependency-remediation`, command: `/fix-vulnerable-deps` |

## Documentation and technical writing

| Need | Start here |
|------|------------|
| API docs | Skill: `documentation/api-docs` |
| Architecture docs | Skill: `documentation/architecture-docs` |
| Research | Skill: `documentation/websearch` |
| General docs | Agent: `docs-agent` (`/docs-agent`) |

## Platform and developer experience

| Need | Start here |
|------|------------|
| Tooling, workflows | Agent: `platform-dx-agent` (`/dx-agent`) |

## AI / ML

| Need | Start here |
|------|------------|
| Prompts, LLM workflows | Agent: `ai-ml-prompt-engineering-agent` (`/prompt-agent`) |

## Gaps and extensions

- **Manual QA checklists** — Combine `testing-agent` with project-specific rules in `.cursor/rules/`.
- **Design / UX copy** — Use `frontend` agents + `accessibility.mdc`; add a scoped rule for `docs/**/*.md` if needed.
- **Release marketing** — Use `docs-agent` and plain-language instructions in [non-technical.md](../getting-started/non-technical.md).

For **non-developers**, see [getting started: non-technical](../getting-started/non-technical.md).

**Browse in the browser:** [Handbook website](https://girijashankarj.github.io/cursor-handbook/) — **Browse** (components) and **Guidelines** ([Cursor IDE topics](https://girijashankarj.github.io/cursor-handbook/#guide)); search, copy paths.
