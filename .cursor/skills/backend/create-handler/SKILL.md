# Skill: Create API Handler

## Description
Step-by-step workflow for creating a new API handler following the {{CONFIG.patterns.handlerFlowSteps}}-step handler pattern.

## Trigger
When the user asks to create a new API endpoint, handler, or route.

## Prerequisites
- Project configuration loaded (`{{CONFIG.paths.handlerBasePath}}` exists)
- Understanding of the entity and operation

## Steps

### Step 1: Gather Requirements
- [ ] Identify the entity (e.g., Order, Product, User)
- [ ] Identify the operation (e.g., create, read, update, list, delete)
- [ ] Determine HTTP method and URL path
- [ ] Identify request parameters and body schema
- [ ] Identify response format

### Step 2: Create Directory Structure
```bash
mkdir -p {{CONFIG.paths.handlerBasePath}}/{entity}/{operation}/logic
mkdir -p {{CONFIG.paths.handlerBasePath}}/{entity}/{operation}/schemas
```

Expected structure:
```
{{CONFIG.paths.handlerBasePath}}/{entity}/{operation}/
├── {{CONFIG.fileNames.handlerEntry}}
├── logic/
│   ├── validate-request.ts
│   ├── validate-business.ts
│   ├── pre-processing.ts
│   ├── operation.ts
│   ├── post-operation.ts
│   └── response.ts
└── schemas/
    ├── {{CONFIG.fileNames.requestSchema}}
    └── {{CONFIG.fileNames.responseSchema}}
```

### Step 3: Create Request Schema
- [ ] Define JSON Schema in `schemas/{{CONFIG.fileNames.requestSchema}}`
- [ ] Include all required and optional fields
- [ ] Add type validation and constraints
- [ ] Add description for each field

### Step 4: Create Response Schema
- [ ] Define JSON Schema in `schemas/{{CONFIG.fileNames.responseSchema}}`
- [ ] Follow response envelope pattern: `{ data, meta }`
- [ ] Include all response fields with types

### Step 5: Implement Logic Steps
For each file in `logic/`:
- [ ] `validate-request.ts` — Validate request against schema
- [ ] `validate-business.ts` — Check business rules and entity state
- [ ] `pre-processing.ts` — Transform and enrich data
- [ ] `operation.ts` — Execute core business logic
- [ ] `post-operation.ts` — Trigger side effects (events, notifications)
- [ ] `response.ts` — Format response with envelope

### Step 6: Create Handler Entry Point
- [ ] Import all logic steps
- [ ] Wire up the {{CONFIG.patterns.handlerFlowSteps}}-step flow
- [ ] Add error handling with try/catch
- [ ] Add structured logging with correlationId
- [ ] Export handler function

### Step 7: Register Route
- [ ] Add route in the appropriate router file
- [ ] Apply authentication middleware
- [ ] Apply rate limiting if needed

### Step 8: Add Tests
- [ ] Create test file: `{entity}/{operation}/__tests__/handler.test.ts`
- [ ] Test each logic step independently
- [ ] Test handler integration (success path)
- [ ] Test error cases (validation, business, not found)
- [ ] Verify {{CONFIG.testing.coverageMinimum}}% coverage

### Step 9: Validate
- [ ] Run type check: `{{CONFIG.testing.typeCheckCommand}}`
- [ ] Run tests for the new handler only
- [ ] Verify schemas match implementation

## Completion
Handler is created, tested, and type-checked. Ready for code review.
