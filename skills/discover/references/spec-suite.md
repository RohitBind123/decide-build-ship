# The spec suite

What each document contains, and how deep to go for the stage. A builder must be able to start from these
pages without asking what the product is for.

## Contents

- Depth by stage
- Product brief (PRD)
- Non-functional requirements
- Architecture and stack
- Design direction
- Roadmap
- Quality bar

## Depth by stage

| Stage | PRD | Architecture | Roadmap |
|---|---|---|---|
| Prototype | 1 to 2 pages | half a page: stack and hosting | 1 milestone |
| MVP | 2 to 4 pages | 1 to 2 pages, one ADR per big choice | 2 to 4 milestones |
| Production product or rebuild | full template | full template, ADRs, threat model | milestones to launch and after |

Shorter is better when nothing is lost. Link to the research brief instead of repeating it.

## Product brief (PRD)

Template: [../assets/prd.md](../assets/prd.md). It covers problem, personas, journeys, prioritised features
with acceptance criteria, domain model, data and privacy, non-functional requirements, AI parts, success
metrics, risks and open questions. Each feature has acceptance criteria a test can check, written as "Given,
when, then" or as a short list.

## Non-functional requirements

Set a number or a rule for each item, or mark it as an open question. Defaults to propose:

- **Performance:** first meaningful screen under 2.5 s on a mid-range phone on 4G; API p95 under 300 ms for
  reads and 800 ms for writes.
- **Availability:** a target the owner can afford (99.5% is a reasonable MVP default).
- **Security:** sign-in method, role model, input validation at every boundary, secrets in a secret store,
  rate limits on public endpoints, audit trail for money and permissions.
- **Privacy:** personal data listed, retention period, deletion and export on request, data residency.
- **Accessibility:** WCAG 2.2 AA for web; platform accessibility settings honoured on mobile and desktop.
- **Reliability:** idempotent writes, retries with backoff, no lost work on a crash, backups and a tested
  restore.
- **Observability:** error tracking, request latency and error-rate metrics, structured logs with a request id.
- **Internationalisation:** languages, currencies, time zones, date formats.
- **Cost:** a monthly budget for hosting and paid APIs, and alerts before it is reached.

## Architecture and stack

Template: [../assets/architecture.md](../assets/architecture.md). Recommend the simplest stack that meets the
requirements and that the owner or team can run. Prefer mainstream, well-documented tools; avoid a new
dependency for something the platform already does. For each major choice (language, framework, database,
hosting, auth, payments, AI provider), give the reason and the rejected alternative, and write an ADR with the
`plan-slice` ADR template when the choice is hard to reverse. Anything that costs money or locks in a vendor is
an owner decision.

## Design direction

When the product has screens, run the `design-ui` skill to write the design system page: brand adjectives,
type, colour, spacing, components, states, motion and accessibility rules. The PRD links to it.

## Roadmap

Template: [../assets/roadmap.md](../assets/roadmap.md). Milestones are ordered by risk: the assumption most
likely to be wrong goes first. Each milestone has a goal a user would recognise, a demo the owner can try, and a
list of slices following [../../plan-slice/references/slicing.md](../../plan-slice/references/slicing.md). Mark
slices that touch separate file sets as able to run in parallel; `autopilot` uses that.

## Quality bar

Before asking for approval, check each document:

- Every feature has acceptance criteria and a priority.
- Every number has a source or is an open question.
- Every role can manage what it creates from a screen.
- Every domain rule cites a source or is marked for the owner to confirm.
- Nothing names a framework or vendor without a reason.
- The first milestone can be demonstrated end to end.
