---
name: build
description: Run the project build (compile, bundle, or package). Use before deploying or after pulling changes.
---

# Command: Build

## Invocation
`/build`

## Description
Run the project build (compile, bundle, or package). Use the script from package.json or project config.

## Action
```bash
{{CONFIG.techStack.packageManager}} run build
```

## When to Use
- Before deploying
- After pulling changes
- To verify compilation succeeds

## Token Cost
—

## Expected Output
- **Success**: Build completes; output in `dist/`, `build/`, or similar
- **Failure**: Compilation errors with file, line, and message; exit code non-zero

## Troubleshooting
- **"Module not found"**: Run `{{CONFIG.techStack.packageManager}} install`; check node_modules
- **Out of memory**: Set `NODE_OPTIONS=--max-old-space-size=4096` for large bundles
- **Env-specific failures**: Ensure `.env` or env vars set; build may reference `process.env`

## Env Notes
- Requires `package.json` with `build` script
- Some builds need `NODE_ENV=production` for optimizations
