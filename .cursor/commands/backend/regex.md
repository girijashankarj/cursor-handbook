---
name: regex
description: Build, explain, or debug a regular expression with plain-English breakdown and test cases.
---

# Command: Regex

## Invocation
`/regex`

## Description
Build a regex from a description, explain an existing regex in plain English, or debug a pattern that isn't matching correctly.

## Parameters
- `mode`: `build` (default), `explain`, or `debug`
- `pattern`: Existing regex to explain/debug (for explain/debug modes)
- `description`: What the regex should match (for build mode)
- `language`: Target language — `javascript` (default), `python`, `go`

## Action
### Build Mode
1. Parse the description of what to match.
2. Construct regex incrementally.
3. Provide plain-English breakdown of each component.
4. Include test cases (matches and non-matches).
5. Note any ReDoS risks.

### Explain Mode
1. Break down the provided regex character by character.
2. Explain each component in plain English.
3. Provide examples of what matches and what doesn't.

### Debug Mode
1. Analyze why the pattern doesn't match the expected input.
2. Identify the specific component causing the mismatch.
3. Suggest a fixed pattern.

## When to Use
- Writing validation patterns (email, phone, URL)
- Understanding a complex regex in existing code
- Fixing a broken regex
- Building extraction patterns for log parsing

## Token Cost
~1–3K tokens

## Expected Output
- Regex pattern with language-specific syntax
- Plain-English breakdown of each component
- Test cases showing matches and non-matches

## Troubleshooting
- **Flavor differences:** Notes JS vs Python differences (lookbehind support, flags)
- **ReDoS risk:** Warns if pattern has catastrophic backtracking potential
