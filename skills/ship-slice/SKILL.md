---
name: ship-slice
description: Merges and releases safely - only when the gate is green on the exact commit, the live check passed, user-facing wording is approved, and the owner has approved the merge (asked with AskUserQuestion, or covered by a recorded standing approval). Never force-pushes or rebases shared branches, never pushes to an unconfigured remote, never skips hooks. Covers the release to production, the after-merge wrap-up (doc statuses, changelog, backlog, handoff) and worktree cleanup. Use when a verified slice is ready to merge, when someone asks to merge, ship, release or deploy, or to push to a shared branch, and after a merge to tidy up. Always use it when someone asks to force-push, rewrite, squash or clean up the history of a shared branch such as main, or says to merge or push without checking with them.
license: MIT
---

# Ship a slice

Shipping is where mistakes become hard to undo. Every step here checks a condition or asks for an approval
before it acts.

## Before you start

Read the `Build workflow` section of the project's `CLAUDE.md` for `Branches` (integration branch, production
branch, slice branch pattern, merge style), `Remote`, `Approvals` (what needs the owner and any standing
approvals), `Commands` and `Release steps`. Read the standing approvals in the decisions log. Missing
`Remote`: use `origin`. Missing branches, merge style or release steps: ask the owner; never assume them.

Copy this checklist into your reply:

```
Ship progress:
- [ ] 1. Preconditions met on the exact head being merged
- [ ] 2. Owner approved the merge (or a recorded standing approval covers it)
- [ ] 3. Merged the project's way; shared branches never force-pushed
- [ ] 4. Push approved separately (unless covered)
- [ ] 5. Wrap-up: statuses, changelog, backlog, handoff
- [ ] 6. Cleanup script ran with --apply; its summary reported
```

## 1. Preconditions

All of these hold on the exact commit you will merge:

- the gate is green, with the evidence summary naming that sha;
- the live check passed;
- review findings are fixed or accepted with a recorded reason;
- every new user-facing sentence is approved by the owner;
- the feature doc lists nothing as "still needs owner approval".

If the integration branch moved, rebase the slice branch onto it, rerun the gate on what changed, and record
the new sha. A merge never skips a precondition, even under a standing approval.

## 2. Ask for approval

Report what shipped, the evidence path, the gate result and sha, and any open items. Then ask with the
AskUserQuestion tool: "Approve merge" (recommended when everything above holds) or "Not yet".

- The tool is denied, unavailable or unanswered: that is not an approval. Ask in plain text and stop until the
  owner answers.
- A standing approval can replace the question only if the owner's own words (or the full question and the
  option they chose) are recorded verbatim, with a date and conditions, in the decisions log, and only within
  those conditions. Say which one you rely on. Never write a
  standing approval yourself from an inference.

## 3. Merge the project's way

- Use the merge style in `CLAUDE.md`: for example a fast-forward merge into the integration branch from the main
  checkout, or a pull request. Do not switch styles on your own.
- Never rebase, reset or force-push a shared branch (the integration or production branch). On your own slice
  branch, use `--force-with-lease`, never `--force`.
- Push only to the configured remote. Never bypass hooks (`--no-verify`) or signing unless the owner asks for
  that specific push.
- Pushing a shared branch needs its own approval unless a standing approval covers it.

## 4. Release

The production branch moves only on a release the owner approves. Release steps, checks and rollback:
[references/release.md](references/release.md).

## 5. After the merge

1. Set the ADR to Accepted and the feature doc to Shipped; mark the slice merged in the roadmap; add the
   changelog entry.
2. Move deferred items, owner actions and blockers to the backlog, each with its source.
3. Update the handoff file's "next step" to the next slice (`handoff` skill).
4. Run the cleanup script from the main checkout, dry run first, then `--apply`
   ([scripts/cleanup-slice.sh](scripts/cleanup-slice.sh), details in the release reference). It removes merged
   worktrees with their build output, merged local branches and stale worktree records, and keeps anything with
   unmerged commits, uncommitted work, a lock or a running process. Report its summary line. Do not mark the
   slice done while it lists a worktree of this slice as kept without a reason you can state.
5. Ask the owner before starting the next slice, unless `autopilot` is running the milestone under a recorded
   standing approval.
