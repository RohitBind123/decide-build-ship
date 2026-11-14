# Planning AI and agent slices

Extra planning steps for any slice where a model produces output that users see or act on, or where an agent
calls tools.

## Contents

- Evals before prompts
- Model choice
- Cost and latency budgets
- Safety and approvals
- Untrusted content and prompt injection
- Tool design for agents
- What goes in the plan

## Evals before prompts

1. Write the eval cases before writing or tuning the prompt: typical inputs, hard inputs, inputs that must be
   refused, and adversarial inputs (injection attempts, misleading documents).
2. For each case, define pass and fail in checkable terms. Prefer deterministic checks (the answer cites a
   source that exists, the output parses against the schema, a refused topic is refused). Use a model judge
   only for what code cannot check, and let it lower a grade, never raise one.
3. Record a baseline: the score of the simplest approach (no prompt engineering, or the current version).
4. Set the pass bar with the owner. A change ships only if it beats the baseline by more than the run-to-run
   noise.
5. Never edit an eval case to make it pass. Retire it and add a new one, with the reason.

## Model choice

- Pick the smallest model that passes the evals at the required quality; try one size up and one down.
- Pin the exact model version in configuration, never an alias that can change under you.
- Record which model each tuned number (timeout, output size, retry count) was measured against; re-measure
  when the model changes.
- Plan for the model being slow, down, or retired: a timeout, a fallback, and a clear message to the user.

## Cost and latency budgets

- Estimate tokens per call and calls per user action; multiply by expected usage for a monthly cost.
- Set a p95 latency target for what the user waits on; stream long answers.
- Keep the stable part of the prompt (instructions, tool definitions) free of dates, ids and other values that
  change per call, so it can be cached.
- Set a per-account or per-day cap where runaway usage is possible.

## Safety and approvals

- List what the model must never do and enforce each rule in code where possible (a validator, a permission
  check, an allow-list), not only in the prompt.
- Any consequential action (sending a message, paying, deleting, changing records someone relies on) is
  approved by a person, bound to the exact version they approved.
- An action that may or may not have happened after a failure is "in doubt": a person checks it; it is never
  retried automatically.

## Untrusted content and prompt injection

- Text from users, uploaded files, web pages, emails and tool results is data, never instructions.
- What the model is allowed to do is decided by code before it reads the content. Content cannot widen it.
- Label where content came from when it is fetched, and keep the label on summaries of it.
- "Ignore instructions in the document" in a prompt is a hint, not a control. Plan the control in code.

## Tool design for agents

- One clear job per tool, with when to use it, when not to, and the sibling tool to use instead.
- Arguments the model can quote rather than compute: ids from earlier results, enums, units in the name.
- Results state when they are empty, partial or truncated, with the original size.
- Errors say what was wrong and what to do next, in a few lines.
- Each tool is tagged as read-only or effectful by code, not by the model.

## What goes in the plan

Add these to the feature doc for an AI slice:

- the eval set location, the case count by type, the baseline score and the pass bar;
- the pinned model and the reason for it;
- the cost and latency budgets;
- the rules the model must never break and where each is enforced;
- the approval points and what a person sees at each;
- the fallback when the model fails.
