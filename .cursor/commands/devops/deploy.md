---
name: deploy
description: Deploy the application to target environment. Requires explicit user confirmation for production.
---

# Command: Deploy

## Invocation
`/deploy`

## Description
Deploy the application to the target environment. Use for staging/production deployment workflows.

## Instructions

1. Determine deploy method from project (e.g. CI/CD workflow, `npm run deploy`, or infrastructure tool).
2. Do not execute deploy that modifies production unless the user explicitly confirms.
3. If asked to "prepare" or "document" deploy, output the steps or update runbook only.
4. Never commit or push secrets; use environment variables or secrets manager references.

## Expected Output
- **Prepare mode**: List of steps, commands, or runbook updates
- **Execute**: Deployment logs; success/failure status

## Troubleshooting
- **No deploy script**: Check for `deploy` in package.json, or CI config (.github/workflows, .gitlab-ci.yml)
- **Auth failures**: Deploy often needs tokens/keys; never hardcode; use env or secrets manager
- **Environment mismatch**: Confirm target (staging vs prod); use different env files

## Env Notes
- Deploy typically needs: `DEPLOY_TOKEN`, `AWS_*`, or similar; never in code
- Use `NODE_ENV=production` for production builds
