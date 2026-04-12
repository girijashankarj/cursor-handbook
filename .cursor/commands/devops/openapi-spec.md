---
name: openapi-spec
description: Generate an OpenAPI 3.x spec snippet for a given endpoint or resource.
---

# Command: OpenAPI Spec

## Invocation
`/openapi-spec`

## Description
Generate an OpenAPI 3.0.3 specification snippet for one or more API endpoints, ready to merge into a full spec file.

## Parameters
- `resource`: Resource name (e.g., `orders`, `users`, `products`)
- `operations`: Comma-separated operations — `list`, `get`, `create`, `update`, `delete` (default: all)
- `auth`: Authentication type — `bearer` (default), `apikey`, `none`

## Action
1. Generate path definitions for the specified operations.
2. Generate request/response schemas using the project's response envelope pattern.
3. Include standard error responses (400, 401, 403, 404, 500).
4. Add examples with realistic, non-PII data.
5. Output as YAML.

## When to Use
- Adding a new resource to existing API docs
- Quickly scaffolding OpenAPI spec for a new endpoint
- Generating API contract before implementation (design-first)

## Token Cost
~3–8K tokens (depends on number of operations)

## Expected Output
- OpenAPI YAML snippet with paths and schemas
- Ready to merge into existing `openapi.yaml`
- Includes `operationId`, tags, parameters, request/response schemas

## Troubleshooting
- **Custom fields:** Provide TypeScript interface or example JSON to derive schema
- **Nested resources:** Use path parameters: `/orders/{orderId}/items`
