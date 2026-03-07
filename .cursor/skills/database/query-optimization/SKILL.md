# Skill: Optimize Database Query

## Description
Workflow for identifying and fixing slow database queries.

## Trigger
When a query is slow or user asks to optimize database performance.

## Steps

### Step 1: Identify Slow Query
- [ ] Get the query text
- [ ] Measure current execution time
- [ ] Check query frequency (how often it runs)

### Step 2: Analyze Query Plan
- [ ] Run EXPLAIN ANALYZE on the query
- [ ] Identify sequential scans on large tables
- [ ] Check for missing indexes
- [ ] Look for unnecessary joins or subqueries
- [ ] Check sort operations (external sorts)

### Step 3: Optimize
Common optimizations:
- [ ] Add missing indexes
- [ ] Rewrite subqueries as JOINs
- [ ] Add WHERE clause filters to reduce data
- [ ] Use cursor-based pagination instead of OFFSET
- [ ] Add partial indexes for filtered queries
- [ ] Denormalize if read performance is critical

### Step 4: Benchmark
- [ ] Run optimized query with EXPLAIN ANALYZE
- [ ] Compare before/after execution times
- [ ] Test with production-like data volume
- [ ] Verify results are identical

### Step 5: Implement
- [ ] Update query in code
- [ ] Create migration for new indexes
- [ ] Add monitoring for the query
- [ ] Update any affected tests

## Completion
Query optimized with measurable improvement and monitoring in place.
