# Command: Lint fix (backend)

Auto-fix lint issues in backend code.

## Instructions

1. Run the project lint-fix command (e.g. `npm run lint -- --fix` or `eslint --fix`).
2. Restrict to backend/source paths; do not fix generated or vendor files.
3. If the tool reports unfixable errors, list them and suggest manual edits.

## Scope

- Backend/source directories only.
- Prefer safe fixes (formatting, unused imports); avoid changing behavior.
