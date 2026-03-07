---
name: debug-issue
description: Structured workflow for debugging a reported or reproduced issue. Use when the user asks to debug a bug, find root cause, or fix a failing scenario.
---

# Skill: Debug issue

## Trigger
When the user asks to debug a bug, find the root cause, or fix a failing scenario.

## Steps

1. **Reproduce** — Run or describe steps to reproduce; capture error message and stack if any.
2. **Isolate** — Narrow to the smallest repro (single request, single file, single branch).
3. **Hypothesize** — List 2–3 likely causes (e.g. null input, wrong config, race).
4. **Verify** — Add a log, assertion, or minimal test to confirm one cause.
5. **Fix** — Apply minimal code change; add or update a test to prevent regression.
6. **Confirm** — Run type-check and relevant tests.

## Rules
- Do not change unrelated code.
- Prefer adding a test that fails before the fix and passes after.
