---
name: doc-redactor
description: Scan and redact sensitive information (secrets, PII, internal URLs, credentials) from documents, configs, logs, and code. Use when the user asks to sanitize files, redact secrets, or prepare content for sharing.
---

# Skill: Doc Redactor

Systematically scan and redact sensitive information from files before sharing, committing, or publishing.

## Trigger
When the user asks to redact, sanitize, or clean sensitive data from files — or before sharing code/docs externally.

## Prerequisites
- [ ] Files or content to redact identified
- [ ] Sensitivity classification understood (what must be redacted)

## Steps

### Step 1: Identify Redaction Targets

| Category | Examples | Replacement Pattern |
|----------|---------|-------------------|
| **API Keys** | `sk-...`, `AKIA...`, `ghp_...` | `[API_KEY]` |
| **Passwords** | Password values, connection strings | `[PASSWORD]` |
| **Tokens** | JWT, OAuth, bearer tokens | `[TOKEN]` |
| **URLs** | Internal endpoints, admin panels | `[INTERNAL_URL]` |
| **IPs** | Server IPs, private ranges | `[IP_ADDRESS]` |
| **Emails** | Personal or corporate email addresses | `[EMAIL]` |
| **Names** | Personal names in logs or comments | `[PERSON_NAME]` |
| **Phone Numbers** | Any phone format | `[PHONE]` |
| **Account IDs** | AWS account IDs, GCP project IDs | `[ACCOUNT_ID]` |
| **Resource ARNs** | `arn:aws:...` | `[RESOURCE_ARN]` |
| **Database Hosts** | RDS endpoints, MongoDB URIs | `[DB_HOST]` |
| **S3 Buckets** | `s3://bucket-name` | `[BUCKET_NAME]` |
| **Queue Names** | SQS, RabbitMQ, Kafka topic names | `[QUEUE_NAME]` |
| **Certificates** | PEM blocks, cert contents | `[CERTIFICATE]` |
| **SSN / Tax IDs** | Social security, EIN numbers | `[REDACTED_ID]` |
| **Credit Cards** | Card numbers, CVVs | `[CARD_NUMBER]` |

### Step 2: Scan Files
- [ ] Search for common secret patterns using regex:

```
# API keys and tokens
/(?:api[_-]?key|token|secret|password|credential)\s*[:=]\s*["']?[A-Za-z0-9+/=_-]{16,}/gi

# AWS keys
/AKIA[0-9A-Z]{16}/g

# GitHub tokens
/gh[pousr]_[A-Za-z0-9_]{36,}/g

# JWT tokens
/eyJ[A-Za-z0-9_-]*\.eyJ[A-Za-z0-9_-]*\.[A-Za-z0-9_-]*/g

# Connection strings
/(?:mongodb|postgres|mysql|redis):\/\/[^\s"']+/gi

# IP addresses (private ranges)
/(?:10|172\.(?:1[6-9]|2\d|3[01])|192\.168)\.\d{1,3}\.\d{1,3}/g

# Email addresses
/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g

# AWS ARNs
/arn:aws:[a-z0-9-]+:[a-z0-9-]*:\d{12}:[^\s"']*/g

# AWS Account IDs (12-digit)
/\b\d{12}\b/g (context-dependent)

# PEM certificates
/-----BEGIN [A-Z ]+-----[\s\S]*?-----END [A-Z ]+-----/g
```

### Step 3: Classify Findings
For each match:
- [ ] Determine if it's a true positive (actual secret) or false positive
- [ ] Classify sensitivity level: **Restricted** (must redact) vs **Internal** (should redact)
- [ ] Group findings by file and type
- [ ] Present a summary to the user before redacting

### Step 4: Apply Redactions
- [ ] Replace each finding with the appropriate placeholder from Step 1
- [ ] Preserve file structure and formatting
- [ ] Keep enough context for the document to remain useful
- [ ] For `.env` files: keep keys, redact values → `DB_PASSWORD=[PASSWORD]`
- [ ] For logs: mask inline → `email: "j***@example.com"`
- [ ] For code: replace with env var references → `process.env.API_KEY`

### Step 5: Handle Special Cases

#### `.env` Files
```bash
# Before
DB_PASSWORD=super_secret_password_123
API_KEY=sk-1234567890abcdef

# After
DB_PASSWORD=[PASSWORD]
API_KEY=[API_KEY]
```

#### Configuration Files
```json
// Before
{ "host": "prod-db-cluster.abc123.us-east-1.rds.amazonaws.com" }

// After
{ "host": "[DB_HOST]" }
```

#### Log Files
```
// Before
User john.doe@company.com placed order from 10.0.1.45

// After
User [EMAIL] placed order from [IP_ADDRESS]
```

#### Code Comments
```typescript
// Before
// Contact admin@internal-corp.com for access to prod-api.internal.company.com

// After
// Contact [EMAIL] for access to [INTERNAL_URL]
```

### Step 6: Generate Redaction Report
- [ ] List all files scanned
- [ ] Count of findings per category
- [ ] List of redactions applied (without showing the original values)
- [ ] Flag any uncertain findings for manual review

```markdown
## Redaction Report
- **Files scanned:** 12
- **Findings:** 23
  - API Keys: 3
  - Emails: 8
  - Internal URLs: 5
  - IP Addresses: 4
  - Database hosts: 3
- **Redactions applied:** 21
- **Needs manual review:** 2 (possible false positives flagged in output)
```

### Step 7: Validate
- [ ] Re-scan redacted files to confirm no remaining secrets
- [ ] Verify the document is still readable and useful
- [ ] Check that placeholders are consistent (same secret → same placeholder)

## Rules
- **NEVER** show or log the original secret values in output
- **ALWAYS** err on the side of redacting (false positive > missed secret)
- **ALWAYS** generate a redaction report
- **NEVER** modify files without user confirmation
- Preserve document structure — only replace the sensitive values
- Use consistent placeholder format: `[CATEGORY]` in uppercase with underscores
- For partial redaction (masking): show first and last characters only → `s***t`

## Completion
All files scanned, findings reported, redactions applied (with user approval), and re-validation passed.

## If a Step Fails
- **Too many false positives:** Narrow regex patterns, use allowlists for known-safe values
- **Missed a secret:** Add the pattern to the scan list, re-run
- **File too large:** Process in chunks, focus on config and env files first
- **Binary files:** Skip binary files, flag them as unscanned
