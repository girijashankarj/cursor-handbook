# PR code review prompt

Use this when reviewing a pull request for correctness, security, and style.

---

## Prompt

```
Review this PR / these changes for:

1. **Correctness** — Logic bugs, edge cases, null/undefined handling, off-by-one errors
2. **Security** — Hardcoded secrets, PII in logs, SQL injection, missing auth checks, input validation
3. **Performance** — N+1 queries, missing indexes, unbounded loops, large payloads
4. **Patterns** — Does it follow the handler pattern? Are types in the right place? Is logging structured?
5. **Tests** — Are there tests for the new code? Do they cover error cases? Proper mocking?

Files to review:
[LIST_FILES_OR_DIFF]

For each issue found, provide:
- Severity: critical / warning / suggestion
- File and line
- What's wrong
- How to fix it

Skip style-only comments. Focus on bugs, security, and correctness.
```

## Quick review variant

```
Quick review [FILE_PATH] — focus only on bugs and security issues. Skip style.
```

## Placeholders

| Placeholder | Replace with |
|-------------|-------------|
| `[LIST_FILES_OR_DIFF]` | File paths, or paste the diff output |
| `[FILE_PATH]` | Single file to review |

## Tip

Reference the `code-reviewer` agent for structured output: "Use the code-reviewer agent to review this PR."
