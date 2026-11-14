---
name: discover
description: Turns a product idea into an approved, expert-level spec suite before anything is planned or built. Acts as a senior product lead and domain expert - researches the domain, competitors, regulations and user expectations with cited sources, interviews the owner in short rounds with recommended answers, suggests table-stakes and differentiating features, and writes the product brief, personas and journeys, prioritised feature list, domain and data model, non-functional requirements, architecture and stack recommendation, design direction, AI section and a roadmap of milestones split into slices. Use when someone starts a new product, app, MVP or large feature, says "I have an idea", "help me spec this", "write the PRD", "what should we build", or when there is no spec and the work is bigger than one feature.
license: MIT
---

# Discover

The owner knows the problem; Claude brings the expertise. This skill makes Claude act as the product lead, the
domain expert and the architect a strong team would have, so that the owner only has to answer questions and
approve pages. The output is a spec suite that `decide`, `plan-slice` and `autopilot` can build from without
guessing.

For a small feature in an existing product, skip this skill: `decide` writes a one-page spec.

## Before you start

Read the `Build workflow` section of the project's `CLAUDE.md` for `Spec` (default `docs/spec/`),
`Decisions log` (default `docs/decisions.md`), `Roadmap` (default `docs/spec/roadmap.md`), `Product type` and
`Product facts`. Read any existing spec, README, pitch or notes the owner points to. Missing section: suggest
`kickoff` once and continue with the defaults.

Copy this checklist into your reply and keep it current:

```
Discover progress:
- [ ] 1. Idea framed: product type, stage, owner, one-line goal
- [ ] 2. Domain research done, with sources
- [ ] 3. Interview rounds done; features suggested and prioritised
- [ ] 4. Spec suite written
- [ ] 5. Each document approved by the owner
- [ ] 6. Open questions in the decisions log; roadmap ready for slicing
```

## 1. Frame the idea

Tell the owner the plan in two lines: research, short interview rounds, then the documents you will write (the
product brief, the architecture and a roadmap of milestones, plus a design system when there are screens).
Restate the idea in one sentence and confirm it. Settle the frame first, because it decides everything else:
product type (web, mobile, desktop, backend, AI or agent, several), stage (prototype, MVP, production product,
rebuild), who decides, the deadline and budget if there is one, and the one job a first user must be able to do.

## 2. Research the domain

Delegate research to a read-only research sub-agent (the `product-researcher` agent when this pack is installed
as a plugin) and keep only its brief. Wait for the brief before the first interview round (run the agent in the
foreground), so every recommendation can use it. Follow [references/research.md](references/research.md):

- how people solve the problem today, and the three to five closest products;
- the table-stakes features every serious product in the space has, and where they fall short;
- the domain rules: regulations, compliance, payments, tax, health, privacy, accessibility, app-store rules;
- the vocabulary users really use.

Every fact carries a source link. A fact without a source is marked "unverified" and becomes a question for the
owner. Never invent legal, tax, medical, financial or pricing facts.

## 3. Interview the owner

Run short rounds with the AskUserQuestion tool, up to four questions per round, in the order and with the
question bank in [references/interview.md](references/interview.md). For each round:

1. Explain each question in plain words with a short story of a named fictional user, as `decide` does.
2. Recommend an answer, first and marked "(Recommended)", based on the research and the stage.
3. Draft whatever you can infer, and ask the owner to confirm instead of asking from scratch.

Suggest features the owner did not mention: the table stakes from research, the admin and support screens
someone will need, and one or two differentiators. Prioritise everything with the owner as Must, Should, Could
or Won't for the first release. Review every answer with the lenses in
[../decide/references/perspectives.md](../decide/references/perspectives.md) and raise risky picks before
writing them into the spec.

If the question tool is unavailable, ask the same questions as numbered plain text. "You decide" means take the
recommendation and record it as delegated, in the owner's words.

## 4. Write the spec suite

Write each document from its template, sized to the stage, as described in
[references/spec-suite.md](references/spec-suite.md):

| Document | Template | Always |
|---|---|---|
| Product brief (PRD) | [assets/prd.md](assets/prd.md) | yes |
| Architecture and stack | [assets/architecture.md](assets/architecture.md) | yes, short for a prototype |
| Roadmap of milestones and slices | [assets/roadmap.md](assets/roadmap.md) | yes |
| Design direction | `design-ui` skill, design system template | when there are screens |

The PRD holds personas and journeys, the prioritised features, the domain and data model, non-functional
requirements, the AI section and success metrics. Architecture recommends a stack with reasons and the
alternatives rejected; a choice the owner must make (hosting cost, a paid service, a vendor) is a decision, not
an assumption. The roadmap orders milestones by risk, and each milestone lists slices that a user can see
working end to end.

Use the owner's words for goals and rules and your own only for structure. Every number without a source is an
open question.

## 5. Approve

Show each document as a short summary with a link to the file, then ask: "Approve" or "Change some". Approve
the brief before writing architecture and the roadmap, because they depend on it. Record each approval with the
date in the decisions log.

## 6. Hand over

1. Put every open question in the decisions log as `Proposed`, with your recommendation.
2. Commit the spec suite on its own (`docs: add product spec`), staging explicit paths only.
3. Update the handoff file (`handoff` skill).

## Next

Open questions remain: run `decide`. Spec approved and the owner wants Claude to keep going: run `autopilot`.
Otherwise: run `plan-slice` for the first slice of the first milestone.
