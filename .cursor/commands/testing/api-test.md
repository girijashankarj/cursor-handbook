---
name: api-test
description: Generate an integration test for an API endpoint with success, validation, auth, and error cases.
---

# Command: API Test

## Invocation
`/api-test`

## Description
Generate a complete integration test file for an API endpoint covering success, validation error, authentication, and not-found scenarios.

## Parameters
- `endpoint`: API path (e.g., `POST /api/v1/orders`)
- `schema`: Request body schema or TypeScript interface (optional)

## Action
1. Parse the endpoint (method + path).
2. Generate test cases:
   - **Success** — valid request returns expected status and response shape
   - **Validation error (400)** — invalid/missing fields
   - **Unauthorized (401)** — missing or invalid auth token
   - **Not found (404)** — resource doesn't exist (for GET/PUT/DELETE)
   - **Conflict (409)** — duplicate creation (for POST, if applicable)
3. Follow AAA pattern (Arrange-Act-Assert).
4. Include test data factories and cleanup.
5. Use project testing conventions (`should ... when ...` naming).

## When to Use
- After creating a new API endpoint
- Adding test coverage for untested endpoints
- Scaffolding integration tests quickly

## Token Cost
~3–5K tokens

## Expected Output
- Complete test file with `describe`/`it` blocks
- Test data setup and cleanup
- All standard HTTP error cases covered
- Ready to run with `{{CONFIG.testing.testCommand}}`

## Troubleshooting
- **Complex auth:** Provide test token setup in test helpers
- **Database-dependent:** Include seed data and cleanup in `beforeEach`/`afterEach`
