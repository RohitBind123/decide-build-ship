# Handoff: <project>, <slice or milestone>

Last updated: <YYYY-MM-DD HH:MM, time zone> by <session or person>

## Paste this into a new session

```
Continue <project> at <repository path>. Read CLAUDE.md (section "Build workflow") and this file
(<handoff path>) first, then check the state with: git status; git log -1; git worktree list.
We are on branch <branch> at <sha>, in the <decide | plan | build | verify | ship> phase of <slice>.
Next step: <one concrete action>.
Use the skills discover, decide, plan-slice, design-ui, build-slice, verify-slice, ship-slice, autopilot,
overview and handoff. Autopilot running: <yes, milestone M | no>.
Ask the owner with AskUserQuestion before any merge, push or release not covered by a recorded standing approval.
```

## Where things stand

- Repository: <path>
- Branch: <branch> at <sha>; working tree: clean | <uncommitted files>
- Pushed: yes | no (<what is local only>)
- Phase: <phase>
- Milestone: <M> (<n> of <total> slices merged; roadmap <path>)

## Done

- <step>: <commit sha>, evidence <path>

## In flight

| Agent or job | Task | Worktree | Branch | Ports / database | Status |
|---|---|---|---|---|---|
| <id or name> | <task> | <path> | <branch> | <ports> | running / waiting |

Locks held: <path and owner, or "none">

## Owner

Waiting for an answer:

- <question, options, recommendation>

Answers received this session (verbatim):

- <D-number>: "<answer>" (recorded in <decisions log path>: yes | no)

Standing approvals in force:

- <approval and conditions>

## Rules to keep

- <rule, or "see CLAUDE.md, section Build workflow">

## Next step

1. <action>
2. Check first with: <commands>
