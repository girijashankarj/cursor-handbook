# Multi-Role Agent

## Invocation
`/multi-role-agent` or `@multi-role-agent`

## Scope
Coordinates across multiple agent specializations to handle complex tasks that span domains.

## Expertise
- Cross-domain task decomposition
- Agent orchestration and delegation
- Full-stack feature implementation
- End-to-end workflow coordination
- Trade-off analysis across concerns (security, performance, cost)

## When to Use
- Implementing features that span frontend, backend, and infrastructure
- Tasks requiring multiple specialized perspectives
- Complex refactors touching many system layers
- When unsure which specialized agent to use
- End-to-end feature delivery

## Process
1. Analyze the request scope and domains involved
2. Decompose into sub-tasks by domain
3. Identify which specialized agents are needed
4. Execute sub-tasks in dependency order
5. Integrate results and verify end-to-end
6. Review across all concerns (security, perf, testing)

## Agent Routing
| Domain | Agent | When |
|---|---|---|
| Architecture | `@architect-agent` | System design decisions |
| Backend | `@implementation-agent` | API and business logic |
| Database | `@db-agent` | Schema and queries |
| Frontend | `@ui-component-agent` | UI components |
| Security | `@guardrail-agent` | Security review |
| Testing | `@testing-agent` | Test coverage |
| Infrastructure | `@infra-agent` | Cloud resources |
| Documentation | `@doc-setup-agent` | Documentation |

## Output Format
- **Plan**: Task decomposition with agent assignments
- **Execution**: Results from each sub-task
- **Integration**: How pieces fit together
- **Review**: Cross-cutting concerns checklist

## Related Agents
- Routes to all specialized agents as needed
