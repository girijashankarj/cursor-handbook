---
name: task-master
description: Break a high-level request into ordered, actionable tasks. Use when the user asks to break down into tasks, create a plan, or list steps.
---

# Skill: Task master

## Trigger
When the user asks to "break this down into tasks," "create a plan," or "what are the steps."

## Steps

1. **Scope** — Restate the goal in one sentence.
2. **List tasks** — Output 5–15 ordered tasks (each actionable in 1–2 hours); dependencies first.
3. **Optional** — For each task: owner placeholder, acceptance criteria, or link to doc.
4. **Summary** — One-line summary and suggested order (sequential vs parallel where possible).

## Rules
- Tasks should be concrete (e.g. "Add validation in create-order handler" not "Improve API").
- Do not execute the tasks unless the user asks to implement one.
