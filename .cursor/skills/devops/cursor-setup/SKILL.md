---
name: cursor-setup
description: Set up cursor-handbook in a new project by cloning, configuring, and validating the .cursor directory. Use when the user asks to install cursor-handbook, set up a new project, or bootstrap Cursor configuration.
---

# Skill: Cursor Setup

Bootstrap cursor-handbook in any project — clone the repo, configure project settings, and validate the installation.

## Trigger
When the user asks to set up cursor-handbook in a new project, install the Cursor configuration, or bootstrap the `.cursor/` directory.

## Prerequisites
- [ ] `git` installed
- [ ] Target project directory exists
- [ ] No conflicting `.cursor/` directory (or user consents to backup)

## Usage

Run the bundled script from the target project root:

```bash
scripts/setup-cursor.sh
```

### Environment Variables
- `CURSOR_CONFIG_REPO` — Override the default repository URL (optional)

## Steps

### Step 1: Check Prerequisites
- [ ] Verify `git` is installed
- [ ] Check if `.cursor/` already exists
- [ ] If exists, ask user whether to back up and replace

### Step 2: Run Setup
- [ ] Execute `scripts/setup-cursor.sh` using the Shell tool
- [ ] The script will:
  1. Back up existing `.cursor/` if needed
  2. Clone cursor-handbook into `.cursor/`
  3. Copy `project.json.template` to `project.json`
  4. Make hook scripts executable

### Step 3: Configure Project
- [ ] Open `.cursor/config/project.json`
- [ ] Guide the user to fill in:
  - `project.name` — project identifier
  - `techStack.language` — primary language (typescript, python, go, etc.)
  - `techStack.framework` — framework (express, fastify, django, etc.)
  - `techStack.database` — database (postgresql, mysql, mongodb, etc.)
  - `techStack.cloud` — cloud provider (aws, gcp, azure)
  - `paths.source` — source code root (e.g., `src/`)
- [ ] Replace all `{{PLACEHOLDER}}` values

### Step 4: Validate Installation
- [ ] Run the handbook validator to check structure
- [ ] Verify at least one `.mdc` rule exists
- [ ] Verify `project.json` has no remaining placeholders

### Step 5: Post-Setup
- [ ] Remind user to restart Cursor IDE
- [ ] Suggest testing with a quick command (e.g., `/type-check`)
- [ ] Point to `docs/getting-started/quick-start.md` for detailed guidance

## Rules
- **NEVER** overwrite `.cursor/` without user confirmation
- **ALWAYS** back up existing configuration before replacing
- **NEVER** hardcode repository credentials in the script
- The setup script is idempotent with user consent for overwrite

## Completion
cursor-handbook installed, `project.json` configured, and structure validated. User can restart Cursor and begin using commands and skills.

## If a Step Fails
- **Git not installed:** Direct user to install git
- **Clone fails:** Check network connectivity and repository URL
- **Backup fails:** Check disk space and permissions
- **No template found:** Create a minimal `project.json` manually
