# Skill: OpenSearch

## Description
Workflow for OpenSearch (or Elasticsearch) usage: indexing, search, mappings, and simple tuning.

## Trigger
When the user asks about OpenSearch/Elasticsearch indexing, search queries, or mapping design.

## Steps

1. **Clarify** — Identify use case (full-text search, filters, aggregations, logging).
2. **Mapping** — Propose or review index mapping (keyword vs text, date, nested) per use case.
3. **Query** — Write or adjust query (query DSL or simple term/match); prefer parameterized inputs.
4. **Operational** — Mention index lifecycle, refresh, and sizing if relevant.

## Rules
- Do not expose real cluster URLs or credentials; use placeholders.
- Follow project security rules (no secrets in code, env vars for endpoints).
