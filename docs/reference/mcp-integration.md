# MCP integration

Placeholder for Model Context Protocol (MCP) integration with cursor-handbook.

## Purpose

MCP allows external context servers (APIs, docs, databases) to supply structured context to the AI. If your team runs an MCP server, you can connect Cursor to it so that context is available in addition to handbook rules and skills.

## Configuration

- Configure the MCP client in Cursor per Cursor’s documentation (e.g. settings or config file).
- Ensure the MCP server does not expose secrets; use allowlists for URLs and data.

## Project-specific notes

- Add here: MCP server URLs (as placeholders), expected context shape, and any limits (e.g. max tokens from MCP).
- See `docs/guides/ai-adoption/mcp-guide.md` for a short overview.
