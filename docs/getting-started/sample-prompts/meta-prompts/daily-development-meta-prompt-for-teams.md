# Daily development meta-prompt for teams

Generates a set of team-specific daily development prompts matched to your project's patterns and conventions.

---

## Meta-prompt

```
You are creating a daily development prompt guide for our team.

Read the project context:
1. project.json — tech stack, test commands, lint commands
2. .cursor/rules/ — coding standards, handler patterns, error handling
3. Example handlers/services — the actual patterns used in this codebase
4. Test files — testing patterns, mock setup, naming conventions

Generate a "Daily Development Prompts" document with ready-to-paste prompts for these scenarios, customized to OUR project:

### 1. Add a feature
A prompt template that references our actual handler pattern, schema library, and folder structure.

### 2. Fix a bug
A prompt template that references our error handling pattern, logging, and test strategy.

### 3. Write tests
A prompt template using our test framework, mock patterns, and coverage targets.

### 4. Refactor code
A prompt template that follows our architectural rules (no circular deps, types in common/, etc.).

### 5. Database changes
A prompt template for migrations following our naming conventions and safety rules.

### 6. API changes
A prompt template for endpoint modifications with validation, error codes, and versioning.

### 7. Quick commands
A table of one-liner prompts for common tasks:
- "Run type-check on [file]"
- "Add a test for [function]"
- "Explain this error: [paste]"
- "Review this file for security issues"

Each prompt should use our actual:
- File paths and folder names
- Framework-specific syntax
- Test framework and commands
- Naming conventions

Make these directly pasteable — no placeholders that require project knowledge to fill.
```

## Expected output

A team reference document with 7+ ready-to-paste prompts. Share in your team wiki or `docs/` folder.
