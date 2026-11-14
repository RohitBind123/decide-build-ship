# Parallel builders

How to split a slice across sub-agents without conflicts, and how to bring their work back.

## Contents

- When to parallelise
- Worktrees
- The brief
- Keeping builders in sync
- Bringing work back
- Cleaning up

## When to parallelise

Parallelise only work that is independent: different file sets, a committed contract between them, and no step
that needs another's output. Dependent steps run in order. A handoff that costs more than the time saved is not
worth it; a one-file change is faster done directly.

Keep the number of builders doing heavy work (full builds, test suites, browsers) low enough for the machine.
Two or three at once is a sensible default on a laptop.

## Worktrees

- Each builder gets its own git worktree, so builds and tests do not share a working copy.
- A worktree may start on an older commit than the slice. The builder's first command is
  `git checkout -b <builder-branch> <slice head sha>`.
- Each worktree that runs services uses its own ports and its own throwaway database, so parallel test runs
  do not collide. Derive them from the worktree path or set them in the brief.

## The brief

A builder knows only what the brief says. Include:

```
Goal: <one sentence>
Feature doc: <path>  (read it first)
Contract commit: <sha>  (build against this; do not change it without telling me)
Your branch: create <builder-branch> from <slice head sha> as your first command
Files you own: <paths or globs>  (edit nothing else; ask me if you must)
Shared strings: <error codes, event names, field names, verbatim>
Order: failing test first, save RED to <evidence path>, then code, then GREEN to <evidence path>
Commands: <build, test, lint from CLAUDE.md>
Rules: <commit rules, no secrets, file size cap, project rules>
Never: push, merge into or change any branch but yours, delete worktrees, call paid services, read .env files
Questions: you cannot ask the owner; stop that part and report the question to me
Done when: <tests and checks that must pass>
Report: commits (sha and message), test output paths, anything you could not do and why
```

Choose the model for the brief from `Models per task` in `CLAUDE.md`.

## Keeping builders in sync

- When a builder reports a change to a shared contract or string, send it to every other builder that uses
  it at once (SendMessage to the agent's id or name), and mark which earlier instruction it replaces.
- When the owner changes a decision mid-build, the decisions log is updated first, then every affected builder
  is told (see the `decide` skill).
- Follow-ups go to the same builder (resume it) rather than a fresh agent, so it keeps its context.

## Bringing work back

1. Review each builder's commits before taking them.
2. Bring them onto the slice branch with `git cherry-pick <sha>...` or a merge, whichever the project's
   `Bring builder work back` key names (default: cherry-pick).
3. Resolve each conflict by hand, keeping both builders' intent. A conflict only in a generated file is
   resolved by regenerating it.
4. Run the build and the affected tests on the slice branch after each batch.

## Cleaning up

After the slice is merged or abandoned, remove the builders' worktrees and local branches (see the
`ship-slice` skill). Keep only worktrees whose agent is still running.
