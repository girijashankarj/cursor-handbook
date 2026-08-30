---
name: cron
description: Build, explain, or convert a cron expression with human-readable description and next run times.
---

# Command: Cron

## Invocation
`/cron`

## Description
Build a cron expression from a plain-English schedule, explain an existing expression, or show next execution times.

## Parameters
- `mode`: `build` (default), `explain`
- `expression`: Existing cron expression (for explain mode)
- `schedule`: Plain-English schedule description (for build mode)

## Action
### Build Mode
1. Parse the schedule description (e.g., "every weekday at 9am", "every 15 minutes").
2. Generate the cron expression (5-field or 6-field with seconds).
3. Show next 5 execution times.
4. Note any timezone considerations.

### Explain Mode
1. Break down each field of the cron expression.
2. Translate to plain English.
3. Show next 5 execution times.

### Cron Field Reference
```
┌───────── minute (0–59)
│ ┌───────── hour (0–23)
│ │ ┌───────── day of month (1–31)
│ │ │ ┌───────── month (1–12)
│ │ │ │ ┌───────── day of week (0–7, 0 and 7 = Sun)
│ │ │ │ │
* * * * *
```

## When to Use
- Setting up scheduled jobs (cron, CloudWatch Events, GitHub Actions)
- Understanding an existing cron schedule
- Converting between human-readable and cron format

## Token Cost
~1–2K tokens

## Expected Output
- Cron expression
- Plain-English description
- Next 5 execution times
- Platform-specific notes (AWS EventBridge uses 6 fields)

## Troubleshooting
- **6-field vs 5-field:** AWS EventBridge and some tools use seconds field; standard cron uses 5 fields
- **Timezone:** Cron runs in the system timezone unless configured otherwise; always note this
