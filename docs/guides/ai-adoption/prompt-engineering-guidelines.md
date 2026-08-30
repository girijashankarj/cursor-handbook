# Prompt Engineering Guidelines

How to write effective prompts for Cursor and LLM-assisted development. These guidelines complement cursor-handbook's rules by helping you communicate clearly with the AI.

## Core principles

### 1. Be specific, not vague

| Vague | Specific |
|-------|----------|
| "Fix the bug" | "Fix the null pointer in `getUserById` when userId is undefined" |
| "Add validation" | "Add Zod schema validation for the POST /api/v1/orders request body" |
| "Write tests" | "Write unit tests for `calculateTotal` covering empty array, negative prices, and overflow" |
| "Make it faster" | "Optimize the `getOrders` query — it's doing N+1 fetches on line 45" |

### 2. One task per prompt

Break complex work into steps. Instead of "Build a user registration system with email verification, rate limiting, and tests," use:

1. "Create a POST /api/v1/users handler following the handler pattern"
2. "Add email verification logic to the user service"
3. "Add rate limiting middleware to the registration endpoint"
4. "Write unit tests for the registration service"

### 3. Provide context

The AI performs better when it knows what it's working with.

```
Good:  "In src/services/order-service.ts, the calculateDiscount function
       on line 32 doesn't handle the case where couponCode is expired.
       Add expiry validation using the coupon.expiresAt field."

Bad:   "Handle expired coupons."
```

### 4. Reference project patterns

```
Good:  "Follow the handler pattern used in src/handlers/order-handler.ts"
       "Use the code-reviewer agent to review this"
       "Follow the create-handler skill"

Bad:   "Create an endpoint" (AI has to guess your patterns)
```

## Prompt structures

### The STAR format (for feature work)

- **Situation**: What exists now
- **Task**: What you want to change
- **Approach**: How to do it (patterns, constraints)
- **Result**: What the output should look like

```
Situation: We have a GET /api/v1/orders endpoint that returns all orders.
Task: Add cursor-based pagination.
Approach: Follow the pagination pattern in our project rules.
         Use the cursor from the last item's createdAt + id.
Result: Paginated response with { data: [...], meta: { cursor, hasMore } }.
```

### The constraint format (for reviews and fixes)

Tell the AI what to focus on and what to skip.

```
Review src/handlers/payment-handler.ts.
Focus on: security issues, SQL injection, missing auth checks.
Skip: code style, formatting, naming.
For each issue: severity, line number, what's wrong, how to fix.
```

### The minimal-diff format (for edits)

```
In src/services/user-service.ts, change the getUserById function to:
- Return null instead of throwing when user not found
- Add a debug log with the userId (no PII)
Show only the changed lines.
```

## Token-efficient prompting

### Do

- Point to specific files: `"In src/services/order.ts on line 42"`
- Ask for minimal output: `"Show only changed lines"`
- Use type-check over full tests: `"Run type-check to validate"`
- Scope tests: `"Run tests for this file only"`
- Reference agents/skills by name: `"Use the debug-issue skill"`

### Don't

- Paste entire files when a line range suffices
- Ask for explanations you don't need: `"Just fix it, no explanation needed"`
- Request full test suites: use single-file tests
- Repeat project conventions: rules handle that automatically

## Prompt templates by task

### Adding code

```
Add [WHAT] to [WHERE].
Follow the pattern in [EXISTING_EXAMPLE].
Include: input validation, error handling, logging with correlationId.
Run type-check after.
```

### Reviewing code

```
Review [FILE] for [FOCUS: bugs / security / performance].
Skip [SKIP: style / formatting].
For each issue: severity, location, problem, fix.
```

### Debugging

```
Error: [PASTE_ERROR]
File: [FILE_PATH]
Context: [WHAT_YOU_WERE_DOING]
Find root cause and fix. Add a test for the fix.
```

### Explaining code

```
Explain [FUNCTION_NAME] in [FILE_PATH].
Focus on: what it does, why (not how), any non-obvious decisions.
Keep it under 5 bullet points.
```

## Common mistakes

| Mistake | Why it fails | Better approach |
|---------|-------------|-----------------|
| "Rewrite everything" | Huge output, loses context | Ask for specific changes to specific functions |
| No file reference | AI guesses which file | Always name the file and line |
| Conflicting instructions | "Be thorough but brief" | Pick one: "Be concise" or "Be detailed" |
| Chaining unrelated tasks | AI loses focus | One task per prompt, iterate |
| Ignoring existing patterns | Creates inconsistency | Reference an example or rule |

## Working with cursor-handbook

The handbook's rules, agents, and skills handle most conventions automatically. Your prompts should focus on **what to do** and **where**, not **how to style or structure** the code. The rules take care of:

- Error handling patterns
- Logging format and correlationId
- Test naming and structure
- Security guardrails
- Import order and file organization

You only need to specify conventions when doing something non-standard or when the default rule doesn't apply to your case.
