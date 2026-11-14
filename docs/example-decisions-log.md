# Example: a filled decisions log

What `docs/decisions.md` looks like after the first `decide` round for Loafly, the fictional bakery pre-order
app from the README. Riley owns the bakery and answers the questions. The template is
[skills/decide/assets/decision-log.md](../skills/decide/assets/decision-log.md).

## Index

| ID | Topic | Status | Date |
|---|---|---|---|
| D1 | Pickup slot length and hours | Accepted | 2026-03-02 |
| D2 | Orders per slot | Accepted | 2026-03-02 |
| D3 | Missed pickups | Accepted | 2026-03-02 |
| D4 | Allergen questions in the assistant | Replaced by D5 | 2026-03-02 |
| D5 | Allergen questions in the assistant | Accepted | 2026-03-02 |

## D1. How long is a pickup slot, and when are slots open?

- Asked: 2026-03-02, slice 1 (pickup slots)
- Spec: `docs/spec/loafly.md`, section 3 says "customers choose a pickup time" but gives no slot length
- Options offered: A) 30 minutes from 7:00 to 12:00 (recommended), B) 15 minutes from 7:00 to 12:00
- Owner's answer, verbatim: "30 minutes is fine, 7 till 12"
- Review: no concerns
- Status: Accepted
- Replaces: nothing
- Applies to: slice 1, order form, order board

## D2. How many orders can one slot take?

- Asked: 2026-03-02, slice 1
- Spec: silent
- Options offered: A) the owner sets a limit per slot, default 10; a full slot shows "Full" (recommended),
  B) no limit
- Owner's answer, verbatim: "A, and I want to change the limit on Saturdays"
- Review: users and roles: the limit screen must let Riley set a different limit per weekday; added to the
  slice 1 screens list
- Status: Accepted
- Replaces: nothing
- Applies to: slice 1, slot settings screen

## D3. What happens when a customer misses their pickup?

- Asked: 2026-03-02, slice 3
- Spec: silent
- Options offered: A) marked "Not collected" at closing, weekly count for the owner (recommended), B) staff
  mark by hand
- Owner's answer, verbatim: "Auto-mark at closing (Recommended)"
- Review: end customer: the next-day message must not sound like a penalty; wording goes to the approval list
- Status: Accepted
- Replaces: nothing
- Applies to: slice 3

## D4. How should the assistant answer allergen questions?

- Asked: 2026-03-02, slice 4
- Spec: section 6, "the assistant helps customers with questions about our breads"
- Options offered: A) only from the approved ingredient sheets, citing the sheet, and hand anything else to
  staff (recommended), B) from the model's general knowledge
- Owner's answer, verbatim: "B, so it can answer anything"
- Review: AI and model risks (hallucination, safety): a confident wrong answer about nuts or gluten could harm
  a customer; the rye is made on the same line as the walnut bread. Raised with the owner and asked again.
- Status: Replaced by D5
- Replaces: nothing

## D5. How should the assistant answer allergen questions? (asked again)

- Asked: 2026-03-02, slice 4, after the review of D4
- Owner's answer, verbatim: "OK, only from our sheets. Make the hand-over to staff obvious."
- Review: no further concerns; eval cases must include questions the sheets do not cover
- Status: Accepted
- Replaces: D4
- Applies to: slice 4, assistant prompt and eval set

## Standing approvals

- 2026-03-02: "When a slice's gate is green and I've approved the wording, you can merge it to develop without
  asking me again." Conditions: live check passed, wording approved. Does not cover pushes to `main` or
  releases.
