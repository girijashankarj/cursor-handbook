---
name: infrastructure
description: Workflow for provisioning cloud infrastructure using IaC. Use when the user needs to create or modify cloud resources.
---

# Skill: Set Up Cloud Infrastructure

## Trigger
When the user needs to create or modify cloud resources.

## Steps

### Step 1: Define Requirements
- [ ] What resources are needed?
- [ ] Which environment? (dev, staging, production)
- [ ] Performance requirements?
- [ ] Budget constraints?
- [ ] Security requirements?

### Step 2: Design Architecture
- [ ] Draw architecture diagram (Mermaid)
- [ ] Define networking (VPC, subnets, security groups)
- [ ] Plan compute resources (size, scaling)
- [ ] Plan storage (database, file storage, cache)
- [ ] Plan monitoring and alerting

### Step 3: Write IaC
- [ ] Create Terraform/CDK/CloudFormation templates
- [ ] Use modules for reusable components
- [ ] Parameterize environment-specific values
- [ ] Follow naming conventions: `{project}-{env}-{resource}`
- [ ] Tag all resources

### Step 4: Security
- [ ] Enable encryption at rest
- [ ] Enable encryption in transit
- [ ] Configure IAM with least privilege
- [ ] Set up VPC and security groups
- [ ] Enable audit logging

### Step 5: Deploy
- [ ] Plan: Review changes before applying
- [ ] Apply to dev first
- [ ] Verify in dev
- [ ] Promote to staging
- [ ] Verify in staging
- [ ] Promote to production

### Step 6: Monitor
- [ ] Set up health checks
- [ ] Configure alert rules
- [ ] Create dashboards
- [ ] Set up cost alerts

## If a step fails

| Step | Failure | Recovery |
|------|---------|----------|
| Step 5 | Deploy to dev/staging fails | Run `terraform destroy` or equivalent; fix IaC; re-apply; never proceed to prod until dev/staging succeeds |
| Step 5 | Deploy to production fails | Rollback via IaC (revert and apply previous state); investigate; fix in dev; re-test full pipeline |
| Step 5 | Partial apply (some resources created) | Document what was created; run destroy/rollback for failed resources; fix and retry |

**Never** apply infrastructure changes to production without explicit user confirmation. Require confirmation before `terraform apply` or equivalent on prod.

## Completion
Infrastructure provisioned, secured, monitored, and documented.
