---
name: postman-collection-generator
description: Generate Postman or Insomnia collections from OpenAPI specs, code, or endpoint descriptions. Use when the user asks to create an API collection, export endpoints for testing, or set up Postman/Insomnia.
---

# Skill: Postman Collection Generator

Generate importable API client collections (Postman v2.1 or Insomnia) for manual testing and team sharing.

## Trigger
When the user asks to create a Postman collection, Insomnia workspace, or export API endpoints for manual testing.

## Prerequisites
- [ ] API endpoints identified (from code, OpenAPI spec, or descriptions)
- [ ] Authentication method known
- [ ] Base URL and environments identified

## Steps

### Step 1: Gather Endpoints
- [ ] Scan route files or OpenAPI spec for all endpoints
- [ ] For each endpoint: method, path, parameters, request body, response shape
- [ ] Group endpoints by resource or feature

### Step 2: Define Environment Variables

```json
{
  "id": "env-dev",
  "name": "Development",
  "values": [
    { "key": "baseUrl", "value": "http://localhost:3000/api/v1", "enabled": true },
    { "key": "authToken", "value": "", "enabled": true },
    { "key": "correlationId", "value": "{{$guid}}", "enabled": true }
  ]
}
```

Environments to create:
- **Development** — `localhost:3000`
- **Staging** — `[STAGING_URL]`
- **Production** — `[PROD_URL]` (read-only requests only)

### Step 3: Generate Collection Structure

```json
{
  "info": {
    "name": "{{CONFIG.project.name}} API",
    "_postman_id": "{{$guid}}",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "auth": {
    "type": "bearer",
    "bearer": [{ "key": "token", "value": "{{authToken}}", "type": "string" }]
  },
  "variable": [
    { "key": "baseUrl", "value": "http://localhost:3000/api/v1" }
  ],
  "item": []
}
```

### Step 4: Generate Request Items

For each endpoint:

```json
{
  "name": "List Orders",
  "request": {
    "method": "GET",
    "header": [
      { "key": "X-Correlation-Id", "value": "{{correlationId}}" },
      { "key": "Content-Type", "value": "application/json" }
    ],
    "url": {
      "raw": "{{baseUrl}}/orders?cursor=&pageSize=20",
      "host": ["{{baseUrl}}"],
      "path": ["orders"],
      "query": [
        { "key": "cursor", "value": "", "description": "Pagination cursor" },
        { "key": "pageSize", "value": "20", "description": "Items per page (1-100)" }
      ]
    }
  },
  "response": [
    {
      "name": "Success (200)",
      "status": "OK",
      "code": 200,
      "body": "{\"data\": [{\"id\": \"ord_001\", \"status\": \"PENDING\"}], \"meta\": {\"cursor\": \"abc\", \"hasMore\": true}}"
    }
  ]
}
```

For POST/PUT endpoints:
```json
{
  "name": "Create Order",
  "request": {
    "method": "POST",
    "header": [
      { "key": "X-Correlation-Id", "value": "{{correlationId}}" },
      { "key": "Content-Type", "value": "application/json" }
    ],
    "body": {
      "mode": "raw",
      "raw": "{\n  \"customerId\": \"cust_001\",\n  \"items\": [\n    { \"productId\": \"prod_001\", \"quantity\": 2 }\n  ]\n}",
      "options": { "raw": { "language": "json" } }
    },
    "url": {
      "raw": "{{baseUrl}}/orders",
      "host": ["{{baseUrl}}"],
      "path": ["orders"]
    }
  }
}
```

### Step 5: Add Pre-Request Scripts (Optional)

```javascript
// Auto-generate correlation ID
pm.variables.set("correlationId", pm.variables.replaceIn("{{$guid}}"));

// Auth token from login response
const authResponse = pm.environment.get("authResponse");
if (authResponse) {
  const token = JSON.parse(authResponse).data.token;
  pm.environment.set("authToken", token);
}
```

### Step 6: Add Test Scripts (Optional)

```javascript
// Common assertions for all requests
pm.test("Status code is successful", () => {
  pm.expect(pm.response.code).to.be.oneOf([200, 201, 204]);
});

pm.test("Response has correct envelope", () => {
  const json = pm.response.json();
  pm.expect(json).to.have.property("data");
  pm.expect(json).to.have.property("meta");
  pm.expect(json.meta).to.have.property("correlationId");
});

pm.test("Response time < 500ms", () => {
  pm.expect(pm.response.responseTime).to.be.below(500);
});
```

### Step 7: Organize Folders
- [ ] Group by resource: Users, Orders, Products, etc.
- [ ] Add an "Auth" folder with login/register/refresh endpoints
- [ ] Add a "Health" folder with health check endpoints
- [ ] Add an "Admin" folder for administrative endpoints

### Step 8: Export and Document
- [ ] Export as Postman Collection v2.1 JSON
- [ ] Export environment files separately
- [ ] Save to `docs/api/postman/` or project-standard location
- [ ] Add import instructions to README

## Rules
- **NEVER** include real credentials or tokens in the collection
- **NEVER** include PII in example request/response bodies
- **ALWAYS** use environment variables for base URLs and tokens
- **ALWAYS** include example responses for each endpoint
- Use `{{$guid}}` for dynamic IDs, `{{$timestamp}}` for timestamps
- Group endpoints logically by resource, not by HTTP method

## Completion
Importable Postman collection JSON with environments, example requests/responses, and test scripts.

## If a Step Fails
- **No OpenAPI spec:** Build from route files and TypeScript types
- **Complex auth (OAuth):** Add a dedicated "Auth Flow" folder with token exchange steps
- **Too many endpoints:** Generate for core resources first, expand incrementally
- **Insomnia format needed:** Convert Postman JSON to Insomnia YAML format
