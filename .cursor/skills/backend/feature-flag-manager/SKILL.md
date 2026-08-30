---
name: feature-flag-manager
description: Create, manage, and clean up feature flags for gradual rollouts and safe deployments. Use when the user asks to add a feature flag, toggle, or manage feature gating.
---

# Skill: Feature Flag Manager

Implement feature flags for controlled rollouts, A/B testing, and safe deployments with cleanup workflows.

## Trigger
When the user asks to add a feature flag, gate a feature, set up gradual rollout, or clean up old flags.

## Prerequisites
- [ ] Feature to gate identified
- [ ] Rollout strategy decided (on/off, percentage, user segment)

## Steps

### Step 1: Choose Flag Strategy

| Strategy | When to Use | Complexity |
|----------|-------------|-----------|
| **Boolean toggle** | Simple on/off per environment | Low |
| **Percentage rollout** | Gradual rollout to % of users | Medium |
| **User segment** | Specific users, orgs, or roles | Medium |
| **A/B test** | Compare variants with metrics | High |
| **Kill switch** | Emergency disable of a feature | Low |

### Step 2: Define the Flag
- [ ] Name: `FEATURE_{DOMAIN}_{DESCRIPTION}` (e.g., `FEATURE_ORDERS_ASYNC_PROCESSING`)
- [ ] Type: boolean, number (percentage), string (variant)
- [ ] Default value: `false` (new features default to off)
- [ ] Description: one sentence explaining what it controls
- [ ] Owner: team or person responsible
- [ ] Expiry: target date for cleanup

### Step 3: Create Flag Configuration

```typescript
// config/feature-flags.ts
export const FeatureFlags = {
  FEATURE_ORDERS_ASYNC_PROCESSING: {
    key: 'FEATURE_ORDERS_ASYNC_PROCESSING',
    description: 'Enable async order processing pipeline',
    defaultValue: false,
    owner: 'orders-team',
    createdAt: '2026-04-12',
    targetCleanup: '2026-06-12',
  },
} as const;

export type FeatureFlagKey = keyof typeof FeatureFlags;
```

### Step 4: Implement Flag Check Utility

```typescript
// utils/feature-flags.ts
export function isFeatureEnabled(
  flagKey: FeatureFlagKey,
  context?: { userId?: string; orgId?: string }
): boolean {
  const envValue = process.env[flagKey];
  if (envValue !== undefined) {
    return envValue === 'true' || envValue === '1';
  }
  return FeatureFlags[flagKey].defaultValue;
}
```

### Step 5: Gate the Feature in Code

```typescript
// In handler/service:
if (isFeatureEnabled('FEATURE_ORDERS_ASYNC_PROCESSING', { userId })) {
  await processOrderAsync(order);
} else {
  await processOrderSync(order);
}
```

### Step 6: Add to Environment Config
- [ ] Add flag to `.env.example` with `false` default
- [ ] Add to staging `.env` with `true` for testing
- [ ] Keep production as `false` until ready for rollout

### Step 7: Add Tests for Both Paths
- [ ] Test with flag enabled
- [ ] Test with flag disabled
- [ ] Test flag default behavior (env var not set)

```typescript
describe('when FEATURE_ORDERS_ASYNC_PROCESSING is enabled', () => {
  beforeEach(() => { process.env.FEATURE_ORDERS_ASYNC_PROCESSING = 'true'; });
  afterEach(() => { delete process.env.FEATURE_ORDERS_ASYNC_PROCESSING; });

  it('should process order asynchronously', async () => { /* ... */ });
});

describe('when FEATURE_ORDERS_ASYNC_PROCESSING is disabled', () => {
  it('should process order synchronously', async () => { /* ... */ });
});
```

### Step 8: Document Rollout Plan
```markdown
## Rollout Plan: FEATURE_ORDERS_ASYNC_PROCESSING
1. **Dev/Staging**: Enable, run integration tests
2. **Canary (5%)**: Monitor error rate and latency for 24h
3. **Gradual (25% → 50% → 100%)**: Each stage monitored for 48h
4. **Cleanup**: Remove flag after 2 weeks at 100%
```

## Flag Cleanup Workflow

### When to Clean Up
- Flag has been at 100% for 2+ weeks
- No incidents related to the feature
- Target cleanup date reached

### Cleanup Steps
1. Remove the flag check — keep the "enabled" code path
2. Remove the "disabled" code path
3. Remove flag from `FeatureFlags` config
4. Remove from `.env` files
5. Remove flag-specific tests (keep the feature tests)
6. Update documentation

## Rules
- **ALWAYS** default new flags to `false` (off)
- **ALWAYS** set a cleanup target date when creating a flag
- **ALWAYS** test both code paths (enabled and disabled)
- **NEVER** nest feature flags (flag inside flag)
- **NEVER** use feature flags for permanent configuration — use config instead
- Flag names must be descriptive and follow `FEATURE_DOMAIN_DESCRIPTION` pattern
- Maximum 15 active flags at any time — clean up before adding more

## Completion
Feature flag created with config, utility function, code gating, tests, and rollout plan. Cleanup date documented.

## If a Step Fails
- **Too many active flags:** Audit and clean up stale flags first
- **Complex branching:** Consider a feature flag service (LaunchDarkly, Unleash) instead of env vars
- **Tests flaky with flag:** Ensure env var cleanup in `afterEach`
- **Can't determine rollout strategy:** Default to boolean toggle, upgrade later
