#!/bin/sh
# SessionStart hook for decide-build-ship.
# Prints short, factual context about the build workflow state of the current project.
# Reads only CLAUDE.md and the handoff file. Never reads .env files or secrets. Always exits 0.
# File content is printed with printf '%s', never echo, so backslashes are not interpreted.

project_dir="${CLAUDE_PROJECT_DIR:-$(pwd)}"
claude_md="$project_dir/CLAUDE.md"
max_next_lines=12
max_line_chars=200

[ -f "$claude_md" ] || exit 0
grep -q '^## Build workflow' "$claude_md" 2>/dev/null || exit 0

# Handoff path from the "Handoff file:" key, else the default.
handoff_rel=$(sed -n 's/^- Handoff file: *`\([^`]*\)`.*/\1/p' "$claude_md" | head -n 1)
[ -n "$handoff_rel" ] || handoff_rel="tasks/handoff.md"
case "$handoff_rel" in
  /*|..|../*|*/../*|*/..) exit 0 ;;  # only relative paths that stay inside the project
esac
handoff="$project_dir/$handoff_rel"

printf '%s\n' "This project uses the decide-build-ship workflow (CLAUDE.md has a Build workflow section)."

if [ ! -f "$handoff" ]; then
  printf 'No handoff file exists yet at %s.\n' "$handoff_rel"
  exit 0
fi

updated=$(sed -n 's/^Last updated: *//p' "$handoff" | head -n 1 | cut -c "1-$max_line_chars")
if [ -n "$updated" ]; then
  printf 'A handoff file exists at %s (last updated %s).\n' "$handoff_rel" "$updated"
else
  printf 'A handoff file exists at %s.\n' "$handoff_rel"
fi

next=$(awk -v max="$max_next_lines" -v width="$max_line_chars" '
  /^## Next step/ { on = 1; next }
  on && /^## / { exit }
  on && n < max && NF { print substr($0, 1, width); n++ }
' "$handoff")
if [ -n "$next" ]; then
  printf '%s\n' "Its Next step section reads:"
  printf '%s\n' "$next"
fi

# Count list items under "Waiting for an answer:" up to the next blank line followed by a non-list line.
waiting=$(awk '
  /^Waiting for an answer:/ { on = 1; next }
  !on { next }
  /^- [^<]/ { n++; blank = 0; next }
  /^[[:space:]]*$/ { blank = 1; next }
  blank && !/^[[:space:]]/ { exit }
  END { print n + 0 }
' "$handoff")
if [ "$waiting" -gt 0 ] 2>/dev/null; then
  printf 'The handoff file lists %s owner question(s) waiting for an answer.\n' "$waiting"
fi
printf '%s\n' "The handoff skill's resume steps check the real git state before continuing from this file."
exit 0
