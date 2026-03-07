# BugBot custom rules

These rules are used by **Cursor BugBot** (Cursor's PR review feature) when reviewing pull requests. BugBot reads this file from `.cursor/BUGBOT.md`. See [Cursor BugBot docs](https://cursor.com/docs/bugbot) for setup and more rule examples.

---

## Security: No hardcoded secrets

If any changed file contains patterns like `password\s*=\s*['\"][^'\"]+['\"]`, `api[_-]?key\s*=\s*['\"][^'\"]+['\"]`, `secret\s*=\s*['\"][^'\"]+['\"]`, or `token\s*=\s*['\"][^'\"]+['\"]` (literal string assignments), then:
- Add a blocking Bug with title "Possible hardcoded secret" and body: "Do not commit secrets. Use environment variables or a secrets manager. Remove the value and reference via process.env or config."
- Apply label "security".

---

## Security: No eval or dangerous dynamic execution

If any changed file contains the string pattern `/\beval\s*\(|\bexec\s*\(|new Function\s*\(/i`, then:
- Add a blocking Bug with title "Dangerous dynamic execution" and body: "Usage of eval/exec/new Function was found. Replace with safe alternatives or justify with a detailed comment and security review."
- Apply label "security".

---

## Database: Parameterized queries only (no string concatenation in SQL)

If any changed file contains SQL or query strings built with `+`, template literals, or `.replace()` that include user or variable input in the same expression as `SELECT`, `INSERT`, `UPDATE`, `DELETE`, or `FROM`, then:
- Add a blocking Bug with title "SQL may be vulnerable to injection" and body: "Use parameterized queries or a query builder. Never concatenate or interpolate user input into SQL strings."
- Apply label "security".

---

## Database: No raw DELETE statements

If any changed file contains `DELETE FROM` or `.delete()` that permanently removes rows (not soft delete), then:
- Add a blocking Bug with title "Use soft delete instead of DELETE" and body: "This project uses soft delete only. Mark records as inactive (e.g. active_indicator = false) instead of DELETE FROM."
- Apply label "compliance".

---

## Backend: Require tests for handler/service changes

If the PR modifies files in paths matching `**/handlers/**`, `**/api/**`, `**/services/**`, or `**/*.service.ts` and there are no changes in files matching `**/*.test.*`, `**/*.spec.*`, `**/__tests__/**`, or `**/tests/**`, then:
- Add a non-blocking Bug with title "Missing tests for backend changes" and body: "This PR modifies backend or API code but includes no accompanying tests. Please add or update unit or integration tests."
- Apply label "quality".

---

## Logging: No PII in log messages

If any changed file adds or modifies log statements (e.g. logger., console., log.) that include patterns like email addresses, phone numbers, or full names in the log message or interpolated value, then:
- Add a non-blocking Bug with title "Possible PII in logs" and body: "Do not log personally identifiable information (email, phone, name). Log IDs or masked values only."
- Apply label "compliance".

---

## General: Prefer TODO with issue reference

If any changed file contains `/(?:^|\s)(TODO|FIXME)(?:\s*:|\s+)/` and the comment does not reference an issue (e.g. no `#123` or `PROJ-456`), then:
- Add a non-blocking Bug with title "TODO/FIXME without issue reference" and body: "Replace with a tracked issue reference, e.g. TODO(#123): ... or remove before merge."
- If the TODO already references an issue pattern `/#\d+|[A-Z]+-\d+/`, do not add the Bug.
