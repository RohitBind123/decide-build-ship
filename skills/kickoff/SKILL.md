---
name: kickoff
description: Sets up a project for the decide, plan, build, verify, ship and handoff workflow - detects the stack, proposes the project's commands, branches, paths, approvals and review perspectives, confirms them with the owner, then adds a "Build workflow" section to CLAUDE.md and creates the decisions log, handoff file and feature-doc and ADR templates without overwriting anything. Use when someone asks to set up, bootstrap or configure this build workflow for a repository, or to adopt it in an existing project.
license: MIT
---

# Kickoff

Every other skill in this pack reads its project-specific settings from one place: a `Build workflow` section
in the project's `CLAUDE.md`. This skill writes that section and the files it points to.

## Rules

- Never overwrite an existing file. Append a section, or create a file only where none exists.
- Propose values from what you detect; the owner confirms them. Never guess a command you cannot see in the
  repository; leave it as `<not set>` and ask.
- Show the full diff of every file you will write, then ask with the AskUserQuestion tool: "Write these files"
  or "Change some".
- Write nothing until the owner has answered. If the question tool is denied or unavailable, show the proposal
  and the questions as numbered plain text and stop there; filling values in yourself and asking afterwards is
  not confirmation.

Copy this checklist into your reply:

```
Kickoff progress:
- [ ] 1. Repository inspected; stack, commands and branches detected
- [ ] 2. Owner confirmed product type, paths, branches, approvals and perspectives
- [ ] 3. "Build workflow" section added to CLAUDE.md
- [ ] 4. Decisions log, handoff file and doc templates created
- [ ] 5. Next step agreed (usually: decide, starting from the spec)
```

## 1. Inspect

1. Read `CLAUDE.md`, `README`, and any contributing guide. If a `Build workflow` section already exists, show it
   and ask what to change instead of adding a second one.
2. Detect the stack from its files (for example `package.json`, `go.mod`, `pyproject.toml`, `Cargo.toml`,
   `pubspec.yaml`, `Gemfile`, `pom.xml`, a `Makefile`) and read the real build, lint, test and run commands
   from them. Do not invent commands.
3. Read the branches (`git branch -a`) and the remote (`git remote -v`), and look for an existing spec,
   ADR folder, changelog and CI config.

## 2. Confirm with the owner

Explain each choice in plain words, then ask (up to four questions per dialog round):

1. Product type: web app, mobile app, backend system, AI or agent product, startup MVP (several may apply).
   This decides which review perspectives and checks are on.
2. Paths: spec, decisions log, feature docs, ADRs, evidence, handoff file. Recommend the defaults in the
   template unless the project already has a place.
3. Branches and merge style: integration and production branches, slice branch pattern, fast-forward merges or
   pull requests, the only remote to push to.
4. Approvals: what always needs the owner (merge, push, release, new dependency, spending money) and any
   standing approvals.

## 3. Write the CLAUDE.md section

Fill [assets/claude-md-section.md](assets/claude-md-section.md) with the confirmed values and append it to
`CLAUDE.md` (create the file if there is none). Keep it short; link to longer docs instead of pasting them.

## 4. Create the files

Copy each template from the sibling skills of this pack to the confirmed path, only where no file exists.
In Claude Code the sibling skills are at `${CLAUDE_SKILL_DIR}/..`; elsewhere use the relative path from this
skill's folder.

| Create | From |
|---|---|
| Decisions log | `../decide/assets/decision-log.md` |
| Spec (only if the owner wants a blank one now) | `../decide/assets/spec-template.md` |
| Feature doc template (`_TEMPLATE.md` in the feature docs folder) | `../plan-slice/assets/feature-doc.md` |
| ADR template (`_TEMPLATE.md` in the ADR folder) | `../plan-slice/assets/adr.md` |
| Evidence summary template (in the evidence folder) | `../verify-slice/assets/gate-evidence.md` |
| Handoff file | `../handoff/assets/handoff.md` |

If a sibling skill is missing (only some skills were copied), create a minimal file with a title and a
one-line purpose, and say which skill to install for the full template.

After the owner approves, run `git status` on each file. Commit only files that contain nothing but your
changes, with explicit paths (`docs: set up the build workflow`). If `CLAUDE.md` already had uncommitted
edits, leave it uncommitted and tell the owner.

## 5. Next

Usually `decide`: read the spec, or write a one-page spec with the owner if there is none.
