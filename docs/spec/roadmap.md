# Roadmap

## M1: slice cleanup you can trust

| Slice | What | Depends on | Parallel with | Status |
|---|---|---|---|---|
| S0 | Merge PR #5 (cleanup script) and the kickoff files; run the script on a real worktree | - | - | Planned |
| S1 | Package hygiene: keep decisions, evidence, handoff and templates out of the npm package | S0 | - | Planned |
| S2 | Squash-merge detection in the cleanup script (offline, `git merge-tree`) | S0 | S3 | Planned |
| S3 | SessionStart hook reports merged worktrees left on disk, report only | S0 | S2 | Planned |
| S4 | `autopilot` cleanup step; `ship-slice` and `handoff` cleanup gate | S2, S3 | - | Planned |
| S5 | Eval case: after a merge, `ship-slice` runs the cleanup script dry run first | S4 | - | Planned |
| S6 | Release 0.3.0: version, changelog, npm publish, tag (always asks) | S1-S5 | - | Planned |

Demo: run a two-slice autopilot in a temp repo and show no worktree, branch or build folder left afterwards.
