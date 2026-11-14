# Decisions log

The durable record of every product decision: what was asked, what the owner answered in their own words,
and what each answer replaced. Builders are briefed from this file. Never edit an accepted entry to change its
meaning; add a new entry that replaces it.

Status values: `Proposed` (asked, no answer yet), `Accepted`, `Replaced by D<n>`, `Needs owner approval`.

## Index

| ID | Topic | Status | Date |
|---|---|---|---|
| D1 | <topic> | Accepted | <YYYY-MM-DD> |

## D1. <Short question>

- Asked: <YYYY-MM-DD>, in <slice or milestone>
- Spec: <file and section, or "silent">
- Options offered: A) <option> (recommended), B) <option>
- Owner's answer, verbatim: "<exact words or chosen label>"
- Review: <one line per perspective that raised something, or "No concerns">
- Status: Accepted
- Replaces: <D-number or "nothing">
- Applies to: <slices, screens, services>

## Standing approvals

Approvals the owner has given in advance, with their conditions. Example:

- <YYYY-MM-DD>: "Merge slices to the integration branch when the gate is green." Conditions: live check passed,
  user-facing wording approved. Does not cover releases to production.
