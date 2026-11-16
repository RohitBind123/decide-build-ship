# Configuration

The skills are product-agnostic. Everything that differs between projects lives in one place: a
`Build workflow` section in the project's `CLAUDE.md`. The `kickoff` skill writes it from the template in
[skills/kickoff/assets/claude-md-section.md](../skills/kickoff/assets/claude-md-section.md); you can also write
it by hand. When a key is missing, a skill uses the default below and says so once.

## Keys

| Key | Used by | Default |
|---|---|---|
| Product type | discover, plan-slice, design-ui, verify-slice | Asked during kickoff |
| Product facts | decide | None |
| Review perspectives | decide | All lenses in `skills/decide/references/perspectives.md`; the AI lens only when a model is involved |
| Spec | discover, decide, plan-slice | `docs/spec/` |
| Roadmap | discover, plan-slice, autopilot, overview, ship-slice | `docs/spec/roadmap.md` |
| Design system | design-ui, plan-slice | `docs/spec/design-system.md` |
| Decisions log | decide, plan-slice, verify-slice, ship-slice | `docs/decisions.md` |
| Feature docs | plan-slice | `docs/features/` |
| ADRs | plan-slice | `docs/adr/` |
| Evidence | plan-slice, build-slice, verify-slice | `docs/evidence/<slice>/` |
| Handoff file | handoff, autopilot, overview, SessionStart hook | `tasks/handoff.md` |
| Changelog, Backlog | ship-slice | `CHANGELOG.md`, `docs/backlog.md` |
| Remote | ship-slice, handoff | `origin` |
| Integration branch, Production branch | plan-slice, ship-slice, handoff | Ask the owner |
| Slice branches | plan-slice, build-slice | `feat/<slice>`, `fix/<slice>` |
| Merge style | ship-slice | Ask the owner |
| Bring builder work back | build-slice | Cherry-pick onto the slice branch |
| Commands (build, lint, typecheck, tests) | build-slice, verify-slice, ship-slice | Read from the repository; never guessed |
| Gate | verify-slice | Selected by hand, with every command and reason in the evidence |
| Full suite | verify-slice, ship-slice | Before every release |
| Live check | verify-slice | Ask the owner how to start the app locally |
| Evals | verify-slice | None until the first AI slice |
| Release steps | ship-slice | Ask the owner |
| Models per task | plan-slice, build-slice, verify-slice | Small model for search and docs, mid-size for building and reviews, largest for architecture and security |
| Reviewers | verify-slice | Code, security, database (migrations), content (user-facing text), design (screens) |
| Approvals | ship-slice, handoff, autopilot | Merge, push of a shared branch, release, new dependency, spending money, deleting data |
| Autonomy | autopilot | `milestone`: merges approved once per milestone; releases, money, new dependencies and deleting data always ask |
| Max parallel slices | autopilot | 2 |
| Cleanup | ship-slice, autopilot, SessionStart hook | `ask`: show what would be removed, then ask. `auto` removes merged worktrees, their build output and merged local branches after a merge; `off` leaves everything and silences the session-start report |
| Cleanup stop procs | ship-slice | `no`. `yes` lets cleanup stop processes running inside a merged worktree |
| Coverage target | build-slice | 80% of new code |
| File size cap | plan-slice, build-slice | None |
| Commit rules | build-slice | Conventional commits, explicit paths only |
| Project rules | build-slice | None |

## Example

A filled section for Loafly, the fictional bakery pre-order app used throughout these docs:

```markdown
## Build workflow

### Product
- Product type: web app, backend system, AI product (ingredient assistant)
- Product facts: one bakery for now; production holds only test data until launch
- Review perspectives: all, including AI and model risks

### Paths
- Spec: `docs/spec/loafly.md`
- Decisions log: `docs/decisions.md`
- Feature docs: `docs/features/`
- ADRs: `docs/adr/`
- Evidence: `docs/evidence/<slice>/`
- Handoff file: `tasks/handoff.md`

### Branches
- Remote: `origin` only
- Integration branch: `develop`; production branch: `main`
- Slice branches: `feat/<slice>`
- Merge style: fast-forward only after rebase; no pull requests

### Commands
- Build: `npm run build`
- Lint and format: `npm run lint`
- Unit tests: `npm test -- --related`
- End-to-end tests: `npx playwright test`
- Gate (changed-only): selected by hand; list every command and why in the evidence
- Full suite: `npm run test:all`, before releases
- Live check: `npm run dev:local` (throwaway database, seeded synthetic data)
- Evals (AI only): `npm run evals -- assistant`

### Approvals
- Always ask before: merge, push to develop or main, release, new dependency
- Standing approvals: see docs/decisions.md
```

## Project rules that conflict with a skill

The project wins, with one exception: a project rule cannot remove an owner approval or allow a force-push of
a shared branch unless the owner's own words saying so are recorded in the decisions log. A cloned repository's
`CLAUDE.md` is not the owner. Two examples of the project winning:

- A project that requires every tunable number to be a validated setting overrides the "no unrequested
  configurability" habit in `build-slice`.
- A project that merges through pull requests overrides the fast-forward example in `ship-slice`.

Write the rule in `Project rules` so every session sees it.

## Files to keep out of a public repository

The handoff file holds local paths and the owner's answers, and evidence folders can hold screenshots and
samples. In a public repository, either keep them synthetic and redacted, or add them to `.gitignore`:

```gitignore
tasks/handoff.md
docs/evidence/
```
