---
name: prompt-engineering
description: Craft effective prompts and instructions for AI coding assistants. Use when creating rules, agents, skills, or system prompts for Cursor or other LLM-based tools.
---

# Skill: Prompt Engineering

## Trigger
When the user needs to write, improve, or review prompts, system instructions, agent definitions, Cursor rules, or any text intended to guide AI behavior.

## Steps

1. **Clarify the goal** — Identify what the prompt should make the AI do (generate code, review, explain, follow a pattern).
2. **Define the persona** — Specify the role, expertise level, and constraints (e.g. "You are a senior backend engineer specializing in Node.js").
3. **Structure the prompt** — Organize with clear sections:
   - **Context**: Background the AI needs
   - **Instructions**: What to do (use imperative mood)
   - **Constraints**: What NOT to do (use NEVER/ALWAYS for hard rules)
   - **Output format**: Expected shape of the response (code, bullet points, table)
   - **Examples**: One good and one bad example when possible
4. **Apply prompt patterns** — Use established techniques:
   - **Few-shot**: Provide 2–3 examples of desired input/output
   - **Chain of thought**: Ask the AI to think step-by-step for complex reasoning
   - **Negative constraints**: Explicitly state anti-patterns to avoid
   - **Structured output**: Specify exact format (JSON, markdown, code block)
5. **Review and iterate** — Test the prompt; refine based on output quality.

## Rules
- Use imperative mood for instructions ("Use X", "Never do Y")
- Bold critical constraints: **ALWAYS**, **NEVER**, **CRITICAL**
- Keep instructions atomic — one rule per bullet point
- Order from most important to least important
- Use tables for structured data (comparisons, configurations)
- Include escape hatches: what to do when the instruction doesn't apply
- Avoid vague language ("try to", "maybe", "consider") — be decisive
- Test with edge cases: what happens if the user asks something unexpected?

## Prompt Quality Checklist
- [ ] Clear role/persona defined
- [ ] Specific, actionable instructions (not vague guidance)
- [ ] Hard constraints marked with ALWAYS/NEVER
- [ ] Output format specified
- [ ] At least one example (good or bad)
- [ ] Edge cases addressed
- [ ] No conflicting instructions
- [ ] Concise — removes filler without losing meaning

## Anti-patterns
- Walls of text without structure — use headers and bullet points
- Conflicting rules (e.g. "be concise" AND "explain everything in detail")
- Too many rules — prioritize; AI follows top rules more reliably
- Vague instructions: "write good code" vs "use TypeScript strict mode, define interfaces for all inputs"
- Missing context: assuming the AI knows your project without telling it

## Prerequisites
- [ ] Clear understanding of the desired AI behavior
- [ ] Knowledge of the target audience (developer, reviewer, end user)
- [ ] Examples of good and bad outputs

## Completion Checklist
- [ ] Prompt has clear structure (context, instructions, constraints, format)
- [ ] Critical rules use ALWAYS/NEVER
- [ ] Tested with at least one real scenario
- [ ] No conflicting instructions
- [ ] Concise (< 500 words for rules, < 1000 words for agents)

## If Step Fails
- **AI ignores a rule**: Move it higher in the prompt; bold it; add "CRITICAL"
- **Output is wrong format**: Add an explicit example of the expected format
- **AI hallucinates**: Add "Only use information from the provided context"
- **Too verbose**: Add "Keep responses under N sentences/lines"
- **Too terse**: Add "Explain your reasoning" or "Include code examples"

## Example
Task: Create a Cursor rule for error handling.
1. Persona: "You are a backend engineer ensuring consistent error handling."
2. Structure: Section for error classes, section for HTTP mapping, section for logging.
3. Constraints: "NEVER expose stack traces to API consumers", "ALWAYS include correlationId".
4. Format: `.mdc` file with YAML frontmatter, markdown body.
5. Test: Apply to a sample handler and verify output matches expectations.
