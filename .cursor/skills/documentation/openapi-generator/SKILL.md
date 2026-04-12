---
name: openapi-generator
description: Generate OpenAPI 3.x specifications from code, requirements, or existing APIs. Use when the user asks to create an API spec, Swagger doc, or OpenAPI definition.
---

# Skill: OpenAPI Generator

Generate complete OpenAPI 3.0/3.1 specifications from code, requirements, or existing endpoints.

## Trigger
When the user asks to generate an OpenAPI spec, create Swagger documentation, document API endpoints, or produce an API contract.

## Prerequisites
- [ ] API endpoints identified (routes, methods, paths)
- [ ] Request/response schemas known or inferable from code
- [ ] Authentication method known

## Steps

### Step 1: Gather API Information
- [ ] Scan route files to identify all endpoints
- [ ] Identify HTTP methods for each endpoint (GET, POST, PUT, PATCH, DELETE)
- [ ] Identify path parameters, query parameters, request bodies
- [ ] Identify response shapes and status codes
- [ ] Identify authentication/authorization requirements
- [ ] Check for existing schema definitions (Zod, JSON Schema, TypeScript interfaces)

### Step 2: Define API Metadata
```yaml
openapi: "3.0.3"
info:
  title: "{{CONFIG.project.name}} API"
  description: "API documentation for {{CONFIG.project.name}}"
  version: "1.0.0"
  contact:
    name: "API Support"
    email: "[API_SUPPORT_EMAIL]"
servers:
  - url: "[API_BASE_URL]/api/v1"
    description: "Production"
  - url: "[API_BASE_URL_STAGING]/api/v1"
    description: "Staging"
```

### Step 3: Define Security Schemes
```yaml
components:
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
    ApiKeyAuth:
      type: apiKey
      in: header
      name: X-API-Key
```

### Step 4: Define Reusable Schemas

#### Response Envelope
```yaml
components:
  schemas:
    SuccessResponse:
      type: object
      properties:
        data:
          type: object
        meta:
          $ref: "#/components/schemas/Meta"
    ErrorResponse:
      type: object
      properties:
        error:
          $ref: "#/components/schemas/Error"
        meta:
          $ref: "#/components/schemas/Meta"
    Meta:
      type: object
      properties:
        correlationId:
          type: string
          format: uuid
        timestamp:
          type: string
          format: date-time
    Error:
      type: object
      properties:
        code:
          type: string
        message:
          type: string
        details:
          type: array
          items:
            type: object
    PaginationMeta:
      type: object
      properties:
        cursor:
          type: string
          nullable: true
        pageSize:
          type: integer
        hasMore:
          type: boolean
```

#### Entity Schemas
- [ ] Convert TypeScript interfaces / Zod schemas to OpenAPI schema objects
- [ ] Define `required` fields
- [ ] Add `format` hints (uuid, email, date-time, uri)
- [ ] Add `example` values for each field
- [ ] Add `description` for non-obvious fields
- [ ] Define enums for constrained values

### Step 5: Define Endpoints

For each endpoint:
```yaml
paths:
  /resource:
    get:
      summary: "List resources"
      description: "Returns a paginated list of resources"
      operationId: "listResources"
      tags:
        - "Resources"
      security:
        - BearerAuth: []
      parameters:
        - name: cursor
          in: query
          schema:
            type: string
          description: "Pagination cursor"
        - name: pageSize
          in: query
          schema:
            type: integer
            default: 20
            minimum: 1
            maximum: 100
      responses:
        "200":
          description: "Successful response"
          content:
            application/json:
              schema:
                allOf:
                  - $ref: "#/components/schemas/SuccessResponse"
                  - type: object
                    properties:
                      data:
                        type: array
                        items:
                          $ref: "#/components/schemas/Resource"
                      meta:
                        allOf:
                          - $ref: "#/components/schemas/Meta"
                          - $ref: "#/components/schemas/PaginationMeta"
        "401":
          description: "Unauthorized"
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/ErrorResponse"
    post:
      summary: "Create resource"
      operationId: "createResource"
      tags:
        - "Resources"
      security:
        - BearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/CreateResourceRequest"
      responses:
        "201":
          description: "Created"
          content:
            application/json:
              schema:
                allOf:
                  - $ref: "#/components/schemas/SuccessResponse"
                  - type: object
                    properties:
                      data:
                        $ref: "#/components/schemas/Resource"
        "400":
          description: "Validation error"
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/ErrorResponse"
```

### Step 6: Add Common Response Codes
- [ ] `200` — Success (GET, PUT, PATCH)
- [ ] `201` — Created (POST)
- [ ] `204` — No content (DELETE)
- [ ] `400` — Validation error
- [ ] `401` — Unauthorized
- [ ] `403` — Forbidden
- [ ] `404` — Not found
- [ ] `409` — Conflict
- [ ] `429` — Rate limited
- [ ] `500` — Internal server error

### Step 7: Add Examples
- [ ] Add `example` or `examples` to request bodies
- [ ] Add `example` or `examples` to responses
- [ ] Use realistic but non-PII data in examples

```yaml
examples:
  CreateOrderExample:
    summary: "Create a standard order"
    value:
      customerId: "cust_abc123"
      items:
        - productId: "prod_xyz789"
          quantity: 2
      shippingAddress:
        street: "123 Main St"
        city: "Anytown"
        state: "CA"
        zip: "90210"
```

### Step 8: Validate the Spec
- [ ] Verify all `$ref` references resolve
- [ ] Verify all required fields are listed
- [ ] Verify examples match schemas
- [ ] Check for consistent naming (camelCase for fields, kebab-case for paths)
- [ ] Verify no real URLs, secrets, or PII in the spec

### Step 9: Output
- [ ] Generate as YAML (preferred) or JSON
- [ ] Save to `docs/api/openapi.yaml` or project-standard location
- [ ] Provide instructions for viewing: Swagger UI, Redoc, or Stoplight

## Rules
- **ALWAYS** use OpenAPI 3.0.3 or 3.1.0
- **ALWAYS** include `operationId` for every endpoint
- **ALWAYS** document all response codes (success and error)
- **ALWAYS** use `$ref` for reusable schemas — no duplication
- **NEVER** include real URLs, secrets, or PII in the spec
- **NEVER** use `any` or untyped fields — be explicit
- Follow the project's response envelope pattern: `{ data, meta, errors }`
- Use `tags` to group related endpoints
- Alphabetize paths and sort methods (GET, POST, PUT, PATCH, DELETE)

## Completion
Complete OpenAPI spec file ready to serve via Swagger UI, Redoc, or import into Postman/Insomnia.

## If a Step Fails
- **Can't infer schemas from code:** Ask the user for TypeScript interfaces or example payloads
- **Too many endpoints:** Generate a skeleton first, fill in details incrementally
- **Schema conflicts:** Validate with `npx @redocly/cli lint openapi.yaml`
- **Missing auth info:** Default to BearerAuth, ask user to confirm
