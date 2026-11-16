## Build workflow

This project uses the decide-build-ship skills: discover, decide, plan-slice, design-ui, build-slice,
verify-slice, ship-slice, autopilot, overview and handoff. The skills read the keys below; change a value here,
not in the skills.

### Product

- Product type: <web app | mobile app | desktop app | backend system | AI or agent product | startup MVP>
- Product facts: <facts that change decisions, for example "production holds only test data">
- Review perspectives: users and roles, buyer or owner, end customer, business and support, data and
  reporting, security and privacy, engineering cost<, AI and model risks>

### Paths

- Spec: `docs/spec/` (the floor: build to it or better)
- Roadmap: `docs/spec/roadmap.md`
- Design system: `docs/spec/design-system.md`
- Decisions log: `docs/decisions.md`
- Feature docs: `docs/features/` (template `_TEMPLATE.md`)
- ADRs: `docs/adr/` (template `_TEMPLATE.md`)
- Evidence: `docs/evidence/<slice>/`
- Handoff file: `tasks/handoff.md`
- Changelog: `CHANGELOG.md`
- Backlog: `docs/backlog.md`

### Branches

- Remote: `origin` only
- Integration branch: `<develop or main>`
- Production branch: `<main>`; moves only on an owner-approved release
- Slice branches: `feat/<slice>` and `fix/<slice>`, created from the integration branch
- Merge style: <fast-forward only after rebase | pull request>
- Bring builder work back: <cherry-pick | merge> onto the slice branch
- Never rebase or force-push the integration or production branch.

### Commands

- Build: `<command>`
- Lint and format: `<command>`
- Typecheck: `<command>`
- Unit tests: `<command>`
- End-to-end tests: `<command>`
- Gate (changed-only): `<command, or "selected by hand; list every command and why in the evidence">`
- Full suite: `<command>`, before releases and in CI
- Live check: `<how to start the real app locally with a throwaway database and synthetic data>`
- Evals (AI only): `<command>`
- Release steps: `<for example: fast-forward the production branch, tag, deploy command>`

### Agents

- Models per task: search, docs and mechanical edits on the smallest fast model; building, tests and
  reviews on a mid-size model; architecture, slice planning and security review on the largest model.
- Reviewers: a code reviewer per language touched; a security reviewer for input, auth, data access, secrets
  and money; a database reviewer for migrations and heavy queries; a content reviewer for user-facing text.
- One git worktree per builder; one writer per file set; at most <2-3> builders doing heavy work at once.
- Max parallel slices (autopilot): <2>

### Approvals

- Always ask the owner (with AskUserQuestion) before: merging, pushing a shared branch, releasing, adding a
  dependency, spending money, deleting data.
- Standing approvals: see the "Standing approvals" section of the decisions log.
- Cleanup: <ask | auto | off>. After a merge, `ask` shows what would be removed (merged worktrees, build output,
  merged local branches) and asks; `auto` removes it; `off` leaves it. The session-start report is silent on `off`.
- Cleanup stop procs: <no | yes>. `yes` lets cleanup stop dev servers running inside a merged worktree.
- Autonomy: <milestone | per merge>. `milestone`: autopilot merges verified slices under a merge approval the
  owner gives once per milestone. Releases, money, new dependencies and deleting data always ask.

### Rules

- Coverage target: <80%> of new code
- File size cap: <none | 200 | 400> lines
- Commit rules: conventional commits; stage explicit paths only<; no co-author trailer>
- Project rules: <extra rules, for example "every tunable number is a validated setting with a default">.
  Project rules cannot waive the approval or no-force-push rules unless the owner records that in the
  decisions log.
- Explain each owner question in plain words with a short story, then ask; review every answer before building.
- Docs before code; contract first; failing test first.
- Never trade quality for speed, including in long or unattended runs.
- Never read or print `.env` files or secrets; document new settings in the example env file.
- Missing values are shown as missing, never as 0; internal codes never reach users.
- Keep the handoff file current at every phase change.
