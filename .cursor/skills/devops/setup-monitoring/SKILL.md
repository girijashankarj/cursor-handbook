---
name: setup-monitoring
description: Guide for setting up or extending monitoring (metrics, logs, alerts) for a service. Use when the user asks to set up monitoring or add alerts.
---

# Skill: Setup monitoring

## Trigger
When the user asks to set up monitoring, add alerts, or configure dashboards.

## Steps

1. **Scope** — Identify what to monitor (API latency, errors, DB, queue depth) and where (cloud provider, vendor).
2. **Metrics** — Define 3–5 key metrics (e.g. request rate, error rate, p99 latency); use structured logging with correlationId.
3. **Alerts** — Propose thresholds (e.g. error rate > 1%, p99 > 2s) and severity; document in runbook.
4. **Dashboard** — List panels to add (time series, status); use placeholders for dashboard URLs.
5. **Logs** — Remind: no PII or secrets; JSON format; include correlationId per project rules.

## Rules
- Follow `.cursor/rules/devops/monitoring.mdc`. Use placeholder resource names.
