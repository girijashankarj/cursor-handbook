---
name: automate
description: Quickly scaffold a shell script, GitHub Action, or Cursor hook for a described automation task.
---

# Command: Automate

## Invocation
`/automate`

## Description
Generate a ready-to-use automation script or workflow from a brief description of the task to automate.

## Parameters
- `task`: Description of what to automate (e.g., "lint and type-check before commit")
- `type`: Output type — `script` (default), `github-action`, `cursor-hook`, `makefile`

## Action
1. Parse the task description to identify trigger, inputs, steps, and outputs.
2. Generate the automation in the requested format:
   - **script:** Bash script with `set -euo pipefail`, logging, error handling
   - **github-action:** Complete workflow YAML with trigger, jobs, steps
   - **cursor-hook:** Hook script + `hooks.json` entry
   - **makefile:** Makefile target with phony declaration
3. Include error handling, prerequisites validation, and usage documentation.

## When to Use
- Automating a repetitive development task
- Setting up a CI step quickly
- Creating a pre-commit or post-save hook
- Generating a project task runner target

## Token Cost
~3–6K tokens

## Expected Output
- Complete, runnable automation file
- Instructions for where to save and how to activate
- Prerequisites and required permissions noted

## Troubleshooting
- **Complex multi-step task:** Use the full `automation-helper` skill instead
- **Needs secrets:** Output env var references, remind to configure in CI secrets
