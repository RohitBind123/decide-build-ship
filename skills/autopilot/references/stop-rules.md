# Stop rules

Autopilot keeps going by default and stops only for the reasons below. When it stops, it stops only what is
affected and says why in the handoff file.

## Stop the slice and ask the owner

- A product decision the spec and the decisions log do not answer: a constant, a default, a limit, a rule,
  user-facing wording.
- Review finds the owner's earlier answer wrong or risky in the light of what building revealed.
- A scope change: the slice is bigger than planned, the roadmap order no longer makes sense, or a slice is no
  longer needed.
- A finding outside the slice that matters (`verify-slice` sends it to `decide`).

## Stop and ask before acting, always

These never run on a standing milestone approval:

- a production release or deploy;
- spending money: a paid service, a paid model run beyond the recorded budget, a new subscription;
- adding a dependency the plan did not name;
- deleting data, dropping a table, or a migration that cannot be rolled back;
- anything that touches real customer data or production systems;
- pushing to a remote or branch not configured in `CLAUDE.md`, or pushing a shared branch that the recorded
  approval does not name;
- changing CI, branch protection, secrets or permissions.

## Stop the slice and report

- The gate or the live check is still red after two fix attempts on the same cause.
- A critical security finding.
- A tool or service the slice needs is unavailable (for example the local database will not start).
- Builders conflict on a file in a way that cannot be resolved without dropping one side's change.

Report with: what failed, the evidence path, what was tried, and a recommendation. Then continue with other
slices that do not depend on this one.

## Never

- Merge with a red gate, a skipped live check, or unfixed critical, high or medium findings.
- Skip tests, lower the coverage target, disable a check, or mark a failing test as skipped to get green.
- Force-push a shared branch or bypass hooks.
- Treat silence, a timeout or a denied question tool as an approval.
- Decide a product question in code because the owner is away.

## Asking well

Batch the open questions. Ask with AskUserQuestion, up to four per round, most blocking first, each with a short
story, the options, and a recommendation. When the run is unattended, write the batch to the "Waiting for an
answer" list in the handoff file in the same format, so the owner can answer in one message ("1A 2B 3A").
