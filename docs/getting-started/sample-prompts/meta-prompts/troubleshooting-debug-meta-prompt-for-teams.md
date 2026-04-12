# Troubleshooting & debug meta-prompt for teams

Generates a project-specific debugging runbook and troubleshooting guide.

---

## Meta-prompt

```
You are creating a troubleshooting and debugging runbook for our team.

Read the project context:
1. project.json — tech stack, commands, service names
2. .cursor/rules/ — error handling patterns, logging standards
3. Existing error classes — how errors are structured (AppError, error codes)
4. Logging configuration — what's logged, log format, where logs go
5. Health check endpoints — if any exist
6. Docker/infrastructure files — how services run

Generate a runbook with:

### Common errors and fixes
A table of errors the team is likely to encounter:

| Error / Symptom | Likely cause | Quick fix |
|-----------------|-------------|-----------|
| Connection refused on port X | Service not running | `[actual start command]` |
| AUTH_ERROR / 401 | Token expired or missing | Check env vars, refresh token |
| VALIDATION_ERROR / 400 | Request schema mismatch | Check request body against schema |
| Database connection error | DB not running or wrong creds | Check DB container, verify .env |
| Type error in build | Missing type or wrong import | Run type-check, fix imports |
| Test timeout | Async operation not awaited | Check async/await, mock timeouts |

### Debugging workflow
Step-by-step process for our codebase:

1. **Reproduce** — Get the exact error message and stack trace
2. **Locate** — Trace through our handler → service → model flow
3. **Check logs** — Where to find logs, how to filter by correlationId
4. **Isolate** — Write a failing test that reproduces the bug
5. **Fix** — Apply the fix following project patterns
6. **Verify** — Run the failing test, then type-check
7. **Prevent** — Add test coverage for the fixed case

### Environment-specific issues
Debugging tips for each environment:
- **Local** — Docker issues, env var problems, port conflicts
- **CI** — Build failures, test timeouts, missing env vars
- **Staging/Production** — Log access, monitoring dashboards, rollback steps

### Debugging prompts
Ready-to-paste prompts for common debugging scenarios:
1. "Debug this error: [paste error]"
2. "This endpoint returns [status] instead of [expected]"
3. "This test is flaky: [test name]"
4. "Performance is degraded on [endpoint]"
5. "Build is failing after [recent change]"

Each customized with our error patterns, log format, and service architecture.

### Useful commands
| Task | Command |
|------|---------|
| Check service health | ... |
| Tail logs | ... |
| Run single test | ... |
| Check DB connection | ... |
| Restart services | ... |

Use real commands, real error patterns, and real file paths from THIS project.
```

## Expected output

A team debugging reference (2-3 pages). Especially useful for on-call rotation and new team members.
