---
name: handbook-validator
description: Validate cursor-handbook structure, config, and component integrity. Use when the user asks to validate the setup, check for issues, or verify the handbook installation.
---

# Skill: Handbook Validator

Validate that the cursor-handbook structure is correct, configuration is present, and components are well-formed.

## Trigger
When the user asks to validate the handbook, check the setup, verify configuration, or troubleshoot missing components.

## Prerequisites
- [ ] Inside a project with `.cursor/` directory

## Usage

Run the bundled script from the project root:

```bash
scripts/validate.sh
```

## Steps

### Step 1: Run Basic Validation
- [ ] Execute `scripts/validate.sh` using the Shell tool
- [ ] Capture pass/fail output
- [ ] The script checks:
  - `.cursor/` directory exists
  - `project.json` or `project.json.template` present
  - `hooks.json` present
  - At least one `.mdc` rule file exists

### Step 2: Extended Validation (if basic passes)
- [ ] Check for unresolved `{{PLACEHOLDER}}` values in `project.json`
- [ ] Verify all skill folders contain a `SKILL.md`
- [ ] Verify all agent files have a title and description
- [ ] Check that hook scripts referenced in `hooks.json` exist and are executable
- [ ] Verify `.mdc` rule files have valid frontmatter (`description`, `globs`, or `alwaysApply`)

### Step 3: Report Results
- [ ] Present a summary table:

| Check | Status | Details |
|-------|--------|---------|
| `.cursor/` exists | PASS/FAIL | — |
| `project.json` configured | PASS/WARN | Placeholder count |
| Rules present | PASS/FAIL | Count of `.mdc` files |
| Skills valid | PASS/WARN | Count with/without `SKILL.md` |
| Hooks wired | PASS/WARN | Missing scripts |

### Step 4: Suggest Fixes
- [ ] For each FAIL/WARN, provide a specific fix action
- [ ] Prioritize: FAIL items first, then WARN items
- [ ] Offer to auto-fix simple issues (e.g., create missing `project.json` from template)

## Rules
- **NEVER** modify files without user confirmation
- Report all issues, don't stop at the first failure
- Distinguish between FAIL (blocking) and WARN (advisory)

## Completion
Validation report with clear pass/fail status for each check and actionable fix suggestions for any issues found.

## If a Step Fails
- **`.cursor/` not found:** Suggest running the `cursor-setup` skill to bootstrap
- **No rules found:** Suggest copying from examples or running setup
- **Permission errors:** Check file permissions with `ls -la`
