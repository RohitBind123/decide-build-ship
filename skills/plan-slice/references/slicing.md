# Slicing work

How to split a product or a feature into thin vertical slices, with notes per product type.

## Contents

- What makes a good slice
- Ordering
- Sizing
- Notes by product type
- Example: Loafly

## What makes a good slice

- **Vertical.** It goes from what the user sees to where the data is stored. A slice that only adds tables, or
  only adds a screen with fake data, is a layer, not a slice.
- **Demonstrable.** At the end you can show a real person doing something they could not do before.
- **Independent.** It can be merged on its own without breaking what is already there. Work hidden behind a
  switch counts, if the switch is off by default and tested both ways.
- **Testable.** It has a clear pass or fail: the flow works, the tests pass, the evidence shows it.

## Ordering

1. The riskiest assumption first: the part most likely to be wrong, slow, expensive or rejected by users.
2. Then the path that the most users take.
3. Then the admin and management screens that the earlier slices need.
4. Then polish, edge flows and optimisation.

When two slices are independent, they can be built in parallel by different builders on different file sets.

## Sizing

- Small enough that one reviewer can read the whole diff in one sitting.
- If the plan has more than about ten edge cases or touches more than three areas (for example web, backend
  and mobile), consider splitting it.
- If a slice cannot be demonstrated without another slice, merge them or reorder.

## Notes by product type

**Web app**

- Screens ship with the backend that feeds them.
- Plan for light and dark themes, a narrow phone width and a wide desktop width, keyboard use and a screen
  reader.
- Missing data is shown as missing ("No orders yet"), never as 0.

**Mobile app**

- Plan offline and poor-network behaviour, the permission prompts, and the app-store review rules that apply.
- Test on the smallest and largest supported screens and on the oldest supported OS version.

**Backend system**

- Contract first: the API or event schema is written and reviewed before handlers.
- Writes that clients may retry are idempotent (an idempotency key from the caller, or a natural unique key).
- Migrations are safe on tables that already hold data: count rows that would violate a new constraint before
  adding it; add nullable columns first, backfill, then tighten.
- Every query on shared data is scoped to the caller's account or tenant.

**AI or agent product**

- The eval set is part of the first slice, before the prompt is tuned. See [ai-slices.md](ai-slices.md).
- Start with the narrowest task that can be measured, then widen.

**Startup MVP**

- The first slice tests the riskiest assumption with the smallest working thing. Manual work behind the scenes
  is fine if the user cannot tell and it is written down.
- Write down what will be thrown away, so nobody builds on it by accident.

## Example: Loafly

Loafly is a fictional pre-order app for one bakery.

1. Slice 1: a customer orders a loaf for tomorrow's pickup and sees it confirmed; staff see it on the order
   board. (Riskiest: will customers order ahead at all?)
2. Slice 2: pickup time slots with a limit per slot, and the screen where the bakery owner sets the limits.
3. Slice 3: missed pickups marked at closing, with the weekly count for the owner.
4. Slice 4: the ingredient assistant answers allergen questions from approved ingredient sheets only, with an
   eval set of real and adversarial questions.
