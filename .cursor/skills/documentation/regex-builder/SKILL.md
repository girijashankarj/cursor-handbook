---
name: regex-builder
description: Build, explain, and test regular expressions step-by-step with plain-English breakdowns. Use when the user asks to create, debug, or explain a regex pattern.
---

# Skill: Regex Builder

Construct and explain regular expressions incrementally with test cases and plain-English documentation.

## Trigger
When the user asks to build, create, explain, debug, or optimize a regular expression.

## Prerequisites
- [ ] Target pattern or matching criteria described
- [ ] Sample inputs (should match and should NOT match)
- [ ] Target language/flavor (JavaScript, Python, Go, PCRE)

## Steps

### Step 1: Clarify Requirements
- [ ] What should the regex match? (exact description)
- [ ] What should it NOT match? (edge cases)
- [ ] Capture groups needed? (which parts to extract)
- [ ] Flags needed? (case-insensitive, multiline, global, dotall)
- [ ] Performance constraints? (large input, many matches)

### Step 2: Build Incrementally

Start with the simplest pattern that matches, then refine:

1. **Literal match** — match the exact string first
2. **Character classes** — generalize with `[a-z]`, `\d`, `\w`
3. **Quantifiers** — add `+`, `*`, `{n,m}` for repetition
4. **Anchors** — add `^`, `$` for position
5. **Groups** — add `()` for captures, `(?:)` for non-capturing
6. **Alternation** — add `|` for OR logic
7. **Lookahead/behind** — add `(?=)`, `(?<=)` for assertions

### Step 3: Document the Pattern

Break down every component:

```
Pattern: ^(?<protocol>https?):\/\/(?<domain>[a-zA-Z0-9.-]+)(?::(?<port>\d{1,5}))?(?<path>\/[^\s?#]*)?(?:\?(?<query>[^\s#]*))?(?:#(?<fragment>\S*))?$

Breakdown:
^                          Start of string
(?<protocol>https?)        Capture "http" or "https"
:\/\/                      Literal "://"
(?<domain>[a-zA-Z0-9.-]+)  Capture domain name
(?::(?<port>\d{1,5}))?     Optional port number (1-5 digits)
(?<path>\/[^\s?#]*)?       Optional path starting with /
(?:\?(?<query>[^\s#]*))?   Optional query string after ?
(?:#(?<fragment>\S*))?     Optional fragment after #
$                          End of string
```

### Step 4: Create Test Cases

```
✅ Should match:
  "https://example.com"                    → protocol=https, domain=example.com
  "http://api.example.com:8080/v1/users"   → port=8080, path=/v1/users
  "https://example.com/search?q=test#top"  → query=q=test, fragment=top

❌ Should NOT match:
  "ftp://example.com"      → wrong protocol
  "not-a-url"              → no protocol
  ""                       → empty string
```

### Step 5: Validate Edge Cases
- [ ] Empty input
- [ ] Very long input (ReDoS risk)
- [ ] Unicode characters
- [ ] Special regex characters in input (`.`, `*`, `+`, `?`)
- [ ] Newlines and whitespace

### Step 6: Check for ReDoS Vulnerability
Avoid catastrophic backtracking patterns:
- **Dangerous:** `(a+)+`, `(a|a)+`, `(a+b?)+` on non-matching input
- **Safe:** Use atomic groups, possessive quantifiers, or rewrite
- If pattern has nested quantifiers on overlapping character classes → flag as risky

### Step 7: Provide Language-Specific Usage

**JavaScript:**
```javascript
const pattern = /^https?:\/\/[a-zA-Z0-9.-]+/;
const match = url.match(pattern);
const isValid = pattern.test(url);
```

**Python:**
```python
import re
pattern = re.compile(r'^https?://[a-zA-Z0-9.-]+')
match = pattern.match(url)
is_valid = bool(pattern.match(url))
```

**Go:**
```go
pattern := regexp.MustCompile(`^https?://[a-zA-Z0-9.-]+`)
match := pattern.FindString(url)
isValid := pattern.MatchString(url)
```

## Common Patterns Reference

| Need | Pattern | Notes |
|------|---------|-------|
| Email (basic) | `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$` | Not RFC-compliant, covers 99% |
| UUID | `^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$` | Case-insensitive flag |
| ISO date | `^\d{4}-\d{2}-\d{2}$` | Doesn't validate ranges |
| Semantic version | `^v?\d+\.\d+\.\d+(-[a-zA-Z0-9.]+)?$` | Optional `v` prefix |
| IP address (v4) | `^(\d{1,3}\.){3}\d{1,3}$` | Doesn't validate 0–255 |
| Slug | `^[a-z0-9]+(-[a-z0-9]+)*$` | Lowercase with hyphens |

## Rules
- **ALWAYS** explain each component in plain English
- **ALWAYS** provide test cases (match and non-match)
- **ALWAYS** check for ReDoS vulnerability on complex patterns
- **NEVER** use regex for HTML parsing — use a proper parser
- Prefer readability over cleverness — comment complex patterns
- Use named capture groups when extracting data
- Mention flavor differences (JS vs Python vs Go) when they matter

## Completion
Working regex with plain-English breakdown, test cases, language-specific usage, and ReDoS safety check.

## If a Step Fails
- **Can't express requirement in regex:** Consider a parser or multi-step validation instead
- **ReDoS risk detected:** Rewrite with non-overlapping character classes or use a timeout
- **Flavor mismatch:** Note which features are unavailable (e.g., lookbehind in older JS)
- **Too complex:** Split into multiple simpler patterns applied sequentially
