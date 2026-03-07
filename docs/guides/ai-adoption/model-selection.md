# Model selection

Choosing the right model for the task helps balance quality, speed, and cost.

## Guidelines

- **Quick edits and formatting** — Use a faster, cheaper model when the task is simple and easy to verify.
- **Code review and design** — Use a more capable model when reasoning and consistency matter.
- **Large context** — Use a model with sufficient context window if you need to reference many files; otherwise keep context small and use a smaller model.

## Cursor models

Cursor offers several models; check Cursor’s docs for current names and limits. Prefer:

- Default or “fast” for: format, rename, simple tests, type fixes.
- “Pro” or “best” for: architecture, security review, refactors that touch many files.

## Token efficiency

Regardless of model, follow the token-efficiency rules: small prompts, scoped runs (e.g. single file), and summaries instead of full dumps. See `docs/guides/ai-adoption/token-efficiency.md`.
