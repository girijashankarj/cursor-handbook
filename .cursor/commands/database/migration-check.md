---
name: migration-check
description: Validate a database migration for safety — checks for destructive operations, missing rollback, and locking risks.
---

# Command: Migration Check

## Invocation
`/migration-check`

## Description
Analyze a database migration file for safety issues: destructive operations, missing rollback, table locks, and data loss risks.

## Parameters
- `file`: Path to migration file (default: latest migration file)

## Action
1. Read the migration file (up and down).
2. Check for safety issues:

| Check | Risk | Severity |
|-------|------|----------|
| `DROP TABLE` | Data loss | Critical |
| `DROP COLUMN` | Data loss | Critical |
| `DELETE FROM` without `WHERE` | Data loss | Critical |
| `ALTER TABLE` on large table | Table lock | High |
| `NOT NULL` without default | Insert failures | High |
| `RENAME TABLE/COLUMN` | App breakage | High |
| No `down` migration | Can't rollback | Medium |
| Missing `IF EXISTS` / `IF NOT EXISTS` | Idempotency | Low |

3. Report findings with severity and recommendations.
4. Verify migration naming follows project conventions.

## When to Use
- Before applying a migration to staging/production
- During code review of migration PRs
- Validating auto-generated migrations

## Token Cost
~2–4K tokens

## Expected Output
- Safety checklist with pass/fail for each check
- Warnings for risky operations with suggested alternatives
- Rollback verification (down migration exists and is correct)

## Troubleshooting
- **False positive on ALTER:** Small tables are safe; risk is for tables with millions of rows
- **No down migration:** Suggest writing one or document why rollback isn't possible
- **Soft delete violation:** Flag any `DELETE FROM` — project convention is soft delete only
