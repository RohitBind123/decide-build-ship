#!/usr/bin/env python3
"""Structural checks for the skills, manifests and eval cases in this repository.

Runs with the Python standard library only, makes no network calls and changes no files.

Usage:
    python3 scripts/check_skills.py            # check the repository this script lives in
    python3 scripts/check_skills.py <root>     # check another checkout

Exit code 0 when every check passes, 1 when any check fails.
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

# Limits from the Agent Skills specification (agentskills.io/specification) and
# Anthropic's skill authoring best practices. Skills that break them can fail to
# upload outside Claude Code, so they are errors here, not warnings.
NAME_MAX_CHARS = 64
DESCRIPTION_MAX_CHARS = 1024
BODY_MAX_LINES = 500
# Reference files longer than this should open with a table of contents so that
# a partial read still shows their full scope (best-practices guidance).
TOC_MIN_LINES = 100

NAME_PATTERN = re.compile(r"^[a-z0-9]+(-[a-z0-9]+)*$")
RESERVED_WORDS = ("anthropic", "claude")
PORTABLE_KEYS = {"name", "description", "license", "compatibility", "metadata", "allowed-tools"}
LINK_PATTERN = re.compile(r"\]\(([^)#\s]+)(?:#[^)]*)?\)")
XML_TAG_PATTERN = re.compile(r"<[A-Za-z/][^>]*>")
USAGE_PATTERN = re.compile(r"\bUse (when|at|after|before|whenever)\b")
PLACEHOLDER_PATTERN = re.compile(r"<COPYRIGHT HOLDER>|<github-user>|<repo>")
GRADER_TYPES = {"regex", "tool_used", "tool_order", "file_exists", "llm", "baseline"}


def parse_frontmatter(text: str) -> tuple[dict[str, str], list[str]] | None:
    """Return (top-level keys, body lines), or None when there is no frontmatter."""
    lines = text.splitlines()
    if not lines or lines[0].strip() != "---":
        return None
    try:
        end = lines.index("---", 1)
    except ValueError:
        return None
    fields: dict[str, str] = {}
    for line in lines[1:end]:
        if not line or line.startswith((" ", "\t", "#")):
            continue
        key, sep, value = line.partition(":")
        if sep:
            fields[key.strip()] = value.strip().strip('"').strip("'")
    return fields, lines[end + 1 :]


def check_links(path: Path, text: str, errors: list[str]) -> None:
    for target in LINK_PATTERN.findall(text):
        if "://" in target or target.startswith("mailto:"):
            continue
        if "\\" in target:
            errors.append(f"{path}: link uses a backslash: {target}")
            continue
        if not (path.parent / target).exists():
            errors.append(f"{path}: broken relative link: {target}")


def check_skill(skill_dir: Path, errors: list[str], report: list[str]) -> None:
    skill_md = skill_dir / "SKILL.md"
    if not skill_md.is_file():
        errors.append(f"{skill_dir}: missing SKILL.md")
        return
    text = skill_md.read_text(encoding="utf-8")
    parsed = parse_frontmatter(text)
    if parsed is None:
        errors.append(f"{skill_md}: frontmatter must start on line 1 and close with ---")
        return
    fields, body = parsed

    name = fields.get("name", "")
    if name != skill_dir.name:
        errors.append(f"{skill_md}: name '{name}' must match the folder name '{skill_dir.name}'")
    if not NAME_PATTERN.match(name) or len(name) > NAME_MAX_CHARS:
        errors.append(f"{skill_md}: name must be lowercase letters, digits and single hyphens, max {NAME_MAX_CHARS}")
    if any(word in name for word in RESERVED_WORDS):
        errors.append(f"{skill_md}: name must not contain a reserved word {RESERVED_WORDS}")

    description = fields.get("description", "")
    if not description:
        errors.append(f"{skill_md}: description is required")
    if len(description) > DESCRIPTION_MAX_CHARS:
        errors.append(f"{skill_md}: description is {len(description)} chars, max {DESCRIPTION_MAX_CHARS}")
    if XML_TAG_PATTERN.search(description):
        errors.append(f"{skill_md}: description must not contain XML tags")
    if not USAGE_PATTERN.search(description):
        errors.append(f"{skill_md}: description should say when to use the skill ('Use when ...')")

    unknown = set(fields) - PORTABLE_KEYS
    if unknown:
        errors.append(f"{skill_md}: non-portable frontmatter keys {sorted(unknown)}")

    if len(body) > BODY_MAX_LINES:
        errors.append(f"{skill_md}: body is {len(body)} lines, max {BODY_MAX_LINES}")

    check_links(skill_md, text, errors)
    report.append(f"  {name:<14} description {len(description):>4} chars, body {len(body):>3} lines")

    for extra in sorted(skill_dir.rglob("*.md")):
        if extra == skill_md:
            continue
        extra_text = extra.read_text(encoding="utf-8")
        check_links(extra, extra_text, errors)
        is_reference = "references" in extra.parts
        if is_reference and len(extra_text.splitlines()) > TOC_MIN_LINES and "## Contents" not in extra_text:
            errors.append(f"{extra}: over {TOC_MIN_LINES} lines without a '## Contents' section")


def check_manifests(root: Path, errors: list[str]) -> None:
    try:
        plugin = json.loads((root / ".claude-plugin" / "plugin.json").read_text(encoding="utf-8"))
        market = json.loads((root / ".claude-plugin" / "marketplace.json").read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        errors.append(f".claude-plugin: cannot read manifests: {exc}")
        return
    entries = market.get("plugins", [])
    names = [entry.get("name") for entry in entries]
    if plugin.get("name") not in names:
        errors.append("marketplace.json: no plugin entry whose name matches plugin.json")
    if any(entry.get("version") for entry in entries):
        errors.append("marketplace.json: keep the version in plugin.json only, so the two cannot disagree")


def check_evals(root: Path, skill_names: list[str], errors: list[str]) -> int:
    """Check eval cases; a prompt must not name a skill, or it tests nothing about triggering."""
    cases = 0
    names_pattern = re.compile(r"\b(" + "|".join(map(re.escape, skill_names)) + r")\b") if skill_names else None
    evals = root / "evals"
    for prompt in sorted(evals.rglob("prompt.md")):
        if "results" in prompt.parts:
            continue
        cases += 1
        parsed_prompt = parse_frontmatter(prompt.read_text(encoding="utf-8"))
        if parsed_prompt is None:
            errors.append(f"{prompt}: needs frontmatter (at least max_turns and allowed_tools)")
        else:
            prompt_fields, prompt_body = parsed_prompt
            for key in ("max_turns", "allowed_tools"):
                if key not in prompt_fields:
                    errors.append(f"{prompt}: frontmatter needs {key}")
            named = names_pattern.search("\n".join(prompt_body)) if names_pattern else None
            if named:
                errors.append(f"{prompt}: the prompt names the skill '{named.group(1)}'; phrase it as a user would")
        graders = sorted((prompt.parent / "graders").glob("*.md"))
        if not graders:
            errors.append(f"{prompt.parent}: a case needs at least one grader in graders/")
        for grader in graders:
            parsed = parse_frontmatter(grader.read_text(encoding="utf-8"))
            grader_type = parsed[0].get("type") if parsed else None
            if grader_type not in GRADER_TYPES:
                errors.append(f"{grader}: type must be one of {sorted(GRADER_TYPES)}")
    return cases


def find_placeholders(root: Path) -> list[str]:
    """Placeholders the maintainer must fill before publishing (reported, not failed)."""
    found = []
    for path in [root / "LICENSE", root / "README.md", *sorted((root / ".claude-plugin").glob("*.json"))]:
        if path.is_file():
            for marker in sorted(set(PLACEHOLDER_PATTERN.findall(path.read_text(encoding="utf-8")))):
                found.append(f"{path.relative_to(root)}: {marker}")
    return found


def main() -> int:
    root = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(__file__).resolve().parent.parent
    errors: list[str] = []
    report: list[str] = []

    skill_dirs = sorted(p for p in (root / "skills").iterdir() if p.is_dir())
    if not skill_dirs:
        errors.append("skills/: no skills found")
    for skill_dir in skill_dirs:
        check_skill(skill_dir, errors, report)
    check_manifests(root, errors)
    cases = check_evals(root, [d.name for d in skill_dirs], errors)
    for doc in [root / "README.md", *sorted((root / "docs").glob("*.md"))]:
        if doc.is_file():
            check_links(doc, doc.read_text(encoding="utf-8"), errors)

    print(f"Skills ({len(skill_dirs)}):")
    print("\n".join(report))
    print(f"Eval cases: {cases}")
    placeholders = find_placeholders(root)
    if placeholders:
        print("\nPlaceholders to fill before publishing (not an error):")
        print("\n".join(f"  - {item}" for item in placeholders))
    if errors:
        print(f"\n{len(errors)} problem(s):")
        print("\n".join(f"  - {error}" for error in errors))
        return 1
    print("\nAll checks passed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
