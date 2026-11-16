# Spec: slice cleanup you can trust (milestone M1)

## Problem

Parallel slices leave worktrees, build output and merged branches on the builder's laptop. Cleanup was prose
only, so it was skipped. The builder must never need to think about it during development.

## Requirements

1. After every merge, merged slice worktrees (with build output), merged local branches and stale worktree
   records are removed by `skills/ship-slice/scripts/cleanup-slice.sh` (done, PR #5).
2. A squash-merged slice is detected as merged without network access and without asking the owner.
3. A new session reports leftover merged worktrees (count, size) and never deletes anything.
4. `autopilot` runs cleanup after each slice merge; `ship-slice` and `handoff` do not call a slice done while
   its worktree is still on disk.
5. The package published to npm contains no project decisions, evidence or handoff files.
6. Behaviour that depends on skill wording has an eval case.
7. Release 0.3.0 only with the owner's approval of each step.

## Non-goals

Deleting remote branches, cleaning temp evidence files, killing processes without `--stop-procs`.

## Done when

`npm test` and `claude plugin validate . --strict` pass, the cleanup script ran against this milestone's own
real worktrees, and the owner approved each merge and the release.
