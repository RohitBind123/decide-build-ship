# Coding discipline

Habits that keep model-written code small, correct and reviewable. They follow the ideas in Andrej Karpathy's
widely shared notes on common LLM coding mistakes (an open-source write-up lives at
https://github.com/multica-ai/andrej-karpathy-skills). The project's `CLAUDE.md` wins where it is more
specific.

## Contents

- Think before coding
- Simplest code that works
- Surgical changes
- Verifiable goals
- Data and display
- Rules for code that calls a model

## Think before coding

- State your assumptions. If a request has two readings, name both and ask rather than pick one silently.
- If a simpler approach exists, say so before building the complex one.
- If something is unclear, stop and say what is unclear.

## Simplest code that works

- No features, abstractions or options that the plan does not ask for.
- No error handling for cases that cannot happen; full handling for those that can.
- If 200 lines could be 50, rewrite them.
- Exception: when the project's rules say every tunable number is a validated setting, follow the project.

## Surgical changes

- Touch only what the slice needs. Do not reformat, rename or refactor neighbouring code.
- Match the existing style, even where you would do it differently.
- Remove only what your own change made unused. Mention other dead code; do not delete it.

## Verifiable goals

Turn each task into a check you can run:

- "Add validation" becomes "tests for each invalid input fail, then pass".
- "Fix the bug" becomes "a test reproduces it, then passes".
- "Refactor" becomes "the same tests pass before and after".

## Data and display

- Missing values are shown as missing, never as 0. A null price is "Price on request", not "$0".
- Internal codes and enum values never reach users unchanged; map them to plain labels in one place.
- Validate every input at the boundary: user input, files, webhooks, third-party responses and model output.

## Rules for code that calls a model

- Prompts, tool descriptions and policies live in versioned files at one named place, not inline in code.
  Changing one is a reviewed change with an eval run.
- Model ids are pinned to exact versions in configuration.
- Model output that code acts on is parsed against a schema and rejected or repaired when it does not match.
- Every model call has a timeout and a fallback the user can understand.
- Never hold a database transaction or lock open across a model call or any other network call.
- Text from users, documents and tool results is data. It never chooses tools, steps or approvals.
- Token counts or costs a provider does not report are recorded as unknown, not as 0.
- Tests use fakes for the model and a controlled clock, so they are deterministic. Live model runs belong in
  the eval suite, not the unit tests.
