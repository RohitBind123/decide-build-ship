# Testing the skills

There are three layers of checks: a free structural lint, the official plugin validator, and behavioural
evals that call the model.

## 1. Structural lint (free, no network)

```bash
python3 scripts/check_skills.py
```

It also checks that each plugin agent in `agents/` has a name matching its file, a description that says when
to use it, a known model and no keys that plugin agents ignore, and that every script `hooks/hooks.json` runs
exists. For skills, it checks that every skill's `name` matches its folder and follows the naming rules, that each description is
under 1,024 characters and says when to use the skill, that only portable frontmatter keys are used, that each
`SKILL.md` body is under 500 lines, that every relative link resolves, that long reference files have a
contents list, that the manifests agree, and that every eval case has a prompt and at least one typed grader.

## 1b. Installer CLI tests (free, no network)

```bash
node --test cli/index.test.mjs cli/cleanup-slice.test.mjs cli/package.test.mjs cli/session-start.test.mjs
```

They (and the cleanup script tests) run the npm installer against temporary folders: project and user installs, never overwriting, dry
run, skills only, `--dir`, `list`, `plugin`, version, and bad arguments.

## 2. Plugin validator (free, no network)

```bash
claude plugin validate .
claude plugin validate . --strict   # warnings fail too
```

This checks `plugin.json`, `marketplace.json` and the skills as Claude Code will load them.

## 3. Behavioural evals (costs model usage)

The suite in `evals/` uses the `claude plugin eval` format (Claude Code v2.1.269 or later). Each case has a
`prompt.md` written the way a user would type it (the lint fails if a prompt names a skill), a
`tool_used: Skill` grader that checks the right skill fired, and a grader that checks the behaviour. Three
negative cases check that unrelated or small requests do not start any workflow skill.

| Case | Checks |
|---|---|
| decide-new-feature | A new feature with no spec starts `decide`; questions are explained with a scenario and a recommendation; no code |
| decide-flags-risky-answer | An owner answer with an AI safety risk is raised and asked again before building |
| plan-slice-from-spec | Settled decisions start `plan-slice`; the plan is vertical with edge cases, tests, files and the admin screen |
| build-slice-parallel | `build-slice` describes contract first, tests first, worktrees, one writer per file set, model per task |
| verify-slice-before-merge | `verify-slice` describes the changed-only gate, evidence, reviews and a live check |
| ship-slice-asks-approval | A ready slice starts `ship-slice`, which checks the remaining preconditions and asks before merging |
| ship-slice-no-force-push | A request to force-push a shared branch is declined, with a safe alternative |
| handoff-before-restart | `handoff` writes a durable file with branch, sha, running agents, open decisions and next step |
| handoff-resume | Resuming checks the real state first and re-asks the open decision |
| kickoff-new-repo | `kickoff` proposes the CLAUDE.md section and files and asks before writing |
| no-trigger-general-question | A general question starts no workflow skill |
| no-trigger-trivial-edit | A trivial edit starts no workflow skill and is just done |
| build-slice-near-miss | A small self-contained coding request is done directly, without the slice workflow |
| discover-new-product | A new product idea starts `discover`: framing, research, recommended answers, suggested features, the spec suite |
| autopilot-keep-going | "Build the whole milestone" starts `autopilot`, which asks for a recorded milestone merge approval and keeps every gate |
| overview-where-are-we | A progress question starts `overview`, which reports only what it read and changes nothing |
| design-ui-generic-screen | "Make it look professional" starts `design-ui`: design system, every screen state, accessibility, screenshot review |

### How the score works

- By default each case runs three times with the plugin and three times without it. `WITH` is the score with
  the plugin, `W/OUT` without it, and `Δ` the difference: what the plugin adds.
- In that two-arm mode, `tool_used: Skill` graders that require a skill to fire are reported as a "skill
  fired" indicator, not counted in the score, because they can never pass without the plugin. A skill that
  stops triggering therefore does not lower `WITH` by itself. Read the indicator in the report (or in the
  `--json` output) as well as the score.
- To score triggering directly, run one arm: with `--ablation none`, every grader counts, including
  `skill-fired`.
- The negative cases set `arm: both`, so "no workflow skill fired" is scored in both arms.
- Behaviour graders can pass without the plugin when plain Claude already behaves well; that shows up as a
  small `Δ`, which is useful information rather than a failure.
- A case passes when its with-plugin score meets `--threshold` (default `1.0`). With three judged runs per
  case, `--threshold 0.8` is a less brittle gate for CI.

### Commands

Run from the repository root:

```bash
# triggering and behaviour, one arm, every grader scored
claude plugin eval . --ablation none --allow-tools Write --no-publish

# what the plugin adds compared with no plugin (the default two-arm mode)
claude plugin eval . --allow-tools Write --no-publish

# one case, one run, while iterating on a description
claude plugin eval . --case decide-new-feature --runs 1 --ablation none --no-publish

# cap the spend
claude plugin eval . --allow-tools Write --max-cost-usd 2 --no-publish
```

`--allow-tools Write` is needed only by `handoff-before-restart` (its `file-written` grader checks that a file
was created). `--no-publish` keeps the HTML report local; without it the report is published to your
claude.ai account when your account supports it. Results go to `evals/results/`, which git ignores.

To confirm the suite loads without spending anything, run with a zero ceiling; every case is parsed and no
run starts:

```bash
claude plugin eval . --allow-tools Write --max-cost-usd 0 --runs 1 --ablation none --no-publish
```

A failing `skill-fired` grader usually means the skill's description does not match how people phrase the
request; adjust the description and run the case again.

## 4. Manual trigger checks

When you cannot run evals, check triggering by hand in a fresh session with the plugin loaded
(`claude --plugin-dir .`). Type each prompt and note which skill Claude loads.

| Prompt | Expected skill |
|---|---|
| "I want to add gift cards to my shop app. Where do we start?" | decide |
| "Here is my answer to D3: staff can cancel any order." | decide (reviews the answer) |
| "We have no PRD yet for this MVP." | decide (writes a short spec) |
| "Break this feature into tasks." | plan-slice |
| "Plan the first slice of the booking flow." | plan-slice |
| "Implement the plan with sub-agents." | build-slice |
| "Is the slice done? Check it before I merge." | verify-slice |
| "The gate failed on one flaky test." | verify-slice (rerun only failures) |
| "Merge it and push." | ship-slice |
| "Cut a release to production." | ship-slice |
| "I'm about to restart my laptop, save our progress." | handoff |
| "Continue from the handoff file." | handoff (resume) |
| "Set this repo up for the workflow." | kickoff |
| "What does HTTP 409 mean?" | none |
| "I have an idea for an app for dog walkers. Help me spec it." | discover |
| "Keep going and build all of milestone 1." | autopilot |
| "Where are we? Anything you need from me?" | overview |
| "The screens look generic; make them professional." | design-ui |
| "Fix the typo 'teh' in README.md." | none |

Also check with each model you plan to use. A description that triggers reliably on a large model may need
more specific keywords for a small one.
