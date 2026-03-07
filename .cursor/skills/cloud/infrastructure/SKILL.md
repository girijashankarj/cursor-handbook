# Skill: Set Up Cloud Infrastructure

## Description
Workflow for provisioning cloud infrastructure using IaC.

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

## Completion
Infrastructure provisioned, secured, monitored, and documented.
