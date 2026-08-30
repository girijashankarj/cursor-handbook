# Sample Prompts

Ready-to-use prompts for common development workflows with cursor-handbook. Copy, paste, and adapt to your project.

## Structure

| Directory | Purpose |
|-----------|---------|
| `prompts/` | Single-use prompts you paste into Cursor chat for a specific task |
| `meta-prompts/` | Team-level templates that generate custom prompts for your project context |

## How to use

### Single prompts (`prompts/`)

1. Open the prompt file for your task (e.g. `onboarding.md`)
2. Copy the prompt text
3. Paste into Cursor chat and adjust placeholders (`[YOUR_MODULE]`, `[YOUR_FILE]`)
4. Run and iterate

### Meta-prompts (`meta-prompts/`)

Meta-prompts are "prompts that generate prompts." Use them when:

- You want a prompt customized to your specific project, team, or codebase
- You need to generate onboarding guides, review checklists, or workflow docs at scale
- You want to create reusable templates your whole team can share

1. Open the meta-prompt file (e.g. `onboarding-meta-prompt-for-teams.md`)
2. Copy the prompt into Cursor chat
3. The AI will generate a tailored prompt or document for your project
4. Save the output as a team resource

## Prompt index

| Task | Single prompt | Meta-prompt |
|------|--------------|-------------|
| Onboarding | [onboarding](prompts/onboarding.md) | [onboarding-meta](meta-prompts/onboarding-meta-prompt-for-teams.md) |
| Daily development | [daily-development](prompts/daily-development.md) | [daily-dev-meta](meta-prompts/daily-development-meta-prompt-for-teams.md) |
| New feature/handler | [new-feature-handler](prompts/new-feature-handler.md) | [new-feature-meta](meta-prompts/new-feature-handler-meta-prompt-for-teams.md) |
| PR code review | [pr-code-review](prompts/pr-code-review.md) | [pr-review-meta](meta-prompts/pr-code-review-meta-prompt-for-teams.md) |
| Testing & quality | [testing-quality](prompts/testing-quality.md) | [testing-meta](meta-prompts/testing-quality-meta-prompt-for-teams.md) |
| Security compliance | [security-before-commit](prompts/security-before-commit.md) | [security-meta](meta-prompts/security-compliance-before-commit-meta-prompt-for-teams.md) |
| Troubleshooting | [troubleshooting-debug](prompts/troubleshooting-debug.md) | [troubleshooting-meta](meta-prompts/troubleshooting-debug-meta-prompt-for-teams.md) |
| Customizing config | [customizing-config](prompts/customizing-config.md) | [config-meta](meta-prompts/customizing-config-meta-prompt-for-teams.md) |
| Replicate .cursor folder | [replicate-cursor-folder](prompts/replicate-cursor-folder.md) | [cursor-folder-meta](meta-prompts/cursor-folder-meta-prompt-for-teams.md) |
| Replicate docs | [replicate-docs](prompts/replicate-docs.md) | [docs-meta](meta-prompts/documentation-meta-prompt-for-teams.md) |
