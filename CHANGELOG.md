# Changelog

All notable changes to this project are recorded here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and versions follow
[Semantic Versioning](https://semver.org/). The version lives in `.claude-plugin/plugin.json`.

## [Unreleased]

## [0.1.0] - 2026-11-14

### Added

- Seven skills: `kickoff`, `decide`, `plan-slice`, `build-slice`, `verify-slice`, `ship-slice` and `handoff`.
- Templates: spec, decisions log, feature doc, ADR, gate evidence, handoff file, and the `Build workflow`
  section for `CLAUDE.md`.
- Plugin manifest and a single-plugin marketplace file, so the pack installs with `/plugin install`.
- Thirteen `claude plugin eval` cases: ten trigger and behaviour checks and three must-not-trigger checks.
- `scripts/check_skills.py`, a standard-library lint for skills, manifests and eval cases, run in CI.
- Docs: configuration keys, testing, research notes with sources, and a filled example decisions log.
