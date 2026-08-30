---
name: api-mock-server
description: Generate a mock API server from OpenAPI specs, TypeScript interfaces, or endpoint descriptions for frontend development and testing. Use when the user asks to create a mock server, fake API, or stub endpoints.
---

# Skill: API Mock Server

Generate a lightweight mock API server that returns realistic responses for frontend development and integration testing.

## Trigger
When the user asks to mock an API, create a fake backend, stub endpoints, or generate a dev server from a spec.

## Prerequisites
- [ ] API endpoints to mock identified
- [ ] Response shapes known (from OpenAPI spec, TypeScript types, or examples)

## Steps

### Step 1: Choose Approach

| Approach | Tool | Best For |
|----------|------|----------|
| **JSON Server** | `json-server` | Quick REST mock from a JSON file |
| **MSW (Mock Service Worker)** | `msw` | Browser/Node request interception for tests |
| **Express mock** | `express` | Custom logic, delays, error simulation |
| **Prism** | `@stoplight/prism-cli` | Auto-mock from OpenAPI spec |

### Step 2: Generate Mock Data
- [ ] Use the `test-data-factory` skill to create realistic data
- [ ] Generate 10–50 records per resource
- [ ] Include relationships (foreign keys reference valid IDs)

### Step 3a: JSON Server (Simplest)

```json
// mock-db.json
{
  "users": [
    { "id": "usr_001", "name": "Alice Johnson", "email": "alice@example.com", "role": "admin" },
    { "id": "usr_002", "name": "Bob Smith", "email": "bob@example.com", "role": "user" }
  ],
  "orders": [
    { "id": "ord_001", "userId": "usr_001", "status": "CONFIRMED", "total": 99.99 }
  ]
}
```

```bash
npx json-server mock-db.json --port 3001 --delay 200
```

### Step 3b: MSW Handlers (for Tests)

```typescript
// mocks/handlers.ts
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/v1/users', () => {
    return HttpResponse.json({
      data: [
        { id: 'usr_001', name: 'Alice Johnson', email: 'alice@example.com' },
      ],
      meta: { correlationId: 'mock-123', timestamp: new Date().toISOString() },
    });
  }),

  http.post('/api/v1/users', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json(
      { data: { id: 'usr_new', ...body }, meta: { correlationId: 'mock-456' } },
      { status: 201 }
    );
  }),

  http.get('/api/v1/users/:id', ({ params }) => {
    if (params.id === 'not-found') {
      return HttpResponse.json(
        { error: { code: 'NOT_FOUND', message: 'User not found' } },
        { status: 404 }
      );
    }
    return HttpResponse.json({
      data: { id: params.id, name: 'Alice Johnson' },
    });
  }),
];
```

```typescript
// mocks/server.ts (Node.js)
import { setupServer } from 'msw/node';
import { handlers } from './handlers';
export const server = setupServer(...handlers);

// mocks/browser.ts (Browser)
import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';
export const worker = setupWorker(...handlers);
```

### Step 3c: Express Mock (Custom Logic)

```typescript
// mock-server.ts
import express from 'express';

const app = express();
app.use(express.json());

// Simulate latency
app.use((req, res, next) => {
  setTimeout(next, 100 + Math.random() * 200);
});

app.get('/api/v1/resources', (req, res) => {
  const page = parseInt(req.query.cursor as string) || 0;
  res.json({
    data: generateResources(20),
    meta: {
      cursor: page + 20,
      hasMore: page < 100,
      correlationId: req.headers['x-correlation-id'] || 'mock',
    },
  });
});

// Error simulation
app.get('/api/v1/error', (req, res) => {
  res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Simulated error' } });
});

app.listen(3001, () => console.log('Mock server on http://localhost:3001'));
```

### Step 4: Add Error Scenarios
- [ ] 400 — validation error (missing required field)
- [ ] 401 — unauthorized (expired/missing token)
- [ ] 404 — resource not found
- [ ] 429 — rate limited
- [ ] 500 — internal server error
- [ ] Timeout simulation (delayed response)

### Step 5: Add to package.json Scripts
```json
{
  "scripts": {
    "mock": "npx json-server mock-db.json --port 3001",
    "mock:msw": "ts-node mocks/server.ts"
  }
}
```

### Step 6: Document
- [ ] List all mocked endpoints
- [ ] Document special behaviors (error triggers, delays)
- [ ] Note any differences from real API

## Rules
- **NEVER** include real credentials or PII in mock data
- **ALWAYS** match the real API's response envelope format
- **ALWAYS** include realistic latency simulation (100–300ms)
- **ALWAYS** include error scenarios alongside happy paths
- Mock data should use `@example.com` emails, fake names, and UUID-style IDs
- Response shapes must match the real API contract exactly

## Completion
Working mock server with realistic data, error scenarios, and run instructions.

## If a Step Fails
- **No API spec:** Build from TypeScript interfaces or example responses
- **Complex auth flow:** Bypass auth in mock, add header check for token presence only
- **GraphQL API:** Use MSW's `graphql` handlers instead of `http`
- **WebSocket endpoints:** Use `ws` library for mock WebSocket server
