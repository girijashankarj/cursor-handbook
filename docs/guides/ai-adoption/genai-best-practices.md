# GenAI best practices

General practices for LLM-assisted development.

## Prompting

- **Be specific** — Name the file, function, or behavior you want changed.
- **One task per prompt** — Easier to verify and iterate.
- **Provide context** — "In this handler, add validation for X" is better than "add validation."
- **Ask for minimal change** — "Fix this function" or "Add a test for this branch" keeps outputs small.

## Code quality

- **Review all generated code** — Treat AI output as a draft; check logic, edge cases, and security.
- **Run type-check and tests** — Don’t assume generated code compiles or passes tests.
- **Prefer project patterns** — Use rules and skills so the AI follows your handler pattern, logging, and style.

## Cost and latency

- **Prefer type-check over full test run** — For quick validation, type-check is cheaper than running the whole suite.
- **Single-file or scoped tests** — Run tests for the file you changed when possible.
- **Avoid huge context** — Don’t paste entire codebases; point to files or paste relevant snippets.

## Security

- **No secrets in prompts or logs** — Don’t paste API keys, tokens, or credentials.
- **Validate generated code** — Especially for auth, SQL, or file handling; ensure parameterization and input checks.
