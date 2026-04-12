---
name: adr-generator
description: Generate Architecture Decision Records (ADRs) documenting significant technical decisions with context, options, and consequences. Use when the user asks to document an architecture decision, design choice, or technical trade-off.
---

# Skill: ADR Generator

Create Architecture Decision Records following the Michael Nygard format to document significant technical decisions.

## Trigger
When the user asks to document an architecture decision, record a design choice, or create an ADR.

## Prerequisites
- [ ] Decision to document identified
- [ ] Options considered (at least 2)
- [ ] Context and constraints understood

## Steps

### Step 1: Determine ADR Number
- [ ] Check existing ADRs: `ls docs/adr/ 2>/dev/null || echo "no ADR directory"`
- [ ] Assign next sequential number: `NNNN` (e.g., `0001`, `0002`)
- [ ] Create directory if needed: `mkdir -p docs/adr`

### Step 2: Gather Decision Context
- [ ] What is the problem or need?
- [ ] What constraints exist? (technical, business, timeline, team)
- [ ] What was the trigger? (new requirement, incident, tech debt)
- [ ] Who are the stakeholders?

### Step 3: Document Options
For each option considered:
- [ ] Name and brief description
- [ ] Pros (advantages, benefits)
- [ ] Cons (disadvantages, risks, costs)
- [ ] Effort estimate
- [ ] Team familiarity

### Step 4: Generate ADR

```markdown
# ADR-NNNN: [Decision Title]

## Status
[Proposed | Accepted | Deprecated | Superseded by ADR-XXXX]

## Date
YYYY-MM-DD

## Context
[Describe the situation, problem, or need that requires a decision.
Include technical and business context. What forces are at play?]

## Decision
[State the decision clearly in 1-3 sentences. Use active voice:
"We will use X for Y because Z."]

## Options Considered

### Option 1: [Name]
- **Description:** [What this option entails]
- **Pros:**
  - [Advantage 1]
  - [Advantage 2]
- **Cons:**
  - [Disadvantage 1]
  - [Disadvantage 2]
- **Effort:** [Low / Medium / High]

### Option 2: [Name]
- **Description:** [What this option entails]
- **Pros:**
  - [Advantage 1]
- **Cons:**
  - [Disadvantage 1]
- **Effort:** [Low / Medium / High]

### Option 3: [Name] (if applicable)
...

## Consequences

### Positive
- [Good outcome 1]
- [Good outcome 2]

### Negative
- [Trade-off 1]
- [Accepted risk 1]

### Neutral
- [Side effect that isn't clearly positive or negative]

## Related
- [Link to related ADRs, design docs, or tickets]
- [Supersedes ADR-XXXX] (if applicable)
```

### Step 5: Save and Index
- [ ] Save as `docs/adr/NNNN-kebab-case-title.md`
- [ ] Update ADR index if one exists (`docs/adr/README.md`)
- [ ] Link from relevant design docs or tickets

### Step 6: Review
- [ ] Verify context is complete enough for a new team member to understand
- [ ] Verify all considered options are documented
- [ ] Verify consequences include both positive and negative
- [ ] Verify no secrets, PII, or internal URLs

## ADR Categories

| Category | Examples |
|----------|---------|
| **Architecture** | Microservices vs monolith, event sourcing, CQRS |
| **Technology** | Database choice, framework, language, cloud provider |
| **Process** | Branching strategy, release process, testing approach |
| **Security** | Auth mechanism, encryption approach, secret management |
| **Infrastructure** | Deployment strategy, scaling approach, caching layer |
| **Data** | Schema design, migration strategy, backup approach |

## Rules
- **ALWAYS** document at least 2 options (including the chosen one)
- **ALWAYS** include both positive and negative consequences
- **ALWAYS** set a clear status (Proposed, Accepted, Deprecated, Superseded)
- **NEVER** delete ADRs — deprecate or supersede them
- **NEVER** include secrets or internal infrastructure details
- Write for future readers who weren't part of the decision
- Keep ADRs concise — 1–2 pages maximum
- Date the decision, not the document creation

## Completion
ADR saved to `docs/adr/` with sequential numbering, complete context, options, decision, and consequences.

## If a Step Fails
- **Only one option:** Document why alternatives were ruled out before analysis
- **Decision not yet made:** Set status to "Proposed" and list options for team discussion
- **Superseding an old ADR:** Reference the old ADR, mark old one as "Superseded by ADR-NNNN"
- **No ADR directory:** Create `docs/adr/` and add a `README.md` index
