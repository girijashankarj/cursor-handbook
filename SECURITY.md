# Security Policy

## Supported Versions

We release security updates for the following versions of cursor-handbook:

| Version | Supported          |
| ------- | ------------------ |
| 1.4.x   | Yes                |
| 1.3.x   | Yes                |
| < 1.3   | No                 |

## Reporting a Vulnerability

If you discover a security vulnerability in cursor-handbook, please report it responsibly.

### How to Report

- **Do NOT open a public GitHub issue** for security vulnerabilities.
- Use [GitHub's private vulnerability reporting](https://github.com/girijashankarj/cursor-handbook/security/advisories/new) (Security tab → Report a vulnerability).

### What to Include

- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

### Response Timeline

| Stage              | Timeline                        |
| ------------------ | ------------------------------- |
| Acknowledgment     | Within 48 hours                 |
| Initial assessment| Within 5 business days          |
| Fix released      | Within 30 days for critical     |

### Scope

Security issues in cursor-handbook include:

- Rules that could lead to secrets exposure
- Agents that could execute destructive operations
- Hooks that bypass security guardrails
- MCP configurations that allow unauthorized access

### Out-of-Scope

- [Cursor IDE](https://cursor.com) itself — report to Cursor
- AI model behavior — report to the model provider
- Configuration mistakes in a user's `project.json` — not a vulnerability in this repo

## Security Features

cursor-handbook includes built-in security guardrails:

- Secrets detection rules (no hardcoded API keys, passwords, tokens)
- PII protection rules (no PII in logs)
- Destructive command blocking (e.g. via shell-guard hook)
- Input validation requirements in handler patterns
- Parameterized-query and soft-delete database rules
