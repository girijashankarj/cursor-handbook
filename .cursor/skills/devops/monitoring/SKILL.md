# Skill: Set Up Monitoring

## Description
Workflow for implementing comprehensive monitoring and alerting.

## Trigger
When the user needs to set up or improve service monitoring.

## Steps

### Step 1: Define Metrics
- [ ] Request rate (throughput)
- [ ] Error rate (4xx, 5xx)
- [ ] Latency (p50, p95, p99)
- [ ] Resource utilization (CPU, memory, disk)
- [ ] Business metrics (domain-specific)

### Step 2: Implement Structured Logging
- [ ] JSON format for all logs
- [ ] Required fields: timestamp, level, correlationId, service
- [ ] No PII in logs
- [ ] Appropriate log levels (error, warn, info, debug)

### Step 3: Set Up Tracing
- [ ] Add OpenTelemetry or provider-specific SDK
- [ ] Instrument HTTP requests
- [ ] Instrument database queries
- [ ] Instrument external service calls
- [ ] Configure sampling rate

### Step 4: Create Dashboards
- [ ] Service health overview
- [ ] Request rate and error rate
- [ ] Latency percentiles
- [ ] Resource utilization
- [ ] Business KPIs

### Step 5: Configure Alerts
- [ ] Error rate > 1% → P3
- [ ] Error rate > 5% → P1
- [ ] p99 latency > 2s → P3
- [ ] CPU > 80% → P3
- [ ] Health check failure → P1
- [ ] Set notification channels

### Step 6: Create Runbooks
- [ ] For each alert, write a runbook:
  - What the alert means
  - Investigation steps
  - Resolution steps
  - Escalation path

## Completion
Monitoring, alerting, and runbooks are in place.
