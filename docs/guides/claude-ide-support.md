# Claude IDE Support

cursor-handbook provides configuration that works across **Cursor IDE** and **Claude Code** (and other Claude-based tools).

## What we support

| File | Cursor | Claude Code |
|------|--------|-------------|
| `AGENTS.md` | ✅ Loaded automatically | ✅ Loaded automatically |
| `CLAUDE.md` | ✅ Loaded (Claude uses this) | ✅ Primary instruction file |
| `.cursor/rules/` | ✅ Project rules | ✅ Compatible via `.cursor` |
| `.cursor/skills/` | ✅ Skills | ✅ Cursor loads from `.claude/skills/` too |
| `project.json` | ✅ Via rules | ✅ Via rules when referenced |

## How to use with Claude Code

1. **Claude Code** reads `CLAUDE.md` from your project root by default.
2. **AGENTS.md** is supported by both Cursor and Claude Code for agent instructions.
3. Copy the `.cursor` folder into your project — Cursor uses it; Claude Code may use compatible paths (e.g. `.claude/skills/`).
4. **project.json** is cursor-handbook's central config. When rules reference it, the AI reads it. Works in both Cursor and Claude Code sessions.

## Skills compatibility

Cursor loads skills from `.cursor/skills/`, `.agents/skills/`, and for compatibility also `.claude/skills/` and `.codex/skills/`. If you use Claude Code, you can symlink or copy `.cursor/skills/*` to `.claude/skills/` for full skill support.

## Summary

cursor-handbook is designed for **Cursor IDE** primarily, but the rules, `AGENTS.md`, `CLAUDE.md`, and `project.json` patterns work with Claude Code and other tools that respect these conventions. Use the same config across your team regardless of which IDE they use.
