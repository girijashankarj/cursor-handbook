# FAQ

## General

**Q: Do I need to commit the entire `.cursor` folder?**  
A: Yes, if you want the whole team to use the same rules, agents, and hooks. Add only truly local overrides to `.gitignore` if any.

**Q: Can I use cursor-handbook with an existing project?**  
A: Yes. Copy or clone the handbook into your project's `.cursor` directory and set `config/project.json` to match your stack and paths.

**Q: How do I add a new rule?**  
A: Add a new `.mdc` file under `.cursor/rules/` (or the right subfolder). Cursor picks up all `.mdc` files in that tree.

## Token efficiency

**Q: Why does the handbook stress token efficiency?**  
A: Large context and long outputs increase cost and latency. The rules and patterns help keep prompts and responses smaller without losing quality.

**Q: Should I run full test suite in CI only?**  
A: Yes. The handbook recommends type-check and single-file tests for quick validation; full suite in CI.

## Security

**Q: Where do I put secrets?**  
A: Use environment variables or a secrets manager. Never commit `.env` or hardcode keys; see `docs/security/security-guide.md`.

**Q: What if I need to document an internal URL?**  
A: Use placeholders like `[API_ENDPOINT]` or `[BUCKET_NAME]` in docs and comments.
