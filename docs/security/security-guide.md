# Security Guide

## Overview

cursor-handbook includes built-in security guardrails that protect against common vulnerabilities.

```mermaid
flowchart TB
    subgraph Guardrails [Security Guardrails]
        S1[Secret Management]
        S2[PII Protection]
        S3[SQL Safety]
        S4[Input Validation]
        S5[Authentication]
    end
    Guardrails --> Rules[.cursor/rules/security/]
    Rules --> AI[AI Response]
```

## Security Rules

### 1. Secret Management

All secrets must be loaded from environment variables or a secrets manager.

**Pattern:**

```typescript
// CORRECT
const apiKey = process.env.API_KEY;

// WRONG — Never do this
const apiKey = 'sk-1234567890abcdef';
```

### 2. PII Protection

Never log personally identifiable information.

**Safe to log:** userId, correlationId, operation, duration, status
**Never log:** email, name, phone, SSN, credit card, IP address

### 3. SQL Safety

Always use parameterized queries and soft deletes.

```sql
-- CORRECT
UPDATE orders SET active_indicator = false WHERE id = $1;

-- WRONG
DELETE FROM orders WHERE id = '${orderId}';
```

### 4. Input Validation

Validate all external input at the API boundary.

### 5. Authentication

- Use short-lived tokens (15 min for access, 7 days for refresh)
- Hash passwords with bcrypt/argon2
- Implement rate limiting on auth endpoints

## Security Checklist

Before every release:

- [ ] No hardcoded secrets (run `/check-secrets`)
- [ ] No PII in logs
- [ ] Dependencies audited (run `/audit-deps`)
- [ ] Input validation on all endpoints
- [ ] Parameterized queries only
- [ ] Authentication on protected routes
- [ ] Rate limiting configured
- [ ] Security headers set
