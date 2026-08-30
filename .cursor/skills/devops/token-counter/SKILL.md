---
name: token-counter
description: Estimate LLM token counts for files or directories using a word-based heuristic. Use when the user asks how many tokens a file uses, wants to check context size, or needs to estimate token cost.
---

# Skill: Token Counter

Estimate token consumption for files and directories to help manage LLM context budgets.

## Trigger
When the user asks to count tokens, estimate context size, check how much a file/directory costs in tokens, or wants to optimize token usage.

## Prerequisites
- [ ] Target file or directory exists
- [ ] `wc` command available (standard on macOS/Linux)

## Usage

Run the bundled script:

```bash
scripts/count-tokens.sh <file-or-directory>
```

### Examples

Count tokens for a single file:
```bash
scripts/count-tokens.sh .cursor/rules/main-rules.mdc
```

Count tokens for an entire directory:
```bash
scripts/count-tokens.sh .cursor/rules/
```

Count tokens for the whole project:
```bash
scripts/count-tokens.sh .
```

## Steps

### Step 1: Identify Target
- [ ] Determine what the user wants to measure (single file, directory, or set of files)
- [ ] Verify the target path exists

### Step 2: Run Token Count
- [ ] Execute `scripts/count-tokens.sh <target>` using the Shell tool
- [ ] Capture output

### Step 3: Interpret Results
- [ ] Present the token estimates in a clear table or list
- [ ] Flag any files that exceed context layer budgets:
  - Immediate context: ~2000 tokens
  - Relevant context: ~3000 tokens
  - Extended context: ~3000 tokens
- [ ] Suggest optimizations if totals are high (split files, trim comments, use references)

### Step 4: Recommendations
- [ ] If a single file exceeds 2000 tokens, suggest splitting or using progressive loading
- [ ] If a directory exceeds 10,000 tokens, recommend selective inclusion
- [ ] Reference the token efficiency rules for budget guidance

## How It Works

The script uses a simple heuristic: `word_count × 1.3 ≈ token_count`. This approximation works well for English text and code. For precise counts, use `tiktoken` or the OpenAI tokenizer.

Supported file types: `.md`, `.mdc`, `.ts`, `.tsx`, `.py`

## Rules
- The heuristic is an **approximation** — actual token counts vary by model and tokenizer
- For precise counts, recommend `tiktoken` (Python) or equivalent
- Use this for quick estimates and budget planning, not exact billing

## Completion
Token estimates displayed with optimization suggestions if any files exceed recommended budgets.

## If a Step Fails
- **File not found:** Verify the path and suggest alternatives
- **Empty output:** Check if the directory contains supported file types
- **Inaccurate results:** Suggest installing `tiktoken` for precise counts
