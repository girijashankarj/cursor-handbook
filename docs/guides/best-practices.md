# Best Practices Guide

## Token Efficiency

### Do
- Use `/type-check` instead of running full tests
- Use `/test-single` for targeted testing
- Use `/lint-check` (read_lints) instead of full lint
- Ask for summaries before detailed explanations
- Provide specific file paths when asking for changes

### Don't
- Don't ask AI to "run all tests"
- Don't ask AI to "lint the entire project"
- Don't include large files in context unnecessarily
- Don't ask for verbose explanations unless needed

### Token Budget Guide
| Operation | ~Tokens | Recommendation |
|-----------|---------|----------------|
| Type check | 10K | Default validation |
| Single test | 5K | Targeted testing |
| Read lints | 2K | Quick lint check |
| Full tests | 100K | Only when explicitly needed |
| Full lint | 50K | Avoid — use read_lints |

## Security

### Always
- Use environment variables for secrets
- Validate all user input
- Use parameterized queries
- Log with correlationId (not PII)
- Use placeholders for infrastructure names

### Never
- Hardcode API keys or passwords
- Log email addresses, names, or SSNs
- Expose internal URLs in docs
- Commit .env files
- Use DELETE SQL statements (soft delete only)

## Code Quality

### Handler Pattern
Follow the 7-step handler pattern for all API endpoints:
1. Validate Request
2. Validate Business
3. Pre-Processing
4. Operation
5. Post-Operation
6. Response
7. Exit

### Testing
- Minimum 90% coverage
- Use factories for test data
- Mock at boundaries, not internals
- Test error paths as thoroughly as success paths
- One assertion per test (when practical)

## Workflow
1. Read before writing
2. Follow existing patterns
3. Type-check after changes
4. Test the specific file changed
5. Review with `/code-reviewer` before PRing
