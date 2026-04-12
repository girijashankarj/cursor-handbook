---
name: complexity
description: Analyze cyclomatic complexity and cognitive complexity of functions in a file or module.
---

# Command: Complexity

## Invocation
`/complexity`

## Description
Analyze code complexity metrics for a file or directory to identify functions that are too complex and should be refactored.

## Parameters
- `target`: File path or directory to analyze (default: current file)
- `threshold`: Complexity threshold for warnings (default: 10)

## Action
1. Parse target file(s) for function/method definitions.
2. Calculate for each function:
   - **Cyclomatic complexity** — number of independent paths (if/else, switch, loops, ternary, catch)
   - **Cognitive complexity** — how hard it is for a human to understand (nesting depth, breaks in flow)
   - **Lines of code** — function length
   - **Parameter count** — input count
3. Output a sorted report, highest complexity first.

### Complexity Scale
| Score | Rating | Action |
|-------|--------|--------|
| 1–5 | Low | No action needed |
| 6–10 | Moderate | Monitor, refactor if adding features |
| 11–20 | High | Should refactor — split into smaller functions |
| 21+ | Critical | Must refactor before adding any changes |

## When to Use
- Before modifying a complex module
- During code review to flag hard-to-maintain code
- Tech debt assessment
- Finding refactoring targets

## Token Cost
~2–5K tokens

## Expected Output
- Table of functions sorted by complexity (highest first)
- Functions exceeding threshold highlighted
- Refactoring suggestions for the most complex functions

## Troubleshooting
- **Very large file:** Focus on functions above threshold only
- **Generated code:** Exclude `dist/`, `build/`, generated files from analysis
