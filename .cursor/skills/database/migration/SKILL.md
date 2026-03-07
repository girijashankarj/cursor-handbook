# Skill: Create Database Migration

## Description
Safe workflow for creating and applying database schema changes.

## Trigger
When the user needs to modify the database schema.

## Steps

### Step 1: Plan the Change
- [ ] Define what's changing and why
- [ ] Check for backward compatibility
- [ ] Identify affected queries and code
- [ ] Determine if data migration is needed

### Step 2: Create Migration File
- [ ] Name: `YYYYMMDDHHMMSS_descriptive_name.sql`
- [ ] Write UP migration (apply change)
- [ ] Write DOWN migration (rollback)
- [ ] Include required columns: `{{CONFIG.database.timestampFields.created}}`, `{{CONFIG.database.timestampFields.updated}}`, `{{CONFIG.database.softDeleteField}}`

### Step 3: Safety Checks
- [ ] No `DELETE FROM` statements (soft delete only)
- [ ] New columns have defaults or are nullable
- [ ] Indexes created with `CONCURRENTLY` for large tables
- [ ] No column renames (add new → migrate → drop old)
- [ ] Foreign keys have appropriate cascade rules

### Step 4: Data Migration
If needed:
- [ ] Write data migration script
- [ ] Use batch processing (1000-5000 rows per batch)
- [ ] Make it idempotent (safe to re-run)
- [ ] Include progress logging

### Step 5: Test Migration
- [ ] Apply to development database
- [ ] Verify data integrity
- [ ] Test rollback
- [ ] Test with production-like data volume
- [ ] Verify affected queries still work

### Step 6: Update Code
- [ ] Update models/types to match new schema
- [ ] Update affected queries
- [ ] Run type check: `{{CONFIG.testing.typeCheckCommand}}`
- [ ] Run affected tests

## Completion
Migration created, tested, and code updated. Ready for review.
