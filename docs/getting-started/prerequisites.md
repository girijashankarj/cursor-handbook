# Prerequisites

Before using cursor-handbook you need:

## Required

- **Cursor IDE** — [cursor.sh](https://cursor.sh/) installed and signed in.
- **Git** — For cloning the handbook and for hooks that run on commit.
- **Project** — A codebase where you’ll add the `.cursor` configuration.

## Optional (by use case)

- **Node.js / npm** — If your project uses TypeScript/JavaScript and you use type-check, lint, or test commands.
- **Prettier / ESLint** — For format and lint hooks and commands.
- **Python / Black** — If you use Python and the format hook for `.py` files.

## Permissions

- Write access to the project directory so Cursor can create or update `.cursor` and run hooks.
- If hooks fail with "Permission denied", run: `chmod +x .cursor/hooks/*.sh`
