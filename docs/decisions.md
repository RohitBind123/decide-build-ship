# Decisions log

The durable record of every product decision: what was asked, what the owner answered in their own words,
and what each answer replaced. Builders are briefed from this file. Never edit an accepted entry to change its
meaning; add a new entry that replaces it.

Status values: `Proposed` (asked, no answer yet), `Accepted`, `Replaced by D<n>`, `Needs owner approval`.

## Index

| ID | Topic | Status | Date |
|---|---|---|---|
| D1 | Squash-merge detection method | Accepted | 2026-11-16 |
| D2 | Item 7 (eval case): keep or drop | Accepted | 2026-11-16 |
| D3 | Where the cleanup gate lives | Accepted | 2026-11-16 |
| D4 | Session-start report scope | Accepted | 2026-11-16 |

## D1. How to detect a squash-merged slice

- Asked: 2026-11-16, in M1
- Spec: docs/spec/spec.md requirement 2 (offline, no owner question)
- Options offered: A) `git merge-tree --write-tree` equals base tree (offline) (recommended), B) `gh pr view` merged state (needs network and gh)
- Owner's answer, verbatim: "Offline git check (Recommended)"
- Review: engineering cost - offline check avoids a gh dependency; fall back to keep when git is too old for merge-tree
- Status: Accepted
- Replaces: nothing
- Applies to: S2

## D2. Item 7, the eval case

- Asked: 2026-11-16, in M1
- Spec: requirement 6
- Options offered: A) keep one eval (recommended), B) drop
- Owner's answer, verbatim: "review 7 if need otherwise drop"
- Review: existing evals cover ship-slice approval and force-push only; nothing guards the new cleanup step, and a skill-wording change is exactly what regresses silently. Kept, one case.
- Status: Accepted
- Replaces: nothing
- Applies to: S5

## D3. Where the cleanup gate lives

- Asked: 2026-11-16, in M1
- Spec: requirement 4
- Options offered: A) ship-slice step 5 and handoff checklist, plus autopilot step (recommended), B) verify-slice
- Owner's answer, verbatim: "ship-slice, handoff, autopilot (Recommended)"
- Review: verify-slice runs before merge so a merged slice cannot be checked there; ship-slice and handoff run after.
- Status: Accepted
- Replaces: nothing
- Applies to: S4

## D4. Session-start report scope

- Asked: 2026-11-16, in M1
- Spec: requirement 3
- Options offered: A) report only: count and size of merged worktrees (recommended), B) offer to clean
- Owner's answer, verbatim: "Report only (Recommended)"
- Review: the hook runs on every session of every user; it must stay fast and never delete.
- Status: Accepted
- Replaces: nothing
- Applies to: S3

## Standing approvals

Approvals the owner has given in advance, with their conditions. Example:

- <YYYY-MM-DD>: "Merge slices to the integration branch when the gate is green." Conditions: live check passed,
  user-facing wording approved. Does not cover releases to production.
