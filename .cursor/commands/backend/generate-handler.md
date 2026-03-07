# Command: Generate Handler

## Invocation
`/generate-handler`

## Description
Scaffold a new API handler with the complete directory structure and boilerplate.

## Parameters
- `entity`: The entity name (e.g., order, product, user)
- `operation`: The operation (e.g., create, read, update, list)

## Action
1. Create directory: `{{CONFIG.paths.handlerBasePath}}/{entity}/{operation}/`
2. Create subdirectories: `logic/`, `schemas/`
3. Generate boilerplate files:
   - `{{CONFIG.fileNames.handlerEntry}}`
   - `logic/validate-request.ts`
   - `logic/validate-business.ts`
   - `logic/pre-processing.ts`
   - `logic/operation.ts`
   - `logic/post-operation.ts`
   - `logic/response.ts`
   - `schemas/{{CONFIG.fileNames.requestSchema}}`
   - `schemas/{{CONFIG.fileNames.responseSchema}}`

## When to Use
- Creating a new API endpoint
- Starting a new handler from scratch
