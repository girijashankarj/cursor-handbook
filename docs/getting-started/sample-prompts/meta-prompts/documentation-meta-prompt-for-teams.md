# Documentation meta-prompt for teams

Generates project-specific documentation tailored to your codebase.

---

## Meta-prompt

```
You are creating documentation for our project.

Read the project context:
1. project.json — project name, description, tech stack, paths
2. Source directory structure — full tree with key files
3. README.md — current state of documentation
4. package.json or equivalent — dependencies, scripts
5. API endpoints or routes — if any exist
6. Test configuration — framework, commands, coverage

Generate the following documents:

### 1. Project README
A comprehensive README with:
- Project name and description
- Architecture diagram (Mermaid)
- Prerequisites
- Quick start (clone, install, configure, run)
- Project structure with descriptions
- Development workflow
- Testing (commands, coverage)
- Deployment process
- Contributing guidelines

### 2. Architecture overview
- High-level system diagram
- Component responsibilities
- Data flow for key operations
- External dependencies and integrations
- Technology choices and rationale

### 3. API documentation
For each endpoint found in the codebase:
- Method and path
- Request schema (params, query, body)
- Response schema (success and error)
- Authentication requirements
- Example request/response

### 4. Development guide
- Local setup with all commands
- Environment variables needed (.env.example format)
- How to add a feature (step by step)
- How to write and run tests
- How to debug common issues
- CI/CD pipeline overview

### 5. Operations guide
- How to deploy
- How to monitor (logs, metrics, alerts)
- How to rollback
- Incident response basics

For each document:
- Use real file paths, commands, and patterns from THIS project
- Include Mermaid diagrams where helpful
- Keep sections concise with bullet points and tables
- Mark any sections where information is missing with [TODO]

Output each as a separate markdown document.
```

## Expected output

5 project-specific documents ready to save in your docs/ folder or team wiki.
