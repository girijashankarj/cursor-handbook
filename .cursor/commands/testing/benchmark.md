---
name: benchmark
description: Create a micro-benchmark for a function to measure performance with statistical analysis.
---

# Command: Benchmark

## Invocation
`/benchmark`

## Description
Generate a benchmark script for a function or code path, measuring execution time with multiple iterations and statistical summary.

## Parameters
- `target`: Function name or file path to benchmark
- `iterations`: Number of iterations (default: 1000)
- `warmup`: Warmup iterations (default: 100)

## Action
1. Read the target function to understand inputs and outputs.
2. Generate a benchmark script:
   - Warmup phase (JIT optimization, cache warming)
   - Measurement phase with `performance.now()` or `process.hrtime.bigint()`
   - Statistical summary: min, max, mean, median, p95, p99, stddev
3. Include comparison template for before/after benchmarking.

```typescript
const results: number[] = [];

// Warmup
for (let i = 0; i < WARMUP; i++) {
  targetFunction(testInput);
}

// Measure
for (let i = 0; i < ITERATIONS; i++) {
  const start = performance.now();
  targetFunction(testInput);
  results.push(performance.now() - start);
}

// Report
results.sort((a, b) => a - b);
console.table({
  min: results[0].toFixed(3) + 'ms',
  max: results[results.length - 1].toFixed(3) + 'ms',
  mean: (results.reduce((a, b) => a + b) / results.length).toFixed(3) + 'ms',
  median: results[Math.floor(results.length / 2)].toFixed(3) + 'ms',
  p95: results[Math.floor(results.length * 0.95)].toFixed(3) + 'ms',
  p99: results[Math.floor(results.length * 0.99)].toFixed(3) + 'ms',
});
```

## When to Use
- Before and after performance optimization
- Comparing two implementations
- Establishing performance baselines
- Validating that changes don't regress performance

## Token Cost
~2–4K tokens

## Expected Output
- Runnable benchmark script
- Instructions for before/after comparison
- Guidance on interpreting results

## Troubleshooting
- **Inconsistent results:** Increase iterations, close other programs, run multiple times
- **Too fast to measure:** Use `process.hrtime.bigint()` for nanosecond precision
- **I/O bound function:** Measure wall-clock time, note that variance will be higher
