# Contribution Examples

Concrete examples of adding rules, skills, and commands to cursor-handbook. Each follows the [Contributing](https://github.com/girijashankarj/cursor-handbook/blob/main/CONTRIBUTING.md) guidelines.

---

## Example 1: Changelog & Release Notes (DevOps)

**Branch:** `feat/add-changelog-and-release-notes`

**What was added:**
- **Rule** `rules/devops/changelog.mdc` — Keep a Changelog format, SemVer, content rules
- **Command** `/changelog` — Generate changelog from recent git commits
- **Skill** `skills/devops/release-notes/` — Guided workflow for drafting release notes

**Why it helps:** Teams cut releases often; having AI follow changelog standards and draft notes from commits saves time.

**Files changed:** New rule, command, skill; update `COMPONENT_INDEX.md` and `README.md` counts.

---

## Example 2: Test Naming & Flaky Tests (Testing)

**Branch:** `feat/add-test-naming-and-flaky-skill`

**What to add:**
- **Rule** `rules/testing/test-naming.mdc` — Enforce `should {behavior} when {condition}` pattern; ban vague names like `test1`
- **Skill** `skills/testing/flaky-test/SKILL.md` — Steps to diagnose and fix flaky tests (retries, timing, isolation)

**Why it helps:** Consistent test names improve readability; flaky tests waste CI time and are hard to debug without a process.

**Files to create:**
- `.cursor/rules/testing/test-naming.mdc`
- `.cursor/skills/testing/flaky-test/SKILL.md`
- Update `COMPONENT_INDEX.md` and `README.md`

---

## Example 3: Dependency Update Workflow (Backend)

**Branch:** `feat/add-dependency-update-skill`

**What to add:**
- **Rule** `rules/architecture/dependency-updates.mdc` — When to update (patch vs minor vs major); security update SLA
- **Skill** `skills/backend/dependency-update/SKILL.md` — Steps: check changelog, run tests, update lockfile, verify no breaking changes

**Why it helps:** Dependency updates are routine but risky; a structured workflow reduces regressions.

**Files to create:**
- `.cursor/rules/architecture/dependency-updates.mdc`
- `.cursor/skills/backend/dependency-update/SKILL.md`
- Update `COMPONENT_INDEX.md` and `README.md`

---

## Example 4: API Versioning (Backend)

**Branch:** `feat/add-api-versioning-rule`

**What to add:**
- **Rule** `rules/backend/api-versioning.mdc` — URL versioning (`/api/v1/`), deprecation headers, sunset policy
- **Command** `/api-version-check` — List endpoints by version; flag deprecated ones

**Why it helps:** API versioning is easy to get wrong; a rule keeps behavior consistent across services.

**Files to create:**
- `.cursor/rules/backend/api-versioning.mdc`
- `.cursor/commands/backend/api-version-check.md`
- Update `COMPONENT_INDEX.md` and `README.md`

---

## Example 5: Documentation Sync (Documentation)

**Branch:** `feat/add-doc-sync-skill`

**What to add:**
- **Skill** `skills/documentation/doc-sync/SKILL.md` — Steps: compare code to docs, list drift, suggest updates for README/OpenAPI/JSDoc

**Why it helps:** Docs drift from code over time; a repeatable workflow keeps them aligned.

**Files to create:**
- `.cursor/skills/documentation/doc-sync/SKILL.md`
- Update `COMPONENT_INDEX.md` and `README.md`

---

## Workflow Summary

For each example:

1. **Branch:** `git checkout -b feat/your-feature-name`
2. **Add components** following [Component Guidelines](https://github.com/girijashankarj/cursor-handbook/blob/main/CONTRIBUTING.md#component-guidelines)
3. **Update** `COMPONENT_INDEX.md` (add new entries, bump counts)
4. **Update** `README.md` (badge, tables, any references)
5. **Commit:** `feat(scope): add X rule, Y skill`
6. **Push:** `git push -u origin feat/your-feature-name`
7. **PR:** Open a pull request with a clear description

Run `./scripts/generate-component-index.sh` before committing to verify counts match.
