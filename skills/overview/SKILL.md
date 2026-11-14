---
name: overview
description: Answers "where are we?" in one read-only report - milestone and slice progress from the roadmap, what merged and shipped, what is being built or verified right now (branches, worktrees, background agents), questions waiting for the owner, decisions still proposed, failing gates, risks, blockers and the next steps - built from the repository's files and git state, never from memory. Can render the same report as a shareable page. Use when the owner asks for an update, a status, an overview, progress, a summary of what was done, "what's next", "what's blocked", or "what do you need from me", and at the end of each milestone.
license: MIT
---

# Overview

The owner should be able to step away and come back to one clear answer. This skill reads; it never changes
code, branches or decisions.

## Before you start

Read the `Build workflow` section of `CLAUDE.md` for the paths: `Roadmap` (default `docs/spec/roadmap.md`),
`Decisions log`, `Feature docs`, `Evidence`, `Handoff file`, `Changelog`, `Backlog`, and the branches. Missing
files are reported as missing, not guessed.

## 1. Gather the facts

Collect these in parallel; each fact keeps the file or command it came from:

1. **Git:** current branch and head sha, integration branch head, slice branches not yet merged and how far
   behind they are, `git worktree list`, uncommitted changes.
2. **Roadmap:** each milestone and slice with its status; the current milestone.
3. **Feature docs and evidence:** for each in-flight slice, its phase (planned, building, verifying, ready to
   merge), the latest gate result and sha, open review findings.
4. **Decisions log:** `Proposed` decisions, standing approvals in force and their conditions.
5. **Handoff file:** running agents, questions waiting for the owner, the recorded next step.
6. **Running work:** background agents and tasks the session can list, and CI status when a CI tool is
   available.
7. **Changelog and backlog:** what shipped since the last overview; deferred items and blockers.

Never read `.env` files or secrets. If two sources disagree (the roadmap says "Done" but the branch is not
merged), report the disagreement instead of picking one.

## 2. Write the report

Use [assets/overview-report.md](assets/overview-report.md). Rules:

- Lead with the one-line answer: the milestone, how far along it is, and whether anything waits for the owner.
- Progress is counted from slices, not guessed as a percentage of effort: "3 of 5 slices merged".
- Each item links to its file, branch or evidence folder.
- "Needs you" lists only what only the owner can do, each as a question with a recommendation.
- Missing data is shown as missing ("no gate run yet"), never as zero or as done.
- Plain words; no internal codes without a label.

Keep it to one screen. Put detail behind links.

## 3. Ask what is needed

If anything waits for the owner, ask it with AskUserQuestion right after the report, explained the way `decide`
explains questions. An answer goes to `decide` to be reviewed and recorded before any work uses it.

## 4. A page to share (optional)

When the owner asks for a page, a dashboard or something to share, render the same report as a page with the
tool the session offers for that (an artifact or document tool), or as a single self-contained HTML file in the
evidence folder. Show slice progress per milestone as a simple bar or table; no invented metrics. The page holds
no secrets, local paths or personal data.

## Next

Questions answered: back to `autopilot` or the skill the next step names.
