# Skill: Create Architecture Documentation

## Description
Workflow for creating and maintaining architecture documentation.

## Trigger
When the user needs to document system architecture or make Architecture Decision Records (ADRs).

## Steps

### Step 1: System Overview
- [ ] High-level architecture diagram (Mermaid)
- [ ] List all services/components
- [ ] Document communication patterns
- [ ] Document data flow

### Step 2: Component Documentation
For each service/component:
- [ ] Purpose and responsibilities
- [ ] Technology stack
- [ ] API contracts (if applicable)
- [ ] Data stores
- [ ] Dependencies
- [ ] Scaling characteristics

### Step 3: Architecture Decision Records (ADRs)
For significant decisions:
- [ ] Title: Short descriptive title
- [ ] Status: Proposed / Accepted / Deprecated / Superseded
- [ ] Context: Why this decision is needed
- [ ] Decision: What was decided
- [ ] Consequences: Trade-offs and implications

ADR template:
```markdown
# ADR-{number}: {title}

## Status
{Proposed | Accepted | Deprecated | Superseded by ADR-{n}}

## Context
{What is the issue that we're seeing that is motivating this decision?}

## Decision
{What is the change that we're proposing and/or doing?}

## Consequences
{What becomes easier or harder because of this change?}
```

### Step 4: Data Flow Diagrams
- [ ] Request flow through the system
- [ ] Event/message flow
- [ ] Data pipeline flow
- [ ] Authentication flow

### Step 5: Operational Documentation
- [ ] Deployment architecture
- [ ] Monitoring and alerting overview
- [ ] Disaster recovery plan
- [ ] Scaling procedures

## Completion
Architecture is documented with diagrams, ADRs, and operational guides.
