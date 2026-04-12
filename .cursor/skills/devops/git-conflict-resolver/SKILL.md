---
name: git-conflict-resolver
description: Systematic workflow for understanding and resolving git merge conflicts safely. Use when the user has merge conflicts or asks for help resolving conflicts.
---

# Skill: Git Conflict Resolver

Safely resolve git merge conflicts by understanding both sides, choosing the correct resolution, and validating the result.

## Trigger
When the user reports merge conflicts, rebase conflicts, or asks for help resolving git conflicts.

## Prerequisites
- [ ] Active merge or rebase in progress (`git status` shows "Unmerged paths")
- [ ] Understanding of the intended behavior of both branches

## Steps

### Step 1: Assess the Situation
- [ ] Run `git status` to list all conflicted files
- [ ] Determine the operation: merge, rebase, or cherry-pick
- [ ] Identify source and target branches
- [ ] Count total conflicts: `git diff --name-only --diff-filter=U`

### Step 2: Understand Each Conflict
For each conflicted file:
- [ ] Read the conflict markers:
```
<<<<<<< HEAD (current branch — "ours")
  current branch code
=======
  incoming branch code ("theirs")
>>>>>>> branch-name
```
- [ ] Understand what **ours** changed and why
- [ ] Understand what **theirs** changed and why
- [ ] Check commit messages for context: `git log --oneline -5 -- <file>`

### Step 3: Classify Conflict Type

| Type | Description | Resolution Strategy |
|------|-------------|-------------------|
| **Trivial** | Same file, different sections | Accept both (auto-merge missed it) |
| **Additive** | Both sides added code | Keep both additions, order logically |
| **Competing** | Both sides changed same line | Understand intent, pick correct version |
| **Structural** | File renamed/moved vs edited | Keep the rename, apply edits to new path |
| **Delete vs Edit** | One side deleted, other edited | Decide if deletion or edit is correct |
| **Semantic** | No textual conflict but logic conflict | Requires understanding business logic |

### Step 4: Resolve Each File
- [ ] For trivial/additive: combine both changes
- [ ] For competing: choose the version that matches intended behavior, or merge logic from both
- [ ] Remove ALL conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`)
- [ ] Verify the file is syntactically valid
- [ ] Verify imports are correct (no duplicates, no missing)

### Step 5: Validate Resolution
- [ ] Run type-check: `{{CONFIG.testing.typeCheckCommand}}`
- [ ] Run lint on resolved files (use `read_lints` tool)
- [ ] Run tests for affected files only (not full suite)
- [ ] Verify no conflict markers remain: search for `<<<<<<<` in resolved files

### Step 6: Complete the Operation
For **merge**:
```bash
git add <resolved-files>
git commit  # Uses the pre-populated merge commit message
```

For **rebase**:
```bash
git add <resolved-files>
git rebase --continue
```

For **cherry-pick**:
```bash
git add <resolved-files>
git cherry-pick --continue
```

### Step 7: Post-Resolution
- [ ] Verify the merge/rebase completed: `git status` shows clean state
- [ ] Run a broader validation if many files changed
- [ ] Check `git log --graph --oneline -10` to verify history looks correct

## Abort Strategies
If resolution becomes too complex:
```bash
git merge --abort     # Undo a merge
git rebase --abort    # Undo a rebase
git cherry-pick --abort  # Undo a cherry-pick
```

## Rules
- **ALWAYS** understand both sides before resolving
- **ALWAYS** validate after resolving (type-check, lint, tests)
- **NEVER** blindly accept "ours" or "theirs" for all files
- **NEVER** leave conflict markers in resolved files
- **NEVER** resolve semantic conflicts without understanding the business logic
- When in doubt, ask the user which behavior is correct
- Prefer small, file-by-file resolution over bulk operations

## Completion
All conflicts resolved, validated, and merge/rebase completed. Working tree is clean.

## If a Step Fails
- **Can't understand intent:** Check PR descriptions, commit messages, or ask the user
- **Type-check fails after resolve:** Likely a missed import or incompatible types — fix before continuing
- **Tests fail after resolve:** Logic conflict exists — review both changes more carefully
- **Too many conflicts (>20 files):** Consider aborting and rebasing incrementally, or merging main into the feature branch first
