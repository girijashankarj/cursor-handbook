# Skill: Create API Documentation

## Description
Workflow for creating comprehensive API documentation.

## Trigger
When the user needs to document API endpoints.

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

## Completion
API documentation is complete, hosted, and auto-updated.
