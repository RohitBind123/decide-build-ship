---
name: plan-slice
description: Turns a spec and settled decisions into a plan of thin vertical slices, then plans the next slice before any code - decisions list, edge cases, test plan (including evals for AI features), risks, the screens people need to manage what the slice adds, an evidence plan, and a file list with one owner per file set. Writes the feature doc and, for architectural choices, an ADR. Use after decisions are settled and before building, when splitting a settled feature, milestone or MVP into slices, when a piece of work feels too big, or when someone asks for a plan, a breakdown or a task list.
license: MIT
---

# Plan a slice

A slice is the thinnest piece of work that a real user can see working end to end: a screen, the API behind
it, the data it stores, and the tests that prove it. Planning writes documents only: no product code until the
plan and its docs are committed.

Skip this skill for a change small enough to describe in one sentence and review in a minute (a one-file fix,
a rename); just do it, test first.

## Before you start

Read the `Build workflow` section of the project's `CLAUDE.md` for `Spec`, `Decisions log`, `Feature docs`
(default `docs/features/`), `ADRs` (default `docs/adr/`), `Evidence` (default `docs/evidence/<slice>/`),
`File size cap` (default none), `Models per task` and `Product type`. Missing keys: use the defaults and say so
once.

Copy this checklist into your reply:

```
Plan progress:
- [ ] 1. Research done (spec, decisions, existing code map)
- [ ] 2. Work split into slices, ordered by risk
- [ ] 3. Next slice planned: goal, decisions, edge cases, tests, files, screens, evidence, risks
- [ ] 4. New open questions sent to decide
- [ ] 5. Feature doc (and ADR if needed) written and committed
```

## 1. Research

1. Read the spec sections the work touches and every related entry in the decisions log.
2. Map the existing code with a read-only search agent on the cheapest suitable model: it returns a file:line
   report of what exists, what to reuse and what to avoid. It must not edit files or read secrets.
3. Look for an existing pattern or library before planning new code.

## 2. Split into slices

Follow [references/slicing.md](references/slicing.md). In short:

- Each slice is vertical (screen to storage), demonstrable, and small enough to review in one sitting.
- Order slices by risk: the assumption most likely to be wrong goes first.
- Every slice that adds something people must manage also delivers the screen to manage it, in the same
  milestone. Nothing stays API-only for long.

## 3. Plan the next slice

For a large or risky slice, delegate the draft to a planning sub-agent on the model that `Models per task`
names for planning, then review it yourself. The plan covers:

1. **Goal**: one sentence a user would recognise.
2. **Decisions** D1..Dn: link each to the decisions log; mark any still open.
3. **Edge cases** E1..En: empty, one, many, very large; missing and invalid data; permissions; concurrency and
   retries; time zones and period boundaries; failure halfway.
4. **Test plan**: unit tests for logic, integration tests for each endpoint or job, end-to-end tests for each
   user flow, accessibility checks for screens. For AI features, the eval cases and pass bar first
   ([references/ai-slices.md](references/ai-slices.md)).
5. **Contract**: the API, event, schema or prompt and tool interfaces the slice adds, defined before code.
6. **Screens**: every screen an admin or user needs to manage what the slice adds. If one is not in this
   slice, name the slice that delivers it and raise it with the owner.
7. **File list**: new and changed files, grouped into file sets with exactly one builder each; keep every file
   under the project's size cap.
8. **Evidence plan**: the BEFORE state to capture now and the AFTER state to capture when done.
9. **Risks and out of scope**: what could go wrong, and what this slice deliberately does not do.

Every constant, default, threshold and piece of wording in the plan cites the spec line or the decision it
comes from. If it has no source, it is an open question.

## 4. Send new questions to decide

Anything the plan surfaced that the spec and the log do not answer goes back through the `decide` skill before
building. Do not start building on a guess.

## 5. Write the docs and commit them first

1. Write the feature doc from [assets/feature-doc.md](assets/feature-doc.md).
2. Write an ADR from [assets/adr.md](assets/adr.md) when the slice makes an architectural choice: a new
   dependency, a new data store or schema pattern, a change to how components talk, a security model.
3. Capture the BEFORE evidence.
4. Create the slice branch from the integration branch (name pattern from `CLAUDE.md`, default
   `feat/<slice>`) and commit the docs on their own (`docs: plan <slice>`).

## Next

Docs committed: run `build-slice`.
