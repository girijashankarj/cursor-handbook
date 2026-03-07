# Skill: AWS cost estimator

## Description
Estimate or review cost for proposed AWS resources (compute, storage, data transfer).

## Trigger
When the user asks for cost estimate, cost optimization, or "how much will this architecture cost."

## Steps

1. **Gather** — List resources (e.g. Lambda, RDS, S3, API Gateway) and expected usage (requests/month, GB, duration).
2. **Estimate** — Use AWS Pricing Calculator assumptions or public pricing; state assumptions clearly.
3. **Summarize** — Break down by service and total monthly/yearly; highlight high-cost items.
4. **Suggest** — Offer 1–2 optimizations (reserved capacity, right-sizing, storage class) if relevant.

## Rules
- Use placeholder regions and account references; never real account IDs.
- Clearly label estimates as approximate and state pricing date/region if known.
