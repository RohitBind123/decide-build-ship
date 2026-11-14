# Writing a short spec

Use this when there is no spec or PRD. The goal is one page the owner approves, not a long document. Fill the
template in [../assets/spec-template.md](../assets/spec-template.md) with the owner's words.

## Contents

- Interview order
- Questions by product type
- Keeping it short
- Approval

## Interview order

Ask in this order, a few questions per round, with the question tool. Draft the answers you can infer from the
conversation and ask the owner to confirm them rather than asking from scratch.

1. **Problem.** Who has the problem, and what do they do today instead?
2. **Users and roles.** Who uses it, who pays for it, who administers it?
3. **The one job.** What must a first user be able to do end to end on day one?
4. **Success.** How will the owner know it works? One or two measurable signals.
5. **Scope.** What is in the first release, and what is explicitly out?
6. **Key flows.** The three to five flows that matter most, as short numbered steps.
7. **Data.** What is stored, who owns it, what is personal, how long it is kept.
8. **Constraints.** Legal, privacy, accessibility, platforms, budget, deadlines.
9. **Open questions.** Everything not yet decided. These become decisions in the log.

## Questions by product type

- **Web or mobile app:** which platforms and screen sizes, offline needs, sign-in method, notifications,
  accessibility level, app-store review constraints.
- **Backend system:** who calls it, expected load, data consistency needs, idempotency of writes, tenancy,
  retention, uptime target.
- **AI or agent product:** what the model does and must never do, which sources it may use, how good is
  measured (the first eval cases), cost and latency budgets, who approves consequential actions, what happens
  when the model is wrong or unavailable.
- **Startup MVP:** the riskiest assumption to test first, the smallest thing that tests it, what can be manual
  behind the scenes, and what will be thrown away later.

## Keeping it short

- One page. Link out to detail rather than pasting it in.
- The owner's words for goals and rules; your words only for structure.
- No implementation detail (frameworks, tables) unless the owner has a hard constraint.
- Mark every number you could not get from the owner as an open question, not a guess.

## Approval

Show the filled page and ask with the question tool: "Approve the spec" or "Change some". Save it to the
project's `Spec` path. Record the approval in the decisions log with the date.
