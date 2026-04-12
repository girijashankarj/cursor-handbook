# Cursor Component Enrichment Checklist

Use this checklist when enriching `.cursor` components. Stay concise per [token-efficiency](../../.cursor/rules/architecture/token-efficiency.mdc): bullet points, short examples, no paragraphs.

## Principles

- **Actionable over explanatory** — Add checklists, examples, anti-patterns; avoid long prose
- **Token-aware** — Keep additions tight; use tables and bullets; max 1–2 line code snippets
- **Cross-reference** — Link to related rules, skills, or docs where helpful
- **Fail-safe** — Add "If X fails" / troubleshooting where relevant

---

## Rules (.mdc)

| Section | Add |
|---------|-----|
| **Anti-patterns** | 3–5 "Don't do this" items with 1-line code examples |
| **Examples** | 1–2 before/after snippets (good vs bad) |
| **Edge cases** | Brief list of boundary conditions to handle |
| **Related** | Links to skills or other rules (e.g. `@create-handler`) |

---

## Agents (.md)

| Section | Add |
|---------|-----|
| **Example output** | 1 short sample of ideal agent response |
| **Common mistakes** | 3–5 things to avoid when using this agent |
| **Token tips** | When to scope down (e.g. "Review single file, not whole module") |
| **Related agents** | 1–2 agents to use before/after |

---

## Skills (SKILL.md)

| Section | Add |
|---------|-----|
| **If step fails** | Per-step troubleshooting |
| **Examples** | 1 concrete example per major step |
| **Prerequisites** | Explicit checks (e.g. "package.json exists", "config loaded") |
| **Completion checklist** | Final verification list |

---

## Commands (.md)

| Section | Add |
|---------|-----|
| **Troubleshooting** | 2–3 common errors and fixes |
| **Expected output** | Success and failure examples |
| **Env notes** | Any env vars or config needed |

---

## Hooks (shell scripts)

| Enhancement | Add |
|-------------|-----|
| **Package managers** | Support pnpm/yarn where relevant |
| **Error messages** | Clear exit messages for common failures |
| **Comments** | Brief header describing purpose and usage |
