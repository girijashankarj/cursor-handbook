---
name: mock-data
description: Generate realistic mock JSON data matching a schema, interface, or entity description.
---

# Command: Mock Data

## Invocation
`/mock-data`

## Description
Generate realistic, type-safe mock data from a TypeScript interface, JSON Schema, database table, or plain description.

## Parameters
- `schema`: TypeScript interface name, file path, or inline description
- `count`: Number of records to generate (default: 5)
- `format`: Output format — `json` (default), `csv`, `factory` (TypeScript factory function)

## Action
1. Parse the schema/interface to identify fields, types, and constraints.
2. Generate `count` records with:
   - Realistic values (names, emails, dates, UUIDs — all fake)
   - Correct types and format constraints
   - Unique IDs per record
   - Consistent foreign key references
3. Output in the requested format.

## When to Use
- Seeding a development database
- Creating test fixtures
- Prototyping UI with realistic data
- Generating sample API responses

## Token Cost
~2–5K tokens

## Expected Output
- Array of mock records matching the schema
- All values are fake (no real PII)
- IDs are unique, dates are realistic, enums are valid values

## Troubleshooting
- **Complex nested objects:** Generates one level deep by default; specify depth if needed
- **Foreign key consistency:** Generates referenced IDs first, then uses them
- **No schema provided:** Ask for field names and types
