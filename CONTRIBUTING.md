# Contributing

Thank you for helping. This pack is meant to work for any product, stack and team, so the bar for a change is:
does it help most builders, and does it keep each skill short?

## Before you open a change

1. Open an issue first for a new skill or a change to how the skills chain, so the design can be agreed.
2. Keep skills product-agnostic. No stack, country, vendor or personal tool may be assumed. Anything
   project-specific becomes a key in the `Build workflow` section of `CLAUDE.md` (see
   `docs/configuration.md`) with a sensible default.
3. Use the fictional example product (Loafly, a bakery pre-order app) or another clearly fictional one in
   examples. Use they/them for people. Never include real names, companies, customer data or secrets.

## Writing skills

- Frontmatter: only `name`, `description` and `license`, so the folders stay portable. `name` matches the folder
  and uses lowercase letters, digits and hyphens.
- Description: third person, under 1,024 characters, what the skill does first, then "Use when ..." with the
  words people actually type.
- Body: under 500 lines (the skills here stay at about 120 or fewer). Move detail into `references/` and templates
  into `assets/`, each linked directly from `SKILL.md`. Give a reference file over 100 lines a `## Contents`
  list.
- Plain, short sentences. Imperative mood for instructions. One term per concept.
- No dates or version numbers in instructions; put dated facts in `docs/research-notes.md`.

## Writing agents and hooks

- Agents in `agents/` need `name` (matching the file name) and a `description` that says when to use the agent.
  Give each the fewest tools it needs; reviewers and researchers are read-only. Do not use `hooks`,
  `mcpServers` or `permissionMode` in agent frontmatter: Claude Code ignores them for plugin agents.
- Hooks in `hooks/hooks.json` run on every session of everyone who installs the plugin. Keep them fast,
  POSIX `sh` with no dependencies, always exiting 0 unless they must block, never reading `.env` files or
  secrets, and printing short factual statements.

## Checks

Run before every commit:

```bash
python3 scripts/check_skills.py
claude plugin validate .
```

When you change a description or a skill's behaviour, run the related eval cases (this uses model calls):

```bash
claude plugin eval . --case <case-name> --runs 1 --ablation none --no-publish
```

Add or update an eval case when you add a skill or change when one should trigger. Every skill has at least
one case where it must fire, and the negative cases must keep passing.

## Commits

- Conventional commits: `feat:`, `fix:`, `docs:`, `test:`, `refactor:`, `chore:`.
- Stage explicit paths. One coherent change per commit.
- Add a line to `CHANGELOG.md` under `Unreleased` for anything a user would notice.

## Releases

Maintainers bump `version` in `.claude-plugin/plugin.json` and `package.json` (the lint fails if they differ), move the `Unreleased` entries under the new
version in `CHANGELOG.md`, and tag the release (`claude plugin tag .` creates a `{name}--v{version}` tag after
checking the manifests agree), and publish to npm with `npm publish` (which runs `npm test` first).

## License

By contributing you agree that your contributions are licensed under the MIT License in `LICENSE`.
