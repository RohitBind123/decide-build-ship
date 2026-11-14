# Releases, rollback and cleanup

## Contents

- Standing approvals
- Release checklist
- Hotfixes
- Rollback
- Abandoning a slice
- Worktree and branch cleanup

## Standing approvals

An owner may approve a class of actions in advance, for example "merge slices to the integration branch when
the gate is green". Record each one in the decisions log with:

- the owner's words verbatim and the date;
- what it covers and what it does not (for example "not releases to production");
- the conditions that still apply (for example "wording still needs approval").

When you rely on one, name it in your report. When in doubt about whether it covers an action, ask.

## Release checklist

Releases move the production branch. Before asking the owner to approve a release:

1. The full suite is green on the exact commit (not only the slice gates).
2. Migrations have been checked against synthetic or anonymised data with production's shape and size: rows
   that would violate new constraints counted, long locks avoided, and the rollback path known.
3. The changelog lists every user-visible change since the last release.
4. New settings and secrets are documented and present in the target environment (checked by name, never by
   printing values).
5. Monitoring for the changed flows exists: errors, latency and, for AI features, cost and eval drift.
6. A rollback plan is written down (below).

Ask with the question tool: "Approve release <version>". After approval, release the project's way (for
example a fast-forward of the production branch from the integration branch, a tag, then the deploy command in
`CLAUDE.md`), and record the release in the changelog and the decisions log.

## Hotfixes

A fix that cannot wait for the next release:

1. Branch from the production branch (`fix/<slug>`), not from the integration branch.
2. Write a failing test that reproduces the problem, then the smallest fix.
3. Run the gate for what changed, plus the tests the owner agrees are enough for an urgent release.
4. Ask the owner to approve the hotfix release; release it the project's way.
5. Bring the same fix into the integration branch (cherry-pick or merge) so the next release keeps it.

## Rollback

Write before the release:

- how to roll back the code (redeploy the previous tag, or revert the merge commit);
- how to roll back data changes, or why they are one-way and what the forward fix is;
- who decides to roll back, and the signal that triggers it.

A rollback of a shared branch is a new commit (a revert), never a force-push.

## Abandoning a slice

When the owner stops a slice: record the decision and the reason in the decisions log, set the feature doc's
status to Abandoned with a pointer to that entry, move anything worth keeping to the backlog, then clean up as
below. Never delete the slice branch from the shared remote without asking.

## Worktree and branch cleanup

Each worktree holds a full checkout and its build output. After a slice is merged or abandoned:

```bash
git worktree list                      # see what exists
git worktree unlock <path>             # only if it is locked and its agent has finished
git worktree remove <path>
git branch -d <slice-or-builder-branch> # use -D only for an abandoned branch you own
```

Keep any worktree whose agent is still running. Never remove another session's worktree or branch.
