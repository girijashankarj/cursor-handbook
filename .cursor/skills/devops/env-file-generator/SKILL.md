---
name: env-file-generator
description: Scan codebase for environment variable references and generate a complete .env.example file with safe placeholders. Use when the user asks to create or update .env.example or audit env var usage.
---

# Skill: Env File Generator

Scan source code for `process.env.*` references and produce a comprehensive `.env.example` with documentation and safe placeholder values.

## Trigger
When the user asks to create `.env.example`, audit environment variables, or ensure all required env vars are documented.

## Prerequisites
- [ ] Access to project source code
- [ ] Knowledge of which env vars are required vs optional

## Steps

### Step 1: Scan for Environment Variable References
- [ ] Search for `process.env.` patterns across source files
- [ ] Search for `os.environ` / `os.getenv` (Python projects)
- [ ] Search for `System.getenv` (Java projects)
- [ ] Check existing config loader files for env var mappings
- [ ] Check Docker/compose files for `environment:` and `${VAR}` references
- [ ] Check CI/CD config for required secrets

### Step 2: Catalog Variables
For each variable found:
- [ ] Name (e.g., `DB_PASSWORD`)
- [ ] Where it's used (file and line)
- [ ] Whether it has a default value in code
- [ ] Whether it's required (no default, throws if missing)
- [ ] Data type (string, number, boolean, URL)
- [ ] Category (database, auth, cloud, feature flags, etc.)

### Step 3: Classify Sensitivity

| Level | Examples | Placeholder Format |
|-------|---------|-------------------|
| **Secret** | `DB_PASSWORD`, `JWT_SECRET`, `API_KEY` | `your-secret-here` |
| **Infrastructure** | `DB_HOST`, `REDIS_URL`, `S3_BUCKET` | `localhost` / descriptive example |
| **Config** | `PORT`, `LOG_LEVEL`, `NODE_ENV` | Actual default value |
| **Feature** | `ENABLE_FEATURE_X`, `MAX_RETRIES` | `true` / `false` / number |

### Step 4: Generate .env.example

```bash
# ============================================
# {{CONFIG.project.name}} Environment Variables
# ============================================
# Copy this file to .env and fill in the values
# NEVER commit .env to version control
# ============================================

# ---------------------
# Application
# ---------------------
NODE_ENV=development
PORT=3000
LOG_LEVEL=info

# ---------------------
# Database
# ---------------------
DB_HOST=localhost
DB_PORT=5432
DB_NAME={{CONFIG.project.name}}
DB_USERNAME=your-db-username
DB_PASSWORD=your-db-password

# ---------------------
# Authentication
# ---------------------
JWT_SECRET=your-jwt-secret-min-32-chars
JWT_EXPIRY=15m

# ---------------------
# Cloud / AWS
# ---------------------
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key

# ---------------------
# External Services
# ---------------------
# REDIS_URL=redis://localhost:6379
# SMTP_HOST=smtp.example.com
```

### Step 5: Cross-Reference
- [ ] Compare with existing `.env.example` (if any) to find new/removed vars
- [ ] Check `.gitignore` includes `.env` (add if missing)
- [ ] Verify config validation code matches the env var list
- [ ] Flag any env vars in code that are NOT in `.env.example`

### Step 6: Generate Validation Code (Optional)
```typescript
const required = ['DB_PASSWORD', 'JWT_SECRET'] as const;
for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}
```

### Step 7: Output
- [ ] Present `.env.example` content
- [ ] List any discrepancies (vars in code but not in example, or vice versa)
- [ ] Note which vars are required at startup

## Rules
- **NEVER** put real secret values in `.env.example`
- **ALWAYS** use safe placeholder values (`your-xxx-here`, `localhost`, defaults)
- **ALWAYS** include comments explaining each section
- **ALWAYS** verify `.env` is in `.gitignore`
- Group variables by category with section headers
- Mark optional variables with comments (prefix with `#`)
- Include type hints in comments where ambiguous

## Completion
Complete `.env.example` with all environment variables, grouped by category, with safe placeholders and documentation.

## If a Step Fails
- **Too many vars (>50):** Group by service/module, add a table of contents comment
- **Dynamic env var names:** Flag for manual review (e.g., `process.env[varName]`)
- **Can't determine required vs optional:** Default to required, flag for user review
- **Existing .env.example out of date:** Show diff of changes (added/removed vars)
