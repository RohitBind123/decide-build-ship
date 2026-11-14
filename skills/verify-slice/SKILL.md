---
name: verify-slice
description: Proves a built slice works before anyone asks to merge it - a changed-only verification gate (static checks in full, tests only for what changed and what depends on it, rerun only failures), code and security reviews in parallel, a live check of the real running app with synthetic data, AI eval runs against a baseline when a model is involved, and an evidence folder with before and after. Use when a slice or feature is built, before asking for merge approval, after a rebase, when tests fail in a gate, or when someone asks whether a slice is done, works or is ready to merge.
license: MIT
---

# Verify a slice

Nothing is done until it is proven. Proof is a passing gate on the exact commit, reviews with their findings
fixed, a live check of the real app, and evidence someone else can read.

## Before you start

Read the `Build workflow` section of the project's `CLAUDE.md` for `Product type`, `Commands`, `Gate` (the
changed-only gate command or rules), `Full suite` (when it runs), `Live check` (how to start the real app
locally), `Evals`, `Evidence`, `Reviewers` and `Models per task`. Missing keys: use the defaults this
skill describes and say so once; if `Live check` is missing, ask the owner how to start the app locally.

Copy this checklist into your reply:

```
Verify progress:
- [ ] 1. Gate plan written: every command and why it was selected
- [ ] 2. Gate green on the slice head (sha recorded)
- [ ] 3. Reviews run in parallel; critical, high and medium findings fixed
- [ ] 4. Live check of the real app done, screenshots and samples saved
- [ ] 5. AI evals run against the baseline (AI slices only)
- [ ] 6. Evidence folder complete: before, after, gate, reviews, live check
```

## 1. The changed-only gate

Full rules and selection examples: [references/changed-only-gate.md](references/changed-only-gate.md). In short:

- Run the cheap static checks in full: build, lint, typecheck, format, schema or contract drift, bundle size.
- Run tests only for what the slice changed and what depends on it, plus a small fixed smoke set of the most
  important flows.
- Write the plan first: list every command and the reason it was selected. That list goes in the evidence.
- After a failure, fix, commit, and rerun only what failed on the new commit. A flaky failure on the same
  commit reruns only the failed tests.
- The full suite runs before every release and on a schedule or in CI, not for every slice.
- After a rebase, rerun the selection from the new merge base.

## 2. Reviews in parallel

Run reviewers at the same time, each briefed with the diff and the feature doc, not with your conclusions:

- a code reviewer for each language touched;
- a security reviewer (the strongest configured model) for anything touching input, auth, data access,
  secrets or money;
- a database reviewer when the slice adds migrations or heavy queries;
- a content reviewer for user-facing text and data display (missing values as 0, raw codes on screen).

Fix every critical, high and medium finding, each with a failing test first; fix low findings when cheap. A
finding outside the slice goes to the owner as a decision (`decide`), not into this slice silently. Log
findings and fixes in the evidence folder.

## 3. Live check

Run the real app, not only the tests. Details and patterns:
[references/live-check.md](references/live-check.md).

- Before starting, confirm that the database, cache and any queue the app will use are local or throwaway,
  from the live-check command, a compose file or the example config. Never read or print `.env` files or
  secrets to find out. If you cannot confirm it, stop and ask the owner.
- Start the real server and the built front end the way `Live check` in `CLAUDE.md` says, with synthetic data.
  Never point it at production or real customer data.
- Walk every flow in the slice as a user would, in a real browser, simulator or client.
- Save screenshots, API request and response samples, and relevant database rows (redacted) to the evidence
  folder.

## 4. AI slices

When the slice involves a model: run the eval set against the baseline, check cost and latency against the
budget, and run the adversarial cases. Eval runs call a paid model: estimate the cost first and ask the owner,
unless a budget is recorded in the decisions log. See
[references/ai-verification.md](references/ai-verification.md).

## 5. Evidence

Write the evidence summary from [assets/gate-evidence.md](assets/gate-evidence.md) into the slice's evidence
folder. Synthetic data only; redact anything that looks like a secret or personal data. No evidence, not
done.

## Next

Everything green and recorded: run `ship-slice`.
