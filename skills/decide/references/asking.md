# Asking the owner

How to explain a question and ask it so the owner can answer quickly and correctly the first time.

## Contents

- When to ask, and when not to
- The explanation block
- The question dialog
- Wording approval
- When the dialog is unavailable
- After the answer

## When to ask, and when not to

Ask only when the spec is silent, contradicts itself, is not feasible now, or is missing a constant, default,
threshold, limit or on-screen wording. Everything else you decide and report in one line with a citation:

> Spec section 4.2 says orders close at 8 pm the day before pickup, so the order form closes then. No question
> needed.

Batch questions. Ask everything that blocks the next step in one round rather than one question per message.

## The explanation block

Write this in your message before you open the dialog, one short block per question:

```
D3. What happens when a customer misses their pickup?

Story: Sam orders two sourdough loaves for Saturday 9 am and does not come. At closing time the order is
still on the board.

Option A (recommended): the order is marked "Not collected" at closing time and the bakery owner sees a
weekly count. Sam gets one message the next day.
Option B: staff mark it by hand. If nobody does, the board fills up with old orders.

Spec: section 5 covers pickup but not missed pickups.
Why I recommend A: it keeps the board clean without staff effort and gives the owner the number they asked
for in section 2.
```

Keep it plain. No internal names, codes or jargon the owner did not use first.

## The question dialog

Use the AskUserQuestion tool and keep within the limits in its schema (typically up to four questions per call,
each with two to four options and a header of a few words); the tool adds a free-text "Other" answer.

- Each question stands on its own: restate the situation in one line, because the dialog may hide your message.
- The recommended option comes first and ends with "(Recommended)".
- Every option carries a concrete example of what the user would see.
- One decision per question. Split "who can cancel and what they are told" into two questions.

Example question (shape only; adapt it to the tool's actual schema):

```
question: "A customer misses their pickup. What should happen to the order?"
header: "Pickup miss"
options:
  - label: "Auto-mark at closing (Recommended)"
    description: "At closing time the order shows 'Not collected'; Sam gets one message next day."
  - label: "Staff mark by hand"
    description: "Orders stay on the board until someone marks them."
```

## Wording approval

Every new sentence that a user will read is a decision. Collect them in one list with real examples and ask
once:

```
New wording for slice 2 (pickup slots):
1. Button: "Choose a pickup time"
2. Empty state: "No pickup times left today. Try tomorrow from 7 am."
3. Confirmation: "See you Saturday at 9:00 am, Sam."

Approve all / Change some
```

## When the dialog is unavailable

If the tool call is denied, or the owner is on a client without the dialog, ask the same questions as numbered
plain text with lettered options:

```
1. Missed pickup: A) auto-mark at closing (recommended)  B) staff mark by hand
2. Reminder time: A) two hours before the slot (recommended)  B) 7 am on the day
Reply like "1A 2A".
```

## After the answer

1. Record each answer in the decisions log at once, in the owner's words.
2. Review each answer from every perspective before anyone builds on it
   ([perspectives.md](perspectives.md)).
3. Confirm back in one line per answer: "D3: auto-mark at closing. Recorded."
