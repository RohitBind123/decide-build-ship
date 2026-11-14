# Domain research

Research makes Claude's suggestions expert-level instead of generic. It is read-only, cited, and short.

## Contents

- Who does it
- What to find
- Source rules
- The research brief
- When there is no web access

## Who does it

Delegate to one read-only sub-agent so the search results stay out of the main conversation. Use the
`product-researcher` agent when the plugin is installed; otherwise any agent with web search and read-only file
tools. Brief it with the one-line goal, the product type, the stage, the country or market if the owner gave
one, and the questions below. It must not edit files, sign up for services, or spend money.

## What to find

1. **Today's workaround.** How the target users solve the problem now: spreadsheets, paper, a competitor, a
   person. What it costs them.
2. **Closest products.** Three to five, each with who it is for, the price model, the features users praise,
   and the complaints that come up again and again (reviews, forums, issue trackers).
3. **Table stakes.** Features every serious product in the space has. Missing one makes the product look
   broken, even if the owner never asked for it.
4. **Differentiators.** Gaps the closest products leave open that fit the owner's idea.
5. **Domain rules.** Laws, standards and platform rules that apply: data protection, consumer law, payments
   and refunds, tax and invoicing, health or financial regulation, accessibility law, app-store review rules,
   age limits. Name the market each rule applies to.
6. **Vocabulary.** The words users and the industry use, so screens and docs match them.
7. **Technical patterns.** How products of this kind are usually built, and well-known failure modes (for
   example double booking, oversold stock, timezone bugs, webhook retries).

## Source rules

- Prefer primary sources: official documentation, regulators, standards bodies, the product's own pages.
- Every fact gets a link and the date it was read. Note when a source is a forum post or a review.
- A fact that matters but has no reliable source is marked "unverified" and goes to the owner as a question.
- Never present legal, tax, medical or financial facts as settled. Write "the owner should confirm with a
  qualified advisor" where the risk is real.
- Do not copy competitors' text, designs or brand assets. Describe what they do.

## The research brief

The sub-agent returns at most one page:

```
Research brief: <product one-liner>, <market>, <date>

Today's workaround: ...
Closest products:
- <name> (<link>): for <who>; <price model>; praised for ...; complaints: ...
Table stakes: ...
Differentiators worth considering: ...
Domain rules (market): <rule> (<link>) ...
Vocabulary: ...
Known technical pitfalls: ...
Unverified, ask the owner: ...
```

Save it next to the spec (for example `docs/spec/research.md`) so later sessions can reuse it.

## When there is no web access

Say so once. Use what the owner and the repository provide, mark every domain fact as unverified, and turn the
important ones into questions. Do not fill gaps from memory as if they were checked.
