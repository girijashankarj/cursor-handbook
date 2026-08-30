---
name: rollback-plan
description: Generate a rollback strategy and checklist for a deployment or change.
---

# Command: Rollback Plan

## Invocation
`/rollback-plan`

## Description
Generate a step-by-step rollback plan for a deployment, database migration, infrastructure change, or feature release.

## Parameters
- `change-type`: `deployment` (default), `migration`, `infrastructure`, `feature-flag`
- `description`: Brief description of the change being deployed

## Action
1. Analyze the change type and scope.
2. Generate:
   - **Pre-deployment checklist** — what to verify before deploying
   - **Rollback trigger criteria** — when to initiate rollback
   - **Rollback steps** — exact commands/actions to revert
   - **Verification steps** — how to confirm rollback succeeded
   - **Communication plan** — who to notify

### Rollback Templates

**Deployment:**
```bash
# Revert to previous version
kubectl rollout undo deployment/[SERVICE] -n [NAMESPACE]
# or
git revert HEAD && git push origin main
```

**Database Migration:**
```bash
# Run down migration
npm run migrate:down -- --to [PREVIOUS_VERSION]
```

**Feature Flag:**
```bash
# Disable the flag
FEATURE_X=false  # Update in env/config
```

## When to Use
- Before any production deployment
- Before running database migrations
- Before infrastructure changes
- As part of change management documentation

## Token Cost
~2–4K tokens

## Expected Output
- Complete rollback checklist with commands
- Trigger criteria (when to roll back)
- Time estimate for rollback execution
- Communication template

## Troubleshooting
- **Irreversible changes:** Flag as "no automatic rollback" and suggest mitigation
- **Data migration rollback:** Note that data changes may require manual intervention
