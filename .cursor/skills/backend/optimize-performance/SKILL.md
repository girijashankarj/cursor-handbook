# Skill: Optimize performance

## Description
Workflow for identifying and applying backend performance improvements.

## Trigger
When the user asks to optimize, speed up, or reduce latency of an endpoint or function.

## Steps

1. **Measure** — Identify the slow path (endpoint, query, or function); use existing metrics or add a quick timing log.
2. **Profile** — Pinpoint bottleneck (DB query, N+1, CPU, I/O); avoid guessing.
3. **Design** — Propose 1–2 concrete changes (index, batch, cache, algorithm); prefer smallest change first.
4. **Implement** — Apply the change; keep the same behavior.
5. **Verify** — Re-run the scenario and confirm improvement; run existing tests.

## Rules
- Do not optimize without measuring first.
- Prefer indexing and query changes over application-level hacks.
- Follow project query patterns (parameterized, soft delete, pagination).
