# Verifying AI and agent slices

Extra checks for any slice where a model's output reaches users or drives actions.

## Contents

- Eval run
- Cost and latency
- Adversarial and safety cases
- Regression after a model or prompt change
- What to record

## Eval run

1. Run the full eval set for the feature, several times if outputs vary, and report the mean and the spread.
2. Compare against the recorded baseline. The change passes only if it beats the baseline by more than the
   run-to-run noise and meets the owner's pass bar.
3. Read a sample of failing cases yourself. A judge model can be wrong, especially on formatting; check before
   trusting a low score.
4. Never edit an eval case to make it pass. Retire and replace it, with the reason in the eval log.

## Cost and latency

- Measure tokens and cost per call and per user action on the eval run; compare with the budget in the
  feature doc.
- Measure p50 and p95 latency for what the user waits on.
- Check the cache hit rate if the design relies on prompt caching.
- Values the provider does not report are recorded as unknown, not 0.

## Adversarial and safety cases

- Prompt injection in every untrusted input the feature reads: user text, uploaded files, fetched pages, tool
  results. The model must not gain a capability, reveal hidden instructions or skip an approval.
- Requests the model must refuse: check it refuses, and that the refusal is useful to the user.
- Questions the approved sources do not answer: check it says so and hands over, instead of guessing.
- Consequential actions: check a person approves the exact version before it happens.

## Regression after a model or prompt change

- A change to the model version, a prompt, a tool description or a policy file reruns the eval set.
- Numbers tuned against a model (timeouts, output limits, retry counts) are re-measured when the model changes.
- Keep the previous version's scores next to the new ones in the evidence.

## What to record

Add to the evidence summary: the eval set version, the model id, the runs, the baseline and new scores with
spread, cost and latency against budget, the adversarial cases and their results, and any case you retired.
