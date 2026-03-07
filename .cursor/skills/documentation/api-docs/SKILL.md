---
name: api-docs
description: Workflow for creating comprehensive API documentation. Use when the user needs to document API endpoints.
---

# Skill: Create API Documentation

## Trigger
When the user needs to document API endpoints.

## Prerequisites
- [ ] API endpoints exist or are designed
- [ ] OpenAPI/Swagger tooling available (optional)
- [ ] Access to route definitions or handler files

## Steps

### Step 1: Inventory Endpoints
- [ ] List all API endpoints
- [ ] Group by resource/entity
- [ ] Note HTTP method and path for each

### Step 2: Document Each Endpoint
For each endpoint:
- [ ] HTTP method and URL
- [ ] Description and purpose
- [ ] Authentication requirements
- [ ] Request parameters (path, query, header)
- [ ] Request body schema
- [ ] Response schemas (success + errors)
- [ ] Example request and response
- [ ] Rate limiting details

### Step 3: Create OpenAPI Spec
- [ ] Define info, servers, security schemes
- [ ] Create component schemas (reusable)
- [ ] Define paths with all operations
- [ ] Add examples for all schemas
- [ ] Validate spec

### Step 4: Generate Documentation
- [ ] Use Swagger UI or Redoc for interactive docs
- [ ] Host at `/api/docs` or similar
- [ ] Include in CI/CD for auto-updates

### Step 5: Review
- [ ] All endpoints documented
- [ ] Examples are accurate and working
- [ ] Error responses documented
- [ ] Authentication flow documented

## Completion Checklist
- [ ] All endpoints have method, URL, params, body, response
- [ ] Error responses (4xx, 5xx) documented
- [ ] Examples validated against live API or schema
- [ ] OpenAPI spec validates (if used)

## If Step Fails
- **Step 1 (inventory)**: Search for route definitions: `**/*.route*.ts`, `**/routes/**`, `app.get|post|put|delete`
- **Step 3 (OpenAPI)**: Use minimal spec first; add complexity incrementally. Validate with `swagger-cli validate`
- **Step 4 (generate)**: Swagger UI needs valid spec; Redoc is more forgiving. Check CORS if hosted separately

## Example
Step 2 for `POST /api/v1/orders`: Method POST, URL `/api/v1/orders`, Body `{ customerId, items: [{ productId, quantity }] }`, Response 201 `{ data: { id, status } }`, Errors 400 validation, 404 customer not found.
