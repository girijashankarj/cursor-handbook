# New feature / handler prompt

Use this when creating a new API endpoint or handler following the project's handler pattern.

---

## Prompt

```
Create a new [HTTP_METHOD] [ENDPOINT_PATH] handler for [FEATURE_DESCRIPTION].

Requirements:
- Follow the handler pattern: controller → service → model
- Create files in the correct folders:
  - Handler/controller in controllers/ or handlers/
  - Business logic in logic/ or services/
  - Input/output schemas in schemas/
  - Types in types/
- Input validation using the project's schema library
- Structured error responses with error codes
- Structured logging with correlationId
- Soft delete only (no DELETE SQL)
- Parameterized database queries

Include:
1. Route definition
2. Request validation schema
3. Handler function
4. Service/logic function
5. Response type
6. Unit tests for the service layer

Follow the existing patterns — check a similar handler in the codebase for reference.
```

## Placeholders

| Placeholder | Replace with |
|-------------|-------------|
| `[HTTP_METHOD]` | `GET`, `POST`, `PUT`, `PATCH` |
| `[ENDPOINT_PATH]` | e.g. `/api/v1/orders/:id/cancel` |
| `[FEATURE_DESCRIPTION]` | What this endpoint does |

## Expected output

- Route registration
- Validation schema
- Handler with error handling
- Service function with business logic
- Unit tests with AAA pattern
