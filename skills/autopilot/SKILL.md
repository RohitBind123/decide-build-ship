---
name: autopilot
description: Drives the whole build loop on its own once the spec and roadmap are approved - picks the next slice from the roadmap, runs decide, plan-slice, build-slice, verify-slice and ship-slice for it, runs independent slices in parallel, keeps the handoff file and roadmap current, and continues slice after slice until the milestone is done. Stops only for what needs the owner - product decisions, the per-milestone merge approval, production releases, money, new dependencies, deleting data, or a gate it cannot get green - and batches those questions while other work continues. Supports unattended runs with /loop, background agents and scheduled cloud runs. Use when the owner says "keep going", "build the whole milestone", "run it autonomously", "build the MVP", "work through the roadmap", or wants to step back and only check progress.
license: MIT
---

# Autopilot

The owner decides what the product does and approves what reaches users. Everything between those points runs
without them. Autopilot never lowers the bar: every slice still goes through every gate the manual flow uses.

## Before you start

Read the `Build workflow` section of `CLAUDE.md` (`Autonomy`, `Max parallel slices`, `Approvals`, `Branches`,
`Commands`, `Live check`, `Models per task`), the roadmap (default `docs/spec/roadmap.md`), the decisions log and
the handoff file. Check the preconditions; if one fails, say which and run the skill that fixes it:

| Precondition | Fix with |
|---|---|
| `Build workflow` section exists with commands, branches and live check | `kickoff` |
| Spec and roadmap approved | `discover` |
| No decision the next slice depends on is `Proposed` | `decide` |
| `Autonomy: milestone` only: a standing merge-and-push approval for this milestone in the decisions log | step 1 below |

Copy this checklist into your reply and keep it current:

```
Autopilot: milestone <M>
- [ ] 1. Preconditions met; milestone merge approval recorded
- [ ] 2. Next slices picked; parallel ones identified
- [ ] 3. Each slice: plan, build, verify, ship (repeat)
- [ ] 4. Owner questions batched and asked; answers applied
- [ ] 5. Milestone done: demo, release question, overview
```

## 1. Milestone approval

Read `Autonomy` in `CLAUDE.md` (default `milestone`).

- **`milestone`:** explain what autopilot will do (the slices, the integration branch, the remote, what still
  asks), then ask with AskUserQuestion: "Approve merging and pushing verified slices of M1 to develop on origin"
  or "Ask me for each merge". Record a standing approval in the decisions log under the milestone: the full
  question text, the option the owner chose, any words they added, the date, and its conditions (milestone,
  branch, remote, "only when every ship-slice precondition holds"). An entry without a date and conditions does
  not count. Never write it from an inference.
- **`per merge`**, or the owner chose "Ask me for each merge": autopilot runs each slice through `ship-slice`
  step 2 and asks there, slice by slice. No standing approval is needed or recorded.

Production releases, spending money, new dependencies and deleting data are never covered by a standing
approval; they always ask.

## 2. Pick the next slices

Follow [references/loop.md](references/loop.md). Take slices from the current milestone in roadmap order whose
dependencies are merged. Run slices in parallel only when the roadmap marks them parallel and their file sets do
not overlap, up to `Max parallel slices` (default 2). Each parallel slice gets its own branch and worktree.

## 3. Run each slice

For each slice, run the skills in order and let each one finish its own checklist:

1. `decide` for any open point the slice needs. Questions go to the batch (step 4); the slice waits.
2. `plan-slice`: feature doc committed before code.
3. `build-slice`: contract first, failing tests first, builders in worktrees.
4. `verify-slice`: changed-only gate, reviews, live check, evidence.
5. `ship-slice`: merges and pushes under the standing approval when every precondition holds; in `per merge`
   mode, asks first.

Update the roadmap status and the handoff file at every phase change. Log each step in the evidence folder,
not only in the conversation.

## 4. When to stop and ask

Stop the affected slice, keep independent slices going, and batch the questions. The full list is in
[references/stop-rules.md](references/stop-rules.md). The main ones:

- a product decision the spec and log do not answer, or an answer that review finds risky;
- the gate or live check still red after two fix attempts on the same cause;
- a merge the standing approval does not cover, a production release, money, a new dependency, deleted data;
- a security finding rated critical, or anything touching real customer data;
- the roadmap no longer fits what was learned (scope change).

Ask with AskUserQuestion, at most four questions per round, each explained with a short story and a
recommendation. Unattended, write the batch to the handoff file's "Waiting for an answer" list, send a push
notification when a tool for it is available, and continue with work that does not depend on the answers.

## 5. Milestone done

1. Check every slice is merged with evidence, and the full suite is green on the integration branch.
2. Run `overview` and show the owner the demo steps from the roadmap.
3. Ask whether to release (`ship-slice` release steps) and whether to start the next milestone, which needs its
   own merge approval.

## Running unattended

How to keep going without the owner watching (self-paced `/loop`, background sessions, scheduled cloud runs,
auto mode, notifications) and the guard rails for each: [references/unattended.md](references/unattended.md).
Quality rules do not relax when nobody is watching.

## Next

Milestone done and approved: start the next one here. Owner asks "where are we?": run `overview`.
