---
name: dead-code
description: Find unused exports, functions, and variables in the codebase.
---

# Command: Dead Code

## Invocation
`/dead-code`

## Description
Scan the codebase for exported symbols that are never imported, unused functions, and unreachable code paths.

## Parameters
- `path`: Directory or file to scan (default: `{{CONFIG.paths.source}}`)
- `type`: What to find — `exports` (default), `functions`, `variables`, `all`

## Action
1. Collect all `export` statements across source files.
2. Search for import references to each exported symbol.
3. Report exports with zero import references (excluding entry points and public API).
4. Check for:
   - Exported functions never imported
   - Exported constants never used
   - Exported types/interfaces never referenced
   - Files with no external importers (orphan modules)

## When to Use
- Cleaning up after a refactor
- Reducing bundle size
- Tech debt cleanup sprints
- Before major releases

## Token Cost
~3–8K tokens (depends on codebase size)

## Expected Output
- List of unused exports with file paths
- Orphan modules (files imported by nothing)
- Estimated bundle savings

## Troubleshooting
- **False positives:** Entry points, dynamic imports, and plugin systems may show as unused
- **Large codebase:** Scope to specific directories with `path` parameter
- **Re-exports:** Follow re-export chains to find actual usage
