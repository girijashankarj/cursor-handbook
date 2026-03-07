# Skills

Skills are step-by-step workflows defined in `.cursor/skills/` as `SKILL.md` files. They guide the AI through multi-step tasks (e.g. create handler, run code review, create migration, fix tests).

## Usage

- Skills are loaded when the user's request matches the skill's trigger (e.g. "create a new API handler").
- The AI follows the steps and checklists in the skill instead of ad-hoc behavior.

## Structure

Skills are grouped by domain:

- **backend/** — code-review, create-handler, debug-issue, optimize-performance
- **cloud/** — infrastructure, aws-cost-estimator, opensearch
- **database/** — migration, query-optimization, create-migration
- **devops/** — ci-cd, monitoring, task-master, setup-monitoring
- **documentation/** — api-docs, architecture-docs, websearch
- **frontend/** — component-creation, state-management
- **testing/** — fix-tests, coverage-improvement

Each `SKILL.md` describes the trigger, prerequisites, and ordered steps with optional code snippets.
