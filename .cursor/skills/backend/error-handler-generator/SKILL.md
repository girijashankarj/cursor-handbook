---
name: error-handler-generator
description: Generate typed error classes, error handling middleware, and HTTP error mapping following project conventions. Use when the user asks to set up error handling, create error classes, or implement error middleware.
---

# Skill: Error Handler Generator

Create a comprehensive error handling system with typed error classes, centralized middleware, and consistent API error responses.

## Trigger
When the user asks to create error handling, set up error classes, implement error middleware, or standardize error responses.

## Prerequisites
- [ ] Framework identified (Express, Fastify, Koa, etc.)
- [ ] Response envelope format known (`{ error: { code, message }, meta }`)
- [ ] Error categories for the domain identified

## Steps

### Step 1: Define Error Hierarchy

```typescript
// errors/base.ts
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly isOperational: boolean;
  public readonly details?: Record<string, unknown>;

  constructor(params: {
    message: string;
    statusCode: number;
    code: string;
    isOperational?: boolean;
    details?: Record<string, unknown>;
  }) {
    super(params.message);
    this.name = this.constructor.name;
    this.statusCode = params.statusCode;
    this.code = params.code;
    this.isOperational = params.isOperational ?? true;
    this.details = params.details;
    Error.captureStackTrace(this, this.constructor);
  }
}
```

### Step 2: Create Specific Error Classes

```typescript
// errors/index.ts
export class ValidationError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super({ message, statusCode: 400, code: 'VALIDATION_ERROR', details });
  }
}

export class AuthenticationError extends AppError {
  constructor(message = 'Authentication required') {
    super({ message, statusCode: 401, code: 'AUTHENTICATION_ERROR' });
  }
}

export class AuthorizationError extends AppError {
  constructor(message = 'Insufficient permissions') {
    super({ message, statusCode: 403, code: 'AUTHORIZATION_ERROR' });
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, id?: string) {
    const msg = id ? `${resource} with id '${id}' not found` : `${resource} not found`;
    super({ message: msg, statusCode: 404, code: 'NOT_FOUND' });
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super({ message, statusCode: 409, code: 'CONFLICT' });
  }
}

export class RateLimitError extends AppError {
  constructor(retryAfter?: number) {
    super({
      message: 'Rate limit exceeded',
      statusCode: 429,
      code: 'RATE_LIMIT_EXCEEDED',
      details: retryAfter ? { retryAfterSeconds: retryAfter } : undefined,
    });
  }
}

export class ExternalServiceError extends AppError {
  constructor(serviceName: string, message?: string) {
    super({
      message: message || `External service error: ${serviceName}`,
      statusCode: 502,
      code: 'EXTERNAL_SERVICE_ERROR',
      details: { service: serviceName },
    });
  }
}

export class InternalError extends AppError {
  constructor(message = 'An unexpected error occurred') {
    super({ message, statusCode: 500, code: 'INTERNAL_ERROR', isOperational: false });
  }
}
```

### Step 3: Create Error Middleware

```typescript
// middleware/error-handler.ts
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/base';
import { logger } from '../utils/logger';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  const correlationId = req.headers['x-correlation-id'] as string || 'unknown';

  if (err instanceof AppError) {
    logger.warn({
      correlationId,
      error: err.code,
      message: err.message,
      statusCode: err.statusCode,
      path: req.path,
      method: req.method,
    });

    res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        ...(err.details && { details: err.details }),
      },
      meta: {
        correlationId,
        timestamp: new Date().toISOString(),
      },
    });
    return;
  }

  // Unexpected errors — don't expose details
  logger.error({
    correlationId,
    error: 'INTERNAL_ERROR',
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred',
    },
    meta: {
      correlationId,
      timestamp: new Date().toISOString(),
    },
  });
}
```

### Step 4: Create Async Handler Wrapper

```typescript
// middleware/async-handler.ts
import { Request, Response, NextFunction, RequestHandler } from 'express';

export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
): RequestHandler => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
```

### Step 5: Add Error Mapping for External Errors

```typescript
// errors/mappers.ts
import { AppError, ValidationError, InternalError } from './index';
import { ZodError } from 'zod';

export function mapToAppError(err: unknown): AppError {
  if (err instanceof AppError) return err;

  if (err instanceof ZodError) {
    return new ValidationError('Validation failed', {
      fields: err.errors.map(e => ({
        path: e.path.join('.'),
        message: e.message,
      })),
    });
  }

  if (err instanceof SyntaxError && 'body' in err) {
    return new ValidationError('Invalid JSON in request body');
  }

  return new InternalError();
}
```

### Step 6: Wire Into Application

```typescript
// app.ts
import { errorHandler } from './middleware/error-handler';

// ... routes ...

// Error handler must be LAST middleware
app.use(errorHandler);
```

### Step 7: Add Tests

```typescript
describe('Error handling', () => {
  it('should return 400 for validation errors', async () => {
    const res = await request(app).post('/api/v1/orders').send({});
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
    expect(res.body.meta.correlationId).toBeDefined();
  });

  it('should return 500 with safe message for unexpected errors', async () => {
    const res = await request(app).get('/api/v1/error-trigger');
    expect(res.status).toBe(500);
    expect(res.body.error.message).toBe('An unexpected error occurred');
    expect(res.body.error.code).toBe('INTERNAL_ERROR');
  });

  it('should not expose stack traces to clients', async () => {
    const res = await request(app).get('/api/v1/error-trigger');
    expect(res.body.error.stack).toBeUndefined();
  });
});
```

## Rules
- **NEVER** expose stack traces, internal paths, or implementation details to API consumers
- **NEVER** log the full request/response body (may contain PII)
- **ALWAYS** include `correlationId` in error responses and logs
- **ALWAYS** distinguish operational errors (expected) from programmer errors (unexpected)
- **ALWAYS** log unexpected errors at `error` level with full stack trace server-side
- Use the `AppError` hierarchy — don't throw raw `Error` objects from business logic
- Map third-party errors to `AppError` subclasses at the boundary

## Completion
Complete error handling system with base class, specific error types, middleware, async wrapper, error mappers, and tests.

## If a Step Fails
- **Framework not Express:** Adapt middleware signature for Fastify/Koa/etc.
- **Zod not used:** Replace Zod mapper with project's validation library
- **No logger:** Use `console.error` as fallback, recommend structured logger
- **Existing error system:** Extend rather than replace, maintain backward compatibility
