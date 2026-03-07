# Tech stacks

cursor-handbook is designed to be stack-agnostic; `config/project.json` defines your stack so rules and skills can reference it.

## Supported stacks (examples)

Examples in `examples/` include:

- **TypeScript** — Express, NestJS
- **Python** — FastAPI
- **Go** — Chi
- **React / Next.js** — Frontend
- **Flutter** — Mobile
- **Kotlin** — Spring
- **Rust** — Actix

## Config keys

In `project.json`, set:

- `techStack.language` — e.g. TypeScript, Python, Go
- `techStack.framework` — e.g. Express, FastAPI, Chi
- `techStack.database` — e.g. PostgreSQL, MongoDB
- `techStack.testing` — e.g. Jest, pytest
- `techStack.linter` — e.g. ESLint, Ruff
- `techStack.packageManager` — e.g. npm, pnpm, yarn

Rules may branch on these (e.g. backend handler pattern for Node vs Go). See `docs/reference/configuration-reference.md` for the full schema.
