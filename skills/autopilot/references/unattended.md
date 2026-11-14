# Running unattended

Ways to keep autopilot working while the owner is away, and the guard rails for each. Use the ones the owner's
Claude Code setup supports; check the current Claude Code documentation for exact limits.

## Contents

- Choosing a mode
- In the current session: /loop
- Background sessions and agents
- Scheduled cloud runs
- Permissions
- Notifications
- Guard rails

## Choosing a mode

| Situation | Use |
|---|---|
| The owner is nearby and checks in now and then | the current session, with builders as background agents |
| The owner leaves for hours; the machine stays on | a self-paced `/loop` in the current session |
| Work should continue with the laptop closed | a scheduled cloud run on a fresh clone |
| Several milestones or repositories at once | separate background sessions, one per repository |

## In the current session: /loop

`/loop` repeats a prompt while the session is open and idle. Without an interval it paces itself. A good prompt:

```text
/loop Continue autopilot for the current milestone. Read the handoff file first. Do one iteration of the
loop, update the roadmap and handoff file, then stop until the next wake-up. If questions wait for the owner,
work only on slices that do not depend on them.
```

Background agents finish and wake the session on their own; do not use short wake-ups only to poll them.

## Background sessions and agents

- Builders and reviewers run as background sub-agents, each in its own git worktree.
- A whole repository can run as a background session, so the main terminal stays free.
- Resume a finished agent with a message instead of starting a new one, so it keeps its context.

## Scheduled cloud runs

Cloud runs start from a fresh clone and cannot see local files, local databases or uncommitted work. Use them
only when:

- the handoff file, roadmap and decisions log are committed and pushed on a branch the run can read;
- the live check can run in the cloud environment with synthetic data;
- the run pushes only to its own slice branches, and merges still follow the approvals.

## Permissions

- Prefer an allowlist of the project's build, test and git commands over broad permission modes.
- Auto mode reduces prompts by checking each action with a classifier; it does not make an action safe. Keep
  the approvals in `CLAUDE.md` as the source of truth.
- Never run with all permission checks bypassed on a machine that holds real credentials or customer data.

## Notifications

When a push-notification or messaging tool is available, notify the owner when a question batch is waiting,
when a slice is blocked, and when a milestone is done. Keep messages short and free of secrets or personal data.

## Guard rails

- Every iteration starts by checking the real git state, not by trusting the conversation.
- Commit and push the handoff file on the slice branch at every phase change.
- Stop the loop when the milestone is done, when everything left waits for the owner, or when the same failure
  repeats twice.
- Long runs use the same gates as attended runs. A run that cannot meet the bar stops and reports.
