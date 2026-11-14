# Interviewing the owner

The interview should feel like talking to an experienced product lead: short rounds, a recommendation on every
question, and suggestions the owner had not thought of.

## Contents

- Rounds
- Question bank by product type
- Suggesting features
- Prioritising
- Worked example

## Rounds

Up to four questions per AskUserQuestion round, most important first. Stop asking when the remaining questions
can be answered later in `decide` without changing the roadmap.

1. **Problem and users.** Who has the problem, how they solve it today, who pays, who administers.
2. **The one job and success.** What a first user does end to end on day one; one or two measurable signals.
3. **Scope.** Must, Should, Could, Won't for the first release, using the feature suggestions below.
4. **Key flows.** Three to five flows as numbered steps, confirmed from your draft.
5. **Data and rules.** What is stored, what is personal, retention, the domain rules from research.
6. **Platforms and constraints.** Devices, offline needs, sign-in, languages, accessibility level, budget,
   deadline, hosting preferences, existing systems to integrate.
7. **Look and feel.** Three adjectives for the brand, products the owner admires, light or dark, density.
8. **AI parts** (when a model is involved). What it does and must never do, sources, eval pass bar, cost and
   latency budgets, who approves consequential actions.

## Question bank by product type

- **Web app:** public or signed-in, SEO needs, browsers and screen sizes, teams and roles, billing model.
- **Mobile app:** iOS, Android or both; native or cross-platform; offline; push notifications; app-store
  rules for payments; device features (camera, location).
- **Desktop app:** operating systems, file access, auto-update, offline, signing and distribution.
- **Backend or API:** callers, expected load and peaks, consistency needs, idempotent writes, tenancy, uptime
  target, data residency.
- **AI or agent product:** autonomy level, tools it may call, human approval points, fallback when the model
  is wrong or down, evaluation data, prompt-injection exposure.
- **Startup MVP:** the riskiest assumption, the smallest test of it, what can be manual behind the scenes, what
  will be thrown away.
- **Marketplace or multi-sided:** which side to win first, trust and safety, payouts, disputes.

## Suggesting features

For each Must feature, check whether the product also needs its supporting features, and suggest the missing
ones as optional questions:

- sign-in, account recovery, roles and invitations;
- an admin screen for everything users create or configure;
- empty, loading, error and offline states;
- notifications and their settings;
- audit history for money, permissions and deletions;
- export and deletion of a user's own data;
- search and filters once a list can exceed one screen;
- onboarding for the first session;
- analytics events tied to the success signals.

Add the table stakes and one or two differentiators from the research brief. Mark each suggestion with where it
came from ("every booking product offers reminders").

## Prioritising

Ask the owner to place each feature in Must, Should, Could or Won't for the first release. Push back when the
Must list cannot ship by the deadline or contains two unproven ideas at once. Recommend moving the riskiest
assumption into the first milestone.

## Worked example

Loafly, a fictional bakery pre-order app. Round 3 asks:

> Q: Should customers get a reminder before pickup?
> Story: Sam orders sourdough on Friday night for Saturday 9:00 and forgets. The loaf goes stale on the shelf.
> Research: two of the three closest products send an SMS or push reminder; customers cite it in reviews.
> A (Recommended): email reminder 2 hours before pickup, in the first release.
> B: SMS reminder: better reach, but costs per message and needs phone numbers.
> C: no reminder for now.
