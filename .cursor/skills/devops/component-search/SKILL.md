---
name: component-search
description: Search across cursor-handbook rules, agents, commands, and skills for a specific term or topic. Use when the user asks to find a component, search for a keyword, or locate where something is defined.
---

# Skill: Component Search

Search across all cursor-handbook component types (rules, agents, commands, skills) to find files matching a term or topic.

## Trigger
When the user asks to find a rule, agent, skill, or command by keyword — or wants to know where a specific topic is covered in the handbook.

## Prerequisites
- [ ] cursor-handbook `.cursor/` directory exists
- [ ] `grep` command available (standard on macOS/Linux)

## Usage

Run the bundled script:

```bash
scripts/search-components.sh <search-term>
```

### Examples

Find all components related to "security":
```bash
scripts/search-components.sh security
```

Find components mentioning "database":
```bash
scripts/search-components.sh database
```

Find components referencing "correlationId":
```bash
scripts/search-components.sh correlationId
```

## Steps

### Step 1: Identify Search Term
- [ ] Determine what the user is looking for
- [ ] If vague, suggest specific terms or ask for clarification

### Step 2: Run Search
- [ ] Execute `scripts/search-components.sh <term>` using the Shell tool
- [ ] Capture output grouped by component type

### Step 3: Present Results
- [ ] Format results as a table grouped by type (rules, agents, commands, skills)
- [ ] Include file paths and brief descriptions where available
- [ ] Highlight the most relevant matches

### Step 4: Suggest Actions
- [ ] Offer to read the most relevant file(s)
- [ ] Suggest related search terms if few results found
- [ ] Recommend creating a new component if nothing exists for the topic

## How It Works

The script searches recursively through `.cursor/rules/`, `.cursor/agents/`, `.cursor/commands/`, and `.cursor/skills/` using case-insensitive `grep`. Results are grouped by component type.

## Rules
- Search is **case-insensitive** by default
- Only searches within `.cursor/` subdirectories
- Large result sets are not truncated — filter with a more specific term if needed

## Completion
List of matching files grouped by component type, with suggestions for next steps.

## If a Step Fails
- **No results:** Suggest alternative search terms, check spelling, or broader keywords
- **`.cursor/` not found:** Verify the user is in the correct project root
- **Too many results:** Suggest a more specific search term
