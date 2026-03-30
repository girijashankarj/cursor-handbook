# Cursor Usage Guide

Practical guides for common Cursor IDE tasks.

## Checking token usage

Cursor tracks token consumption per request. To view your usage:

1. Go to **[cursor.com/dashboard](https://cursor.com/dashboard)**
2. Open the **Usage** tab
3. View token breakdowns by type (input, output, cache read/write), remaining allowance, and on-demand charges

Usage resets monthly on your subscription date. For teams, all members' usage resets together based on the team billing cycle. Unused usage does not roll over.

**Links:**

- [Usage and limits](https://cursor.com/help/models-and-usage/usage-limits)
- [Token pricing](https://cursor.com/help/models-and-usage/token-fee)
- [Tokens & Pricing (Learn)](https://cursor.com/learn/tokens-pricing)

---

## Agent review from the Git tab

Cursor can run an AI code review on your changes directly from the Git tab:

1. Open the **Source Control** view (Git icon in the sidebar)
2. Stage or select the files you want reviewed
3. Use the **Review** or **Agent** action (varies by Cursor version) to trigger an AI review of your diff
4. The agent analyzes the changes and provides feedback inline or in chat

This lets you get feedback before committing or opening a PR. For PR-level reviews, use [BugBot](ai-adoption/bugbot.md).

---

## BugBot setup for PR review

BugBot is Cursor's automated PR review agent. To set it up:

1. Go to **[cursor.com/dashboard](https://cursor.com/dashboard?tab=integrations)**
2. Open the **Integrations** tab
3. Click **Connect GitHub** (or GitLab) and complete the OAuth flow
4. Enable BugBot for the repositories you want
5. Add custom rules in **`.cursor/BUGBOT.md`** in your repo (BugBot does not use `.cursor/rules/`)

Trigger a review by commenting `cursor review` or `bugbot run` on a PR, or let BugBot run automatically on each PR update.

See [BugBot guide](ai-adoption/bugbot.md) and [Cursor BugBot docs](https://cursor.com/docs/bugbot).
