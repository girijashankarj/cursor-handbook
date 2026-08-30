# Troubleshooting & debug prompt

Use this when debugging errors, failures, or unexpected behavior.

---

## Debug an error

```
I'm seeing this error:

```
[PASTE_ERROR_OUTPUT]
```

Context:
- File: [FILE_PATH]
- What I was doing: [ACTION]
- Environment: [local/staging/production]

Help me debug:
1. What does this error mean?
2. What's the most likely root cause?
3. How to fix it?
4. What test should I add to prevent regression?
```

## Debug a failing endpoint

```
The endpoint [METHOD] [ENDPOINT] is returning [STATUS_CODE] when it should return [EXPECTED_STATUS].

Request payload: [PAYLOAD_OR_DESCRIPTION]
Response body: [RESPONSE]

Trace through the handler → service → database flow and find where it breaks.
```

## Debug performance

```
[ENDPOINT_OR_FUNCTION] is slow — taking [TIME]ms when it should be under [TARGET]ms.

Help me find the bottleneck:
1. Check for N+1 queries
2. Check for missing database indexes
3. Check for unbounded loops or large payload processing
4. Check for synchronous operations that should be async
5. Suggest specific optimizations with expected impact
```

## Debug a build/deploy failure

```
The build is failing with:

```
[PASTE_BUILD_ERROR]
```

This started after [RECENT_CHANGE].

Find the cause and fix it. Check for:
- Type errors
- Missing dependencies
- Circular imports
- Config/env issues
```

## Placeholders

| Placeholder | Replace with |
|-------------|-------------|
| `[PASTE_ERROR_OUTPUT]` | Full error message/stack trace |
| `[FILE_PATH]` | File where the error occurs |
| `[METHOD]` | HTTP method (GET, POST, etc.) |
| `[ENDPOINT]` | API endpoint path |
| `[STATUS_CODE]` | Actual HTTP status code |
