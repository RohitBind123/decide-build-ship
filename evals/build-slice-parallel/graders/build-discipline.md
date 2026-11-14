---
type: llm
---

PASS if the reply says the API contract is written and committed before the parallel work, that each builder writes a failing test before its code, that each builder works in its own git worktree or branch, that no two builders edit the same files, and that a model is chosen per task.
FAIL if it proposes starting both builders immediately with no contract, or omits tests-first, or lets builders share files.
