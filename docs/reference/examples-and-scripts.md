# Examples and scripts

## Examples

The `examples/` directory contains sample `project.json` files for different tech stacks (e.g. typescript-express, python-fastapi, react, go-chi). Use them as a starting point for `config/project.json`.

| Example       | Use case                    |
|---------------|-----------------------------|
| typescript-express | Node/Express API         |
| typescript-nest   | NestJS API               |
| python-fastapi    | FastAPI backend          |
| go-chi            | Go Chi router            |
| react             | React frontend           |
| nextjs            | Next.js                  |
| flutter           | Flutter app              |
| kotlin-spring     | Kotlin/Spring            |
| rust-actix        | Rust Actix web           |

## Scripts

| Script / Command     | Purpose                          |
|----------------------|-----------------------------------|
| `make init`          | One-command setup: copies handbook config to `project.json` (or runs interactive generator) |
| `make verify`        | Run validation and component count check |
| `scripts/setup-cursor.sh` | One-time setup for Cursor config |
| `scripts/init-project-config.sh` | Interactive project.json generator; prompts for key values and creates config from template |
| `scripts/validate.sh`    | Validate config and structure    |
| `scripts/count-tokens.sh` | Estimate token usage (if present) |
| `scripts/generate-changelog.sh` | Generate changelog          |
| `scripts/search-components.sh`  | Search rules/agents/skills  |

Run from the project root. Add execution permission if needed: `chmod +x scripts/*.sh`.
