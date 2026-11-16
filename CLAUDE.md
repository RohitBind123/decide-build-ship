# decide-build-ship

A Claude Code plugin (skills, agents, one hook) and an npm installer CLI. See `README.md` and `CONTRIBUTING.md`.

## Build workflow

This project uses the decide-build-ship skills: discover, decide, plan-slice, design-ui, build-slice,
verify-slice, ship-slice, autopilot, overview and handoff. The skills read the keys below; change a value here,
not in the skills.

### Product

- Product type: developer tool (Claude Code plugin and npm installer CLI)
- Product facts: no app, no user data, no database. The skills steer a model, so wording changes to a skill
  need an eval run before a release. The published npm package must never contain decisions, evidence or
  handoff files.
- Review perspectives: users (people installing and using the plugin), security and privacy (shell scripts,
  installer, hook), engineering cost

### Paths

- Spec: `docs/spec/` (the floor: build to it or better)
- Roadmap: `docs/spec/roadmap.md`
- Design system: not applicable (no screens)
- Decisions log: `docs/decisions.md`
- Feature docs: `docs/features/` (template `_TEMPLATE.md`)
- ADRs: `docs/adr/` (template `_TEMPLATE.md`)
- Evidence: `docs/evidence/<slice>/`
- Handoff file: `tasks/handoff.md`
- Changelog: `CHANGELOG.md`
- Backlog: `docs/backlog.md`

### Branches

- Remote: `origin` only
- Integration branch: `main`
- Production branch: `main`; moves only through an owner-approved pull request
- Slice branches: `feat/<slice>` and `fix/<slice>`, created from `main`
- Merge style: pull request on origin that the owner approves
- Bring builder work back: cherry-pick onto the slice branch
- Never rebase or force-push `main`.

### Commands

- Build: not applicable
- Lint and format: `python3 scripts/check_skills.py`
- Typecheck: not applicable
- Unit tests: `node --test cli/index.test.mjs cli/cleanup-slice.test.mjs`
- End-to-end tests: not applicable
- Gate (changed-only): `npm test`
- Full suite: `npm test && claude plugin validate . --strict`
- Live check: run `node cli/index.mjs install --dir <temp dir>` and `sh skills/ship-slice/scripts/cleanup-slice.sh`
  in a throwaway temp git repo with synthetic worktrees
- Evals: `claude plugin eval` (costs model usage; run before a release or after changing skill wording)
- Release steps: bump the version in `package.json` and `.claude-plugin/plugin.json`, update `CHANGELOG.md`,
  `npm publish`, tag `v<version>`; the owner approves each step

### Agents

- Models per task: search, docs and mechanical edits on the smallest fast model; building, tests and
  reviews on a mid-size model; architecture, slice planning and security review on the largest model.
- Reviewers: code reviewer for scripts and the CLI; security reviewer for the shell scripts, hook and installer.
- One git worktree per builder; one writer per file set; at most 2 builders doing heavy work at once.
- Max parallel slices (autopilot): 2

### Approvals

- Always ask the owner (with AskUserQuestion) before: merging, pushing a shared branch, releasing or
  publishing to npm, adding a dependency, spending money, deleting data.
- Standing approvals: see the "Standing approvals" section of the decisions log.
- Autonomy: per merge. Autopilot builds and verifies each slice, then asks before every pull request merge.

### Rules

- Coverage target: 80% of new code
- File size cap: 400 lines
- Commit rules: conventional commits; stage explicit paths only; end commits with the
  `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>` trailer
- Project rules: keep skills product-agnostic and each `SKILL.md` under 500 lines (see `CONTRIBUTING.md`);
  hooks are POSIX `sh`, fast, and exit 0; no emoji in code, comments or docs.
- Explain each owner question in plain words with a short story, then ask; review every answer before building.
- Docs before code; contract first; failing test first.
- Never trade quality for speed, including in long or unattended runs.
- Never read or print `.env` files or secrets.
- Missing values are shown as missing, never as 0; internal codes never reach users.
- Keep the handoff file current at every phase change.
