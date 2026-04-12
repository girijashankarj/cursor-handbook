---
name: incident-runbook-creator
description: Generate operational runbooks for services covering common failure scenarios, diagnostics, and recovery steps. Use when the user asks to create a runbook, document incident response, or prepare on-call guides.
---

# Skill: Incident Runbook Creator

Create structured operational runbooks for diagnosing and resolving production incidents.

## Trigger
When the user asks to create a runbook, document incident procedures, or prepare on-call documentation.

## Prerequisites
- [ ] Service or system to document identified
- [ ] Common failure scenarios known or discoverable
- [ ] Access to monitoring/alerting configuration

## Steps

### Step 1: Identify the Service
- [ ] Service name and purpose
- [ ] Dependencies (databases, caches, queues, external APIs)
- [ ] Deployment target (Kubernetes, Lambda, EC2, etc.)
- [ ] Health check endpoint
- [ ] Key metrics and dashboards

### Step 2: Catalog Failure Scenarios

| Category | Common Scenarios |
|----------|-----------------|
| **Availability** | Service down, health check failing, DNS issues |
| **Performance** | High latency, timeout errors, memory leaks |
| **Data** | Database connection failures, replication lag, disk full |
| **Dependencies** | Upstream service down, API rate limited, cert expired |
| **Capacity** | CPU saturation, OOM kills, connection pool exhausted |
| **Security** | Auth failures spike, DDoS, certificate expiry |
| **Deployment** | Bad deploy, config change, feature flag issue |

### Step 3: Create Runbook Template

For each scenario:

```markdown
## [Scenario Name]

### Alert
- **Alert name:** [matching alert name from monitoring]
- **Severity:** P1 / P2 / P3
- **SLA:** Acknowledge in X min, resolve in Y min

### Symptoms
- [What the user/system experiences]
- [What alerts fire]
- [What metrics look abnormal]

### Diagnosis Steps
1. Check [dashboard/metric]: `[command or URL]`
2. Check [logs]: `[query or command]`
3. Check [dependency]: `[health check command]`
4. Verify [configuration]: `[command]`

### Resolution Steps
1. **Quick mitigation:** [immediate action to restore service]
2. **Root cause fix:** [steps to address underlying issue]
3. **Verification:** [how to confirm the fix worked]

### Rollback
- [Steps to rollback if resolution makes things worse]

### Escalation
- **Team:** [team name]
- **Contact:** [on-call rotation or channel]
- **Escalation path:** [who to contact if unresolved in N minutes]

### Post-Incident
- [ ] Create incident ticket
- [ ] Update this runbook if new information found
- [ ] Schedule post-mortem within 48 hours
```

### Step 4: Generate Common Runbook Entries

#### Service Down
```markdown
## Service Unresponsive

### Diagnosis
1. Health check: `curl -s [HEALTH_ENDPOINT] | jq .`
2. Pod/container status: `kubectl get pods -l app=[SERVICE] -n [NAMESPACE]`
3. Recent deployments: `kubectl rollout history deployment/[SERVICE]`
4. Logs: `kubectl logs -l app=[SERVICE] --tail=100 --since=5m`

### Resolution
1. If recent deploy → rollback: `kubectl rollout undo deployment/[SERVICE]`
2. If OOM → increase memory limits and restart
3. If crash loop → check logs for startup errors
4. If dependency down → check dependency health, enable circuit breaker
```

#### High Latency
```markdown
## High Latency (p99 > 2s)

### Diagnosis
1. Check request rate for traffic spike
2. Check database query latency
3. Check connection pool utilization
4. Check external dependency latency
5. Check CPU/memory for resource saturation

### Resolution
1. If traffic spike → scale up: `kubectl scale deployment/[SERVICE] --replicas=N`
2. If slow queries → identify and optimize (check slow query log)
3. If dependency slow → enable/tighten circuit breaker timeouts
4. If resource saturation → increase limits, add nodes
```

### Step 5: Add Service-Specific Sections
- [ ] Custom commands for the specific tech stack
- [ ] Links to dashboards (use `[DASHBOARD_URL]` placeholders)
- [ ] Database-specific diagnostics (connection count, replication lag)
- [ ] Queue-specific diagnostics (depth, consumer lag)

### Step 6: Add Contact and Escalation Info
- [ ] On-call rotation schedule
- [ ] Escalation matrix by severity
- [ ] Communication channels (use placeholders, not real URLs)
- [ ] Status page update process

### Step 7: Validate and Output
- [ ] Verify all commands use placeholders for real values
- [ ] Verify runbook covers at least the top 5 failure scenarios
- [ ] Verify each entry has diagnosis, resolution, and rollback
- [ ] Save to `docs/runbooks/` or project-standard location

## Rules
- **NEVER** include real hostnames, IPs, or credentials — use placeholders
- **ALWAYS** include rollback steps for every resolution
- **ALWAYS** include escalation path and contacts
- **ALWAYS** include verification steps (how to confirm the fix)
- Write for someone unfamiliar with the service (on-call engineer at 3 AM)
- Keep commands copy-pasteable
- Link to dashboards and documentation

## Completion
Comprehensive runbook covering common failure scenarios with diagnosis, resolution, rollback, and escalation for each.

## If a Step Fails
- **Don't know failure scenarios:** Start with the generic categories in Step 2, refine from incident history
- **No monitoring setup:** Note this as a gap, suggest setting up monitoring first
- **Too many scenarios:** Prioritize by frequency and severity, cover top 10
- **Missing dependency info:** Document what's known, flag gaps for service owner
