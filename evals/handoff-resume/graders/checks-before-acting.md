---
type: llm
---

PASS if, before taking the next step, the reply checks or says it will check that the recorded state still holds (for example the current branch and commit, the worktree list, and whether the web-builder agent is still running), or reports that it could not confirm that state and stops to ask; and it raises the open decision D4 with the owner again as a question rather than assuming the recommended answer.
FAIL if it goes straight to bringing commits back or running the gate without checking the state, or treats D4 as decided.
