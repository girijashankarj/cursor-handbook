---
name: sql-explain
description: Explain a SQL query's execution plan and suggest performance optimizations.
---

# Command: SQL Explain

## Invocation
`/sql-explain`

## Description
Analyze a SQL query, explain its execution plan in plain English, identify performance issues, and suggest optimizations (indexes, rewrites, restructuring).

## Parameters
- `query`: The SQL query to analyze
- `table-info`: Optional table structure or row count context

## Action
1. Parse the SQL query structure.
2. Identify potential performance issues:
   - **Full table scans** — missing index on WHERE/JOIN columns
   - **N+1 patterns** — subqueries that could be JOINs
   - **SELECT *** — fetching unnecessary columns
   - **Missing LIMIT** — unbounded result sets
   - **Implicit type casts** — preventing index usage
   - **OR conditions** — often prevent index usage
   - **Non-SARGable predicates** — functions on indexed columns
3. Suggest optimizations:
   - Index recommendations
   - Query rewrites
   - Denormalization suggestions (if appropriate)
4. Provide the `EXPLAIN ANALYZE` command to run for actual execution plan.

## When to Use
- Debugging slow queries
- Reviewing SQL in code reviews
- Before deploying new queries to production
- Optimizing database performance

## Token Cost
~2–5K tokens

## Expected Output
- Plain-English explanation of what the query does
- Performance issues identified with severity
- Suggested indexes with `CREATE INDEX` statements
- Rewritten query (if optimization found)
- `EXPLAIN ANALYZE` command to verify

## Troubleshooting
- **No table info:** Suggestions based on query structure alone; actual EXPLAIN needed for precise analysis
- **ORM-generated query:** Suggest ORM-level optimizations (eager loading, select fields)
- **Complex joins:** Break down execution order step by step
