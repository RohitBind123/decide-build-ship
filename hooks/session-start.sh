#!/bin/sh
# SessionStart hook for decide-build-ship.
# Prints short, factual context about the build workflow state of the current project.
# Reads CLAUDE.md, the handoff file and the git worktree list (never file contents of worktrees). Never reads
# .env files or secrets. Always exits 0.
# File content is printed with printf '%s', never echo, so backslashes are not interpreted.

project_dir="${CLAUDE_PROJECT_DIR:-$(pwd)}"
claude_md="$project_dir/CLAUDE.md"
max_next_lines=12
max_line_chars=200
max_linked_worktrees=50

# D4: report only, never delete. D5: "- Cleanup: off" in CLAUDE.md silences the line (default is ask).
report_merged_worktrees() {
  cleanup=$(sed -n 's/^- Cleanup: *`\{0,1\}\([A-Za-z]*\).*/\1/p' "$claude_md" | head -n 1 | tr 'A-Z' 'a-z')
  [ "$cleanup" = "off" ] && return 0
  command -v git >/dev/null 2>&1 || return 0
  list=$(git -C "$project_dir" worktree list --porcelain 2>/dev/null) || return 0
  [ -n "$list" ] || return 0
  tab=$(printf '\t')
  # Merged means merged into the main checkout (the first block of the list), whichever worktree this session is in.
  main_path=$(printf '%s\n' "$list" | awk '/^worktree / { print substr($0, 10); exit }')
  base=$(git -C "$main_path" rev-parse HEAD 2>/dev/null) || return 0
  here=$(git -C "$project_dir" rev-parse --show-toplevel 2>/dev/null)
  # Linked worktrees only (the first block is the main checkout): skip detached and locked ones.
  candidates=$(printf '%s\n' "$list" | awk -v max_linked="$max_linked_worktrees" -v tab="$tab" '
    function flush() { if (n > 1 && path != "" && branch != "" && !skip && n - 1 <= max_linked) print path tab branch }
    /^worktree / { flush(); n++; path = substr($0, 10); branch = ""; skip = 0; next }
    /^branch / { branch = substr($0, 8); next }
    /^detached/ || /^locked/ { skip = 1 }
    END { flush() }
  ')
  [ -n "$candidates" ] || return 0
  count=0
  while IFS="$tab" read -r wt_path wt_branch; do
    [ -d "$wt_path" ] || continue
    [ "$wt_path" = "$here" ] && continue
    git -C "$project_dir" merge-base --is-ancestor "$wt_branch" "$base" 2>/dev/null || continue
    # A new slice branch has only its "branch: Created" reflog entry and looks merged; skip it.
    git -C "$project_dir" reflog show --format='%gs' "$wt_branch" 2>/dev/null | grep -qv '^branch: Created' || continue
    count=$((count + 1))
  done <<EOF
$candidates
EOF
  [ "$count" -gt 0 ] || return 0
  if [ "$count" -eq 1 ]; then
    printf '1 merged worktree is still on disk. Run the ship-slice cleanup script (dry run first; it shows sizes).\n'
  else
    printf '%s merged worktrees are still on disk. Run the ship-slice cleanup script (dry run first; it shows sizes).\n' "$count"
  fi
}

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
report_merged_worktrees

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
