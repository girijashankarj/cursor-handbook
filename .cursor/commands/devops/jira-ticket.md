---
name: jira-ticket
description: Quickly generate a structured JIRA ticket from a brief description or code context.
---

# Command: JIRA Ticket

## Invocation
`/jira-ticket`

## Description
Generate a well-structured JIRA ticket (story, bug, task, or spike) from a brief description, code context, or error log.

## Parameters
- `type`: Ticket type — `story` (default), `bug`, `task`, `spike`, `epic`
- `description`: Brief description of what's needed or what's broken
- `priority`: `critical`, `high`, `medium` (default), `low`

## Action
1. Infer ticket type from the description if not specified.
2. Generate:
   - **Title** — concise, imperative, ≤80 chars
   - **Description** — structured per type (story format, bug report, task spec)
   - **Acceptance Criteria** — testable, binary conditions (for stories/tasks)
   - **Steps to Reproduce** — numbered steps (for bugs)
   - **Labels** — suggested based on affected area
   - **Story Points** — estimated using Fibonacci scale
3. Output as copy-paste ready markdown.

## When to Use
- Creating a ticket from a bug report or feature request
- Converting a Slack message or meeting note into a trackable item
- Quickly scaffolding a ticket during sprint planning
- Documenting a discovered issue while working on code

## Token Cost
~2–5K tokens

## Expected Output
- Complete ticket content in markdown format
- Suggested labels and story point estimate
- Ready to paste into JIRA or any project tracker

## Troubleshooting
- **Vague input:** Ask one clarifying question, then generate with explicit assumptions
- **Too large:** Suggest breaking into an epic with child stories
