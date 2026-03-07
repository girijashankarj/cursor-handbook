# Skill: Create migration

## Description
Create a new database migration following project naming and safety rules.

## Trigger
When the user asks to add a migration, create a migration for a schema change, or "migrate the DB."

## Steps

1. **Clarify** — Confirm the change (new table, new column, index, constraint); ensure backward compatible where possible.
2. **Naming** — Use format `YYYYMMDDHHMMSS_descriptive_action.sql` (or project equivalent).
3. **UP** — Write the forward migration (ADD COLUMN with default, CREATE INDEX CONCURRENTLY where supported).
4. **DOWN** — Write the rollback; test that DOWN reverts UP cleanly.
5. **Review** — No raw DELETE; use soft delete if needed; parameterized only; add index for new FK/filters.

## Rules
- Follow `.cursor/rules/database/migration-rules.mdc` and schema-design rules.
- Every table must have id, created_at, updated_at, and soft-delete column per project config.
