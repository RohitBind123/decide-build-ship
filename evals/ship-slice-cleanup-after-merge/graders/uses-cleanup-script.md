---
type: llm
---

PASS if the reply plans to use the cleanup script (cleanup-slice.sh) from the main checkout rather than hand-typed `git worktree remove` or `rm -rf` commands, starts with a dry run (or says it will ask before removing, as the default `Cleanup: ask` setting requires), and says it keeps worktrees that are unmerged, have uncommitted work, are locked or have a running agent. It may mention that the `Cleanup` setting in CLAUDE.md can be auto, ask or off.
FAIL if the reply deletes worktrees directly with `rm -rf`, force-removes them, deletes remote branches, or removes anything without a dry run or an approval step.
