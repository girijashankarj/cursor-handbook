---
name: architecture-docs
description: Workflow for creating and maintaining architecture documentation. Use when the user needs to document system architecture or make ADRs.
---

# Skill: Create Architecture Documentation

## Trigger
When the user needs to document system architecture or make Architecture Decision Records (ADRs).

## Prerequisites
- [ ] Codebase or design available to analyze
- [ ] docs/ or docs/architecture/ directory exists (or create it)
- [ ] Mermaid support in docs (GitHub, MkDocs, etc.)

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

## Completion Checklist
- [ ] At least one diagram (Mermaid) for system or data flow
- [ ] ADRs for significant decisions (format, status, context, decision, consequences)
- [ ] Component list with purpose and tech stack
- [ ] Operational section (deploy, monitor, scale)

## If Step Fails
- **Step 1 (overview)**: Start with 3–5 boxes; add detail later. Use `flowchart LR` or `flowchart TB` for simple flows
- **Step 3 (ADRs)**: Number format `ADR-001`; keep each ADR to one decision
- **Step 4 (diagrams)**: Mermaid syntax: no spaces in node IDs; use `A[Label]` not `A[Label with spaces]`

## Example
Step 1: `flowchart LR` with Client -> API -> DB, API -> Cache. Step 3: ADR-001 Use PostgreSQL — Status Accepted, Context: need relational, Decision: PostgreSQL, Consequences: SQL expertise required.
