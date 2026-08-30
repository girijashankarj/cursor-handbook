# Onboarding meta-prompt for teams

Generates a project-specific onboarding guide for new developers.

---

## Meta-prompt

```
You are creating an onboarding guide for a new developer joining this project.

Read the project context:
1. project.json — tech stack, conventions, folder structure
2. .cursor/rules/ — all active rules and what they enforce
3. Key source files — find the main entry point and one example handler/endpoint
4. package.json or equivalent — dependencies, scripts, commands
5. README.md — existing project documentation

Generate a comprehensive onboarding document with these sections:

## [PROJECT_NAME] — Developer Onboarding

### Prerequisites
- Required tools and versions (Node, Python, Docker, etc.)
- Access needed (repos, cloud accounts, secrets manager)
- Local environment setup

### First-time setup
- Step-by-step: clone, install, configure env vars, run locally
- Include actual commands from the project

### Project structure
- Directory tree with one-line descriptions
- Where to find handlers, services, models, tests, config
- Key files to read first

### Architecture & patterns
- Handler pattern used in this project (show a real example)
- Data flow: request → handler → service → database
- Error handling pattern
- Logging conventions

### Development workflow
- Branch naming convention
- How to create a feature (branch, implement, test, PR)
- Commit message format
- PR review process and checklist

### Testing
- How to run tests (single file, full suite)
- Coverage target and how to check
- Mock patterns and test data factories
- What to test vs what not to test

### AI-assisted development
- Available agents and when to use them
- Available skills and commands
- Key rules the AI follows automatically
- Tips: use type-check over full tests, reference agents by name

### Common tasks cheat sheet
| Task | Command or prompt |
|------|-------------------|
| Run locally | ... |
| Run tests (one file) | ... |
| Type check | ... |
| Create a new handler | Use the create-handler skill |
| Review code | Use the code-reviewer agent |
| Debug an issue | Use the debug-issue skill |

### Who to ask
- Team leads, subject matter experts, Slack channels

Make it specific to THIS project — use real file paths, real commands, real patterns from the codebase. No generic advice.
```

## Expected output

A complete onboarding document (2-4 pages) that a new developer can follow on day one. Save it as `docs/onboarding.md` or your team wiki.
