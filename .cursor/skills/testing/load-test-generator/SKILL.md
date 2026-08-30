---
name: load-test-generator
description: Generate load test scripts using k6, Artillery, or Locust from API endpoints or OpenAPI specs. Use when the user asks to create load tests, stress tests, or performance benchmarks.
---

# Skill: Load Test Generator

Generate load test scripts for API endpoints with configurable scenarios, thresholds, and reporting.

## Trigger
When the user asks to create load tests, stress tests, performance benchmarks, or capacity tests.

## Prerequisites
- [ ] Target API endpoints identified
- [ ] Expected load profile known (requests/sec, concurrent users)
- [ ] Performance thresholds defined (latency, error rate)

## Steps

### Step 1: Choose Tool

| Tool | Language | Best For |
|------|----------|----------|
| **k6** | JavaScript | Developer-friendly, CI integration, cloud scaling |
| **Artillery** | YAML + JS | Quick setup, YAML-based scenarios |
| **Locust** | Python | Python teams, distributed testing |

Default to **k6** unless user specifies otherwise.

### Step 2: Identify Scenarios

| Scenario Type | Purpose | Pattern |
|--------------|---------|---------|
| **Smoke** | Verify works under minimal load | 1–5 VUs, 1 min |
| **Load** | Normal expected traffic | Target RPS, 5–10 min |
| **Stress** | Find breaking point | Ramp to 2–5x normal, 10 min |
| **Spike** | Sudden traffic burst | 0 → max → 0 in seconds |
| **Soak** | Memory leaks, degradation | Normal load, 1–4 hours |

### Step 3: Define Test Configuration

```javascript
// k6 load test
export const options = {
  scenarios: {
    load_test: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '2m', target: 50 },   // Ramp up
        { duration: '5m', target: 50 },   // Steady state
        { duration: '2m', target: 100 },  // Peak
        { duration: '1m', target: 0 },    // Ramp down
      ],
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<500', 'p(99)<1000'],
    http_req_failed: ['rate<0.01'],
    http_reqs: ['rate>100'],
  },
};
```

### Step 4: Generate Test Script (k6)

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

const BASE_URL = __ENV.BASE_URL || '[API_BASE_URL]';
const AUTH_TOKEN = __ENV.AUTH_TOKEN || '[TEST_TOKEN]';

const errorRate = new Rate('errors');
const latency = new Trend('request_latency');

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${AUTH_TOKEN}`,
};

export default function () {
  // Scenario: List resources
  const listRes = http.get(`${BASE_URL}/api/v1/resources`, { headers });
  check(listRes, {
    'list returns 200': (r) => r.status === 200,
    'list latency < 500ms': (r) => r.timings.duration < 500,
    'list returns array': (r) => JSON.parse(r.body).data.length >= 0,
  });
  errorRate.add(listRes.status !== 200);
  latency.add(listRes.timings.duration);

  sleep(1);

  // Scenario: Create resource
  const payload = JSON.stringify({
    name: `load-test-${Date.now()}`,
    type: 'test',
  });
  const createRes = http.post(`${BASE_URL}/api/v1/resources`, payload, { headers });
  check(createRes, {
    'create returns 201': (r) => r.status === 201,
    'create latency < 1000ms': (r) => r.timings.duration < 1000,
  });
  errorRate.add(createRes.status !== 201);

  sleep(1);
}
```

### Step 5: Add Data-Driven Testing

```javascript
import { SharedArray } from 'k6/data';
import papaparse from 'https://jslib.k6.io/papaparse/5.1.1/index.js';

const testData = new SharedArray('users', function () {
  return JSON.parse(open('./test-data.json'));
});

export default function () {
  const user = testData[__VU % testData.length];
  // Use user.id, user.email, etc. in requests
}
```

### Step 6: Add Cleanup (Optional)
```javascript
export function teardown(data) {
  // Clean up test data created during the load test
  http.del(`${BASE_URL}/api/v1/test-data/cleanup`, null, { headers });
}
```

### Step 7: Create Run Scripts
```bash
# Smoke test
k6 run --vus 5 --duration 1m load-test.js

# Load test
k6 run load-test.js

# Stress test (override VUs)
k6 run --stage 2m:200,5m:200,2m:0 load-test.js

# With environment variables
k6 run -e BASE_URL=https://staging.example.com -e AUTH_TOKEN=$TOKEN load-test.js
```

### Step 8: Document Thresholds
- [ ] p95 latency target: `<500ms`
- [ ] p99 latency target: `<1000ms`
- [ ] Error rate target: `<1%`
- [ ] Throughput target: `>100 RPS`
- [ ] Document what "pass" and "fail" mean for each threshold

## Rules
- **NEVER** run load tests against production without explicit approval
- **NEVER** hardcode credentials — use environment variables
- **ALWAYS** include think time (`sleep`) between requests to simulate real users
- **ALWAYS** include `check` assertions for response validation
- **ALWAYS** define thresholds (the test should pass/fail based on performance)
- Use test-specific API tokens, not production credentials
- Clean up test data after runs
- Start with smoke tests before running full load tests

## Completion
Load test script with scenarios, thresholds, data-driven testing, and run instructions. Ready to execute locally or in CI.

## If a Step Fails
- **Don't know expected load:** Start with smoke test, baseline current performance
- **Auth complexity:** Create a dedicated load-test user/token
- **Rate limiting blocks tests:** Coordinate with ops to allowlist test IP or increase limits
- **No staging environment:** Use a dedicated load-test environment, never hit production directly
