---
name: build-slice
description: Builds a planned slice the disciplined way - docs before code, contract first, test-driven (a failing test saved before the code), and parallel sub-agents in separate git worktrees with a model chosen per task and exactly one writer per file set. Covers briefing builders, bringing their commits back, keeping shared contract strings in sync, and AI-specific build rules (prompts as versioned files, pinned models, validated model output, untrusted content as data). Use when implementing a planned slice or feature, when delegating implementation to sub-agents, or when someone says "build it", "implement this" or "start coding".
license: MIT
---

# Build a slice

Build only what the plan and the decisions say, test first, and keep parallel builders from stepping on each
other.

## Before you start

Read the `Build workflow` section of the project's `CLAUDE.md` for `Commands`, `Branches`, `Models per task`,
`Coverage target` (default 80% of new code), `File size cap`, `Commit rules` and `Project rules`. Check that the
feature doc for the slice exists and is committed. If it does not, run `plan-slice` first.

For a small change (one file, an obvious fix, a rename), skip the worktrees and builders: write the failing
test, make the change, run the related tests. A bug fix always starts with a test that reproduces the bug.

Copy this checklist into your reply:

```
Build progress:
- [ ] 1. Feature doc and ADR committed on the slice branch
- [ ] 2. Contract written, generated code updated, committed on its own
- [ ] 3. Builders briefed, one per file set, each in its own worktree
- [ ] 4. RED run saved for each area before its code
- [ ] 5. GREEN run saved; coverage meets the target
- [ ] 6. Builder commits brought back to the slice branch
```

## 1. Docs before code

The feature doc (and the ADR, when there is one) is committed before any code. If building reveals that a
decision is wrong or missing, stop that part and go back to `decide`. Do not decide it in code.

## 2. Contract first

When the slice adds or changes an interface (an HTTP API, an event, a database schema, a shared type, a prompt
or tool definition):

1. Write the contract file first (for example an OpenAPI or schema file, or the typed interface).
2. Regenerate any generated clients or types.
3. Commit the contract on its own and keep the build green.

Parallel builders then work against the committed contract, not against each other's guesses.

## 3. Test-driven

For each piece of behaviour: write the test, run it, see it fail for the right reason, and save that RED output
to the evidence folder. Then write the minimal code to pass, run it GREEN, save that output, and refactor.
Every user flow gets both unit tests and an end-to-end test. Tests assert on structure and state, not on
generated wording.

Coding discipline (think first, simplest code, surgical changes, verifiable goals):
[references/coding-discipline.md](references/coding-discipline.md).

## 4. Parallel builders

Use parallel sub-agents only for independent file sets. Full briefing template and the return path:
[references/parallel-agents.md](references/parallel-agents.md). The rules:

- **One worktree per builder** (the Agent tool's worktree isolation, or `git worktree add`). A worktree may
  start on an old commit: the builder's first command creates its branch from the slice head sha.
- **One writer per file set.** No two builders edit the same file. Shared files (a router, a registry, a lock
  file) belong to one builder or to you.
- **A model per task**, from `Models per task` in `CLAUDE.md`. Default: the smallest fast model for search,
  docs and mechanical edits; a mid-size model for implementation, tests and reviews; the largest model only for
  architecture and hard security or concurrency design.
- **Same strings in every brief.** Builders that share a contract (error codes, event names, JSON field names)
  get the exact strings in each brief. When one reports a contract change, relay it to the others at once.
- **Resume, do not respawn.** Follow-ups go to the builder that wrote the code, so it keeps its context.
- **Bring work back** with cherry-pick or merge, as the project's `Bring builder work back` key says (default:
  cherry-pick). Resolve conflicts by hand; never resolve one by dropping the other builder's change.
- **Builders never push, merge into shared branches, or spend money.** They cannot ask the owner; they report
  open questions back to you, and you take them to `decide`.

## 5. Standing rules while building

- Stage explicit paths only; never `git add -A` or `git add .`.
- Conventional commit messages, following the project's commit rules.
- Never read, print or commit secrets or `.env` files. Document new settings in the example env file.
- Keep files under the project's size cap; split by responsibility, not by line count.
- Never trade quality for speed, including in long or unattended runs.

## Next

Slice builds and its tests pass: run `verify-slice`.
