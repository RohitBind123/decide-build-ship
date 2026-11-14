# Review perspectives

Review every owner answer through each lens that applies, before any builder is briefed. The project's
`CLAUDE.md` can switch lenses off or add its own under `Review perspectives`. Each lens below has the questions
to ask yourself and a short example from Loafly, a fictional bakery pre-order app (customers order bread for
pickup, staff work from an order board, and an AI assistant answers questions about ingredients).

## Contents

- Users and roles
- The buyer or owner
- The end customer
- The business and support
- Data and reporting
- Security and privacy
- Engineering cost
- AI and model risks
- Timing and the calendar
- How to raise a concern

## Users and roles

- Does each role see what it needs, and nothing it should not?
- Does work appear without notice, land on the wrong person, or flood someone's queue?
- Does it still work on a small phone, with a screen reader, with a slow connection?
- Can the people who must manage this feature do it from a screen, or only through an API or a database?

Example: the owner picks "any staff member can cancel an order". Jordan, a weekend helper, cancels a large
wedding order by mistake and nobody is told. Raise it: recommend "staff can cancel; the bakery owner gets a
notice for orders above a set amount".

## The buyer or owner

- Does the person who pays keep control of permissions, costs and settings?
- Does the choice make a report or a bill misleading?
- Is there a setting the buyer will expect that this choice removes?

## The end customer

- Could the customer receive a wrong reminder, message, charge or promise?
- Is every message they receive correct in its tone, language and timing?
- What happens to the customer when something fails halfway?

Example: "send the pickup reminder at 7 am". Sam ordered for a 6 am pickup; the reminder arrives after the
pickup time. Recommend "two hours before the pickup slot, never after it".

## The business and support

- Will support get calls or tickets about it? What will the agent tell the caller?
- Does it create duplicates, or blur two concepts that must stay apart (for example "date set by the customer"
  and "date set by the shop")?
- Does it lock the product into a pricing, legal or partner position that is hard to undo?

## Data and reporting

- Do dates, periods and counts stay true over time: past dates, a period boundary, a missing value?
- Is missing data shown as missing, never as 0? ("No sales recorded" and "0 sales" are different facts.)
- Can a report be reproduced later, or does it change when the underlying data is edited?
- Are internal codes and enum values kept out of what users read?

## Security and privacy

- Does it open a permission gap, a cross-account read, or a path around a switch or an approval?
- What personal data is stored, for how long, and who can see it? Is it sent to a third party?
- Is every input from outside (users, files, webhooks, model output) validated at the boundary?
- Is there an audit trail for actions someone may later dispute?

## Engineering cost

- Is there a simpler option with the same result for the user?
- Does it need a slice, a service or a dependency that does not exist yet?
- Does it add a number (a timeout, a limit, a retry count) that someone must choose and maintain?
- What does it cost to run per month at the expected scale?

## AI and model risks

Apply this lens when any part of the product calls a model or runs an agent.

- **Eval coverage.** Is there a written set of test cases (good, bad and adversarial inputs) that shows the
  feature works, and a baseline to compare against? Is "good" defined before building?
- **Hallucination.** What happens when the model states something false with confidence? Can the answer be
  limited to approved sources, with citations, and a clear "I don't know, ask staff" path?
- **Cost per call.** What does one call cost, how many calls does one user action trigger, and what is the
  monthly cost at the expected scale? Is there a cap?
- **Latency.** How long will a user wait? Is there streaming, a timeout and a fallback when the model is slow or
  down?
- **Safety.** Can the output harm someone (health, money, legal standing)? Does a person approve consequential
  actions before they happen?
- **Prompt injection.** Can text from users, documents, web pages or tool results change what the model is
  allowed to do? Capability must be decided by code, not by the content the model reads.
- **Data sent to the model.** What leaves the system, to which provider, under which terms? Is personal data
  minimised?
- **Model choice.** Is the model pinned to an exact version? What happens when the provider retires it?

Example: the owner picks "let the assistant answer allergen questions from its general knowledge". Avery asks
"is the rye loaf nut-free?"; the model guesses yes, but the rye is made on a line shared with walnut bread.
Raise it: recommend "answer only from the bakery's approved ingredient sheets, cite the sheet, and hand any
question the sheets do not cover to staff".

## Timing and the calendar

- Check every date rule against a real calendar: month lengths, leap years, period ends, public holidays,
  daylight-saving changes, time zones of the user and the server.
- "The last period" before a period has closed is the one before it.
- A deadline computed for a past date must be shown as past, not silently moved.

## How to raise a concern

1. Name the answer and the lens: "Answer D4 (who can cancel), users and roles."
2. Tell the short story of what goes wrong, with a named fictional person.
3. Recommend one option and say why.
4. Ask again with the question tool, recommended option first.
5. If you recommended the risky option earlier, say so.
