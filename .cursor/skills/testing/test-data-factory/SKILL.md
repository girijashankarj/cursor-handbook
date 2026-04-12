---
name: test-data-factory
description: Generate type-safe test data factories and fixtures for unit and integration tests. Use when the user asks to create mock data, test fixtures, or data factories.
---

# Skill: Test Data Factory

Create reusable, type-safe factory functions for generating test data with sensible defaults and easy overrides.

## Trigger
When the user asks to create test data, mock data, fixtures, factories, or seed data for tests.

## Prerequisites
- [ ] Entity/model to create factories for identified
- [ ] TypeScript interfaces or schema definitions available
- [ ] Testing framework known (Jest, Vitest, etc.)

## Steps

### Step 1: Identify Entities
- [ ] List all entities that need factories
- [ ] Identify relationships between entities (foreign keys, nested objects)
- [ ] Check existing factories in `tests/mocks/factories/` to avoid duplicates

### Step 2: Design Factory Structure

```
tests/mocks/factories/
├── index.ts          # Re-exports all factories
├── user.factory.ts
├── order.factory.ts
├── product.factory.ts
└── helpers.ts        # Shared helpers (randomId, timestamps, etc.)
```

### Step 3: Create Helper Utilities

```typescript
// tests/mocks/factories/helpers.ts
import { randomUUID } from 'crypto';

export const fakeId = () => randomUUID();
export const fakeDate = (daysAgo = 0) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString();
};
export const fakeMoney = (min = 1, max = 1000) =>
  Math.round((Math.random() * (max - min) + min) * 100) / 100;
export const fakeEmail = (name = 'test') =>
  `${name}-${Math.random().toString(36).slice(2, 8)}@example.com`;
export const pickRandom = <T>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];
```

### Step 4: Create Entity Factory

Template for each entity:

```typescript
// tests/mocks/factories/order.factory.ts
import { fakeId, fakeDate, fakeMoney } from './helpers';

interface Order {
  id: string;
  customerId: string;
  status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  total: number;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
  activeIndicator: boolean;
}

type OrderOverrides = Partial<Order>;

export function buildOrder(overrides: OrderOverrides = {}): Order {
  return {
    id: fakeId(),
    customerId: fakeId(),
    status: 'PENDING',
    total: fakeMoney(10, 500),
    items: [],
    createdAt: fakeDate(),
    updatedAt: fakeDate(),
    activeIndicator: true,
    ...overrides,
  };
}

export function buildOrders(count: number, overrides: OrderOverrides = {}): Order[] {
  return Array.from({ length: count }, () => buildOrder(overrides));
}

// Pre-built scenarios
export const confirmedOrder = (overrides: OrderOverrides = {}) =>
  buildOrder({ status: 'CONFIRMED', ...overrides });

export const cancelledOrder = (overrides: OrderOverrides = {}) =>
  buildOrder({ status: 'CANCELLED', activeIndicator: false, ...overrides });
```

### Step 5: Handle Relationships

```typescript
// For entities with relationships:
export function buildOrderWithItems(
  itemCount = 3,
  overrides: OrderOverrides = {}
): Order {
  const items = buildOrderItems(itemCount);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return buildOrder({ items, total, ...overrides });
}
```

### Step 6: Create Database Fixtures (for integration tests)

```typescript
// tests/mocks/factories/db-fixtures.ts
export async function seedTestUser(db: Database, overrides = {}) {
  const user = buildUser(overrides);
  await db.query(
    'INSERT INTO users (id, email, name, created_at) VALUES ($1, $2, $3, $4)',
    [user.id, user.email, user.name, user.createdAt]
  );
  return user;
}

export async function cleanupTestData(db: Database) {
  await db.query('DELETE FROM order_items WHERE id LIKE $1', ['test-%']);
  await db.query('DELETE FROM orders WHERE id LIKE $1', ['test-%']);
  await db.query('DELETE FROM users WHERE id LIKE $1', ['test-%']);
}
```

### Step 7: Create Index File

```typescript
// tests/mocks/factories/index.ts
export * from './helpers';
export * from './user.factory';
export * from './order.factory';
export * from './product.factory';
```

### Step 8: Validate
- [ ] Factories produce valid entities (pass schema validation)
- [ ] Overrides work correctly (custom values replace defaults)
- [ ] Batch creation works (`buildOrders(10)`)
- [ ] Scenario builders produce correct states
- [ ] No real PII in factory defaults (use fake data)

## Rules
- **ALWAYS** use `build` prefix for factory functions (not `create` — reserve that for DB operations)
- **ALWAYS** return plain objects (not class instances) for unit test factories
- **ALWAYS** make every field overridable via the overrides parameter
- **NEVER** use real PII — use fake emails (`@example.com`), fake names, fake IDs
- **NEVER** use `Math.random()` for IDs — use `randomUUID()` or sequential IDs
- Defaults should produce a valid entity that passes validation
- Use scenario builders for common test states (e.g., `confirmedOrder()`, `adminUser()`)
- Separate in-memory factories (unit tests) from DB seed functions (integration tests)

## Completion
Type-safe factories for all requested entities with helpers, scenarios, and index file. Ready to use in tests.

## If a Step Fails
- **No TypeScript interfaces:** Infer from database schema or API response shapes
- **Complex relationships:** Start with leaf entities, build up to aggregates
- **Faker.js dependency:** Use lightweight helpers instead if project avoids large test deps
- **Circular dependencies:** Break cycle with lazy factory references or factory functions
