---
type: llm
---

PASS if the reply proposes a "Build workflow" section for CLAUDE.md (or equivalent project settings: paths for the spec, decisions log, feature docs and handoff file, branches, commands and approvals), proposes creating the decisions log and handoff file, does not invent build or test commands it cannot see, and asks the owner to confirm the values before writing any files.
FAIL if it writes or claims to write files without asking, or fills in specific build or test commands as if they were known.
