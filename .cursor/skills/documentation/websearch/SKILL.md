---
name: websearch
description: Use web search to find current documentation, best practices, or version-specific information. Use when the user asks about library versions or recent API changes.
---

# Skill: Web search

## Trigger
When the user asks about a library version, recent API change, or "latest way to do X" and the answer may have changed.

## Steps

1. **Query** — Form a short search query (library name, version, and topic).
2. **Search** — Use the web search tool to fetch 1–2 authoritative results (official docs, release notes).
3. **Synthesize** — Summarize the finding and cite the source; apply to the user’s codebase if relevant.
4. **Caveat** — Note if the result is version-specific or may vary by environment.

## Rules
- Prefer official docs and release notes over random blog posts.
- Do not paste long copied text; summarize and link.

## Prerequisites
- [ ] Web search tool available
- [ ] User question is version- or time-sensitive (e.g. "latest", "React 19", "Node 22")

## Completion Checklist
- [ ] Query used and source cited
- [ ] Summary in 2–4 sentences
- [ ] Version or date caveat if applicable

## If Step Fails
- **No results**: Broaden query (e.g. "React useEffect" instead of "React 19 useEffect")
- **Outdated result**: Add "as of [date]" or "check latest docs"
- **Conflicting info**: Prefer official docs; note disagreement

## Example
Query: "Express 5 migration guide". Result: Express 5 release notes, breaking changes. Summary: async handlers, req.query changes. Caveat: Express 5.x as of 2025.
