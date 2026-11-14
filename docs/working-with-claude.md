# Working with Claude efficiently

The skills tell Claude what to do; these Claude Code features make it faster, safer and cheaper. Check the
[Claude Code documentation](https://code.claude.com/docs) for current details; features and limits change.

## Contents

- Talking to Claude
- Features the skills use
- Running long and unattended
- Keeping cost and context down
- Prompts that work well

## Talking to Claude

You do not need to name skills. Describe what you want; Claude picks the skill from its description.

| You say | What runs |
|---|---|
| "I have an idea for an app that ..." | `discover`: research, interview, spec suite |
| "Here is my answer to D4: ..." | `decide`: reviews and records the answer |
| "Plan the next slice" | `plan-slice` |
| "Make the screens look professional" | `design-ui` |
| "Build it" | `build-slice` |
| "Is it done? Check before I merge" | `verify-slice` |
| "Merge it" / "Release" | `ship-slice` |
| "Keep going and build milestone 1" | `autopilot` |
| "Where are we?" / "What do you need from me?" | `overview` |
| "Save where we are, I'm restarting" | `handoff` |

You can also call one directly: `/decide-build-ship:discover` as a plugin, or `/discover` as copied skills.

## Features the skills use

| Feature | Used for |
|---|---|
| AskUserQuestion (the question dialog) | Every owner decision and approval, with a recommended option |
| Sub-agents | Research, code maps, builders and reviewers, so their output stays out of the main conversation |
| Git worktrees (`isolation: worktree`, `claude --worktree`) | One isolated checkout per builder or parallel slice |
| SendMessage to a running agent | Relaying a changed decision or a contract change to builders |
| Plan mode | Reviewing a slice plan before anything is written |
| Hooks | This plugin's SessionStart hook tells a new session where the work stands |
| MCP servers (for example Playwright) | The live check in a real browser and design screenshots |
| Artifacts or documents | A shareable page of the `overview` report, when the host offers it |
| Checkpoints and rewind | Undoing a wrong turn in the conversation and the files Claude changed |

## Running long and unattended

| Need | Feature |
|---|---|
| Keep going while you are away, machine on | `/loop` with no interval (self-paced) and the `autopilot` skill |
| Keep the terminal free | Background agents and background sessions |
| Work with the laptop closed | Scheduled cloud runs (routines) on a pushed branch |
| Fewer permission prompts | A project allowlist of build, test and git commands; auto mode where your plan allows it |
| Know when you are needed | Push notifications or a messaging connector, when available |

Rules that never relax in unattended runs are in `skills/autopilot/references/stop-rules.md`.

## Keeping cost and context down

- Let sub-agents do wide searches and reviews; keep only their conclusions.
- Use `Models per task` in `CLAUDE.md`: a small model for search and docs, a mid-size model for building and
  reviews, the largest for planning, architecture and security.
- Keep the handoff file current; after a compaction or restart, Claude resumes from it instead of rereading
  everything.
- Use the changed-only gate for each slice and the full suite before releases.

## Prompts that work well

- Give the outcome, not the steps: "Customers should be able to reschedule a pickup up to 2 hours before."
- Say who decides: "I decide wording and prices; you decide technical details."
- Give standing rules once, and let Claude record them: "Never add a paid service without asking me."
- Ask for evidence: "Show me the screenshots from the live check."
