# Research notes

What the official documentation says about skills and plugins, and how this pack follows it. Checked against
Claude Code v2.1.322 in November 2026. Re-check the sources before relying on a specific limit; they change.

## Sources

1. Claude Code skills: https://code.claude.com/docs/en/skills
2. Skill authoring best practices: https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices
3. Agent Skills specification: https://agentskills.io/specification
4. Plugin manifest reference: https://code.claude.com/docs/en/plugins-reference
5. Marketplace reference: https://code.claude.com/docs/en/plugins/marketplace-reference.md
6. Create a marketplace: https://code.claude.com/docs/en/plugins/create-marketplace.md
7. Test plugins with evals: https://code.claude.com/docs/en/plugin-evals.md
8. Anthropic's example skills and marketplace: https://github.com/anthropics/skills (including
   `skills/skill-creator/SKILL.md` and `.claude-plugin/marketplace.json`)
9. Coding-mistake guidelines referenced in `build-slice`: https://github.com/multica-ai/andrej-karpathy-skills

## SKILL.md format

- A skill is a folder with a `SKILL.md` whose YAML frontmatter starts on line 1 (1, 3).
- `name`: 1 to 64 characters, lowercase letters, digits and single hyphens, no leading or trailing hyphen,
  must match the folder name, must not contain the reserved words `anthropic` or `claude` (2, 3).
- `description`: 1 to 1,024 characters, no XML tags, third person, says what the skill does and when to use
  it (2, 3). Claude Code truncates description plus `when_to_use` at 1,536 characters in its listing (1).
- Portable keys outside Claude Code: `name`, `description`, `license`, `compatibility`, `metadata`,
  `allowed-tools`. Other keys (`disable-model-invocation`, `context`, `model`, `paths`, ...) work in Claude
  Code but cause a hard error on claude.ai upload or the Skills API (1). This pack uses only `name`,
  `description` and `license`, so the same folders work as a plugin, as copied folders, and elsewhere.

## Size and progressive disclosure

- Three levels: metadata (about 100 tokens, always loaded), the `SKILL.md` body (loaded on use, under 5,000
  tokens recommended), and bundled files (loaded only when read) (3).
- Keep the body under 500 lines (1, 2, 3). Every skill here is about 120 lines or fewer, frontmatter included.
- Keep references one level deep from `SKILL.md`; give reference files over 100 lines a table of contents
  (2). Every reference file here links directly from its `SKILL.md`, and the longer ones open with
  `## Contents`.
- After auto-compaction, Claude Code re-attaches the first 5,000 tokens of each recently used skill, within a
  25,000-token total (1). Short bodies survive compaction whole.

## Descriptions that trigger reliably

- Put the key use case first; include the words users actually type (2).
- Claude tends to under-trigger skills, so descriptions can be a little "pushy" about when to use them (8,
  skill-creator).
- Avoid vague names (`helper`, `utils`) and inconsistent naming (2). Names here are action-oriented and
  distinct (`plan-slice`, `verify-slice`) to avoid colliding with common personal skills such as `plan` or
  `verify` when copied as plain folders; personal skills override project skills with the same name (1).

## Content guidance applied

- Assume Claude is capable; only add what it does not know (2).
- Checklists Claude copies into its reply for multi-step workflows (2): every skill has one.
- Feedback loops: validate, fix, repeat (2): the gate's "rerun only failures" loop.
- No time-sensitive statements in instructions (2); dated facts live in this notes file.
- Forward slashes in paths (2).
- `${CLAUDE_SKILL_DIR}` expands to the skill's folder in Claude Code (1); `kickoff` uses it to find sibling
  templates and falls back to a relative path elsewhere.

## Plugins and marketplaces

- The manifest is `.claude-plugin/plugin.json`; only `name` is required, kebab-case. `version`,
  `description` and `author` avoid validator warnings (4).
- Plugin names must not start with `claude-` or `anthropic-` or pass as Anthropic's own (4).
- Components live at the plugin root, not inside `.claude-plugin/`; skills in `skills/<name>/SKILL.md` (4).
- Plugin skills are namespaced: `/decide-build-ship:decide` (1, 4).
- The marketplace file is `.claude-plugin/marketplace.json` with `name`, `owner` and `plugins`; a plugin in
  the same repository uses a relative `source` of `"./"` (5, 8). Keep the entry name and the manifest name the
  same (6). Keep `version` in `plugin.json` only, since it wins and a mismatch warns (5).
- Install flow for users: `/plugin marketplace add <owner>/<repo>`, then
  `/plugin install <plugin>@<marketplace>`, or `claude plugin marketplace add` and `claude plugin install`
  from a shell (6).
- `claude plugin validate <path>` is the authoritative check; `--strict` fails on warnings (4, 6).
- A `CLAUDE.md` at the plugin root is not loaded as context; instructions belong in skills (4).

## Evals

- `claude plugin eval` runs cases from `evals/<case>/prompt.md` plus `graders/*.md` (7).
- Grader types: `regex`, `tool_used`, `tool_order`, `file_exists`, `llm`, `baseline` (7).
- `tool_used` with `tool: Skill` and an `input_match` regex checks that a skill fired; `min: 0`, `max: 0` and
  `arm: both` check that it did not (7).
- Each case runs three times by default, with and without the plugin; `Δ` is what the plugin adds (7).
- Runs get only read-only tools unless granted with `--allow-tools` (7).
- skill-creator has its own `evals/evals.json` format; the two tools do not read each other's files (7, 8).
  This pack uses the `claude plugin eval` format only.

## Workflow sources

The workflow itself generalises practices from two private products (a multi-platform business application
and an AI agent product) that the author built with Claude. No names, data or code from those
projects are included. The lessons kept are:

- spec first, explain then ask, review every answer from several perspectives, record answers durably, tell
  running builders when an answer changes;
- documents before code, contract first, failing tests first, one worktree and one writer per file set, a
  model chosen per task;
- a changed-only gate with reruns of failures only and the full suite before releases;
- a live check of the real app with synthetic data, and evidence before and after;
- merge only when green and approved, never force-push shared branches, standing approvals written down;
- a handoff file kept current, because limits and restarts arrive without warning;
- for AI products: evals before prompts, pinned models, budgets for cost and latency, capability decided by
  code rather than by content, and people approving consequential actions.
