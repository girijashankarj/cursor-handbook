---
name: json-diff
description: Compare two JSON objects or files and produce a structured diff showing additions, deletions, and modifications.
---

# Command: JSON Differ

## Invocation
`/json-diff`

## Description
Compare two JSON objects, files, or API responses and produce a clear, structured diff highlighting what changed.

## Parameters
- `source`: First JSON (file path, pasted content, or "clipboard")
- `target`: Second JSON (file path, pasted content, or "clipboard")
- `format`: Output format — `summary` (default), `detailed`, `patch` (JSON Patch RFC 6902)

## Action
1. Parse both JSON inputs (validate syntax first).
2. Perform deep comparison:
   - **Added keys** — present in target, absent in source
   - **Removed keys** — present in source, absent in target
   - **Modified values** — same key, different value (show before → after)
   - **Type changes** — same key, different type (string → number, etc.)
   - **Array changes** — items added, removed, or reordered
3. Output in the requested format.

### Output Formats

#### Summary (default)
```
 Changes: 3 added, 1 removed, 2 modified

 + config.newFeature: true
 + config.settings.timeout: 5000
 + config.settings.retries: 3
 - config.deprecated: "old-value"
 ~ config.version: "1.0.0" → "2.0.0"
 ~ config.settings.debug: true → false
```

#### Detailed
```json
{
  "added": [
    { "path": "$.config.newFeature", "value": true },
    { "path": "$.config.settings.timeout", "value": 5000 }
  ],
  "removed": [
    { "path": "$.config.deprecated", "value": "old-value" }
  ],
  "modified": [
    {
      "path": "$.config.version",
      "from": "1.0.0",
      "to": "2.0.0"
    }
  ]
}
```

#### JSON Patch (RFC 6902)
```json
[
  { "op": "add", "path": "/config/newFeature", "value": true },
  { "op": "remove", "path": "/config/deprecated" },
  { "op": "replace", "path": "/config/version", "value": "2.0.0" }
]
```

## When to Use
- Comparing API response changes between versions
- Reviewing configuration drift between environments
- Validating migration output matches expected schema
- Debugging unexpected JSON changes in tests or payloads
- Comparing OpenSearch mappings, Terraform state, or package.json changes

## Token Cost
~3–8K tokens (depends on JSON size)

## Expected Output
- Structured diff in the requested format
- Count of changes by type (added, removed, modified)
- Warnings for type changes or structural differences

## Troubleshooting
- **Invalid JSON:** Report parsing error with line/column if possible
- **Very large JSON (>1000 keys):** Summarize top-level changes, offer to drill into specific paths
- **Array comparison:** Default to positional comparison; mention if reordering is detected
- **Nested objects:** Use dot-notation paths for clarity (`config.settings.timeout`)
