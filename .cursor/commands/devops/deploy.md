# Command: Deploy

Deploy the application to the target environment.

## Instructions

1. Determine deploy method from project (e.g. CI/CD workflow, `npm run deploy`, or infrastructure tool).
2. Do not execute deploy that modifies production unless the user explicitly confirms.
3. If asked to "prepare" or "document" deploy, output the steps or update runbook only.
4. Never commit or push secrets; use environment variables or secrets manager references.
