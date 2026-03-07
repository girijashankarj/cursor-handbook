# SAST integration

Static Application Security Testing (SAST) can be run in CI or via hooks to find vulnerabilities in code.

## In CI

- Add a SAST step to your CI workflow (e.g. GitHub Actions) that runs on every PR.
- Use tools such as Semgrep, CodeQL, or a language-specific scanner.
- Fail the build on high/critical findings or report them in the PR.

## With Cursor

- Optionally run a lightweight secret scan in a pre-commit or before-push hook (e.g. `scan-secrets.sh`).
- For full SAST, run in CI rather than on every edit to avoid slowdown.

## Configuration

- Document the SAST tool and config file location here (e.g. `.semgrep.yml`, CodeQL workflow).
- Use placeholders for internal URLs or project names.
