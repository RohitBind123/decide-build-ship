#!/bin/sh
# Cleans up after slices: removes linked git worktrees (with their build output) and local branches that are
# already merged, and prunes worktree records whose folder is gone.
#
# Usage (run from the main checkout):
#   sh cleanup-slice.sh                       dry run: report what would be removed and what is kept
#   sh cleanup-slice.sh --apply               remove merged, clean worktrees and their merged branches
#   sh cleanup-slice.sh --base <branch>       branch that must contain the slice (default: current branch)
#   sh cleanup-slice.sh --abandon <branch>    also remove this unmerged slice (repeatable; owner abandoned it)
#   sh cleanup-slice.sh --stop-procs          stop processes running inside a worktree before removing it
#
# Safe by default: a worktree is kept when its branch is not merged, it has uncommitted work, it is locked,
# or a process is running inside it. Never force-removes, never touches the main checkout, never deletes
# remote branches (it prints the command instead). Exits 0 unless the arguments or location are wrong.

apply=0
stop_procs=0
base=""
abandon=" "

while [ $# -gt 0 ]; do
  case "$1" in
    --apply) apply=1 ;;
    --stop-procs) stop_procs=1 ;;
    --base) [ -n "$2" ] || { echo "--base needs a branch" >&2; exit 2; }; base="$2"; shift ;;
    --abandon) [ -n "$2" ] || { echo "--abandon needs a branch" >&2; exit 2; }; abandon="$abandon$2 "; shift ;;
    -h|--help) sed -n '2,14p' "$0"; exit 0 ;;
    *) echo "unknown argument: $1" >&2; exit 2 ;;
  esac
  shift
done

git rev-parse --git-dir >/dev/null 2>&1 || { echo "not inside a git repository" >&2; exit 2; }
git_dir=$(git rev-parse --absolute-git-dir)
common_dir=$(cd "$(git rev-parse --git-common-dir)" && pwd -P)
if [ "$git_dir" != "$common_dir" ]; then
  echo "run this from the main checkout, not from a linked worktree" >&2
  exit 2
fi
main_path=$(git rev-parse --show-toplevel)
[ -n "$base" ] || base=$(git symbolic-ref --short -q HEAD)
[ -n "$base" ] || { echo "main checkout has no branch checked out; pass --base" >&2; exit 2; }
git rev-parse --verify -q "refs/heads/$base" >/dev/null || { echo "unknown base branch: $base" >&2; exit 2; }

if [ "$apply" -eq 1 ]; then mode="removed"; else mode="would remove"; fi
removed=0
kept=0
freed_kb=0

pids_in() {  # pids whose working directory is inside $1; empty when lsof is missing
  command -v lsof >/dev/null 2>&1 || return 0
  lsof -a -d cwd -Fpn 2>/dev/null | awk -v dir="$1" '
    /^p/ { pid = substr($0, 2) }
    /^n/ { p = substr($0, 2); if (p == dir || index(p, dir "/") == 1) print pid }' | sort -u
}

keep() { printf 'keep    %s (%s): %s\n' "$1" "$2" "$3"; kept=$((kept + 1)); }

handle() {  # path branch locked
  path="$1"; branch="$2"; locked="$3"
  label="${branch:-detached}"
  if [ -z "$branch" ]; then keep "$path" "$label" "detached head, remove by hand if finished"; return; fi
  case "$abandon" in *" $branch "*) is_abandoned=1 ;; *) is_abandoned=0 ;; esac
  if [ "$is_abandoned" -eq 0 ] && ! git merge-base --is-ancestor "$branch" "$base" 2>/dev/null; then
    keep "$path" "$label" "not merged into $base (use --abandon $branch if the owner dropped it)"; return
  fi
  if [ -n "$(git -C "$path" status --porcelain 2>/dev/null)" ]; then
    keep "$path" "$label" "uncommitted work"; return
  fi
  if [ -n "$locked" ]; then keep "$path" "$label" "locked, its agent may still be running"; return; fi
  procs=$(pids_in "$path")
  if [ -n "$procs" ]; then
    if [ "$stop_procs" -eq 1 ] && [ "$apply" -eq 1 ]; then
      # shellcheck disable=SC2086
      kill $procs 2>/dev/null
      sleep 1
    else
      keep "$path" "$label" "processes running inside (pid $(echo $procs | tr ' ' ',')); pass --stop-procs to stop them"
      return
    fi
  fi
  size_kb=$(du -sk "$path" 2>/dev/null | awk '{print $1}')
  size_kb=${size_kb:-0}
  if [ "$apply" -eq 1 ]; then
    if ! git worktree remove "$path" 2>/dev/null; then keep "$path" "$label" "git refused to remove it"; return; fi
    if [ "$is_abandoned" -eq 1 ]; then git branch -D "$branch" >/dev/null 2>&1; else git branch -d "$branch" >/dev/null 2>&1; fi
  fi
  printf '%s %s (%s, %s MB)\n' "$mode" "$path" "$label" "$((size_kb / 1024))"
  removed=$((removed + 1))
  freed_kb=$((freed_kb + size_kb))
  if git remote get-url origin >/dev/null 2>&1 && git ls-remote --exit-code --heads origin "$branch" >/dev/null 2>&1; then
    printf 'note    remote branch exists; delete only with owner approval: git push origin --delete %s\n' "$branch"
  fi
}

path=""; branch=""; locked=""; first=1
list=$(git worktree list --porcelain)
while IFS= read -r line; do
  case "$line" in
    "worktree "*) path="${line#worktree }"; branch=""; locked="" ;;
    "branch "*) branch="${line#branch refs/heads/}" ;;
    "locked"*) locked="yes" ;;
    "")
      if [ -n "$path" ]; then
        if [ "$path" = "$main_path" ]; then :
        elif [ ! -d "$path" ]; then :  # folder gone: the prune step below handles the record
        else handle "$path" "$branch" "$locked"; fi
      fi
      path="" ;;
  esac
done <<EOF2
$list

EOF2

# Merged slice branches that no worktree uses any more.
for b in $(git for-each-ref --format='%(refname:short)' --merged "$base" refs/heads/); do
  [ "$b" = "$base" ] && continue
  case "$b" in main|master|develop|trunk|release*|production|prod) continue ;; esac
  git worktree list --porcelain | grep -qx "branch refs/heads/$b" && continue
  tip=$(git rev-parse "$b"); basetip=$(git rev-parse "$base")
  [ "$tip" = "$basetip" ] && continue  # same commit as base: a fresh branch, not a finished slice
  if [ "$apply" -eq 1 ]; then git branch -d "$b" >/dev/null 2>&1 || continue; fi
  printf '%s branch %s (merged into %s)\n' "$mode" "$b" "$base"
done

orphans=$(git worktree prune -n -v 2>&1)
if [ -n "$orphans" ]; then
  [ "$apply" -eq 1 ] && git worktree prune
  printf '%s stale worktree records:\n%s\n' "$mode" "$orphans"
fi

printf 'summary: %s worktree(s) %s, %s kept, about %s MB %s\n' \
  "$removed" "$mode" "$kept" "$((freed_kb / 1024))" "$([ "$apply" -eq 1 ] && echo freed || echo reclaimable)"
[ "$apply" -eq 1 ] || echo "dry run: nothing was changed. Run with --apply to remove."
exit 0
