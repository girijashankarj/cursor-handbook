---
name: automation-helper
description: Design and create automation workflows — shell scripts, Cursor hooks, GitHub Actions, cron jobs, and task runners. Use when the user asks to automate a process, create a script, or set up a workflow.
---

# Skill: Automation Helper

Design and implement automation workflows for repetitive development tasks using shell scripts, Cursor hooks, GitHub Actions, or task runners.

## Trigger
When the user asks to automate a process, create a shell script, set up a GitHub Action, add a Cursor hook, or streamline a repetitive workflow.

## Prerequisites
- [ ] Clear understanding of the task to automate
- [ ] Target platform identified (local, CI, Cursor hook, cron)

## Steps

### Step 1: Identify Automation Type

| Type | Tool | Best For |
|------|------|----------|
| **Pre-commit check** | Cursor hook / husky | Lint, format, type-check before commit |
| **CI pipeline step** | GitHub Actions / GitLab CI | Build, test, deploy on push/PR |
| **Local task** | Shell script / Makefile | Dev environment setup, data seeding |
| **Scheduled job** | Cron / CloudWatch Events | Report generation, cleanup, backups |
| **IDE automation** | Cursor hook | Auto-format, auto-test, notifications |
| **Workflow orchestration** | GitHub Actions / scripts | Multi-step release, dependency updates |

### Step 2: Gather Requirements
- [ ] What triggers the automation? (manual, git event, schedule, file change)
- [ ] What inputs does it need? (files, env vars, user input)
- [ ] What does it produce? (files, logs, notifications, side effects)
- [ ] What are the failure modes? (missing deps, network errors, permissions)
- [ ] Should it be idempotent? (safe to re-run)

### Step 3: Design the Workflow
- [ ] Break into discrete steps (each step should do one thing)
- [ ] Identify dependencies between steps
- [ ] Define success/failure criteria for each step
- [ ] Plan error handling and rollback
- [ ] Determine logging and notification needs

### Step 4: Implement

#### Shell Script Template
```bash
#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*"; }
error() { log "ERROR: $*" >&2; exit 1; }

# Validate prerequisites
command -v node >/dev/null 2>&1 || error "node is required"

log "Starting [task name]..."

# Step 1: [description]
log "Step 1: [description]"
# implementation here

# Step 2: [description]
log "Step 2: [description]"
# implementation here

log "Done."
```

#### GitHub Actions Template
```yaml
name: [Workflow Name]
on:
  [trigger]:
    branches: [main]
    paths:
      - 'src/**'

jobs:
  [job-name]:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: [command]
```

#### Cursor Hook Template (`.cursor/hooks/`)
```bash
#!/usr/bin/env bash
set -euo pipefail

# Hook: [name]
# Trigger: [when this runs]
# Purpose: [what it does]

[implementation]
```

#### Makefile Template
```makefile
.PHONY: [target]

[target]: ## [description]
	@echo "Running [target]..."
	[command]
```

### Step 5: Add Error Handling
- [ ] Use `set -euo pipefail` in all bash scripts
- [ ] Add meaningful error messages with context
- [ ] Implement cleanup on failure (trap EXIT)
- [ ] Add retry logic for transient failures (network, rate limits)
- [ ] Log failures with enough context to debug

```bash
cleanup() {
  local exit_code=$?
  if [ $exit_code -ne 0 ]; then
    log "Script failed with exit code $exit_code"
    # cleanup actions here
  fi
}
trap cleanup EXIT
```

### Step 6: Add Documentation
- [ ] Header comment with purpose, trigger, prerequisites
- [ ] Usage examples in the script or README
- [ ] Document required environment variables
- [ ] Document expected inputs and outputs

### Step 7: Test the Automation
- [ ] Run manually with expected inputs
- [ ] Test failure scenarios (missing inputs, network errors)
- [ ] Test idempotency (run twice — same result)
- [ ] Verify logging output is useful
- [ ] Verify no secrets are logged or exposed

### Step 8: Wire Up the Trigger
- [ ] For hooks: add to `.cursor/hooks.json`
- [ ] For CI: add to `.github/workflows/` or `.gitlab-ci.yml`
- [ ] For cron: add crontab entry or CloudWatch rule
- [ ] For manual: add to `Makefile` or `package.json` scripts

## Rules
- **ALWAYS** use `set -euo pipefail` in bash scripts
- **ALWAYS** validate inputs and prerequisites before executing
- **NEVER** hardcode secrets — use environment variables
- **NEVER** use `rm -rf /` or other dangerous commands without safeguards
- **ALWAYS** add a `--dry-run` option for destructive operations
- Scripts must be idempotent unless explicitly documented otherwise
- Prefer `#!/usr/bin/env bash` over `#!/bin/bash` for portability

## Common Automations

| Automation | Implementation |
|-----------|---------------|
| Pre-commit lint + type-check | Cursor hook or husky |
| Auto-generate changelog | Shell script on release branch |
| Dependency update check | GitHub Actions scheduled weekly |
| Database backup | Cron job with rotation |
| Dev environment setup | `make setup` or `scripts/setup.sh` |
| Release tagging | Shell script + GitHub Actions |
| Stale branch cleanup | GitHub Actions scheduled monthly |

## Completion
Working automation with error handling, documentation, and trigger wired up. Tested manually at minimum.

## If a Step Fails
- **Missing command:** Check prerequisites and add installation step
- **Permission denied:** Verify `chmod +x` on scripts and IAM/role permissions for CI
- **Flaky in CI:** Add retries, increase timeouts, check for race conditions
- **Too slow:** Parallelize independent steps, cache dependencies
