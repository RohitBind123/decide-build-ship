# The changed-only gate

A full test suite for every slice gets slower with every slice, and one flaky test restarts everything. A
changed-only gate keeps each slice's gate fast and keeps the full suite for releases.

## Contents

- The tiers
- Selecting tests
- Rerun only failures
- Parallel gates on one machine
- Automating the selection
- Example selection

## The tiers

| Tier | When | What runs |
|---|---|---|
| Slice gate | Every slice, before merge approval | Static checks in full; tests for changed code, its dependents and a smoke set |
| Full suite | Before every release, and nightly or in CI on the integration branch | Everything |
| Rerun | After a failure on the same commit | Only the failed jobs, and inside them only the failed tests |

A regression outside the files a slice touched can reach the integration branch; the full suite catches it
within a day or at release. A full-suite failure is fixed first by the next slice, before new work.

## Selecting tests

Always run in full (they are fast and catch whole classes of error):

- build or compile, lint, typecheck, format check;
- contract or schema drift (generated code matches the contract);
- bundle or binary size budget, if the project has one.

Run selectively:

- unit tests in the changed packages or modules, and in the modules that import them;
- all integration tests of a layer when its shared code changed (for example any change to a request handler,
  service or migration runs all API integration tests);
- end-to-end tests for the features the slice touched;
- a fixed smoke set of the most important flows (for example sign-in, the main screen, the most-used list);
- accessibility checks for the screens the slice touched, in the light and dark themes on one browser; the
  full browser and device matrix runs with the full suite.

When unsure whether something depends on the change, include it.

## Rerun only failures

- A job that passed on a commit stays passed for that commit.
- After a failure: fix, commit, and run the gate selection again on the new commit.
- A failure that looks flaky (a timeout under load, a port in use) is rerun once on the same commit, only for
  the failed tests. If it fails again, it is a real failure.
- The evidence lists every attempt with its commit sha.

## Parallel gates on one machine

- Each worktree uses its own ports and throwaway database, derived from its path or set in its brief.
- Keep per-gate parallelism modest (for example two test workers) so several gates can run at once.
- A heavy step that cannot share the machine (a large integration shard, a device farm) takes turns through a
  lock file in the repository's git directory. The lock records its owner process and is released on exit.
- Before starting another heavy gate, check the machine's load, free memory and free disk.
- Never remove a lock you did not create, except one whose owner process is gone, and log that you did.

## Automating the selection

If the project automates the gate, keep the selection rules in one script with its own tests. A missed
dependency means a missed test, so the selection logic deserves the same care as product code. The script
writes a summary file: the plan with the reason for each step, and every attempt with its commit.

Record the gate command in `CLAUDE.md` under `Gate`, for example:

```
- Gate: `./scripts/gate.sh slice` (changed-only); `./scripts/gate.sh rerun <summary>` after a flaky failure
- Full suite: `./scripts/gate.sh all`, before releases and in CI on the integration branch
```

## Example selection

Loafly slice 2 (pickup slots) changed `api/slots/*`, `web/src/order/*` and one migration:

```
build, lint, typecheck, format       always
contract drift                       always
unit: api/slots, api/orders          changed, and orders imports slots
integration: all API tests           a migration changed
e2e: order flow, slot admin          features touched
smoke: sign-in, order board          fixed set
a11y: order form, slot admin         screens touched, light and dark, one browser
```
