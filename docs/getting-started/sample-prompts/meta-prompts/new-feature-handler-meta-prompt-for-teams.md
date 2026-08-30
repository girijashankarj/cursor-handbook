# New feature handler meta-prompt for teams

Generates a feature creation checklist and prompt customized to your project's handler pattern.

---

## Meta-prompt

```
You are creating a "New Feature Handler" guide for our team.

Read the project context:
1. Find 2-3 existing handlers in the codebase — identify the pattern
2. Read project.json for folder names, tech stack, and conventions
3. Read relevant rules: handler-patterns, error-handling, typescript/nodejs
4. Check the schemas/ or validation folder for input validation patterns
5. Check the test files for how handlers are tested

Generate a document with:

### Handler pattern reference
Show our actual handler pattern with annotations:
- Where the file goes (folder path)
- How the route is registered
- Input validation approach (Zod, joi, class-validator, etc.)
- Service/logic layer structure
- Error handling and response format
- Logging pattern

### New handler checklist
A step-by-step checklist for creating a new endpoint:
- [ ] Create route definition in [actual routes folder]
- [ ] Create validation schema in [actual schemas folder]
- [ ] Create handler function in [actual handlers folder]
- [ ] Create service function in [actual services folder]
- [ ] Add types to [actual types folder]
- [ ] Write unit tests for service layer
- [ ] Write integration test for endpoint
- [ ] Add to API documentation
- [ ] Run type-check and tests

### Ready-to-paste prompt
A single prompt a developer can copy into Cursor to generate a complete handler, pre-filled with our project's patterns:

"Create a new [METHOD] [PATH] handler for [DESCRIPTION]. Follow the pattern in [EXAMPLE_HANDLER_PATH]. Put files in [FOLDERS]. Use [VALIDATION_LIB] for schemas. Include tests."

### Example output
Show what the generated handler should look like, based on our existing patterns.

Use real file paths, real patterns, real framework syntax from THIS project.
```

## Expected output

A team reference for consistent feature creation. New team members can follow the checklist and paste the prompt to get started.
