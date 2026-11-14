---
name: decide
description: Settles what to build before anything is built. Starts from the spec or PRD (helps write a short one if none exists), decides spec-backed points without asking, explains each open question in plain words with a short story, asks with AskUserQuestion, then reviews every answer from several perspectives (users, buyer, customer, business and support, data, security and privacy, engineering cost, and AI risks such as evals, hallucination, cost, latency and prompt injection) and raises wrong or risky picks before any code. Records answers in a durable decisions log and tells running agents when an answer changes. Use when starting a product, feature or slice whose spec or choices are not settled, whenever a choice belongs to the owner, and before briefing builders. Always use it right after the owner answers a decision (for example "my answer for D2 is ..."), even when they say it is decided and ask to start building.
license: MIT
---

# Decide

The owner is whoever decides what the product does: a founder, a product owner, a client, or the user in
this session. This skill makes sure that every choice is grounded in the spec, understood by the owner, and
reviewed before anyone builds on it. A wrong pick that gets built costs a rework slice; raising it costs one
message.

Skip this skill for changes that need no product decision: a typo, a rename, a bug with an obvious fix.

## Before you start

Read the `Build workflow` section of the project's `CLAUDE.md`. Use these keys; when one is missing, use the
default and say so once:

- `Spec`: where the spec or PRD lives (default `docs/spec/`).
- `Decisions log`: the durable record of answers (default `docs/decisions.md`).
- `Review perspectives`: which lenses apply (default: all in [references/perspectives.md](references/perspectives.md)).
- `Product facts`: facts the owner has stated that change decisions.

If the section does not exist, suggest the `kickoff` skill once and continue with the defaults.

Copy this checklist into your reply and keep it current:

```
Decide progress:
- [ ] 1. Spec read, or a short spec written and approved
- [ ] 2. Open decisions listed; spec-backed ones decided with a citation
- [ ] 3. Each open question explained, then asked
- [ ] 4. Every answer reviewed from each perspective
- [ ] 5. Answers recorded in the decisions log
- [ ] 6. Running builders told about any changed answer
```

## 1. Spec first

1. Read the spec sections that the work touches, and the decisions log for earlier answers.
2. The spec is the floor: build to it or better. How an older version of the product behaves is not a
   constraint and not a reason to ask.
3. No spec yet: write a one-page spec with the owner before planning. Follow
   [references/writing-a-spec.md](references/writing-a-spec.md) and the template
   [assets/spec-template.md](assets/spec-template.md). Get the owner's approval of the page.
4. Sort every open point:
   - Spec clear and feasible: decide it yourself. Tell the owner in one line, citing the file and section.
   - Spec clear but not feasible now (cost, a missing dependency, a service not yet available): say why, give
     the cost and an alternative, and ask.
   - Spec silent or contradicting itself, or missing a constant, default, threshold, limit or on-screen
     wording: ask.
5. Never invent domain facts: legal or tax rules, prices, medical or financial facts, deadlines, regulator
   wording. Ask, or cite a source the owner accepts.
6. Apply the owner's earlier general answers before asking again. Example: "hide every field until its slice
   ships" also decides the menu items and steps that belong to later slices.

## 2. Explain, then ask

In your message, before the question dialog, explain each question in plain words:

- the situation as a short story with a named fictional person;
- what that person would see or experience under each option;
- what the spec says, and what you recommend and why.

Then ask with the AskUserQuestion tool. Each question must stand on its own, because the dialog may be all the
owner sees. Put the recommended option first with "(Recommended)" and give a concrete example in each option.
Wording is a decision too: list every new user-facing sentence with real examples and ask "Approve all" or
"Change some".

Every request for the owner's input goes through the question tool: a decision, an approval, a command only the
owner can run, a blocker. A plain-text ask at the end of a status message is easy to miss. If the tool is
denied or unavailable (for example on a remote or text-only client), ask the same questions as numbered plain
text so the owner can reply "1A 2B".

If the owner says "you decide", take the recommended option, record it as "delegated to Claude" with the
owner's words, and say which option you took. No answer is not an answer: keep the decision open, record it as
`Proposed`, and do not build on it.

Format, limits and worked examples: [references/asking.md](references/asking.md).

## 3. Review every answer before building

Right after each answer round, and before any builder is briefed, check each answer against every perspective in
[references/perspectives.md](references/perspectives.md). Also check timing against a real calendar (period
ends, deadlines that fall in the past, time zones, year boundaries) and against the product facts.

- An answer looks wrong or risky: say so plainly, with a short story of what would go wrong; recommend an
  option; ask again. If the risky option was your own recommendation, own it.
- An answer is fine: say so in one line.
- A capability the owner did not ask for would clearly help: offer it as an optional question.

Never brief a builder on a decision you believe is wrong without raising it first. Choices that make the product
more capable are welcome; choices that conflict with the spec, the product or how its users really work are
called out.

## 4. Record before you build

1. Write each answer to the decisions log as soon as it arrives, in the format of
   [assets/decision-log.md](assets/decision-log.md): an ID, the question, the owner's words verbatim, the date,
   the status, and which earlier decision it replaces. Never keep answers only in chat, a scratch directory or a
   temp folder: those are lost on a restart or when the context is compacted.
2. When an answer changes after a builder has started, update the log first. Then message every running builder
   at once (SendMessage to its agent id or name) with the final wording of each changed decision and the
   earlier instruction it replaces, and ask each to confirm.
3. Brief builders with the decisions verbatim, the approved wording, and the list of points that still need the
   owner's approval.

## Next

Decisions settled: run `plan-slice`. A new open question during planning, building or review: come back here.
