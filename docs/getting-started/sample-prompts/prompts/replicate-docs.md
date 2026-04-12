# Replicate docs prompt

Use this to generate project-specific documentation from cursor-handbook templates.

---

## Generate full docs

```
Generate documentation for my project [PROJECT_NAME] based on cursor-handbook's docs structure.

My project: [BRIEF_DESCRIPTION]
Tech stack: [LANGUAGE] / [FRAMEWORK] / [DATABASE] / [CLOUD]

Create these docs tailored to my project:
1. README.md — Project overview, setup instructions, development workflow
2. Quick start guide — How to clone, install, and run
3. Architecture overview — Folder structure, key patterns, data flow
4. API documentation — Endpoints, request/response formats
5. Testing guide — How to run tests, coverage targets, mock patterns
6. Contributing guide — PR process, commit conventions, branch strategy

Use info from my project.json and codebase. Don't include cursor-handbook-specific content — these are for my project's developers.
```

## Generate a single doc

```
Generate a [DOC_TYPE] for my project based on the cursor-handbook template.

Doc type: [README / architecture / API docs / testing guide / contributing guide]
Focus area: [SPECIFIC_AREA]

Read my project's code and config to make it accurate and specific.
```

## Generate onboarding doc

```
Create a developer onboarding document for [PROJECT_NAME]:

1. Prerequisites (tools, access, env setup)
2. First-time setup steps
3. Project structure walkthrough
4. Key patterns and conventions
5. How to make your first change (create a branch, make a change, run tests, submit PR)
6. Who to ask for help

Base it on our actual project structure and conventions, not generic advice.
```

## Placeholders

| Placeholder | Replace with |
|-------------|-------------|
| `[PROJECT_NAME]` | Your project name |
| `[BRIEF_DESCRIPTION]` | One-line description |
| `[LANGUAGE]` | Language |
| `[FRAMEWORK]` | Framework |
| `[DATABASE]` | Database |
| `[CLOUD]` | Cloud provider |
| `[DOC_TYPE]` | Type of documentation |
| `[SPECIFIC_AREA]` | Focus area for the doc |
