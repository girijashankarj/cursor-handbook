# MCP (Model Context Protocol) guide

MCP lets tools expose structured context to AI models. This guide is a placeholder for project-specific MCP setup.

## What is MCP?

Model Context Protocol defines a way for servers (e.g. your repo, docs, APIs) to provide context to the model in a standard format. Cursor and other clients can connect to MCP servers to pull in extra context.

## Using MCP with Cursor

- If your team runs an MCP server (e.g. for internal APIs or docs), configure Cursor to use it per Cursor’s MCP documentation.
- Context from MCP is in addition to the handbook’s rules and skills; ensure MCP context doesn’t duplicate or contradict project rules.

## Reference

- See Cursor docs for MCP client configuration.
- See `docs/reference/mcp-integration.md` for any project-specific MCP notes.
