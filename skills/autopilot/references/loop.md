# The loop

How autopilot chooses work, runs slices in parallel, and recovers from a restart.

## Contents

- State lives in files
- One iteration
- Choosing slices
- Running slices in parallel
- Recovering after a restart
- Model per task

## State lives in files

Autopilot keeps no state that only exists in the conversation. After a restart or compaction, these files tell
the next session everything:

| File | Holds |
|---|---|
| Roadmap | milestone and slice statuses, dependencies, parallel marks |
| Decisions log | answers, `Proposed` decisions, standing approvals |
| Feature docs | the plan of each slice and its status |
| Evidence folders | gate plans and results, reviews, live checks |
| Handoff file | what is running, what waits for the owner, the next step |

## One iteration

```
read roadmap, decisions log, handoff file; check git state
if a slice is in flight: continue it from its current phase
else: pick the next slices (below)
for each picked slice: decide, plan-slice, build-slice, verify-slice, ship-slice
after every phase change: update roadmap status and the handoff file
if owner questions are pending: ask, or record them for an unattended run
if the milestone is done: milestone wrap-up, then stop
```

## Choosing slices

1. Only slices of the current milestone, in roadmap order.
2. Skip a slice whose dependencies are not merged, or that needs a `Proposed` decision.
3. Prefer the slice that tests the riskiest remaining assumption.
4. A slice too large to review in one sitting goes back to `plan-slice` to be split first.

## Running slices in parallel

- Only slices the roadmap marks `parallel` with each other, and only when the planned file lists do not overlap.
  Shared files (routers, registries, lock files, migrations) make slices sequential.
- Up to `Max parallel slices` at once (default 2). Each has its own branch from the integration head and its own
  worktree; inside a slice, `build-slice` may still run several builders.
- Merge one slice at a time. After each merge, rebase the next one onto the new integration head and rerun its
  changed-only gate before merging it.
- Database migrations from parallel slices are numbered at merge time, not when written, so they cannot clash.

## Recovering after a restart

Run `handoff` in resume mode. Check `git status`, `git worktree list`, the branches of in-flight slices, and
whether recorded agents still exist. A builder that no longer exists is restarted from the slice's last commit;
its brief is in the feature doc. Never assume an in-flight merge finished: check the integration branch log.

## Model per task

Follow `Models per task` in `CLAUDE.md`. For long runs the default split keeps cost down without lowering
quality: the smallest model for code search and docs, the mid-size model for building, tests and most reviews,
the largest model for slice planning, architecture and security review.
