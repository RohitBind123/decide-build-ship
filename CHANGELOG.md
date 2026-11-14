# Changelog

All notable changes to this project are recorded here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and versions follow
[Semantic Versioning](https://semver.org/). The version lives in `.claude-plugin/plugin.json`.

## [Unreleased]

## [0.2.0] - 2026-11-15

### Added

- `discover` skill: expert product discovery. Researches the domain with cited sources, interviews the owner
  with recommended answers, suggests table-stakes and differentiating features, and writes the product brief,
  architecture and a roadmap of milestones and slices (templates for each).
- `autopilot` skill: runs plan, build, verify and ship slice after slice under a merge approval the owner gives
  once per milestone, runs independent slices in parallel, batches owner questions, and supports unattended
  runs. Releases, money, new dependencies and deleting data always ask.
- `overview` skill: a read-only "where are we?" report from the roadmap, decisions log, handoff file and git
  state, optionally as a shareable page.
- `design-ui` skill: design system template, every screen state, accessibility (WCAG 2.2 AA), platform
  conventions and a screenshot review checklist. Original text; platform guidelines are cited by link.
- Plugin agents: `product-researcher`, `slice-builder` (worktree-isolated), `code-reviewer`,
  `security-reviewer` and `design-reviewer`.
- A SessionStart hook that tells a new, resumed or compacted session whether a handoff file exists and what its
  next step is.
- Four eval cases for the new skills; the lint now checks agents and hooks.
- Docs: companion skills and plugins, working with Claude efficiently. Plugin icon and README banner.

### Changed

- `decide` sends new products and large features to `discover`; `plan-slice` reads the roadmap and uses the
  design system for screens; `verify-slice` adds a design review; `ship-slice` marks the slice in the roadmap;
  `kickoff` asks about autonomy and adds the `Roadmap`, `Design system`, `Autonomy` and `Max parallel slices`
  keys.
- README rewritten with badges, the full skill map and a quick start.

## [0.1.0] - 2026-11-14

### Added

- Seven skills: `kickoff`, `decide`, `plan-slice`, `build-slice`, `verify-slice`, `ship-slice` and `handoff`.
- Templates: spec, decisions log, feature doc, ADR, gate evidence, handoff file, and the `Build workflow`
  section for `CLAUDE.md`.
- Plugin manifest and a single-plugin marketplace file, so the pack installs with `/plugin install`.
- Thirteen `claude plugin eval` cases: ten trigger and behaviour checks and three must-not-trigger checks.
- `scripts/check_skills.py`, a standard-library lint for skills, manifests and eval cases, run in CI.
- Docs: configuration keys, testing, research notes with sources, and a filled example decisions log.
