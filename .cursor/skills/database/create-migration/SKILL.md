---
name: create-migration
description: Create a new database migration following project naming and safety rules. Use when the user asks to add a migration or create a migration for a schema change.
---

# Skill: Create migration

## Trigger
When the user asks to add a migration, create a migration for a schema change, or "migrate the DB."

## Steps

1. **Clarify** — Confirm the change (new table, new column, index, constraint); ensure backward compatible where possible.
2. **Naming** — Use format `YYYYMMDDHHMMSS_descriptive_action.sql` (or project equivalent).
3. **UP** — Write the forward migration (ADD COLUMN with default, CREATE INDEX CONCURRENTLY where supported).
4. **DOWN** — Write the rollback; test that DOWN reverts UP cleanly.
5. **Review** — No raw DELETE; use soft delete if needed; parameterized only; add index for new FK/filters.

## If a step fails

| Step | Failure | Recovery |
|------|---------|----------|
| Step 4 | DOWN does not revert UP cleanly | Fix DOWN to match UP; test both directions; document manual steps if schema change is irreversible |
| Step 5 | Review finds unsafe patterns | Rewrite migration; no raw DELETE; use soft delete; add defaults for new columns |

## Rules
- Follow `.cursor/rules/database/migration-rules.mdc` and schema-design rules.
- Every table must have id, created_at, updated_at, and soft-delete column per project config.
